from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    DATABASE_URL: str

    class Config:
        extra = "ignore"
        env_file = ".env"

settings = Settings()
