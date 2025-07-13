#!/usr/bin/env python3
"""Run a minimal version of the app for testing without Docker."""
import os
import sys
import asyncio
import subprocess
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))


def check_requirements():
    """Check if required packages are installed."""
    required = ['fastapi', 'uvicorn', 'openai', 'httpx', 'sqlalchemy']
    missing = []
    
    for package in required:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("\nInstall them with:")
        print(f"pip install {' '.join(missing)}")
        return False
    
    return True


def setup_minimal_db():
    """Set up SQLite database using synchronous connection."""
    # Use regular SQLite URL for initial setup
    os.environ['DATABASE_URL'] = 'sqlite:///./carfinder.db'
    
    from sqlalchemy import create_engine
    from app.database import Base
    from app.models import schemas  # Import to register models
    
    # Create tables using sync engine
    engine = create_engine('sqlite:///./carfinder.db')
    Base.metadata.create_all(bind=engine)
    
    # Now switch to async URL for the app
    os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:///./carfinder.db'
    
    print("✅ Created local SQLite database")


async def main():
    """Run minimal version of the app."""
    print("🚗 Car Finder - Minimal Mode (No Docker)")
    print("=" * 50)
    
    # Check OpenAI key
    if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY') == 'your_openai_api_key_here':
        print("❌ OpenAI API key not configured!")
        print("   Please set OPENAI_API_KEY in your .env file")
        return
    
    print("✅ OpenAI API key configured")
    
    # Check requirements
    if not check_requirements():
        return
    
    # Set minimal environment
    os.environ['REDIS_URL'] = 'redis://localhost:6379/0'  # Won't be used
    os.environ['APP_ENV'] = 'development'
    
    # Setup database
    setup_minimal_db()
    
    print("\n⚠️  Running in minimal mode:")
    print("   - Chat functionality only")
    print("   - No background tasks")
    print("   - No real car listings")
    print("   - Using SQLite instead of PostgreSQL")
    
    print("\n🚀 Starting API server...")
    print("   API: http://localhost:8000")
    print("   Docs: http://localhost:8000/docs")
    print("\n   Press Ctrl+C to stop")
    
    # Run the API server
    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload"
    ])


if __name__ == "__main__":
    # Load environment
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        # Manual .env loading
        env_path = Path(__file__).parent.parent / '.env'
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if '=' in line:
                            key, value = line.split('=', 1)
                            os.environ[key] = value
    
    asyncio.run(main()) 