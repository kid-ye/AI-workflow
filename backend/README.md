# RevDau Backend API

FastAPI backend for RevDau with CRUD operations for agents, voices, models, and realtime agents.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure database in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/revdau
```

3. Run the application:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Agents
- `POST /api/v1/agents/` - Create agent
- `GET /api/v1/agents/{agent_id}` - Get agent by ID
- `GET /api/v1/agents/` - List all agents
- `GET /api/v1/agents/owner/{owner_type}/{owner_id}` - Get agents by owner
- `PUT /api/v1/agents/{agent_id}` - Update agent
- `DELETE /api/v1/agents/{agent_id}` - Delete agent

### Voices
- `POST /api/v1/voices/` - Create voice
- `GET /api/v1/voices/{voice_id}` - Get voice by ID
- `GET /api/v1/voices/` - List all voices
- `GET /api/v1/voices/provider/{provider}` - Get voices by provider
- `PUT /api/v1/voices/{voice_id}` - Update voice
- `DELETE /api/v1/voices/{voice_id}` - Delete voice

### Models
- `POST /api/v1/models/` - Create model
- `GET /api/v1/models/{model_id}` - Get model by ID
- `GET /api/v1/models/` - List all models
- `GET /api/v1/models/name/{model_name}` - Get model by name
- `PUT /api/v1/models/{model_id}` - Update model
- `DELETE /api/v1/models/{model_id}` - Delete model

### Realtime Agents
- `POST /api/v1/realtime-agents/` - Create realtime agent
- `GET /api/v1/realtime-agents/{realtime_agent_id}` - Get realtime agent by ID
- `GET /api/v1/realtime-agents/` - List all realtime agents
- `GET /api/v1/realtime-agents/agent/{agent_id}` - Get realtime agent by agent ID
- `PUT /api/v1/realtime-agents/{realtime_agent_id}` - Update realtime agent
- `DELETE /api/v1/realtime-agents/{realtime_agent_id}` - Delete realtime agent

## Documentation

Access interactive API docs at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
