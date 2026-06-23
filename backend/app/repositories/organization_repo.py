from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class OrganizationRepository:
    def create(self, db: Session, data: OrganizationCreate) -> Organization:
        org = Organization(**data.model_dump())
        db.add(org)
        db.commit()
        db.refresh(org)
        return org

    def get_by_id(self, db: Session, org_id: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.id == org_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Organization]:
        return db.query(Organization).offset(skip).limit(limit).all()

    def get_by_industry(self, db: Session, industry: str) -> List[Organization]:
        return db.query(Organization).filter(Organization.industry == industry).all()

    def update(self, db: Session, org_id: str, data: OrganizationUpdate) -> Optional[Organization]:
        org = self.get_by_id(db, org_id)
        if not org:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(org, field, value)
        
        db.commit()
        db.refresh(org)
        return org

    def delete(self, db: Session, org_id: str) -> bool:
        org = self.get_by_id(db, org_id)
        if not org:
            return False
        
        db.delete(org)
        db.commit()
        return True


organization_repo = OrganizationRepository()
