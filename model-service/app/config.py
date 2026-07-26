from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    NEXT_PUBLIC_SUPABASE_URL: str = Field(..., env="NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_SECRET_KEY: str = Field(..., env="SUPABASE_SECRET_KEY")

    # OCR / Tesseract settings
    TESSERACT_CMD: Optional[str] = Field(default=None)
    TESSERACT_LANG: str = Field(default="eng")
    MAX_UPLOAD_SIZE_MB: int = Field(default=10)

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
