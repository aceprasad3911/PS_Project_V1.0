@echo off
echo Setting up Sapient Slingshot Development Environment...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Install dependencies
echo [SETUP] Installing dependencies...
call npm install

:: Install database dependencies (if using PostgreSQL locally)
echo.
echo [SETUP] Setting up database...
echo Note: Make sure PostgreSQL is running on your system
echo.

:: Create .env file if it doesn't exist
if not exist .env (
    echo [SETUP] Creating .env file...
    copy .env.example .env
    echo.
    echo Please edit .env file with your database credentials
    echo.
)

:: Push database schema (skip if no database configured)
echo [SETUP] Pushing database schema...
echo Note: This may fail if DATABASE_URL is not configured - that's okay for now
call npm run db:push 2>nul || echo Database push skipped - configure DATABASE_URL in .env file

echo.
echo [SETUP] Setup complete!
echo.
echo To start the development server:
echo   For Windows: dev.bat
echo   For Cross-platform: npm run dev
echo.
pause