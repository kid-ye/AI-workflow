from fastapi import APIRouter
from app.api.v1.endpoints import agents, voices, model_realtime, realtime_agent

api_router = APIRouter()

api_router.include_router(agents.router)
api_router.include_router(voices.router)
api_router.include_router(model_realtime.router)
api_router.include_router(realtime_agent.router)
