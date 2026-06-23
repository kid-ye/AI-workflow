from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.user_repo import user_repo
from app.schemas.user import UserCreate, UserUpdate
from app.models.user import User


class UserService:
    def create_user(self, db: Session, data: UserCreate) -> User:
        return user_repo.create(db, data)

    def get_user(self, db: Session, user_id: str) -> Optional[User]:
        return user_repo.get_by_id(db, user_id)

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        return user_repo.get_by_email(db, email)

    def get_users(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        return user_repo.get_all(db, skip, limit)

    def get_users_by_org(self, db: Session, org_id: str) -> List[User]:
        return user_repo.get_by_org_id(db, org_id)

    def get_users_by_type(self, db: Session, user_type: str) -> List[User]:
        return user_repo.get_by_user_type(db, user_type)

    def update_user(self, db: Session, user_id: str, data: UserUpdate) -> Optional[User]:
        return user_repo.update(db, user_id, data)

    def delete_user(self, db: Session, user_id: str) -> bool:
        return user_repo.delete(db, user_id)


user_service = UserService()
