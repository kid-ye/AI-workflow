# AI-workflow — Real-Time Voice AI Platform

A production-grade monorepo for building, managing, and deploying real-time voice conversational AI agents. Supports multilingual STT/TTS, streaming LLM responses, interrupt handling, and a full agent configuration UI.

---

## Repository Structure

```
RevDau/
├── backend/           Python FastAPI — core API, agent/voice/model management, DB
├── frontend/          Next.js 16 — premium dashboard UI for managing AI agents
└── voice-agents/      Node.js + WebSocket — low-latency real-time voice pipeline
```

---

## Architecture Overview

```
[Browser / Next.js UI]
        │
        ├─── REST/WebSocket ──► [Backend API (FastAPI)]
        │                              │
        │                        ┌─────┴──────┐
        │                     [Postgres]  [Model Orchestrator]
        │                                      │
        │                         ┌────────────┼────────────┐
        │                      [OpenAI]    [Sarvam]    [Other]
        │
        └─── WebSocket ──► [voice-agents/backend (Node.js)]
                                   │
                          [Client VAD / ONNX runtime]
```

**Request flow:**

1. The Next.js UI captures audio in the browser (optionally with client-side VAD via `onnxruntime-web`).
2. Audio is sent to the FastAPI backend:
   - **STT** → transcription via Sarvam or OpenAI Whisper
   - **LLM** → streaming response via OpenAI (server-sent events or WebSocket)
   - **TTS** → synthesized audio returned to the client via Sarvam
3. The `voice-agents` service handles low-latency bi-directional streaming for real-time agent sessions, using local VAD to minimize unnecessary uploads.
4. All agents, voices, models, sessions, and users are persisted to Postgres.

---

## Subprojects

### `backend/` — FastAPI API Service

Python REST API providing CRUD for agents, voices, models, and realtime agents. Handles authentication, model orchestration, DB persistence, and streaming.

**Tech:** FastAPI 0.109, SQLAlchemy 2.0, Pydantic 2.5, psycopg2, python-jose, passlib

**Quick start:**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Add DATABASE_URL and secrets to .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at `http://localhost:8000/docs` (Swagger) and `http://localhost:8000/redoc`.

**Endpoints:**

| Resource | Routes |
|---|---|
| Agents | `POST /api/v1/agents/` · `GET /api/v1/agents/` · `GET /api/v1/agents/{id}` · `GET /api/v1/agents/owner/{type}/{id}` · `PUT` · `DELETE` |
| Voices | `POST /api/v1/voices/` · `GET /api/v1/voices/` · `GET /api/v1/voices/{id}` · `GET /api/v1/voices/provider/{provider}` · `PUT` · `DELETE` |
| Models | `POST /api/v1/models/` · `GET /api/v1/models/` · `GET /api/v1/models/{id}` · `GET /api/v1/models/name/{name}` · `PUT` · `DELETE` |
| Realtime Agents | `POST /api/v1/realtime-agents/` · `GET /api/v1/realtime-agents/` · `GET /api/v1/realtime-agents/{id}` · `GET /api/v1/realtime-agents/agent/{agent_id}` · `PUT` · `DELETE` |

---

### `frontend/` — Next.js Dashboard UI

Premium dashboard for configuring and managing AI agents, voice providers, and real-time workflows.

**Tech:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, NextAuth.js, shadcn/ui, cobe

**Features:**
- Split-screen authentication (NextAuth.js)
- Agent builder UI for Realtime, Custom, STT, and TTS agents
- Dynamic retrieval of LLM models, voices, and providers
- Glassmorphism design, 3D globe, ambient glows, dark-native

**Quick start:**

```bash
cd frontend
npm install
# Create .env.local with NEXTAUTH_URL and NEXTAUTH_SECRET
npm run dev
# http://localhost:3000
```

**Scripts:**

| Command | Action |
|---|---|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Lint with ESLint |

**Structure:**

```
src/
├── app/          Pages and API routes (/api/v1/agents, /api/tts-models, etc.)
├── components/   SplitAuthPage, FloatingLogin, Globe, and other UI components
└── lib/          Helpers, utilities, and API configuration
```

---

### `voice-agents/` — Real-Time Voice Pipeline

Low-latency voice agent system with real-time STT → LLM → TTS streaming, barge-in/interrupt detection, and client-side VAD.

**Tech:** Node.js 18+, Express, WebSocket (`ws`), `onnxruntime-web`, `@ricky0123/vad-web`, Vite, TypeScript

**Pipeline:**

```
Mic → MediaRecorder → WebSocket → STT → Conversation Engine
    → LLM (streaming tokens) → Sentence Chunker → TTS → Audio → Frontend
```

**Backend modules:**

