import { useRef, useState, useCallback, useEffect } from 'react';
import { sendMessage, sendAudioChunk, sendInterrupt } from '../lib/wsClient';
import { useAgentStore } from '../store/agentStore';

declare const vad: { MicVAD: { new: (opts: Record<string, unknown>) => Promise<{ start: () => Promise<void>; destroy: () => Promise<void> }> } };

// How long after a barge-in before we accept new speech (ms)
// Gives backend time to send status:idle after abort
const BARGE_IN_COOLDOWN_MS = 1200;

export function useVoiceRecorder() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [volume,      setVolume]      = useState(0);

  const vadRef          = useRef<{ start: () => Promise<void>; destroy: () => Promise<void> } | null>(null);
  const greetedRef      = useRef(false);
  const bargeInTimeRef  = useRef(0);
  const currentSegmentIsBargeIn = useRef(false); // tracks if THIS speech segment was a barge-in
  const agentStatusRef  = useRef('idle');
  agentStatusRef.current = useAgentStore((s) => s.status);

  function float32ToWavBase64(samples: Float32Array, sampleRate = 16000): string {
    const buf = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buf);
    const w = (off: number, str: string) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true);
    w(8, 'WAVE'); w(12, 'fmt ');
    view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true);
    w(36, 'data'); view.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++) {
      const v = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7FFF, true);
    }
    const bytes = new Uint8Array(buf);
    let b = '';
    for (let i = 0; i < bytes.length; i++) b += String.fromCharCode(bytes[i]);
    return btoa(b);
  }

  const startListening = useCallback(async () => {
    if (vadRef.current) return;

    try {
      const instance = await vad.MicVAD.new({
        baseAssetPath: '/',
        onnxWASMBasePath: '/',
        model: 'legacy',
        startOnLoad: true,
        positiveSpeechThreshold: 0.75,
        negativeSpeechThreshold: 0.55,
        minSpeechMs: 800,   // ignore clips under 800ms — filters noise/breathing
        preSpeechPadMs: 150,
        redemptionMs: 400,

        onSpeechStart: () => {
          const status = agentStatusRef.current;
          const isAgentActive = status === 'speaking' || status === 'processing';
          const sinceLastBargeIn = Date.now() - bargeInTimeRef.current;
          const inCooldown = sinceLastBargeIn < BARGE_IN_COOLDOWN_MS;

          if (isAgentActive) {
            console.log('[vad] 🛑 Barge-in — interrupting agent');
            bargeInTimeRef.current = Date.now();
            currentSegmentIsBargeIn.current = true; // mark this segment as barge-in
            sendInterrupt();
            // Don't send audio_start — this segment will be discarded
          } else if (inCooldown) {
            console.log(`[vad] ⏳ Cooldown — skipping segment`);
            currentSegmentIsBargeIn.current = true; // also discard cooldown segments
          } else {
            currentSegmentIsBargeIn.current = false;
            console.log('[vad] 🎤 Speech start');
            setIsSpeaking(true);
            sendMessage('audio_start');
          }
        },

        onFrameProcessed: (probs: { isSpeech: number }) => {
          setVolume(probs.isSpeech);
        },

        onSpeechEnd: (audio: Float32Array) => {
          // Discard if this segment was a barge-in or cooldown segment
          if (currentSegmentIsBargeIn.current) {
            console.log('[vad] Barge-in segment discarded');
            currentSegmentIsBargeIn.current = false;
            setIsSpeaking(false);
            return;
          }

          console.log(`[vad] ✓ Speech end — ${(audio.length / 16000).toFixed(1)}s`);
          setIsSpeaking(false);
          sendAudioChunk(float32ToWavBase64(audio));
          sendMessage('audio_stop');
        },

        onVADMisfire: () => {
          currentSegmentIsBargeIn.current = false;
          setIsSpeaking(false);
        },
      });

      vadRef.current = instance;
      setIsListening(true);
      console.log('[vad] Silero VAD ON');

      if (!greetedRef.current) {
        greetedRef.current = true;
        sendMessage('greeting');
      }
    } catch (e) {
      console.error('[vad] Error:', e);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!vadRef.current) return;
    await vadRef.current.destroy();
    vadRef.current = null;
    bargeInTimeRef.current = 0;
    setIsListening(false);
    setIsSpeaking(false);
    setVolume(0);
    sendInterrupt();
    console.log('[vad] Silero VAD OFF');
  }, []);

  const handleMicClick = useCallback(() => {
    if (vadRef.current) stopListening(); else startListening();
  }, [startListening, stopListening]);

  useEffect(() => () => { vadRef.current?.destroy(); }, []);

  return { isListening, isSpeaking, volume, silenceMs: 0, silenceThreshold: 1, calibrating: false, handleMicClick };
}
