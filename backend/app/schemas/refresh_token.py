from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RefreshTokenResponse(BaseModel):
    id: str
    user_id: str
    expires_at: datetime
    is_revoked: bool = False
    created_at: datetime
    revoked_at: Optional[datetime] = None

    class Config:
        from_attributes = True
