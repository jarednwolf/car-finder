#!/usr/bin/env python3
"""Check which API services are properly configured."""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Try to load .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # If python-dotenv is not installed, try to load .env manually
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key] = value


def check_service(name: str, env_var: str, required: bool = False) -> bool:
    """Check if a service is configured."""
    value = os.getenv(env_var, "")
    is_configured = bool(value and value != f"your_{env_var.lower()}_here")
    
    status = "✅" if is_configured else ("❌" if required else "⚠️ ")
    print(f"{status} {name:.<40} {'CONFIGURED' if is_configured else 'NOT CONFIGURED'}")
    
    return is_configured


def main():
    """Check all service configurations."""
    print("=" * 60)
    print("Car Finder Configuration Check")
    print("=" * 60)
    print()
    
    # Required services
    print("REQUIRED SERVICES:")
    openai_ok = check_service("OpenAI (Chat & Embeddings)", "OPENAI_API_KEY", required=True)
    print()
    
    # Optional services
    print("OPTIONAL SERVICES:")
    marketcheck_ok = check_service("Marketcheck (Car Listings)", "MARKETCHECK_API_KEY")
    autodev_ok = check_service("Auto.dev (Car Listings)", "AUTODEV_API_KEY")
    vinanalytics_ok = check_service("VINAnalytics (VIN Decode)", "VINANALYTICS_KEY")
    print()
    
    print("NOTIFICATION SERVICES:")
    aws_ok = check_service("AWS SES (Email)", "AWS_ACCESS_KEY_ID")
    twilio_ok = check_service("Twilio (SMS)", "TWILIO_SID")
    print()
    
    print("DATABASE SERVICES:")
    supabase_ok = check_service("Supabase (Managed DB)", "SUPABASE_URL")
    print()
    
    # Summary
    print("=" * 60)
    if not openai_ok:
        print("❌ CRITICAL: OpenAI API key is required for the app to function!")
        print("   Please add your OpenAI API key to the .env file.")
        print("   Get one at: https://platform.openai.com/api-keys")
    else:
        print("✅ Core functionality is configured!")
        
        if not (marketcheck_ok or autodev_ok):
            print("⚠️  No car listing APIs configured - will use mock data only")
        
        if not (aws_ok or twilio_ok):
            print("⚠️  No notification services configured - alerts won't be sent")
    
    print("=" * 60)
    print()
    
    # Show current environment
    app_env = os.getenv("APP_ENV", "development")
    print(f"Environment: {app_env}")
    
    # Database URL
    db_url = os.getenv("DATABASE_URL", "")
    if "localhost" in db_url or "db:" in db_url:
        print("Database: Local PostgreSQL (Docker)")
    elif "supabase" in db_url:
        print("Database: Supabase")
    else:
        print("Database: Custom")
    
    print()
    print("Run 'docker compose up' to start the application.")
    print("See API_KEYS.md for instructions on obtaining API keys.")


if __name__ == "__main__":
    main() 