from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RealtimeAgentBase(BaseModel):
    agent_id: str
    persona: Optional[str] = None
    scope: Optional[str] = None
    governance: Optional[str] = None
    security: Optional[str] = None
    voice_id: Optional[int] = None
    model_id: Optional[str] = None


class RealtimeAgentCreate(RealtimeAgentBase):
    pass


class RealtimeAgentUpdate(BaseModel):
    persona: Optional[str] = None
    scope: Optional[str] = None
    governance: Optional[str] = None
    security: Optional[str] = None
    voice_id: Optional[int] = None
    model_id: Optional[str] = None


class RealtimeAgentResponse(RealtimeAgentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
