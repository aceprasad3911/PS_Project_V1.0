@echo off
echo Starting Sapient Slingshot Development Server...
echo.

:: Set environment variables for Windows development
set NODE_ENV=development
set REPL_ID=development-repl-id
set DATABASE_URL=postgresql://localhost:5432/temp_db
set SESSION_SECRET=dev-secret-key-for-local-development
set REPLIT_DOMAINS=localhost:3000,localhost:5000
set ISSUER_URL=https://replit.com/oidc
set PORT=3000
set HOST=localhost

:: Start the server with development authentication
echo [SERVER] Starting backend server on localhost:3000...
echo [DEV] Using development authentication
echo Press Ctrl+C to stop the server
echo.

npx tsx run-dev.js

pause