from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.voice import VoiceCreate, VoiceUpdate, VoiceResponse
from app.services.voice_service import voice_service

router = APIRouter(prefix="/voices", tags=["voices"])


@router.post("/", response_model=VoiceResponse, status_code=status.HTTP_201_CREATED)
def create_voice(voice_data: VoiceCreate, db: Session = Depends(get_db)):
    return voice_service.create_voice(db, voice_data)


@router.get("/{voice_id}", response_model=VoiceResponse)
def get_voice(voice_id: int, db: Session = Depends(get_db)):
    voice = voice_service.get_voice(db, voice_id)
    if not voice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice not found")
    return voice


@router.get("/", response_model=List[VoiceResponse])
def get_voices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return voice_service.get_voices(db, skip, limit)


@router.get("/provider/{provider}", response_model=List[VoiceResponse])
def get_voices_by_provider(provider: str, db: Session = Depends(get_db)):
    return voice_service.get_voices_by_provider(db, provider)


@router.put("/{voice_id}", response_model=VoiceResponse)
def update_voice(voice_id: int, voice_data: VoiceUpdate, db: Session = Depends(get_db)):
    voice = voice_service.update_voice(db, voice_id, voice_data)
    if not voice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice not found")
    return voice


@router.delete("/{voice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_voice(voice_id: int, db: Session = Depends(get_db)):
    if not voice_service.delete_voice(db, voice_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice not found")
