from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.organization_repo import organization_repo
from app.schemas.organization import OrganizationCreate, OrganizationUpdate
from app.models.organization import Organization


class OrganizationService:
    def create_organization(self, db: Session, data: OrganizationCreate) -> Organization:
        return organization_repo.create(db, data)

    def get_organization(self, db: Session, org_id: str) -> Optional[Organization]:
        return organization_repo.get_by_id(db, org_id)

    def get_organizations(self, db: Session, skip: int = 0, limit: int = 100) -> List[Organization]:
        return organization_repo.get_all(db, skip, limit)

    def get_organizations_by_industry(self, db: Session, industry: str) -> List[Organization]:
        return organization_repo.get_by_industry(db, industry)

    def update_organization(self, db: Session, org_id: str, data: OrganizationUpdate) -> Optional[Organization]:
        return organization_repo.update(db, org_id, data)

    def delete_organization(self, db: Session, org_id: str) -> bool:
        return organization_repo.delete(db, org_id)


organization_service = OrganizationService()
