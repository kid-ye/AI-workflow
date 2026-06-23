from pydantic import BaseModel, EmailStr
from typing import Optional, List


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    user_type: Optional[str] = "INDIVIDUAL"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserAuthInfo(BaseModel):
    id: str
    name: str
    email: str
    role: Optional[str] = None
    user_type: Optional[str] = None
    plan_type: Optional[str] = None
    email_verified: bool = False


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserAuthInfo


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SetPasswordRequest(BaseModel):
    password: str


class AuthMethodsResponse(BaseModel):
    has_password: bool
    providers: List[str]
    can_login_with_email: bool
    can_login_with_google: bool
