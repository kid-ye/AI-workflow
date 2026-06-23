from sqlalchemy.orm import Session
from typing import List, Optional
from app.repositories.voice_repo import voice_repo
from app.schemas.voice import VoiceCreate, VoiceUpdate
from app.models.voice import Voice


class VoiceService:
    def create_voice(self, db: Session, voice_data: VoiceCreate) -> Voice:
        return voice_repo.create(db, voice_data)

    def get_voice(self, db: Session, voice_id: int) -> Optional[Voice]:
        return voice_repo.get_by_id(db, voice_id)

    def get_voices(self, db: Session, skip: int = 0, limit: int = 100) -> List[Voice]:
        return voice_repo.get_all(db, skip, limit)

    def get_voices_by_provider(self, db: Session, provider: str) -> List[Voice]:
        return voice_repo.get_by_provider(db, provider)

    def update_voice(self, db: Session, voice_id: int, voice_data: VoiceUpdate) -> Optional[Voice]:
        return voice_repo.update(db, voice_id, voice_data)

    def delete_voice(self, db: Session, voice_id: int) -> bool:
        return voice_repo.delete(db, voice_id)


voice_service = VoiceService()
