import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "ThermaLoop"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./thermaloop.db")
    LLM_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")

settings = Settings()
