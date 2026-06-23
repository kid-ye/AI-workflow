from pydantic import BaseModel
from typing import Optional


class ModelRealtimeBase(BaseModel):
    model_name: str


class ModelRealtimeCreate(ModelRealtimeBase):
    pass


class ModelRealtimeUpdate(BaseModel):
    model_name: Optional[str] = None


class ModelRealtimeResponse(ModelRealtimeBase):
    id: str

    class Config:
        from_attributes = True
