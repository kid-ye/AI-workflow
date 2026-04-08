from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AgentBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: str
    language: Optional[str] = None
    status: str
    owner_type: str
    owner_id: str


class AgentCreate(AgentBase):
    pass


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None


class AgentResponse(AgentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
