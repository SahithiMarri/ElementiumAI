from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Elementium AI — Lab Backend"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Atlas connection URL
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "elementium_ai"
    
    # Gemini API Key
    GEMINI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
