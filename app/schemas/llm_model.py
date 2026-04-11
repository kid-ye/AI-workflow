from pydantic import BaseModel
from typing import Optional


class LLMModelBase(BaseModel):
    id: str
    model_name: str
    provider: str
    temperature: Optional[float] = None


class LLMModelCreate(LLMModelBase):
    pass


class LLMModelUpdate(BaseModel):
    model_name: Optional[str] = None
    provider: Optional[str] = None
    temperature: Optional[float] = None


class LLMModelResponse(LLMModelBase):
    class Config:
        from_attributes = True
