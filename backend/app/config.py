from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    secret_key : str
    access_token_expire_minutes : int = 60
    

settings = Settings()