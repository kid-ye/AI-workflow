from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.stt_model_repo import stt_model_repo
from app.schemas.stt_model import STTModelCreate, STTModelUpdate
from app.models.stt_model import STTModel


class STTModelService:
    def create_model(self, db: Session, data: STTModelCreate) -> STTModel:
        return stt_model_repo.create(db, data)

    def get_model(self, db: Session, model_id: str) -> Optional[STTModel]:
        return stt_model_repo.get_by_id(db, model_id)

    def get_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[STTModel]:
        return stt_model_repo.get_all(db, skip, limit)

    def get_models_by_provider(self, db: Session, provider: str) -> List[STTModel]:
        return stt_model_repo.get_by_provider(db, provider)

    def update_model(self, db: Session, model_id: str, data: STTModelUpdate) -> Optional[STTModel]:
        return stt_model_repo.update(db, model_id, data)

    def delete_model(self, db: Session, model_id: str) -> bool:
        return stt_model_repo.delete(db, model_id)


stt_model_service = STTModelService()
