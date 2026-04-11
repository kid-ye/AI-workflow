from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.db.base import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String)
    contact_email = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
