from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.model_realtime_repo import model_realtime_repo
from app.schemas.model_realtime import ModelRealtimeCreate, ModelRealtimeUpdate
from app.models.model_realtime import ModelRealtime


class ModelRealtimeService:
    def create_model(self, db: Session, model_data: ModelRealtimeCreate) -> ModelRealtime:
        return model_realtime_repo.create(db, model_data)

    def get_model(self, db: Session, model_id: str) -> Optional[ModelRealtime]:
        return model_realtime_repo.get_by_id(db, model_id)

    def get_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelRealtime]:
        return model_realtime_repo.get_all(db, skip, limit)

    def get_model_by_name(self, db: Session, model_name: str) -> Optional[ModelRealtime]:
        return model_realtime_repo.get_by_name(db, model_name)

    def update_model(self, db: Session, model_id: str, model_data: ModelRealtimeUpdate) -> Optional[ModelRealtime]:
        return model_realtime_repo.update(db, model_id, model_data)

    def delete_model(self, db: Session, model_id: str) -> bool:
        return model_realtime_repo.delete(db, model_id)


model_realtime_service = ModelRealtimeService()
