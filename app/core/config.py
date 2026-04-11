from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/revdau"
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "RevDau Backend"
    SECRET_KEY: str = "change-me"
    GOOGLE_CLIENT_ID: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"


settings = Settings()
