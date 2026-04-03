// ─── Interrupt Handler ─────────────────────────────────────────────────────
// Tracks per-session speaking state and handles barge-in logic.
// If user speaks for >500ms while agent is speaking → interrupt.

import { llmService } from '../services/llmService';
import { ttsService } from '../services/ttsService';

interface InterruptState {
  isSpeaking: boolean;
  userSpeakingStart: number | null;
  interruptThresholdMs: number;
}

const states = new Map<string, InterruptState>();

function getState(sessionId: string): InterruptState {
  if (!states.has(sessionId)) {
    states.set(sessionId, {
      isSpeaking: false,
      userSpeakingStart: null,
      interruptThresholdMs: 500,
    });
  }
  return states.get(sessionId)!;
}

export const interruptHandler = {
  setSpeaking: (sessionId: string, speaking: boolean): void => {
    getState(sessionId).isSpeaking = speaking;
    if (!speaking) getState(sessionId).userSpeakingStart = null;
  },

  // Called when audio chunk arrives — checks for barge-in
  onUserAudio: (sessionId: string): boolean => {
    const state = getState(sessionId);
    if (!state.isSpeaking) return false;

    if (!state.userSpeakingStart) {
      state.userSpeakingStart = Date.now();
      return false;
    }

    const duration = Date.now() - state.userSpeakingStart;
    if (duration >= state.interruptThresholdMs) {
      // Barge-in detected — abort LLM + TTS
      llmService.abort(sessionId);
      ttsService.abort(sessionId);
      state.isSpeaking = false;
      state.userSpeakingStart = null;
      console.log(`[interrupt] Barge-in detected for session ${sessionId}`);
      return true; // signal: interrupted
    }
    return false;
  },

  cleanup: (sessionId: string): void => {
    states.delete(sessionId);
  },
};
