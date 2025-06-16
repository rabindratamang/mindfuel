from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    RAPIDAPI_KEY: str
    JWT_SECRET: str = "supersecret"
    JWT_ALGORITHM: str = "HS256"
    CLIENT_ID: str
    CLIENT_SECRET: str
    SENDGRID_API_KEY: str
    MONGODB_URL: str
    DATABASE_NAME: str

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()