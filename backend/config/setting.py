from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    RAPID_API_KEY: str
    JWT_SECRET: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"
    SPOTIFY_CLIENT_ID: str
    SPOTIFY_CLIENT_SECRET: str
    SENDGRID_API_KEY: str
    MONGODB_URL: str
    DATABASE_NAME: str
    MONGODB_DB_NAME: str
    YOUTUBE_API_KEY: str
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()