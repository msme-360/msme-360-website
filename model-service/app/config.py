from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    NEXT_PUBLIC_SUPABASE_URL: str = Field(..., env="NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_SECRET_KEY: str = Field(..., env="SUPABASE_SECRET_KEY")
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
