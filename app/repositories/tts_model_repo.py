from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.tts_model import TTSModel
from app.schemas.tts_model import TTSModelCreate, TTSModelUpdate


class TTSModelRepository:
    def create(self, db: Session, data: TTSModelCreate) -> TTSModel:
        model = TTSModel(**data.model_dump())
        db.add(model)
        db.commit()
        db.refresh(model)
        return model

    def get_by_id(self, db: Session, model_id: str) -> Optional[TTSModel]:
        return db.query(TTSModel).filter(TTSModel.id == model_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[TTSModel]:
        return db.query(TTSModel).offset(skip).limit(limit).all()

    def get_by_provider(self, db: Session, provider: str) -> List[TTSModel]:
        return db.query(TTSModel).filter(TTSModel.provider == provider).all()

    def update(self, db: Session, model_id: str, data: TTSModelUpdate) -> Optional[TTSModel]:
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


tts_model_repo = TTSModelRepository()
