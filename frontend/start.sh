#!/bin/bash

# Budget Buddy Frontend Startup Script

echo "🚀 Starting Budget Buddy..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo ""
    echo "Please create a .env file with:"
    echo "  PLAID_CLIENT_ID=your_id"
    echo "  PLAID_SECRET=your_secret"
    echo "  PLAID_ENV=sandbox"
    echo "  SUPABASE_URL=your_url"
    echo "  SUPABASE_KEY=your_key"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Dependencies ready"
echo ""
echo "Choose an option:"
echo ""
echo "1) Run backend only     → npm run server"
echo "2) Run frontend only    → npm run dev"
echo "3) Run both together    → npm run dev:all"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
