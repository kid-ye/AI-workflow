from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
import uuid
from datetime import datetime
from app.models.user import User
from app.models.auth_provider import AuthProvider
from app.models.refresh_token import RefreshToken
from app.core.auth import hash_password, verify_password, create_access_token, create_refresh_token
from app.schemas.auth import SignupRequest, LoginRequest, GoogleAuthRequest
from app.core.config import settings


class AuthService:
    
    def signup(self, db: Session, data: SignupRequest) -> dict:
        """Manual signup with email and password"""
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise ValueError("Email already registered")
        
        # Create user
        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        user = User(
            id=user_id,
            name=data.name,
            email=data.email,
            phone=data.phone,
            user_type=data.user_type,
            role="user",
            plan_type="free",
            password_hash=hash_password(data.password),
            email_verified=False,
            is_active=True
        )
        db.add(user)
        db.flush()
        
        # Create email auth provider
        auth_provider = AuthProvider(
            id=f"auth_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            provider="email",
            provider_user_id=data.email,
            email_verified=False
        )
        db.add(auth_provider)
        
        # Generate tokens
        access_token = create_access_token({"sub": user.id, "email": user.email})
        refresh_token_str, refresh_expires = create_refresh_token({"sub": user.id, "email": user.email})
        
        # Store refresh token
        refresh_token = RefreshToken(
            id=f"rt_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            token=refresh_token_str,
            expires_at=refresh_expires
        )
        db.add(refresh_token)
        db.commit()
        db.refresh(user)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "user_type": user.user_type
            }
        }
    
    def login(self, db: Session, data: LoginRequest) -> dict:
        """Manual login with email and password"""
        # Find user by email
        user = db.query(User).filter(User.email == data.email).first()
        if not user:
            raise ValueError("Invalid email or password")
        
        # Check if user has password
        if not user.password_hash:
            raise ValueError("No password set. Please use Google login or set a password")
        
        # Verify password
        if not verify_password(data.password, user.password_hash):
            raise ValueError("Invalid email or password")
        
        # Check if user is active
        if not user.is_active:
            raise ValueError("Account is deactivated")
        
        # Generate tokens
        access_token = create_access_token({"sub": user.id, "email": user.email})
        refresh_token_str, refresh_expires = create_refresh_token({"sub": user.id, "email": user.email})
        
        # Store refresh token
        refresh_token = RefreshToken(
            id=f"rt_{uuid.uuid4().hex[:12]}",
            user_id=user.id,
            token=refresh_token_str,
            expires_at=refresh_expires
        )
        db.add(refresh_token)
        db.commit()
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "user_type": user.user_type
            }
        }
    
    def google_login(self, db: Session, data: GoogleAuthRequest) -> dict:
        """Google OAuth login"""
        try:
            # Verify Google ID token
            idinfo = id_token.verify_oauth2_token(
                data.id_token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            google_sub = idinfo['sub']
            google_email = idinfo['email']
            google_name = idinfo.get('name', google_email)
            google_picture = idinfo.get('picture')
            
        except Exception as e:
            raise ValueError(f"Invalid Google token: {str(e)}")
        
        # Check if Google account already linked
        auth_provider = db.query(AuthProvider).filter(
            AuthProvider.provider == "google",
            AuthProvider.provider_user_id == google_sub
        ).first()
        
        if auth_provider:
            # Existing Google user - just login
            user = db.query(User).filter(User.id == auth_provider.user_id).first()
            if not user.is_active:
                raise ValueError("Account is deactivated")
            
            access_token = create_access_token({"sub": user.id, "email": user.email})
            refresh_token_str, refresh_expires = create_refresh_token({"sub": user.id, "email": user.email})
            
            refresh_token = RefreshToken(
                id=f"rt_{uuid.uuid4().hex[:12]}",
                user_id=user.id,
                token=refresh_token_str,
                expires_at=refresh_expires
            )
            db.add(refresh_token)
            db.commit()
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token_str,
                "token_type": "bearer",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                    "user_type": user.user_type
                }
            }
        
        # Check if email exists (account linking scenario)
        existing_user = db.query(User).filter(User.email == google_email).first()
        
        if existing_user:
            # Link Google account to existing user
            new_auth_provider = AuthProvider(
                id=f"auth_{uuid.uuid4().hex[:12]}",
                user_id=existing_user.id,
                provider="google",
                provider_user_id=google_sub,
                profile_picture_url=google_picture,
                email_verified=True
            )
            db.add(new_auth_provider)
            
            access_token = create_access_token({"sub": existing_user.id, "email": existing_user.email})
            refresh_token_str, refresh_expires = create_refresh_token({"sub": existing_user.id, "email": existing_user.email})
            
            refresh_token = RefreshToken(
                id=f"rt_{uuid.uuid4().hex[:12]}",
                user_id=existing_user.id,
                token=refresh_token_str,
                expires_at=refresh_expires
            )
            db.add(refresh_token)
            db.commit()
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token_str,
                "token_type": "bearer",
                "user": {
                    "id": existing_user.id,
                    "name": existing_user.name,
                    "email": existing_user.email,
                    "role": existing_user.role,
                    "user_type": existing_user.user_type
                }
            }
        
        # New user - create account
        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        new_user = User(
            id=user_id,
            name=google_name,
            email=google_email,
            password_hash=None,  # No password for Google-only users
            email_verified=True,  # Google verifies emails
            user_type="INDIVIDUAL",
            role="user",
            plan_type="free",
            is_active=True
        )
        db.add(new_user)
        db.flush()
        
        # Create Google auth provider
        new_auth_provider = AuthProvider(
            id=f"auth_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            provider="google",
            provider_user_id=google_sub,
            profile_picture_url=google_picture,
            email_verified=True
        )
        db.add(new_auth_provider)
        
        access_token = create_access_token({"sub": new_user.id, "email": new_user.email})
        refresh_token_str, refresh_expires = create_refresh_token({"sub": new_user.id, "email": new_user.email})
        
        refresh_token = RefreshToken(
            id=f"rt_{uuid.uuid4().hex[:12]}",
            user_id=user_id,
            token=refresh_token_str,
            expires_at=refresh_expires
        )
        db.add(refresh_token)
        db.commit()
        db.refresh(new_user)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token_str,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role,
                "user_type": new_user.user_type
            }
        }
    
    def set_password(self, db: Session, user_id: str, password: str) -> bool:
        """Set password for Google-only user"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Hash and set password
        user.password_hash = hash_password(password)
        
        # Create email auth provider if doesn't exist
        email_provider = db.query(AuthProvider).filter(
            AuthProvider.user_id == user_id,
            AuthProvider.provider == "email"
        ).first()
        
        if not email_provider:
            email_provider = AuthProvider(
                id=f"auth_{uuid.uuid4().hex[:12]}",
                user_id=user_id,
                provider="email",
                provider_user_id=user.email,
                email_verified=user.email_verified
            )
            db.add(email_provider)
        
        db.commit()
        return True
    
    def get_auth_methods(self, db: Session, email: str) -> dict:
        """Get available authentication methods for an email"""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        auth_providers = db.query(AuthProvider).filter(
            AuthProvider.user_id == user.id
        ).all()
        
        providers = [p.provider for p in auth_providers]
        
        return {
            "has_password": user.password_hash is not None,
            "providers": providers,
            "can_login_with_email": user.password_hash is not None,
            "can_login_with_google": "google" in providers
        }
    
    def refresh_access_token(self, db: Session, refresh_token: str) -> dict:
        """Generate new access token using refresh token"""
        from app.core.middleware import AuthMiddleware
        
        user = AuthMiddleware.verify_refresh_token(refresh_token, db)
        if not user:
            raise ValueError("Invalid or expired refresh token")
        
        # Generate new access token
        access_token = create_access_token({"sub": user.id, "email": user.email})
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    def logout(self, db: Session, refresh_token: str) -> bool:
        """Revoke refresh token on logout"""
        token_record = db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token,
            RefreshToken.is_revoked == False
        ).first()
        
        if token_record:
            token_record.is_revoked = True
            token_record.revoked_at = datetime.utcnow()
            db.commit()
            return True
        
        return False
    
    def logout_all(self, db: Session, user_id: str) -> bool:
        """Revoke all refresh tokens for a user"""
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked == False
        ).update({
            "is_revoked": True,
            "revoked_at": datetime.utcnow()
        })
        db.commit()
        return True


auth_service = AuthService()
