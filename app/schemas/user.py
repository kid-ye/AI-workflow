from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: Optional[str] = None
    user_type: Optional[str] = None
    plan_type: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    user_type: Optional[str] = None
    plan_type: Optional[str] = None


class UserResponse(UserBase):
    email_verified: bool = False
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
