from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrganizationBase(BaseModel):
    id: str
    name: str
    industry: Optional[str] = None
    contact_email: Optional[str] = None


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    contact_email: Optional[str] = None


class OrganizationResponse(OrganizationBase):
    created_at: datetime

    class Config:
        from_attributes = True
