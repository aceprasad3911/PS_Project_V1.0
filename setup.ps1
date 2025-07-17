Write-Host "Setting up Sapient Slingshot Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[SETUP] Node.js version: $nodeVersion" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "[SETUP] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "[SETUP] Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "Please edit .env file with your database credentials" -ForegroundColor Cyan
    Write-Host ""
}

# Push database schema (skip if no database configured)
Write-Host "[SETUP] Pushing database schema..." -ForegroundColor Yellow
Write-Host "Note: This may fail if DATABASE_URL is not configured - that's okay for now" -ForegroundColor Gray
npm run db:push 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Database push skipped - configure DATABASE_URL in .env file" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[SETUP] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server:" -ForegroundColor Cyan
Write-Host "  For PowerShell: .\dev.ps1" -ForegroundColor White
Write-Host "  For Command Prompt: .\dev.bat" -ForegroundColor White
Write-Host "  For Cross-platform: npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"