from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class RealtimeAgent(Base):
    __tablename__ = "realtime_agent"

    id = Column(String, primary_key=True, index=True)
    agent_id = Column(String, ForeignKey("agents.id"), unique=True, nullable=False)
    persona = Column(Text)
    scope = Column(Text)
    governance = Column(Text)
    security = Column(Text)
    voice_id = Column(Integer, ForeignKey("voices.id"))
    model_id = Column(String, ForeignKey("model_realtime.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent = relationship("Agent", backref="realtime_config")
    voice = relationship("Voice")
    model = relationship("ModelRealtime")
