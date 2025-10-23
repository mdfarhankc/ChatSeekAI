from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "llama2"

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173", "http://localhost:3000"]

    # Application
    PROJECT_NAME: str = "ChatSeekAI"
    PROJECT_VERSION: str = "1.0"
    PROJECT_DESCRIPTION: str = "AI Chat Application with Ollama Integration"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False


settings = Settings()
