import uuid
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.custom_agent import CustomAgent
from app.schemas.custom_agent import CustomAgentCreate, CustomAgentUpdate


class CustomAgentRepository:
    def create(self, db: Session, data: CustomAgentCreate) -> CustomAgent:
        agent = CustomAgent(custom_agent_id=str(uuid.uuid4()), **data.model_dump())
        db.add(agent)
        db.commit()
        db.refresh(agent)
        return agent

    def get_by_id(self, db: Session, agent_id: str) -> Optional[CustomAgent]:
        return db.query(CustomAgent).filter(CustomAgent.custom_agent_id == agent_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[CustomAgent]:
        return db.query(CustomAgent).offset(skip).limit(limit).all()

    def get_by_agent_id(self, db: Session, agent_id: str) -> Optional[CustomAgent]:
        return db.query(CustomAgent).filter(CustomAgent.agent_id == agent_id).first()

    def update(self, db: Session, agent_id: str, data: CustomAgentUpdate) -> Optional[CustomAgent]:
        agent = self.get_by_id(db, agent_id)
        if not agent:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
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


custom_agent_repo = CustomAgentRepository()
