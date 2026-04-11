from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.llm_model_repo import llm_model_repo
from app.schemas.llm_model import LLMModelCreate, LLMModelUpdate
from app.models.llm_model import LLMModel


class LLMModelService:
    def create_model(self, db: Session, data: LLMModelCreate) -> LLMModel:
        return llm_model_repo.create(db, data)

    def get_model(self, db: Session, model_id: str) -> Optional[LLMModel]:
        return llm_model_repo.get_by_id(db, model_id)

    def get_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[LLMModel]:
        return llm_model_repo.get_all(db, skip, limit)

    def get_models_by_provider(self, db: Session, provider: str) -> List[LLMModel]:
        return llm_model_repo.get_by_provider(db, provider)

    def update_model(self, db: Session, model_id: str, data: LLMModelUpdate) -> Optional[LLMModel]:
        return llm_model_repo.update(db, model_id, data)

    def delete_model(self, db: Session, model_id: str) -> bool:
        return llm_model_repo.delete(db, model_id)


llm_model_service = LLMModelService()
