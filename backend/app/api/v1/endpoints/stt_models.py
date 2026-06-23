from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.stt_model import STTModelCreate, STTModelUpdate, STTModelResponse
from app.services.stt_model_service import stt_model_service

router = APIRouter(prefix="/stt-models", tags=["stt-models"])


@router.post("/", response_model=STTModelResponse, status_code=status.HTTP_201_CREATED)
def create_stt_model(data: STTModelCreate, db: Session = Depends(get_db)):
    return stt_model_service.create_model(db, data)


@router.get("/{model_id}", response_model=STTModelResponse)
def get_stt_model(model_id: str, db: Session = Depends(get_db)):
    model = stt_model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="STT model not found")
    return model


@router.get("/", response_model=List[STTModelResponse])
def get_stt_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return stt_model_service.get_models(db, skip, limit)


@router.get("/provider/{provider}", response_model=List[STTModelResponse])
def get_stt_models_by_provider(provider: str, db: Session = Depends(get_db)):
    return stt_model_service.get_models_by_provider(db, provider)


@router.put("/{model_id}", response_model=STTModelResponse)
def update_stt_model(model_id: str, data: STTModelUpdate, db: Session = Depends(get_db)):
    model = stt_model_service.update_model(db, model_id, data)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="STT model not found")
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stt_model(model_id: str, db: Session = Depends(get_db)):
    if not stt_model_service.delete_model(db, model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="STT model not found")
