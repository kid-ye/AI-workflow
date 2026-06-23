from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.realtime_agent import RealtimeAgent
from app.schemas.realtime_agent import RealtimeAgentCreate, RealtimeAgentUpdate
import uuid


class RealtimeAgentRepository:
    def create(self, db: Session, realtime_agent_data: RealtimeAgentCreate) -> RealtimeAgent:
        realtime_agent = RealtimeAgent(
            id=str(uuid.uuid4()),
            **realtime_agent_data.model_dump()
        )
        db.add(realtime_agent)
        db.commit()
        db.refresh(realtime_agent)
        return realtime_agent

    def get_by_id(self, db: Session, realtime_agent_id: str) -> Optional[RealtimeAgent]:
        return db.query(RealtimeAgent).filter(RealtimeAgent.id == realtime_agent_id).first()

    def get_by_agent_id(self, db: Session, agent_id: str) -> Optional[RealtimeAgent]:
        return db.query(RealtimeAgent).filter(RealtimeAgent.agent_id == agent_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[RealtimeAgent]:
        return db.query(RealtimeAgent).offset(skip).limit(limit).all()

    def update(self, db: Session, realtime_agent_id: str, realtime_agent_data: RealtimeAgentUpdate) -> Optional[RealtimeAgent]:
        realtime_agent = self.get_by_id(db, realtime_agent_id)
        if not realtime_agent:
            return None
        
        update_data = realtime_agent_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(realtime_agent, field, value)
        
        db.commit()
        db.refresh(realtime_agent)
        return realtime_agent

    def delete(self, db: Session, realtime_agent_id: str) -> bool:
        realtime_agent = self.get_by_id(db, realtime_agent_id)
        if not realtime_agent:
            return False
        
        db.delete(realtime_agent)
        db.commit()
        return True


realtime_agent_repo = RealtimeAgentRepository()
