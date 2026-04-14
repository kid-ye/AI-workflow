from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.custom_agent import CustomAgentCreate, CustomAgentUpdate, CustomAgentResponse
from app.services.custom_agent_service import custom_agent_service

router = APIRouter(prefix="/custom-agents", tags=["custom-agents"])


@router.post("/", response_model=CustomAgentResponse, status_code=status.HTTP_201_CREATED)
def create_custom_agent(data: CustomAgentCreate, db: Session = Depends(get_db)):
    return custom_agent_service.create_agent(db, data)


@router.get("/{custom_agent_id}", response_model=CustomAgentResponse)
def get_custom_agent(custom_agent_id: str, db: Session = Depends(get_db)):
    agent = custom_agent_service.get_agent(db, custom_agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Custom agent not found")
    return agent


@router.get("/", response_model=List[CustomAgentResponse])
def get_custom_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return custom_agent_service.get_agents(db, skip, limit)


@router.get("/agent/{agent_id}", response_model=CustomAgentResponse)
def get_custom_agent_by_agent_id(agent_id: str, db: Session = Depends(get_db)):
    agent = custom_agent_service.get_agent_by_agent_id(db, agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Custom agent not found")
    return agent


@router.put("/{custom_agent_id}", response_model=CustomAgentResponse)
def update_custom_agent(custom_agent_id: str, data: CustomAgentUpdate, db: Session = Depends(get_db)):
    agent = custom_agent_service.update_agent(db, custom_agent_id, data)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Custom agent not found")
    return agent


@router.delete("/{custom_agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_custom_agent(custom_agent_id: str, db: Session = Depends(get_db)):
    if not custom_agent_service.delete_agent(db, custom_agent_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Custom agent not found")
