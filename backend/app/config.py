from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str
    db_name: str = "car_dem"
    upload_dir: str = "uploads"
    secret_key: str
    access_token_minutes: int = 15
    refresh_token_days: int = 7

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def database_url(self):
        return (
            f"postgresql+psycopg2://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()
