import { EventEmitter } from 'events';
import { TTSChunkPayload } from '@voice-agent/shared';

export interface TTSAdapter {
  synthesize(sessionId: string, sentence: string, sentenceIndex: number): Promise<void>;
  abort(sessionId: string): void;
  on(event: 'chunk', listener: (sessionId: string, data: TTSChunkPayload) => void): this;
  on(event: 'done',  listener: (sessionId: string, sentenceIndex: number) => void): this;
}

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';
const MODEL = 'bulbul:v2';

// Detect if text is primarily Hindi (Devanagari) or English
function detectLang(text: string): { language: string; speaker: string } {
  const devanagariChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  const ratio = totalChars > 0 ? devanagariChars / totalChars : 0;

  if (ratio > 0.3) {
    return { language: 'hi-IN', speaker: 'arya' };
  } else {
    return { language: 'en-IN', speaker: 'arya' };
  }
}

export class SarvamTTSService extends EventEmitter implements TTSAdapter {
  private abortFlags = new Map<string, boolean>();

  abort(sessionId: string): void {
    this.abortFlags.set(sessionId, true);
  }

  async synthesize(sessionId: string, sentence: string, sentenceIndex: number): Promise<void> {
    this.abortFlags.set(sessionId, false);
    const text = sentence.trim();
    if (!text) return;

    const t0 = Date.now();
    const { language, speaker } = detectLang(text);
    console.log(`[tts] [${sentenceIndex}] lang=${language} "${text.slice(0, 60)}"`);

    try {
      const response = await fetch(SARVAM_TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': process.env.SARVAM_API_KEY!,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: language,
          speaker,
          pitch: 0,
          pace: 1.05,      // slightly faster for natural conversation
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: MODEL,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Sarvam ${response.status}: ${err}`);
      }

      const json = await response.json() as { audios: string[] };
      const audioBase64 = json.audios?.[0];
      if (!audioBase64) throw new Error('No audio in Sarvam response');
      if (this.abortFlags.get(sessionId)) return;

      console.log(`[tts] ✓ [${sentenceIndex}] ${Date.now() - t0}ms, ${Buffer.from(audioBase64, 'base64').length} bytes`);
      this.emit('chunk', sessionId, { audioBase64, chunkIndex: 0, sentenceIndex, text } as TTSChunkPayload);
      this.emit('done', sessionId, sentenceIndex);
    } catch (err) {
      console.error(`[tts] Error[${sentenceIndex}]:`, err);
      this.emit('done', sessionId, sentenceIndex);
    }
  }
}

export const ttsService = new SarvamTTSService();
