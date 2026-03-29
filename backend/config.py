from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str | None = None
    EMBEDDING_DIM: int = 768  # 👈 AJOUT ICI

    class Config:
        env_file = ".env"


settings = Settings()
