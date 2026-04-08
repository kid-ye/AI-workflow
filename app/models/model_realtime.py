from sqlalchemy import Column, String
from app.db.base import Base


class ModelRealtime(Base):
    __tablename__ = "model_realtime"

    id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
