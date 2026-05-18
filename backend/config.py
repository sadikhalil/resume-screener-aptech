from pydantic_settings import BaseSettings
from pydantic import Field
import os

class Settings(BaseSettings):
    # Every field needs a type annotation (str, int, bool)
    DATABASE_URL: str          = "sqlite:///./resume_screener.db"
    SECRET_KEY: str            = "your-secret-key-change-this"
    ALGORITHM: str             = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    UPLOAD_DIR: str            = "uploads"
    MAX_FILE_SIZE_MB: int      = 10
    SPACY_MODEL: str           = "en_core_web_sm"
    EMBEDDING_MODEL: str       = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"

settings = Settings()