| Module | File | Purpose |
|---|---|---|
| Session Manager | `services/sessionManager.ts` | Per-user isolated context |
| STT Service | `services/sttService.ts` | Streaming transcription |
| LLM Service | `services/llmService.ts` | Token streaming + tool calls |
| TTS Service | `services/ttsService.ts` | Chunked audio synthesis |
| MCP Tools | `services/mcpService.ts` | `get_user_details`, `get_plan_info`, `get_data_usage` |
| RAG System | `services/ragService.ts` | In-memory keyword retrieval |
| Interrupt Handler | `modules/interruptHandler.ts` | Barge-in detection (>500ms) |
| Conversation Engine | `modules/conversationEngine.ts` | Full pipeline orchestration |
| WS Handler | `modules/wsHandler.ts` | WebSocket message routing |

**Quick start:**

```bash
cd voice-agents
npm install
npm run dev
# Frontend: http://localhost:3000
# Backend WS: ws://localhost:8080/ws
# Backend API: http://localhost:8080/api/mcp
```

**MCP Tool API:**

```bash
# List available tools
GET /api/mcp/tools

# Execute a tool
POST /api/mcp/execute
{ "toolName": "get_plan_info", "args": { "user_id": "user_001" } }
```

---

## Configuration

### Environment Variables

**`backend/.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/revdau
SECRET_KEY=your-jwt-secret
OPENAI_API_KEY=sk-...
SARVAM_API_KEY=...
S3_BUCKET=...            # optional, for audio storage
```

**`frontend/.env.local`**

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

**`voice-agents/backend/.env`**

```env
PORT=8080
OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...     # if replacing mock STT
AZURE_SPEECH_KEY=...     # if replacing mock TTS
PINECONE_API_KEY=...     # if replacing in-memory RAG
```

### Agent Config (`agent.config.json`)

Both `backend/` and `voice-agents/backend/` use `agent.config.json` for runtime agent settings: provider endpoints, model names, VAD thresholds, and LLM system prompts.

Key constraints baked into default prompts: max two sentences per response, numbers spoken as words, no bullet lists.

---

## Replacing Mock Services (voice-agents)

The voice-agents service ships with mock STT, LLM, and TTS adapters. Replace them with real providers:

**STT → Deepgram**

```typescript
import { createClient } from '@deepgram/sdk';
export class DeepgramSTTService extends EventEmitter implements STTAdapter {
  private dg = createClient(process.env.DEEPGRAM_API_KEY!);
  processChunk(sessionId: string, audioChunk: Buffer): void { /* stream to Deepgram */ }
}
```

**LLM → OpenAI**

```typescript
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

**TTS → Azure**

```typescript
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
export class AzureTTSService extends EventEmitter implements TTSAdapter {
  async synthesize(sessionId: string, sentence: string, sentenceIndex: number) { /* stream via Azure SDK */ }
}
```

**RAG → Pinecone**

```typescript
import { Pinecone } from '@pinecone-database/pinecone';
// embed query → similarity search → return top-k docs
```

---

## Security

- JWT-based authentication with refresh token rotation (see `backend/AUTHENTICATION.md`)
- `passlib[bcrypt]` for password hashing, `python-jose` for token signing
- CORS is open in development — lock it down for production in `backend/app/main.py`
- Keep all API keys in `.env` files, never committed to version control
- Apply rate limiting on model endpoints to control cost and abuse
- Use TLS for all provider calls and client-server traffic in production

---

## Scaling to Production

| Concern | Recommendation |
|---|---|
| Session storage | Replace in-memory `Map` with Redis |
| Multi-instance WebSocket | Redis pub/sub for WS fan-out |
| LLM concurrency | Queue with BullMQ |
| Audio streaming | WebRTC instead of MediaRecorder |
| TTS caching | Cache common phrases in S3 |
| Observability | OpenTelemetry traces + provider latency metrics |

**Recommended metrics:**
- API request rate and P95 latency per endpoint
- STT latency and transcription error rate
- TTS synthesis latency and audio payload size
- LLM tokens consumed and cost per request
- VAD false-trigger and missed-detection rates

---

## Development

**Run all services:**

```bash
# Terminal 1 — Backend API
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2 — Frontend UI
cd frontend && npm run dev

# Terminal 3 — Voice agents (optional)
cd voice-agents && npm run dev
```

**Tests:**

```bash
cd backend && pytest
```

**Database migrations:**

```bash
cd backend/migrations
# Follow migration tooling — see migrate_add_password_hash.py for an example
```

**Contributing:**

- API changes: update `backend/app/api/v1`, add Pydantic schemas, add tests, update `frontend/API_SCHEMA.md`
- Frontend changes: follow component patterns in `frontend/src/components`, keep bundle size lean
- Voice-agent changes: document `agent.config.json` changes, maintain backward-compatible field names

---

## License

See `LICENSE` in the repository root. If no license file is present, treat this code as private until one is applied.
