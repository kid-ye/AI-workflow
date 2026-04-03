// ─── WebSocket Connection Handler ─────────────────────────────────────────
// Entry point for all WS connections. Routes messages to appropriate modules.

import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { ClientMessage, ServerMessage } from '@voice-agent/shared';
import { createSession, deleteSession, updateSession, getSession } from '../services/sessionManager';
import { sttService } from '../services/sttService';
import { interruptHandler } from './interruptHandler';
import { handleFinalTranscript, playGreeting, abortSession } from './conversationEngine';

function send(ws: WebSocket, msg: Omit<ServerMessage, 'timestamp'>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ ...msg, timestamp: Date.now() }));
  }
}

export function handleWebSocketConnection(ws: WebSocket, _req: IncomingMessage): void {
  const session = createSession();
  const { sessionId } = session;

  console.log(`[ws] Connected: ${sessionId}`);

  // Send session info to client — greeting triggered by frontend when mic is first activated
  send(ws, {
    type: 'status',
    sessionId,
    payload: { status: 'idle', sessionId, message: 'Connected' },
  });

  // ── STT event listeners for this session ──
  const onSTTPartial = (sid: string, data: unknown) => {
    if (sid !== sessionId) return;
    send(ws, { type: 'stt_partial', sessionId, payload: data });
    send(ws, { type: 'status', sessionId, payload: { status: 'listening' } });
  };

  const onSTTFinal = (sid: string, data: { text: string; language: string }) => {
    if (sid !== sessionId) return;
    // Store detected language in session for LLM to use
    updateSession(sessionId, { language: data.language });
    send(ws, { type: 'stt_final', sessionId, payload: data });
    handleFinalTranscript(ws, sessionId, data.text);
  };

  const onSTTError = (sid: string, errMsg: string) => {
    if (sid !== sessionId) return;
    send(ws, { type: 'error', sessionId, payload: `STT: ${errMsg}` });
    send(ws, { type: 'status', sessionId, payload: { status: 'idle' } });
  };

  sttService.on('partial', onSTTPartial);
  sttService.on('final', onSTTFinal);
  sttService.on('error', onSTTError);

  // ── Message router ──
  ws.on('message', (raw) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw.toString()) as ClientMessage;
    } catch {
      return;
    }

    switch (msg.type) {
      case 'audio_start':
        send(ws, { type: 'status', sessionId, payload: { status: 'listening' } });
        break;

      case 'audio_chunk': {
        const payload = msg.payload as { data: string };
        const audioBuffer = Buffer.from(payload.data, 'base64');

        // Check for barge-in
        const interrupted = interruptHandler.onUserAudio(sessionId);
        if (interrupted) {
          send(ws, { type: 'status', sessionId, payload: { status: 'interrupted' } });
        }

        sttService.processChunk(sessionId, audioBuffer);
        break;
      }

      case 'audio_stop': {
        const sess = getSession(sessionId);
        sttService.finalize(sessionId, sess?.language).catch((err) => {
          console.error('[ws] STT finalize error:', err);
          send(ws, { type: 'error', sessionId, payload: `STT error: ${err.message}` });
        });
        break;
      }

      case 'interrupt':
        abortSession(sessionId);
        interruptHandler.setSpeaking(sessionId, false);
        send(ws, { type: 'status', sessionId, payload: { status: 'interrupted' } });
        break;

      case 'text_input': {
        const { text } = msg.payload as { text: string };
        send(ws, { type: 'stt_final', sessionId, payload: { text, confidence: 1, language: 'en-IN', isFinal: true } });
        handleFinalTranscript(ws, sessionId, text);
        break;
      }

      case 'greeting':
        playGreeting(ws, sessionId);
        break;
    }
  });

  ws.on('close', () => {
    console.log(`[ws] Disconnected: ${sessionId}`);
    sttService.off('partial', onSTTPartial);
    sttService.off('final', onSTTFinal);
    sttService.off('error', onSTTError);
    interruptHandler.cleanup(sessionId);
    deleteSession(sessionId);
  });

  ws.on('error', (err) => {
    console.error(`[ws] Error on ${sessionId}:`, err.message);
  });
}
