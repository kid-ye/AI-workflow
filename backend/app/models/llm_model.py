from sqlalchemy import Column, String, Float
from app.db.base import Base


class LLMModel(Base):
    __tablename__ = "llm_models"

    id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    temperature = Column(Float)
