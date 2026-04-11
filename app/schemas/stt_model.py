from pydantic import BaseModel
from typing import Optional


class STTModelBase(BaseModel):
    id: str
    model_name: str
    provider: str
    language: Optional[str] = None
    language_code: Optional[str] = None


class STTModelCreate(STTModelBase):
    pass


class STTModelUpdate(BaseModel):
    model_name: Optional[str] = None
    provider: Optional[str] = None
    language: Optional[str] = None
    language_code: Optional[str] = None


class STTModelResponse(STTModelBase):
    class Config:
        from_attributes = True
