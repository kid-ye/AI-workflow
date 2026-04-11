from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.services.organization_service import organization_service

router = APIRouter(prefix="/organizations", tags=["organizations"])


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(data: OrganizationCreate, db: Session = Depends(get_db)):
    return organization_service.create_organization(db, data)


@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(org_id: str, db: Session = Depends(get_db)):
    org = organization_service.get_organization(db, org_id)
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org


@router.get("/", response_model=List[OrganizationResponse])
def get_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return organization_service.get_organizations(db, skip, limit)


@router.get("/industry/{industry}", response_model=List[OrganizationResponse])
def get_organizations_by_industry(industry: str, db: Session = Depends(get_db)):
    return organization_service.get_organizations_by_industry(db, industry)


@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(org_id: str, data: OrganizationUpdate, db: Session = Depends(get_db)):
    org = organization_service.update_organization(db, org_id, data)
    if not org:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return org


@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(org_id: str, db: Session = Depends(get_db)):
    if not organization_service.delete_organization(db, org_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
