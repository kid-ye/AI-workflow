from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Import all models to register them with SQLAlchemy
from app.models import Agent, Voice, ModelRealtime, RealtimeAgent, STTModel, LLMModel, TTSModel, CustomAgent
from app.models.user import User
from app.models.auth_provider import AuthProvider
from app.models.refresh_token import RefreshToken

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Welcome to RevDau Backend API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
