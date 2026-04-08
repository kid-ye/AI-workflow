from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.services.agent_service import agent_service

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_agent(agent_data: AgentCreate, db: Session = Depends(get_db)):
    return agent_service.create_agent(db, agent_data)


@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = agent_service.get_agent(db, agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent


@router.get("/", response_model=List[AgentResponse])
def get_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return agent_service.get_agents(db, skip, limit)


@router.get("/owner/{owner_type}/{owner_id}", response_model=List[AgentResponse])
def get_agents_by_owner(owner_type: str, owner_id: str, db: Session = Depends(get_db)):
    return agent_service.get_agents_by_owner(db, owner_type, owner_id)


@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: str, agent_data: AgentUpdate, db: Session = Depends(get_db)):
    agent = agent_service.update_agent(db, agent_id, agent_data)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    if not agent_service.delete_agent(db, agent_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
