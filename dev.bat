@echo off
echo Starting Sapient Slingshot Development Server...
echo.

:: Set environment variables for Windows
set NODE_ENV=development
set PORT=5000

:: Start the server using tsx
echo [SERVER] Starting backend server...
npx tsx server/index.ts

pause