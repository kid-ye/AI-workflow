from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate
import uuid


class AgentRepository:
    def create(self, db: Session, agent_data: AgentCreate) -> Agent:
        agent = Agent(
            id=str(uuid.uuid4()),
            **agent_data.model_dump()
        )
        db.add(agent)
        db.commit()
        db.refresh(agent)
        return agent

    def get_by_id(self, db: Session, agent_id: str) -> Optional[Agent]:
        return db.query(Agent).filter(Agent.id == agent_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Agent]:
        return db.query(Agent).offset(skip).limit(limit).all()

    def get_by_owner(self, db: Session, owner_type: str, owner_id: str) -> List[Agent]:
        return db.query(Agent).filter(
            Agent.owner_type == owner_type,
            Agent.owner_id == owner_id
        ).all()

    def update(self, db: Session, agent_id: str, agent_data: AgentUpdate) -> Optional[Agent]:
        agent = self.get_by_id(db, agent_id)
        if not agent:
            return None
        
        update_data = agent_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(agent, field, value)
        
        db.commit()
        db.refresh(agent)
        return agent

    def delete(self, db: Session, agent_id: str) -> bool:
        agent = self.get_by_id(db, agent_id)
        if not agent:
            return False
        
        db.delete(agent)
        db.commit()
        return True


agent_repo = AgentRepository()
