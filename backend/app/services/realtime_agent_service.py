from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.realtime_agent_repo import realtime_agent_repo
from app.schemas.realtime_agent import RealtimeAgentCreate, RealtimeAgentUpdate
from app.models.realtime_agent import RealtimeAgent


class RealtimeAgentService:
    def create_realtime_agent(self, db: Session, realtime_agent_data: RealtimeAgentCreate) -> RealtimeAgent:
        return realtime_agent_repo.create(db, realtime_agent_data)

    def get_realtime_agent(self, db: Session, realtime_agent_id: str) -> Optional[RealtimeAgent]:
        return realtime_agent_repo.get_by_id(db, realtime_agent_id)

    def get_realtime_agent_by_agent_id(self, db: Session, agent_id: str) -> Optional[RealtimeAgent]:
        return realtime_agent_repo.get_by_agent_id(db, agent_id)

    def get_realtime_agents(self, db: Session, skip: int = 0, limit: int = 100) -> List[RealtimeAgent]:
        return realtime_agent_repo.get_all(db, skip, limit)

    def update_realtime_agent(self, db: Session, realtime_agent_id: str, realtime_agent_data: RealtimeAgentUpdate) -> Optional[RealtimeAgent]:
        return realtime_agent_repo.update(db, realtime_agent_id, realtime_agent_data)

    def delete_realtime_agent(self, db: Session, realtime_agent_id: str) -> bool:
        return realtime_agent_repo.delete(db, realtime_agent_id)


realtime_agent_service = RealtimeAgentService()
