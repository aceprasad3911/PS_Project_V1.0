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

:: Push database schema
echo [SETUP] Pushing database schema...
call npm run db:push

echo.
echo [SETUP] Setup complete!
echo.
echo To start the development server:
echo   For Windows: dev.bat
echo   For Cross-platform: npm run dev
echo.
pause