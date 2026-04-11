from sqlalchemy import Column, String
from app.db.base import Base


class STTModel(Base):
    __tablename__ = "stt_models"

    id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    language = Column(String)
    language_code = Column(String)
