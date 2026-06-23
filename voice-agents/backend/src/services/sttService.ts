import { EventEmitter } from 'events';
import { STTPartialPayload, STTFinalPayload } from '@voice-agent/shared';
import FormData from 'form-data';
import https from 'https';

export interface STTAdapter {
  processChunk(sessionId: string, audioChunk: Buffer): void;
  finalize(sessionId: string, langHint?: string): Promise<void>;
  on(event: 'partial', listener: (sessionId: string, data: STTPartialPayload) => void): this;
  on(event: 'final',   listener: (sessionId: string, data: STTFinalPayload)   => void): this;
  on(event: 'error',   listener: (sessionId: string, msg: string)             => void): this;
}

// Whisper hallucinations on silence/noise — discard silently
const HALLUCINATIONS = new Set([
  'thank you', 'thanks', 'bye', 'bye.', 'bye bye', 'goodbye', 'oh', 'oh.', 'ah', 'um', 'hmm',
  'you', 'the', 'a', 'i', 'ok', 'okay', 'yes', 'no', 'sure', 'right', 'alright',
  'الله أكبر', 'سبحان الله', 'amen', 'ameen', '...', '. . .', '…',
]);

function isHallucination(text: string): boolean {
  const clean = text.toLowerCase().trim().replace(/[.,!?।\s]+$/, '').trim();
  if (!clean || clean.length <= 2) return true;
  if (HALLUCINATIONS.has(clean)) return true;
  // Arabic/non-Indian script that's short = Whisper hallucination
  if (/^[\u0600-\u06FF\s]+$/.test(clean) && clean.replace(/\s/g, '').length < 6) return true;
  return false;
}

// ── Sarvam STT (primary — better for Hindi/Hinglish) ──────────────────────
function callSarvam(audioBuffer: Buffer, langHint?: string): Promise<{ transcript: string; language: string }> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', audioBuffer, { filename: 'audio.wav', contentType: 'audio/wav' });
    form.append('model', 'saarika:v2.5');
    // Use language hint from previous turn if available — improves accuracy
    if (langHint) form.append('language_code', langHint);

    const req = https.request({
      hostname: 'api.sarvam.ai',
      path: '/speech-to-text',
      method: 'POST',
      headers: { ...form.getHeaders(), 'api-subscription-key': process.env.SARVAM_API_KEY! },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data) as { transcript: string; language_code: string };
          resolve({ transcript: json.transcript?.trim() ?? '', language: json.language_code ?? 'hi-IN' });
        } else {
          reject(new Error(`Sarvam STT ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

// ── Whisper (fallback — better for pure English) ───────────────────────────
function callWhisper(audioBuffer: Buffer): Promise<{ transcript: string; language: string }> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', audioBuffer, { filename: 'audio.wav', contentType: 'audio/wav' });
    form.append('model', 'whisper-1');
    form.append('response_format', 'verbose_json'); // get language detection
    form.append('prompt', 'Airtel customer care. Hindi, English, or Hinglish.');

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/audio/transcriptions',
      method: 'POST',
      headers: { ...form.getHeaders(), 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data) as { text: string; language: string };
          const lang = json.language === 'hindi' ? 'hi-IN' : 'en-IN';
          resolve({ transcript: json.text?.trim() ?? '', language: lang });
        } else {
          reject(new Error(`Whisper ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

export class HybridSTTService extends EventEmitter implements STTAdapter {
  private buffers = new Map<string, Buffer[]>();

  processChunk(sessionId: string, chunk: Buffer): void {
    if (!this.buffers.has(sessionId)) this.buffers.set(sessionId, []);
    this.buffers.get(sessionId)!.push(chunk);
  }

  async finalize(sessionId: string, langHint?: string): Promise<void> {
    const chunks = this.buffers.get(sessionId) ?? [];
    this.buffers.delete(sessionId);
    if (chunks.length === 0) return;

    const audio = Buffer.concat(chunks);
    const minBytes = 44 + 16000;
    if (audio.length < minBytes) {
      console.log(`[stt] Audio too short (${audio.length} bytes) — skipping`);
      return;
    }

    this.emit('partial', sessionId, {
      text: 'Processing...', confidence: 0, language: 'hi-IN', isFinal: false,
    } as STTPartialPayload);

    console.log(`[stt] ${audio.length} bytes → Sarvam${langHint ? ` (hint: ${langHint})` : ''}`);

    try {
      let result: { transcript: string; language: string };
      try {
        result = await callSarvam(audio, langHint);
        console.log(`[stt] ✓ Sarvam: "${result.transcript}" [${result.language}]`);
      } catch (sarvamErr) {
        console.warn('[stt] Sarvam failed, trying Whisper:', sarvamErr);
        result = await callWhisper(audio);
        console.log(`[stt] ✓ Whisper: "${result.transcript}" [${result.language}]`);
      }

      const { transcript, language } = result;

      if (!transcript || isHallucination(transcript)) {
        console.log(`[stt] Discarded: "${transcript}"`);
        this.emit('error', sessionId, 'HALLUCINATION');
        return;
      }

      this.emit('final', sessionId, {
        text: transcript,
        confidence: 0.95,
        language,
        isFinal: true,
      } as STTFinalPayload);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[stt] All STT failed:', msg);
      this.emit('error', sessionId, msg);
    }
  }
}

export const sttService = new HybridSTTService();
