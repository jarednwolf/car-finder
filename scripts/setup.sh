#!/bin/bash
# Setup script for Car Finder application

echo "🚗 Car Finder Setup Script"
echo "========================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cat > .env << 'EOF'
# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=your_openai_api_key_here

# API Keys for Listing Services (OPTIONAL - but needed for real listings)
MARKETCHECK_API_KEY=your_marketcheck_api_key_here
AUTODEV_API_KEY=your_autodev_api_key_here
VINANALYTICS_KEY=your_vinanalytics_key_here

# Supabase Configuration (OPTIONAL - using local Postgres by default)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration (Docker Compose will use this)
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/carfinder

# Redis Configuration (Docker Compose will use this)
REDIS_URL=redis://localhost:6379/0

# AWS Configuration (OPTIONAL - for email notifications)
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
SES_REGION=us-east-1

# Twilio Configuration (OPTIONAL - for SMS notifications)
TWILIO_SID=your_twilio_sid_here
TWILIO_TOKEN=your_twilio_token_here

# Application Configuration
APP_ENV=development
LOG_LEVEL=INFO
SECRET_KEY=your-secret-key-change-this-in-production
EOF
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your OpenAI API key!"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Make scripts executable
chmod +x scripts/*.py scripts/*.sh 2>/dev/null

# Check Python version
echo ""
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Check Docker
echo ""
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    docker_version=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo "✅ Docker version: $docker_version"
else
    echo "❌ Docker not found. Please install Docker Desktop."
    echo "   https://www.docker.com/products/docker-desktop"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "✅ Docker Compose is available"
else
    echo "❌ Docker Compose not found."
fi

# Run configuration check
echo ""
echo "Checking API configuration..."
python3 scripts/check_config.py

echo ""
echo "Setup complete! Next steps:"
echo "1. Edit .env and add your API keys (especially OPENAI_API_KEY)"
echo "2. Run: docker compose up --build"
echo "3. Open: http://localhost:5173"
echo ""
echo "For more information, see API_KEYS.md" 