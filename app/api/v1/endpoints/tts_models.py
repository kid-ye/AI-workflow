from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.tts_model import TTSModelCreate, TTSModelUpdate, TTSModelResponse
from app.services.tts_model_service import tts_model_service

router = APIRouter(prefix="/tts-models", tags=["tts-models"])


@router.post("/", response_model=TTSModelResponse, status_code=status.HTTP_201_CREATED)
def create_tts_model(data: TTSModelCreate, db: Session = Depends(get_db)):
    return tts_model_service.create_model(db, data)


@router.get("/{model_id}", response_model=TTSModelResponse)
def get_tts_model(model_id: str, db: Session = Depends(get_db)):
    model = tts_model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TTS model not found")
    return model


@router.get("/", response_model=List[TTSModelResponse])
def get_tts_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return tts_model_service.get_models(db, skip, limit)


@router.get("/provider/{provider}", response_model=List[TTSModelResponse])
def get_tts_models_by_provider(provider: str, db: Session = Depends(get_db)):
    return tts_model_service.get_models_by_provider(db, provider)


@router.put("/{model_id}", response_model=TTSModelResponse)
def update_tts_model(model_id: str, data: TTSModelUpdate, db: Session = Depends(get_db)):
    model = tts_model_service.update_model(db, model_id, data)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TTS model not found")
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tts_model(model_id: str, db: Session = Depends(get_db)):
    if not tts_model_service.delete_model(db, model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TTS model not found")
