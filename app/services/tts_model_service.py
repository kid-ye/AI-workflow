from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.tts_model_repo import tts_model_repo
from app.schemas.tts_model import TTSModelCreate, TTSModelUpdate
from app.models.tts_model import TTSModel


class TTSModelService:
    def create_model(self, db: Session, data: TTSModelCreate) -> TTSModel:
        return tts_model_repo.create(db, data)

    def get_model(self, db: Session, model_id: str) -> Optional[TTSModel]:
        return tts_model_repo.get_by_id(db, model_id)

    def get_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[TTSModel]:
        return tts_model_repo.get_all(db, skip, limit)

    def get_models_by_provider(self, db: Session, provider: str) -> List[TTSModel]:
        return tts_model_repo.get_by_provider(db, provider)

    def update_model(self, db: Session, model_id: str, data: TTSModelUpdate) -> Optional[TTSModel]:
        return tts_model_repo.update(db, model_id, data)

    def delete_model(self, db: Session, model_id: str) -> bool:
        return tts_model_repo.delete(db, model_id)


tts_model_service = TTSModelService()
