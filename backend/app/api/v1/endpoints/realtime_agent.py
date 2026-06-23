from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.realtime_agent import RealtimeAgentCreate, RealtimeAgentUpdate, RealtimeAgentResponse
from app.services.realtime_agent_service import realtime_agent_service

router = APIRouter(prefix="/realtime-agents", tags=["realtime-agents"])


@router.post("/", response_model=RealtimeAgentResponse, status_code=status.HTTP_201_CREATED)
def create_realtime_agent(realtime_agent_data: RealtimeAgentCreate, db: Session = Depends(get_db)):
    return realtime_agent_service.create_realtime_agent(db, realtime_agent_data)


@router.get("/{realtime_agent_id}", response_model=RealtimeAgentResponse)
def get_realtime_agent(realtime_agent_id: str, db: Session = Depends(get_db)):
    realtime_agent = realtime_agent_service.get_realtime_agent(db, realtime_agent_id)
    if not realtime_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Realtime agent not found")
    return realtime_agent


@router.get("/", response_model=List[RealtimeAgentResponse])
def get_realtime_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return realtime_agent_service.get_realtime_agents(db, skip, limit)


@router.get("/agent/{agent_id}", response_model=RealtimeAgentResponse)
def get_realtime_agent_by_agent_id(agent_id: str, db: Session = Depends(get_db)):
    realtime_agent = realtime_agent_service.get_realtime_agent_by_agent_id(db, agent_id)
    if not realtime_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Realtime agent not found for this agent")
    return realtime_agent


@router.put("/{realtime_agent_id}", response_model=RealtimeAgentResponse)
def update_realtime_agent(realtime_agent_id: str, realtime_agent_data: RealtimeAgentUpdate, db: Session = Depends(get_db)):
    realtime_agent = realtime_agent_service.update_realtime_agent(db, realtime_agent_id, realtime_agent_data)
    if not realtime_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Realtime agent not found")
    return realtime_agent


@router.delete("/{realtime_agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_realtime_agent(realtime_agent_id: str, db: Session = Depends(get_db)):
    if not realtime_agent_service.delete_realtime_agent(db, realtime_agent_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Realtime agent not found")
