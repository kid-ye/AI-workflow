from fastapi import APIRouter
from app.api.v1.endpoints import agents, voices, model_realtime, realtime_agent, config, stt_models, llm_models, tts_models, custom_agents, organizations, users, auth

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(agents.router)
api_router.include_router(voices.router)
api_router.include_router(model_realtime.router)
api_router.include_router(realtime_agent.router)
api_router.include_router(config.router)
api_router.include_router(stt_models.router)
api_router.include_router(llm_models.router)
api_router.include_router(tts_models.router)
api_router.include_router(custom_agents.router)
api_router.include_router(organizations.router)
api_router.include_router(users.router)
