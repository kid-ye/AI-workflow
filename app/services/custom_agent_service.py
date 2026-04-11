from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.custom_agent_repo import custom_agent_repo
from app.schemas.custom_agent import CustomAgentCreate, CustomAgentUpdate
from app.models.custom_agent import CustomAgent


class CustomAgentService:
    def create_agent(self, db: Session, data: CustomAgentCreate) -> CustomAgent:
        return custom_agent_repo.create(db, data)

    def get_agent(self, db: Session, agent_id: str) -> Optional[CustomAgent]:
        return custom_agent_repo.get_by_id(db, agent_id)

    def get_agents(self, db: Session, skip: int = 0, limit: int = 100) -> List[CustomAgent]:
        return custom_agent_repo.get_all(db, skip, limit)

    def get_agents_by_agent_id(self, db: Session, agent_id: str) -> List[CustomAgent]:
        return custom_agent_repo.get_by_agent_id(db, agent_id)

    def update_agent(self, db: Session, agent_id: str, data: CustomAgentUpdate) -> Optional[CustomAgent]:
        return custom_agent_repo.update(db, agent_id, data)

    def delete_agent(self, db: Session, agent_id: str) -> bool:
        return custom_agent_repo.delete(db, agent_id)


custom_agent_service = CustomAgentService()
