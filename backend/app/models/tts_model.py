from sqlalchemy import Column, String, Float
from app.db.base import Base


class TTSModel(Base):
    __tablename__ = "tts_models"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    pace = Column(Float)
    temperature = Column(Float)
    language = Column(String)
    language_code = Column(String)
