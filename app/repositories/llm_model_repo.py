from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.llm_model import LLMModel
from app.schemas.llm_model import LLMModelCreate, LLMModelUpdate


class LLMModelRepository:
    def create(self, db: Session, data: LLMModelCreate) -> LLMModel:
        model = LLMModel(**data.model_dump())
        db.add(model)
        db.commit()
        db.refresh(model)
        return model

    def get_by_id(self, db: Session, model_id: str) -> Optional[LLMModel]:
        return db.query(LLMModel).filter(LLMModel.id == model_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[LLMModel]:
        return db.query(LLMModel).offset(skip).limit(limit).all()

    def get_by_provider(self, db: Session, provider: str) -> List[LLMModel]:
        return db.query(LLMModel).filter(LLMModel.provider == provider).all()

    def update(self, db: Session, model_id: str, data: LLMModelUpdate) -> Optional[LLMModel]:
        model = self.get_by_id(db, model_id)
        if not model:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(model, field, value)
        
        db.commit()
        db.refresh(model)
        return model

    def delete(self, db: Session, model_id: str) -> bool:
        model = self.get_by_id(db, model_id)
        if not model:
            return False
        
        db.delete(model)
        db.commit()
        return True


llm_model_repo = LLMModelRepository()
