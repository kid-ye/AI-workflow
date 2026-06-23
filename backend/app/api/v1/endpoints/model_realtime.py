from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.model_realtime import ModelRealtimeCreate, ModelRealtimeUpdate, ModelRealtimeResponse
from app.services.model_realtime_service import model_realtime_service

router = APIRouter(prefix="/models", tags=["models"])


@router.post("/", response_model=ModelRealtimeResponse, status_code=status.HTTP_201_CREATED)
def create_model(model_data: ModelRealtimeCreate, db: Session = Depends(get_db)):
    return model_realtime_service.create_model(db, model_data)


@router.get("/{model_id}", response_model=ModelRealtimeResponse)
def get_model(model_id: str, db: Session = Depends(get_db)):
    model = model_realtime_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
    return model


@router.get("/", response_model=List[ModelRealtimeResponse])
def get_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return model_realtime_service.get_models(db, skip, limit)


@router.get("/name/{model_name}", response_model=ModelRealtimeResponse)
def get_model_by_name(model_name: str, db: Session = Depends(get_db)):
    model = model_realtime_service.get_model_by_name(db, model_name)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
    return model


@router.put("/{model_id}", response_model=ModelRealtimeResponse)
def update_model(model_id: str, model_data: ModelRealtimeUpdate, db: Session = Depends(get_db)):
    model = model_realtime_service.update_model(db, model_id, model_data)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_model(model_id: str, db: Session = Depends(get_db)):
    if not model_realtime_service.delete_model(db, model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
