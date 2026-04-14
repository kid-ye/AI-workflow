from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from app.db.base import Base


class CustomAgent(Base):
    __tablename__ = "custom_agent"

    custom_agent_id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id"), unique=True, nullable=False)
    persona = Column(Text)
    scope = Column(Text)
    governance = Column(Text)
    security = Column(Text)
    voice_id = Column(Integer, ForeignKey("voices.id"))
    stt_model_id = Column(String, ForeignKey("stt_models.id"))
    llm_model_id = Column(String, ForeignKey("llm_models.id"))
    tts_model_id = Column(String, ForeignKey("tts_models.id"))
    tts_pace = Column(Float)
    tts_temperature = Column(Float)
    llm_temperature = Column(Float)
    stt_language = Column(String)
    stt_language_code = Column(String)
    tts_language = Column(String)
    tts_language_code = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
