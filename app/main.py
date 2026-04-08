from fastapi import FastAPI
from app.api.v1.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {"message": "Welcome to RevDau Backend API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
