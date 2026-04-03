import { create } from 'zustand';
import { AgentStatus, ChatMessage } from '@voice-agent/shared';
import { v4 as uuidv4 } from 'uuid';

interface DebugEntry {
  type: string;
  content: string;
  ts: number;
}

interface AgentStore {
  // Connection
  sessionId: string | null;
  connected: boolean;
  status: AgentStatus;

  // Chat
  messages: ChatMessage[];
  streamingText: string; // current AI streaming text

  // STT
  partialTranscript: string;

  // Debug
  debugLog: DebugEntry[];
  showDebug: boolean;

  // Actions
  setConnected: (v: boolean) => void;
  setSessionId: (id: string) => void;
  setStatus: (s: AgentStatus) => void;
  setPartialTranscript: (t: string) => void;
  addUserMessage: (text: string) => void;
  startAssistantMessage: () => string; // returns message id
  appendAssistantToken: (id: string, token: string) => void;
  finalizeAssistantMessage: (id: string) => void;
  pushDebug: (type: string, content: string) => void;
  toggleDebug: () => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  sessionId: null,
  connected: false,
  status: 'idle',
  messages: [],
  streamingText: '',
  partialTranscript: '',
  debugLog: [],
  showDebug: false,

  setConnected: (v) => set({ connected: v }),
  setSessionId: (id) => set({ sessionId: id }),
  setStatus: (s) => set({ status: s }),
  setPartialTranscript: (t) => set({ partialTranscript: t }),

  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: uuidv4(), role: 'user', text, timestamp: Date.now() },
      ],
      partialTranscript: '',
    })),

  startAssistantMessage: () => {
    const id = uuidv4();
    set((state) => ({
      messages: [
        ...state.messages,
        { id, role: 'assistant', text: '', timestamp: Date.now(), isStreaming: true },
      ],
    }));
    return id;
  },

  appendAssistantToken: (id, token) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, text: m.text + (m.text ? ' ' : '') + token } : m
      ),
    })),

  finalizeAssistantMessage: (id) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, isStreaming: false } : m
      ),
    })),

  pushDebug: (type, content) =>
    set((state) => ({
      debugLog: [{ type, content, ts: Date.now() }, ...state.debugLog].slice(0, 100),
    })),

  toggleDebug: () => set((state) => ({ showDebug: !state.showDebug })),
  clearMessages: () => set({ messages: [], debugLog: [], partialTranscript: '' }),
}));
