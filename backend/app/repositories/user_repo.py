from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserRepository:
    def create(self, db: Session, data: UserCreate) -> User:
        user = User(**data.model_dump())
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_by_id(self, db: Session, user_id: str) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return db.query(User).offset(skip).limit(limit).all()

    def get_by_org_id(self, db: Session, org_id: str) -> List[User]:
        return db.query(User).filter(User.org_id == org_id).all()

    def get_by_user_type(self, db: Session, user_type: str) -> List[User]:
        return db.query(User).filter(User.user_type == user_type).all()

    def update(self, db: Session, user_id: str, data: UserUpdate) -> Optional[User]:
        user = self.get_by_id(db, user_id)
        if not user:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        return user

    def delete(self, db: Session, user_id: str) -> bool:
        user = self.get_by_id(db, user_id)
        if not user:
            return False
        
        db.delete(user)
        db.commit()
        return True


user_repo = UserRepository()
