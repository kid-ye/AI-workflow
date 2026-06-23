from sqlalchemy import Column, Integer, String
from app.db.base import Base


class Voice(Base):
    __tablename__ = "voices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    language = Column(String)
    type = Column(String)
