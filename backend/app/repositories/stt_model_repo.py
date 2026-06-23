from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.stt_model import STTModel
from app.schemas.stt_model import STTModelCreate, STTModelUpdate


class STTModelRepository:
    def create(self, db: Session, data: STTModelCreate) -> STTModel:
        model = STTModel(**data.model_dump())
        db.add(model)
        db.commit()
        db.refresh(model)
        return model

    def get_by_id(self, db: Session, model_id: str) -> Optional[STTModel]:
        return db.query(STTModel).filter(STTModel.id == model_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[STTModel]:
        return db.query(STTModel).offset(skip).limit(limit).all()

    def get_by_provider(self, db: Session, provider: str) -> List[STTModel]:
        return db.query(STTModel).filter(STTModel.provider == provider).all()

    def update(self, db: Session, model_id: str, data: STTModelUpdate) -> Optional[STTModel]:
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


stt_model_repo = STTModelRepository()
