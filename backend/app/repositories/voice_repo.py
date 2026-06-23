from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.voice import Voice
from app.schemas.voice import VoiceCreate, VoiceUpdate


class VoiceRepository:
    def create(self, db: Session, voice_data: VoiceCreate) -> Voice:
        voice = Voice(**voice_data.model_dump())
        db.add(voice)
        db.commit()
        db.refresh(voice)
        return voice

    def get_by_id(self, db: Session, voice_id: int) -> Optional[Voice]:
        return db.query(Voice).filter(Voice.id == voice_id).first()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[Voice]:
        return db.query(Voice).offset(skip).limit(limit).all()

    def get_by_provider(self, db: Session, provider: str) -> List[Voice]:
        return db.query(Voice).filter(Voice.provider == provider).all()

    def update(self, db: Session, voice_id: int, voice_data: VoiceUpdate) -> Optional[Voice]:
        voice = self.get_by_id(db, voice_id)
        if not voice:
            return None
        
        update_data = voice_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(voice, field, value)
        
        db.commit()
        db.refresh(voice)
        return voice

    def delete(self, db: Session, voice_id: int) -> bool:
        voice = self.get_by_id(db, voice_id)
        if not voice:
            return False
        
        db.delete(voice)
        db.commit()
        return True


voice_repo = VoiceRepository()
