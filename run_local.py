#!/usr/bin/env python3
"""Simple local runner for Car Finder without Docker."""
import os
os.environ['DATABASE_URL'] = 'sqlite+aiosqlite:///./carfinder.db'
os.environ['REDIS_URL'] = 'redis://localhost:6379/0'

# Load .env file
from pathlib import Path
env_path = Path('.env')
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                if key not in os.environ:  # Don't override what we set above
                    os.environ[key] = value

print("🚗 Car Finder - Local Mode")
print("=" * 40)
print("✅ Using SQLite database")
print("✅ OpenAI API configured")
print("\n🚀 Starting at http://localhost:8000")
print("   Docs at http://localhost:8000/docs")
print("\nPress Ctrl+C to stop\n")

# Now import and run
import uvicorn
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 