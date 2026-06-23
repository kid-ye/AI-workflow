// ─── WebSocket Message Types ───────────────────────────────────────────────

export type ClientMessageType =
  | 'audio_chunk'
  | 'audio_start'
  | 'audio_stop'
  | 'interrupt'
  | 'text_input'
  | 'greeting';

export type ServerMessageType =
  | 'stt_partial'
  | 'stt_final'
  | 'llm_token'
  | 'llm_sentence'
  | 'tts_chunk'
  | 'tts_done'
  | 'tts_reset'
  | 'status'
  | 'error'
  | 'tool_call'
  | 'tool_result';

export type AgentStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted';

export interface ClientMessage {
  type: ClientMessageType;
  sessionId: string;
  payload?: unknown;
}

export interface ServerMessage {
  type: ServerMessageType;
  sessionId: string;
  payload: unknown;
  timestamp: number;
}

// ─── STT ───────────────────────────────────────────────────────────────────

export interface STTPartialPayload {
  text: string;
  confidence: number;
  language: string;
  isFinal: false;
}

export interface STTFinalPayload {
  text: string;
  confidence: number;
  language: string;
  isFinal: true;
}

// ─── LLM ───────────────────────────────────────────────────────────────────

export interface LLMTokenPayload {
  token: string;
  accumulated: string;
}

export interface LLMSentencePayload {
  sentence: string;
  index: number;
}

// ─── TTS ───────────────────────────────────────────────────────────────────

export interface TTSChunkPayload {
  audioBase64: string;
  chunkIndex: number;
  sentenceIndex: number;
  text: string;
}

// ─── Status ────────────────────────────────────────────────────────────────

export interface StatusPayload {
  status: AgentStatus;
  message?: string;
}

// ─── Tool ──────────────────────────────────────────────────────────────────

export interface ToolCallPayload {
  toolName: string;
  args: Record<string, unknown>;
}

export interface ToolResultPayload {
  toolName: string;
  result: unknown;
}

// ─── Chat Message (UI) ─────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

// ─── Session ───────────────────────────────────────────────────────────────

export interface SessionContext {
  sessionId: string;
  userId?: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: string;
  createdAt: number;
  lastActivity: number;
}
