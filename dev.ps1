Write-Host "Starting Sapient Slingshot Development Server..." -ForegroundColor Green
Write-Host ""

# Set environment variables for PowerShell
$env:NODE_ENV = "development"
$env:PORT = "5000"
$env:HOST = "localhost"

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "WARNING: .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file with your configuration" -ForegroundColor Cyan
    Write-Host ""
}

# Start the server using tsx
Write-Host "[SERVER] Starting backend server on port 5000..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

try {
    npx tsx server/index.ts
} catch {
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"