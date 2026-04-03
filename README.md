# 🎙️ Voice AI Agent — Production-Grade Monorepo

A real-time voice conversational AI system with interrupt handling, multilingual support, streaming LLM/TTS, and a modern dark UI.

---

## 🏗️ Architecture

```
VoiceAgent/
├── frontend/          React + Vite + Tailwind + Framer Motion
├── backend/           Node.js + Express + WebSocket (ws)
├── shared/            Shared TypeScript types
└── package.json       npm workspaces root
```

### Real-Time Pipeline

```
Mic → MediaRecorder → WebSocket → STT → Conversation Engine
    → LLM (streaming tokens) → Sentence Chunker → TTS → Audio → Frontend
```

### Backend Modules

| Module | File | Purpose |
|---|---|---|
| Session Manager | `services/sessionManager.ts` | Per-user isolated context |
| STT Service | `services/sttService.ts` | Mock streaming transcription |
| LLM Service | `services/llmService.ts` | Mock token streaming + tool calls |
| TTS Service | `services/ttsService.ts` | Mock chunked audio synthesis |
| MCP Tools | `services/mcpService.ts` | get_user_details, get_plan_info, get_data_usage |
| RAG System | `services/ragService.ts` | In-memory keyword retrieval |
| Interrupt Handler | `modules/interruptHandler.ts` | Barge-in detection (>500ms) |
| Conversation Engine | `modules/conversationEngine.ts` | Orchestrates full pipeline |
| WS Handler | `modules/wsHandler.ts` | WebSocket message routing |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 8+ (workspaces support)

### Install & Run

```bash
# 1. Install all dependencies
npm install

# 2. Start both frontend + backend in parallel
npm run dev
```

- Frontend: http://localhost:3000
- Backend WS: ws://localhost:8080/ws
- Backend API: http://localhost:8080/api/mcp

---

## 🔌 Replacing Mocks with Real APIs

### STT (Speech-to-Text)
Replace `MockSTTService` in `backend/src/services/sttService.ts`:

```typescript
// Example: Deepgram
import { createClient } from '@deepgram/sdk';

export class DeepgramSTTService extends EventEmitter implements STTAdapter {
  private dg = createClient(process.env.DEEPGRAM_API_KEY!);

  processChunk(sessionId: string, audioChunk: Buffer): void {
    // Stream to Deepgram live transcription
  }
}
```

### LLM
Replace `MockLLMService` in `backend/src/services/llmService.ts`:

```typescript
// Example: OpenAI
import OpenAI from 'openai';

export class OpenAILLMService extends EventEmitter implements LLMAdapter {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generate(sessionId: string, userText: string, context: SessionContext) {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [...context.history, { role: 'user', content: userText }],
      stream: true,
    });
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || '';
      if (token) this.emit('token', sessionId, { token, accumulated: '' });
    }
  }
}
```

### TTS
Replace `MockTTSService` in `backend/src/services/ttsService.ts`:

```typescript
// Example: Azure TTS
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export class AzureTTSService extends EventEmitter implements TTSAdapter {
  async synthesize(sessionId: string, sentence: string, sentenceIndex: number) {
    // Stream audio chunks via Azure SDK
  }
}
```

### RAG — Real Vector DB
Replace `ragService.ts` with Pinecone / pgvector:

```typescript
import { Pinecone } from '@pinecone-database/pinecone';
// embed query → similarity search → return top-k docs
```

---

## 🌐 Environment Variables

```bash
# backend/.env
PORT=8080

# For real APIs:
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus
PINECONE_API_KEY=...
```

```bash
# frontend/.env
VITE_WS_URL=ws://localhost:8080/ws
```

---

## 🧪 MCP Tool API (REST)

```bash
# List tools
GET /api/mcp/tools

# Execute a tool
POST /api/mcp/execute
{ "toolName": "get_plan_info", "args": { "user_id": "user_001" } }
```

---

## ⚡ Scaling to Production

| Concern | Solution |
|---|---|
| Session storage | Replace in-memory Map with Redis |
| Multi-instance WS | Use Redis pub/sub for WS fan-out |
| LLM concurrency | Queue with BullMQ |
| Audio streaming | WebRTC (replace MediaRecorder) |
| TTS caching | Cache common phrases in S3 |
| Observability | Add OpenTelemetry traces |

---

## 🎨 UI Features

- Dark glassmorphism design
- Live waveform rings on mic button
- Streaming text with cursor animation
- Partial transcript ghost bubble
- Status badges (Idle / Listening / Processing / Speaking / Interrupted)
- Debug panel with color-coded event log (STT, LLM, TTS, tools)
- Text input fallback for accessibility
- Auto-reconnect WebSocket
