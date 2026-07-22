from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./love_letters.db"
    jwt_secret_key: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080  # 7 days
    anthropic_api_key: str = ""
    letter_encryption_key: str = ""
    frontend_origin: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def frontend_origins(self) -> list[str]:
        """Supports a comma-separated FRONTEND_ORIGIN, e.g. for local + prod."""
        return [o.strip() for o in self.frontend_origin.split(",") if o.strip()]


settings = Settings()
