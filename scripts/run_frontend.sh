#!/bin/bash
# Run the frontend development server

echo "🎨 Starting Car Finder Frontend"
echo "=============================="
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting development server..."
echo "   Frontend: http://localhost:5173"
echo ""
echo "⚠️  Make sure the API is running on http://localhost:8000"
echo "   Press Ctrl+C to stop"
echo ""

# Start the development server
npm run dev 