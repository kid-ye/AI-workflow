from pydantic import BaseModel
from typing import Optional


class TTSModelBase(BaseModel):
    id: str
    name: str
    provider: str
    pace: Optional[float] = None
    temperature: Optional[float] = None
    language: Optional[str] = None
    language_code: Optional[str] = None


class TTSModelCreate(TTSModelBase):
    pass


class TTSModelUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    pace: Optional[float] = None
    temperature: Optional[float] = None
    language: Optional[str] = None
    language_code: Optional[str] = None


class TTSModelResponse(TTSModelBase):
    class Config:
        from_attributes = True
