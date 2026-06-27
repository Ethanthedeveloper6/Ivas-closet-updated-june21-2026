#!/bin/bash
# IVAS Closet - Start Development Servers
# Usage: ./start-dev.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "🛍️  IVAS Closet - Starting Development Servers..."
echo ""

# Kill any existing processes on our ports
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start backend
echo "🚀 Starting backend (Express + SQLite) on port 5001..."
cd "$(dirname "$0")/server"
node server.js &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 2

# Start frontend
echo "⚛️  Starting frontend (React + Vite) on port 5173..."
cd "$(dirname "$0")/client"
npx vite &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"
echo "   Admin:    admin@ivascloset.com / admin123"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Wait for either to exit
wait
