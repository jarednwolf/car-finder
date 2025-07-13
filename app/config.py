"""Application configuration."""
import os
from typing import Optional
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    # API Configuration
    app_name: str = "Car Finder"
    app_env: str = "development"
    log_level: str = "INFO"
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_temperature: float = 0.7
    
    # Database
    database_url: str
    
    # Redis
    redis_url: str
    
    # API Keys
    marketcheck_api_key: Optional[str] = None
    autodev_api_key: Optional[str] = None
    vinanalytics_key: Optional[str] = None
    
    # Supabase
    supabase_url: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    
    # AWS
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    ses_region: str = "us-east-1"
    
    # Twilio
    twilio_sid: Optional[str] = None
    twilio_token: Optional[str] = None
    
    # Security
    secret_key: str = "your-secret-key-here"  # Change in production
    
    # CORS
    backend_cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings() 