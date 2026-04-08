from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.agent_repo import agent_repo
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.models.agent import Agent


class AgentService:
    def create_agent(self, db: Session, agent_data: AgentCreate) -> Agent:
        return agent_repo.create(db, agent_data)

    def get_agent(self, db: Session, agent_id: str) -> Optional[Agent]:
        return agent_repo.get_by_id(db, agent_id)

    def get_agents(self, db: Session, skip: int = 0, limit: int = 100) -> List[Agent]:
        return agent_repo.get_all(db, skip, limit)

    def get_agents_by_owner(self, db: Session, owner_type: str, owner_id: str) -> List[Agent]:
        return agent_repo.get_by_owner(db, owner_type, owner_id)

    def update_agent(self, db: Session, agent_id: str, agent_data: AgentUpdate) -> Optional[Agent]:
        return agent_repo.update(db, agent_id, agent_data)

    def delete_agent(self, db: Session, agent_id: str) -> bool:
        return agent_repo.delete(db, agent_id)


agent_service = AgentService()
