from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.model_realtime import ModelRealtime
from app.schemas.model_realtime import ModelRealtimeCreate, ModelRealtimeUpdate
import uuid


class ModelRealtimeRepository:
    def create(self, db: Session, model_data: ModelRealtimeCreate) -> ModelRealtime:
        model = ModelRealtime(
            id=str(uuid.uuid4()),
            **model_data.model_dump()
        )
        db.add(model)
        db.commit()
        db.refresh(model)
        return model

    def get_by_id(self, db: Session, model_id: str) -> Optional[ModelRealtime]:
        return db.query(ModelRealtime).filter(ModelRealtime.id == model_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[ModelRealtime]:
        return db.query(ModelRealtime).offset(skip).limit(limit).all()

    def get_by_name(self, db: Session, model_name: str) -> Optional[ModelRealtime]:
        return db.query(ModelRealtime).filter(ModelRealtime.model_name == model_name).first()

    def update(self, db: Session, model_id: str, model_data: ModelRealtimeUpdate) -> Optional[ModelRealtime]:
        model = self.get_by_id(db, model_id)
        if not model:
            return None
        
        update_data = model_data.model_dump(exclude_unset=True)
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


model_realtime_repo = ModelRealtimeRepository()
