from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import (
    SignupRequest, 
    LoginRequest, 
    GoogleAuthRequest, 
    AuthResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    SetPasswordRequest,
    AuthMethodsResponse
)
from app.services.auth_service import auth_service
from app.core.middleware import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    """
    Manual signup with email and password
    
    - Creates a new user account
    - Hashes the password securely
    - Returns JWT access token
    """
    try:
        result = auth_service.signup(db, data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Manual login with email and password
    
    - Verifies email and password
    - Returns JWT access token
    """
    try:
        result = auth_service.login(db, data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/google", response_model=AuthResponse)
def google_login(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Google OAuth login
    
    - Verifies Google ID token
    - Creates new user if doesn't exist
    - Links Google account to existing user if email matches
    - Returns JWT access token
    """
    try:
        result = auth_service.google_login(db, data)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh_token(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token
    
    - Validates refresh token
    - Returns new access token
    """
    try:
        result = auth_service.refresh_access_token(db, data.refresh_token)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Logout user by revoking refresh token
    
    - Revokes the provided refresh token
    """
    auth_service.logout(db, data.refresh_token)
    return {"message": "Logged out successfully"}


@router.post("/logout-all", status_code=status.HTTP_200_OK)
def logout_all(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Logout from all devices by revoking all refresh tokens
    
    - Requires valid JWT token
    - Revokes all refresh tokens for the user
    """
    auth_service.logout_all(db, current_user.id)
    return {"message": "Logged out from all devices"}


@router.post("/set-password", status_code=status.HTTP_200_OK)
def set_password(
    data: SetPasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Set password for Google-only user
    
    - Allows Google users to add password authentication
    - Requires valid JWT token
    """
    try:
        auth_service.set_password(db, current_user.id, data.password)
        return {"message": "Password set successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/methods/{email}", response_model=AuthMethodsResponse)
def get_auth_methods(email: str, db: Session = Depends(get_db)):
    """
    Get available authentication methods for an email
    
    - Returns which login methods are available
    - Useful for frontend to show appropriate login options
    """
    result = auth_service.get_auth_methods(db, email)
    
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return result


@router.get("/me")
def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user
    
    - Requires valid JWT token
    - Returns user information
    """
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "user_type": current_user.user_type,
        "plan_type": current_user.plan_type,
        "email_verified": current_user.email_verified
    }
