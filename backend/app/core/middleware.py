from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from app.db.session import get_db
from app.core.auth import decode_access_token
from app.models.user import User
from app.models.refresh_token import RefreshToken

security = HTTPBearer()


class AuthMiddleware:
    """Authentication middleware for validating JWT tokens"""
    
    @staticmethod
    def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        db: Session = Depends(get_db)
    ) -> User:
        """
        Dependency to get current authenticated user from JWT token.
        Use this in all protected routes.
        
        Usage:
            @router.get("/protected")
            def protected_route(current_user: User = Depends(get_current_user)):
                return {"user_id": current_user.id}
        """
        token = credentials.credentials
        
        # Decode token
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify token type
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user ID from token
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Fetch user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        return user
    
    @staticmethod
    def get_optional_user(
        request: Request,
        db: Session = Depends(get_db)
    ) -> Optional[User]:
        """
        Optional authentication - returns user if token is valid, None otherwise.
        Use for routes that work with or without authentication.
        """
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.replace("Bearer ", "")
        payload = decode_access_token(token)
        
        if not payload or payload.get("type") != "access":
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        return user
    
    @staticmethod
    def verify_refresh_token(
        token: str,
        db: Session
    ) -> Optional[User]:
        """Verify refresh token and return user if valid"""
        # Decode token
        payload = decode_access_token(token)
        if not payload or payload.get("type") != "refresh":
            return None
        
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        # Check if refresh token exists and is not revoked
        refresh_token = db.query(RefreshToken).filter(
            RefreshToken.token == token,
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked == False
        ).first()
        
        if not refresh_token:
            return None
        
        # Get user
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        return user


# Export the dependency function
get_current_user = AuthMiddleware.get_current_user
get_optional_user = AuthMiddleware.get_optional_user
