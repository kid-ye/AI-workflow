from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.llm_model import LLMModelCreate, LLMModelUpdate, LLMModelResponse
from app.services.llm_model_service import llm_model_service

router = APIRouter(prefix="/llm-models", tags=["llm-models"])


@router.post("/", response_model=LLMModelResponse, status_code=status.HTTP_201_CREATED)
def create_llm_model(data: LLMModelCreate, db: Session = Depends(get_db)):
    return llm_model_service.create_model(db, data)


@router.get("/{model_id}", response_model=LLMModelResponse)
def get_llm_model(model_id: str, db: Session = Depends(get_db)):
    model = llm_model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LLM model not found")
    return model


@router.get("/", response_model=List[LLMModelResponse])
def get_llm_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return llm_model_service.get_models(db, skip, limit)


@router.get("/provider/{provider}", response_model=List[LLMModelResponse])
def get_llm_models_by_provider(provider: str, db: Session = Depends(get_db)):
    return llm_model_service.get_models_by_provider(db, provider)


@router.put("/{model_id}", response_model=LLMModelResponse)
def update_llm_model(model_id: str, data: LLMModelUpdate, db: Session = Depends(get_db)):
    model = llm_model_service.update_model(db, model_id, data)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LLM model not found")
    return model


@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_llm_model(model_id: str, db: Session = Depends(get_db)):
    if not llm_model_service.delete_model(db, model_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="LLM model not found")
