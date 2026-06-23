import { EventEmitter } from 'events';
import { TTSChunkPayload } from '@voice-agent/shared';

export interface TTSAdapter {
  synthesize(sessionId: string, sentence: string, sentenceIndex: number, lang?: string): Promise<void>;
  abort(sessionId: string): void;
  on(event: 'chunk', listener: (sessionId: string, data: TTSChunkPayload) => void): this;
  on(event: 'done',  listener: (sessionId: string, sentenceIndex: number) => void): this;
}

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';
const MODEL = 'bulbul:v2';

function detectLang(text: string): { language: string; speaker: string } {
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  const total = text.replace(/\s/g, '').length;
  return (total > 0 && devanagari / total > 0.3)
    ? { language: 'hi-IN', speaker: 'arya' }
    : { language: 'en-IN', speaker: 'arya' };
}

export class SarvamTTSService extends EventEmitter implements TTSAdapter {
  // One AbortController per session — abort() cancels the in-flight fetch immediately
  private controllers = new Map<string, AbortController>();

  abort(sessionId: string): void {
    const ctrl = this.controllers.get(sessionId);
    if (ctrl) {
      ctrl.abort();
      this.controllers.delete(sessionId);
      console.log(`[tts] ✂ HTTP request aborted for ${sessionId.slice(0, 8)}`);
    }
  }

  async synthesize(sessionId: string, sentence: string, sentenceIndex: number, lang?: string): Promise<void> {
    const text = sentence.trim();
    if (!text) return;

    this.abort(sessionId);
    const ctrl = new AbortController();
    this.controllers.set(sessionId, ctrl);

    const t0 = Date.now();
    // Use passed lang if available, otherwise detect from text
    const detected = detectLang(text);
    const language = lang ?? detected.language;
    const speaker = detected.speaker;
    console.log(`[tts] [${sentenceIndex}] lang=${language} "${text.slice(0, 60)}"`);

    try {
      const response = await fetch(SARVAM_TTS_URL, {
        method: 'POST',
        signal: ctrl.signal,   // ← abort signal wired in
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': process.env.SARVAM_API_KEY!,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: language,
          speaker,
          pitch: 0,
          pace: 1.05,
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

      // Check if aborted after response arrived
      if (ctrl.signal.aborted) return;
      this.controllers.delete(sessionId);

      console.log(`[tts] ✓ [${sentenceIndex}] ${Date.now() - t0}ms, ${Buffer.from(audioBase64, 'base64').length} bytes`);
      this.emit('chunk', sessionId, { audioBase64, chunkIndex: 0, sentenceIndex, text } as TTSChunkPayload);
      this.emit('done', sessionId, sentenceIndex);
    } catch (err: unknown) {
      this.controllers.delete(sessionId);
      // AbortError is expected on interrupt — don't log as error
      if (err instanceof Error && err.name === 'AbortError') {
        console.log(`[tts] [${sentenceIndex}] aborted`);
        this.emit('done', sessionId, sentenceIndex);
        return;
      }
      console.error(`[tts] Error[${sentenceIndex}]:`, err);
      this.emit('done', sessionId, sentenceIndex);
    }
  }
}

export const ttsService = new SarvamTTSService();
