import { ServerMessage } from '@voice-agent/shared';
import { useAgentStore } from '../store/agentStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

let ws: WebSocket | null = null;
let currentAssistantMsgId: string | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

// ─── Audio Playback ───────────────────────────────────────────────────────
// Track every active BufferSource so we can stop them instantly on interrupt.

let audioCtx: AudioContext | null = null;
let nextPlayTime = 0;
let nextSentenceIndex = 0;
const pendingChunks = new Map<number, string>();
const activeSources: AudioBufferSourceNode[] = [];
let audioBlocked = false;
let currentResponseId = '';  // only play chunks matching this ID

function getAudioCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
    nextPlayTime = 0;
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

async function decodeAndSchedule(base64: string): Promise<void> {
  const ctx = getAudioCtx();
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const audioBuffer = await ctx.decodeAudioData(bytes.buffer);
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  const startAt = Math.max(ctx.currentTime, nextPlayTime);
  source.start(startAt);
  nextPlayTime = startAt + audioBuffer.duration;
  activeSources.push(source);
  // Auto-remove from list when done
  source.onended = () => {
    const idx = activeSources.indexOf(source);
    if (idx !== -1) activeSources.splice(idx, 1);
  };
}

async function playAudioChunk(base64: string, sentenceIndex: number): Promise<void> {
  try {
    pendingChunks.set(sentenceIndex, base64);
    while (pendingChunks.has(nextSentenceIndex)) {
      const chunk = pendingChunks.get(nextSentenceIndex)!;
      pendingChunks.delete(nextSentenceIndex);
      await decodeAndSchedule(chunk);
      nextSentenceIndex++;
    }
  } catch (err) {
    console.error('[audio] Playback error:', err);
  }
}

export function stopAudio(): void {
  audioBlocked = true;
  currentResponseId = ''; // reject all in-flight chunks
  for (const src of activeSources) {
    try { src.stop(0); } catch { /* already stopped */ }
  }
  activeSources.length = 0;
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
  nextPlayTime = 0;
  nextSentenceIndex = 0;
  pendingChunks.clear();
}

// ─── WebSocket ─────────────────────────────────────────────────────────────

export function connectWS(): void {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  ws = new WebSocket(WS_URL);
  const store = useAgentStore.getState();

  ws.onopen = () => {
    store.setConnected(true);
    store.pushDebug('ws', 'Connected to server');
    if (reconnectTimer) clearTimeout(reconnectTimer);
  };

  ws.onclose = () => {
    store.setConnected(false);
    store.setStatus('idle');
    store.pushDebug('ws', 'Disconnected — reconnecting in 3s');
    reconnectTimer = setTimeout(connectWS, 3000);
  };

  ws.onerror = () => store.pushDebug('ws', 'Connection error');

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data as string) as ServerMessage;
    handleServerMessage(msg);
  };
}

function handleServerMessage(msg: ServerMessage): void {
  const store = useAgentStore.getState();

  switch (msg.type) {
    case 'status': {
      const { status, sessionId, message } = msg.payload as { status: string; sessionId?: string; message?: string };
      store.setStatus(status as never);
      if (sessionId) store.setSessionId(sessionId);
      store.pushDebug('status', `${status}${message ? ': ' + message : ''}`);
      break;
    }

    case 'stt_partial': {
      const { text, language } = msg.payload as { text: string; confidence: number; language: string };
      // Show live partial in the ghost bubble while Whisper is buffering
      store.setPartialTranscript(text);
      store.pushDebug('stt_partial', `[${language}] ${text}`);
      break;
    }

    case 'stt_final': {
      const { text } = msg.payload as { text: string };
      store.setPartialTranscript('');
      // __greeting__ is a sentinel — don't add to user messages
      if (text !== '__greeting__') {
        store.addUserMessage(text);
        store.pushDebug('stt_final', `✓ STT: "${text}"`);
        currentAssistantMsgId = store.startAssistantMessage();
      } else {
        // Start assistant bubble for greeting
        currentAssistantMsgId = store.startAssistantMessage();
      }
      break;
    }

    case 'llm_token': {
      const payload = msg.payload as { token: string; accumulated: string; _msgId?: string };
      if (currentAssistantMsgId) {
        useAgentStore.setState((state) => ({
          messages: state.messages.map((m) =>
            m.id === currentAssistantMsgId ? { ...m, text: payload.accumulated } : m
          ),
        }));
      }
      store.pushDebug('llm_token', payload.token);
      break;
    }

    case 'llm_sentence': {
      const { sentence, index } = msg.payload as { sentence: string; index: number };
      store.pushDebug('llm_sentence', `[${index}] ${sentence}`);
      break;
    }

    case 'tts_reset': {
      // Backend sends responseId with reset — set it as the accepted ID
      const { responseId } = msg.payload as { responseId?: string };
      currentResponseId = responseId ?? '';
      audioBlocked = false; // new response starts — unblock
      nextSentenceIndex = 0;
      pendingChunks.clear();
      break;
    }

    case 'tts_chunk': {
      const { audioBase64, sentenceIndex, text, responseId } = msg.payload as { audioBase64: string; sentenceIndex: number; chunkIndex: number; text: string; responseId?: string };
      // Only play if this chunk belongs to the current accepted response
      if (audioBlocked || (responseId && responseId !== currentResponseId)) {
        store.pushDebug('tts_chunk', `[DISCARDED stale s${sentenceIndex}]`);
        break;
      }
      store.pushDebug('tts_chunk', `[s${sentenceIndex}] ${text}`);
      playAudioChunk(audioBase64, sentenceIndex);
      break;
    }

    case 'tts_done': {
      if (currentAssistantMsgId) {
        store.finalizeAssistantMessage(currentAssistantMsgId);
        currentAssistantMsgId = null;
      }
      // Reset sentence order counter for next response
      nextSentenceIndex = 0;
      pendingChunks.clear();
      store.pushDebug('tts_done', '✓ Sarvam: full response spoken');
      break;
    }

    case 'tool_call': {
      const { toolName, args } = msg.payload as { toolName: string; args: Record<string, unknown> };
      store.pushDebug('tool_call', `${toolName}(${JSON.stringify(args)})`);
      break;
    }

    case 'error':
      if (String(msg.payload).includes('HALLUCINATION')) {
        // Silent discard — just clear the partial transcript
        store.setPartialTranscript('');
        store.setStatus('idle');
      } else {
        store.pushDebug('error', String(msg.payload));
      }
      break;
  }
}

export function sendMessage(type: string, payload?: unknown): void {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  const store = useAgentStore.getState();
  ws.send(JSON.stringify({ type, sessionId: store.sessionId, payload }));
}

export function sendAudioChunk(base64: string): void {
  sendMessage('audio_chunk', { data: base64 });
}

export function sendTextInput(text: string): void {
  sendMessage('text_input', { text });
}

export function sendInterrupt(): void {
  stopAudio(); // immediately cut audio playback
  sendMessage('interrupt');
}

export function getWS(): WebSocket | null {
  return ws;
}
