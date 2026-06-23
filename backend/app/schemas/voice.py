from pydantic import BaseModel
from typing import Optional


class VoiceBase(BaseModel):
    name: str
    provider: str
    language: Optional[str] = None
    type: Optional[str] = None


class VoiceCreate(VoiceBase):
    pass


class VoiceUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    language: Optional[str] = None
    type: Optional[str] = None


class VoiceResponse(VoiceBase):
    id: int

    class Config:
        from_attributes = True
