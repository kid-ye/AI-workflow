from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CustomAgentBase(BaseModel):
    agent_id: str
    persona: Optional[str] = None
    scope: Optional[str] = None
    governance: Optional[str] = None
    security: Optional[str] = None
    voice_id: Optional[int] = None
    stt_model_id: Optional[str] = None
    llm_model_id: Optional[str] = None
    tts_model_id: Optional[str] = None
    tts_pace: Optional[float] = None
    tts_temperature: Optional[float] = None
    llm_temperature: Optional[float] = None
    stt_language: Optional[str] = None
    stt_language_code: Optional[str] = None
    tts_language: Optional[str] = None
    tts_language_code: Optional[str] = None


class CustomAgentCreate(CustomAgentBase):
    pass


class CustomAgentUpdate(BaseModel):
    agent_id: Optional[str] = None
    persona: Optional[str] = None
    scope: Optional[str] = None
    governance: Optional[str] = None
    security: Optional[str] = None
    voice_id: Optional[int] = None
    stt_model_id: Optional[str] = None
    llm_model_id: Optional[str] = None
    tts_model_id: Optional[str] = None
    tts_pace: Optional[float] = None
    tts_temperature: Optional[float] = None
    llm_temperature: Optional[float] = None
    stt_language: Optional[str] = None
    stt_language_code: Optional[str] = None
    tts_language: Optional[str] = None
    tts_language_code: Optional[str] = None


class CustomAgentResponse(CustomAgentBase):
    custom_agent_id: str
    created_at: datetime

    class Config:
        from_attributes = True
