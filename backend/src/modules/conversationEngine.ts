import { WebSocket } from 'ws';
import { ServerMessage, AgentStatus } from '@voice-agent/shared';
import { getSession, addToHistory } from '../services/sessionManager';
import { llmService } from '../services/llmService';
import { ttsService } from '../services/ttsService';
import { interruptHandler } from './interruptHandler';

const GREETING = 'Namaste! Main Aria hoon, aapki Airtel assistant. Main aapki help kar sakti hoon data balance, recharge, bill payment, network issues, aur plan upgrade mein. Aap kya jaanna chahte hain?';

// Generation counter per session — incremented on every new request or abort.
// Any async work checks its captured generation against current; if stale, it stops.
const generations = new Map<string, number>();

function gen(sessionId: string): number {
  return generations.get(sessionId) ?? 0;
}

function nextGen(sessionId: string): number {
  const g = gen(sessionId) + 1;
  generations.set(sessionId, g);
  return g;
}

// responseId = "sessionId:generation" — sent with every tts_reset and tts_chunk
// Frontend rejects any chunk whose responseId doesn't match the latest reset
function responseId(sessionId: string): string {
  return `${sessionId.slice(0, 8)}:${gen(sessionId)}`;
}

function send(ws: WebSocket, msg: Omit<ServerMessage, 'timestamp'>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ ...msg, timestamp: Date.now() }));
  }
}

function sendStatus(ws: WebSocket, sessionId: string, status: AgentStatus): void {
  send(ws, { type: 'status', sessionId, payload: { status } });
}

export function abortSession(sessionId: string): void {
  nextGen(sessionId); // invalidate all in-flight work immediately
  llmService.abort(sessionId);
  ttsService.abort(sessionId);
  interruptHandler.setSpeaking(sessionId, false);
  console.log(`[engine] ✂ Aborted gen=${gen(sessionId)} for ${sessionId.slice(0, 8)}`);
}

export async function playGreeting(ws: WebSocket, sessionId: string): Promise<void> {
  const session = getSession(sessionId);
  if (!session) return;

  const myGen = nextGen(sessionId);
  const myResponseId = `${sessionId.slice(0, 8)}:${myGen}`;

  send(ws, { type: 'stt_final', sessionId, payload: { text: '__greeting__', isFinal: true } });
  send(ws, { type: 'llm_token', sessionId, payload: { token: GREETING, accumulated: GREETING } });
  addToHistory(sessionId, 'assistant', GREETING);

  sendStatus(ws, sessionId, 'speaking');
  interruptHandler.setSpeaking(sessionId, true);
  send(ws, { type: 'tts_reset', sessionId, payload: { responseId: myResponseId } });

  await speakOne(ws, sessionId, myGen, GREETING, 0);

  if (gen(sessionId) !== myGen) return; // aborted
  interruptHandler.setSpeaking(sessionId, false);
  sendStatus(ws, sessionId, 'idle');
  send(ws, { type: 'tts_done', sessionId, payload: {} });
}

// Speak one sentence. Returns false if aborted mid-way.
function speakOne(ws: WebSocket, sessionId: string, myGen: number, sentence: string, index: number): Promise<boolean> {
  if (gen(sessionId) !== myGen) return Promise.resolve(false);

  // Capture responseId NOW — before any async work — so stale chunks can't steal the new ID
  const myResponseId = `${sessionId.slice(0, 8)}:${myGen}`;

  return new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => { if (!settled) { settled = true; resolve(ok); } };

    const poll = setInterval(() => {
      if (gen(sessionId) !== myGen) { clearInterval(poll); finish(false); }
    }, 20);

    const onChunk = (sid: string, data: unknown) => {
      if (sid !== sessionId || gen(sessionId) !== myGen) return;
      interruptHandler.setSpeaking(sessionId, true);
      sendStatus(ws, sessionId, 'speaking');
      // Use captured responseId — never the current gen which may have advanced
      const tagged = { ...(data as object), responseId: myResponseId };
      send(ws, { type: 'tts_chunk', sessionId, payload: tagged });
    };

    const onDone = (sid: string, idx: number) => {
      if (sid !== sessionId || idx !== index) return;
      clearInterval(poll);
      ttsService.off('chunk', onChunk);
      ttsService.off('done', onDone);
      finish(gen(sessionId) === myGen);
    };

    ttsService.on('chunk', onChunk);
    ttsService.on('done', onDone);
    ttsService.synthesize(sessionId, sentence, index);
  });
}

export async function handleFinalTranscript(
  ws: WebSocket,
  sessionId: string,
  text: string
): Promise<void> {
  const session = getSession(sessionId);
  if (!session || !text.trim()) return;

  // Claim this generation — any previous in-flight work is now stale
  const myGen = nextGen(sessionId);
  const myResponseId = `${sessionId.slice(0, 8)}:${myGen}`;
  const t0 = Date.now();
  console.log(`[engine] ▶ gen=${myGen} "${text}"`);

  addToHistory(sessionId, 'user', text);
  sendStatus(ws, sessionId, 'processing');
  send(ws, { type: 'tts_reset', sessionId, payload: { responseId: myResponseId } });

  let sentenceIndex = 0;
  let ttsChain = Promise.resolve(true);

  await new Promise<void>((resolve) => {
    const onToken = (sid: string, data: unknown) => {
      if (sid !== sessionId || gen(sessionId) !== myGen) return;
      send(ws, { type: 'llm_token', sessionId, payload: data });
    };

    const onSentence = (sid: string, data: { sentence: string; index: number }) => {
      if (sid !== sessionId || gen(sessionId) !== myGen) return;
      send(ws, { type: 'llm_sentence', sessionId, payload: data });

      const idx = sentenceIndex++;
      const sentence = data.sentence;
      // Chain TTS sequentially — sentence N+1 starts only after N finishes
      ttsChain = ttsChain.then((ok) => {
        if (!ok || gen(sessionId) !== myGen) return false;
        return speakOne(ws, sessionId, myGen, sentence, idx);
      });
    };

    const onDone = (sid: string, fullText: string) => {
      if (sid !== sessionId) return;
      if (gen(sessionId) === myGen) {
        addToHistory(sessionId, 'assistant', fullText);
      }
      llmService.off('token', onToken);
      llmService.off('sentence', onSentence);
      llmService.off('done', onDone);
      llmService.off('tool_call', onToolCall);
      console.log(`[engine] LLM done in ${Date.now() - t0}ms`);
      resolve();
    };

    const onToolCall = (sid: string, toolName: string, args: Record<string, unknown>) => {
      if (sid !== sessionId || gen(sessionId) !== myGen) return;
      send(ws, { type: 'tool_call', sessionId, payload: { toolName, args } });
    };

    llmService.on('token', onToken);
    llmService.on('sentence', onSentence);
    llmService.on('done', onDone);
    llmService.on('tool_call', onToolCall);

    llmService.generate(sessionId, text, session);
  });

  // Wait for TTS chain — but only if still our generation
  await ttsChain;

  if (gen(sessionId) !== myGen) {
    console.log(`[engine] gen=${myGen} stale after TTS — discarding`);
    return;
  }

  interruptHandler.setSpeaking(sessionId, false);
  sendStatus(ws, sessionId, 'idle');
  send(ws, { type: 'tts_done', sessionId, payload: {} });
  console.log(`[engine] ✓ gen=${myGen} done in ${Date.now() - t0}ms`);
}
