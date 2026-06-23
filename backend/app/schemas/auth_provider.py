from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AuthProviderResponse(BaseModel):
    id: str
    user_id: str
    provider: str
    provider_user_id: str
    profile_picture_url: Optional[str] = None
    email_verified: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
