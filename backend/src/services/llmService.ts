import { EventEmitter } from 'events';
import { LLMTokenPayload, LLMSentencePayload, SessionContext } from '@voice-agent/shared';
import { ragService } from './ragService';
import { mcpTools } from './mcpService';
import https from 'https';

export interface LLMAdapter {
  generate(sessionId: string, userText: string, context: SessionContext): void;
  abort(sessionId: string): void;
  on(event: 'token',     listener: (sessionId: string, data: LLMTokenPayload)    => void): this;
  on(event: 'sentence',  listener: (sessionId: string, data: LLMSentencePayload) => void): this;
  on(event: 'done',      listener: (sessionId: string, fullText: string)         => void): this;
  on(event: 'tool_call', listener: (sessionId: string, toolName: string, args: Record<string, unknown>) => void): this;
}

function buildSystemPrompt(lang: string): string {
  const langLabel = lang === 'hi-IN' ? 'Hindi' : lang === 'en-IN' ? 'English' : 'Hinglish (mix of Hindi and English)';
  return `You are Aria, a friendly Airtel India customer care voice assistant.
The user is speaking ${langLabel}. Reply ONLY in ${langLabel}. Write in ${langLabel} script only.

Voice output rules (strictly follow):
- Maximum 2 short sentences. Never more.
- No bullet points, lists, markdown, or symbols.
- No filler: never start with "Certainly", "Sure", "Of course", "I understand".
- Speak numbers as words.
- Sound warm and human.

Account data is provided in [Verified account:] and [Account data:] tags — use it for account-specific questions.
For GENERAL questions about Airtel services, plans, or policies — answer them regardless of the user's current plan.
Example: If user has postpaid but asks about prepaid plans, explain prepaid plans. Don't refuse.

NEVER ask for mobile number or verification — account is already verified.
Out of scope (non-Airtel topics): reply in one sentence that you only help with Airtel services.`;
}

function detectToolCall(text: string): { tool: string; args: Record<string, unknown> } | null {
  const l = text.toLowerCase();
  const has = (...w: string[]) => w.some(x => l.includes(x));
  if (has('bill', 'due', 'invoice', 'autopay', 'बिल', 'भुगतान'))
    return { tool: 'get_bill_info', args: { user_id: 'user_001' } };
  if (has('recharge', 'रिचार्ज') && has('history', 'last', 'pichla', 'पिछला'))
    return { tool: 'get_recharge_history', args: { user_id: 'user_001' } };
  if (has('plan', 'pack', 'validity', 'ott', 'prime', 'netflix', 'प्लान', 'वैलिडिटी'))
    return { tool: 'get_plan_info', args: { user_id: 'user_001' } };
  if (has('data', 'balance', 'bacha', 'usage', 'gb', 'डेटा', 'बैलेंस', 'बचा'))
    return { tool: 'get_data_usage', args: { user_id: 'user_001' } };
  if (has('network', 'signal', 'tower', 'coverage', 'नेटवर्क', 'सिग्नल'))
    return { tool: 'get_network_status', args: { user_id: 'user_001' } };
  if (has('account', 'name', 'address', 'loyalty', 'अकाउंट', 'नाम'))
    return { tool: 'get_user_details', args: { user_id: 'user_001' } };
  return null;
}

function streamGPT(
  messages: Array<{ role: string; content: string }>,
  onToken: (t: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4.1',
      messages,
      stream: true,
      max_tokens: 120,   // 2 short sentences = ~60-80 tokens, 120 is safe ceiling
      temperature: 0.5,  // lower = more consistent, faster convergence
    });

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let full = '';
      let buf = '';
      res.on('data', (chunk: Buffer) => {
        buf += chunk.toString();
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const token = JSON.parse(data)?.choices?.[0]?.delta?.content ?? '';
            if (token) { full += token; onToken(token); }
          } catch { /* skip */ }
        }
      });
      res.on('end', () => resolve(full));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export class GPTLLMService extends EventEmitter implements LLMAdapter {
  private abortFlags = new Map<string, boolean>();

  abort(sessionId: string): void {
    this.abortFlags.set(sessionId, true);
  }

  async generate(sessionId: string, userText: string, context: SessionContext): Promise<void> {
    this.abortFlags.set(sessionId, false);
    const t0 = Date.now();

    // Run tool fetch + RAG in parallel — don't wait sequentially
    const toolCall = detectToolCall(userText);
    // Always inject user account data so GPT never asks for mobile number
    const [toolContext, ragDocs, userDetails] = await Promise.all([
      toolCall
        ? (this.emit('tool_call', sessionId, toolCall.tool, toolCall.args),
           mcpTools.execute(toolCall.tool, toolCall.args))
        : Promise.resolve(''),
      Promise.resolve(ragService.retrieve(userText, 1)),
      mcpTools.execute('get_user_details', { user_id: 'user_001' }),
    ]);

    const ragContext = ragDocs[0]?.content ?? '';
    console.log(`[llm] Tool+RAG in ${Date.now() - t0}ms`);

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: buildSystemPrompt(context.language) },
      ...context.history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    ];

    let userContent = userText;
    // Always include user identity so GPT never asks for verification
    userContent += `\n[Verified account: ${userDetails}]`;
    if (toolContext) userContent += `\n[Account data: ${toolContext}]`;
    if (ragContext)  userContent += `\n[Relevant info: ${ragContext}]`;
    messages.push({ role: 'user', content: userContent });

    console.log(`[llm] GPT-4.1 | lang=${context.language} | history=${context.history.length} turns | tool=${toolCall?.tool ?? 'none'}`);
    let accumulated = '';
    let sentenceBuffer = '';
    let sentenceIndex = 0;

    try {
      await streamGPT(messages, (token) => {
        if (this.abortFlags.get(sessionId)) return;
        accumulated += token;
        sentenceBuffer += token;
        this.emit('token', sessionId, { token, accumulated } as LLMTokenPayload);

        const lastChar = sentenceBuffer.trimEnd().slice(-1);
        if (/[.!?।]/.test(lastChar) && sentenceBuffer.trim().split(/\s+/).length >= 3) {
          this.emit('sentence', sessionId, { sentence: sentenceBuffer.trim(), index: sentenceIndex++ } as LLMSentencePayload);
          sentenceBuffer = '';
        }
      });

      if (sentenceBuffer.trim()) {
        this.emit('sentence', sessionId, { sentence: sentenceBuffer.trim(), index: sentenceIndex } as LLMSentencePayload);
      }

      console.log(`[llm] ✓ Done in ${Date.now() - t0}ms: "${accumulated.slice(0, 80)}"`);
      this.emit('done', sessionId, accumulated);
    } catch (err) {
      console.error('[llm] Error:', err);
      const fallback = 'Kuch technical issue aa gaya. Kripya 121 par call karein.';
      this.emit('sentence', sessionId, { sentence: fallback, index: 0 } as LLMSentencePayload);
      this.emit('done', sessionId, fallback);
    }
  }
}

export const llmService = new GPTLLMService();
