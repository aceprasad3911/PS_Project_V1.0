Write-Host "Quick Start - Sapient Slingshot (Development Mode)" -ForegroundColor Green
Write-Host ""

# Set environment variables
$env:NODE_ENV = "development"
$env:PORT = "3000"
$env:HOST = "localhost"

# Override database URL for local development (using in-memory fallback)
$env:DATABASE_URL = "postgresql://localhost:5432/temp_db"
$env:SESSION_SECRET = "development-secret-key"
$env:REPLIT_DOMAINS = "localhost:5000"

Write-Host "[QUICK START] Starting server with development configuration..." -ForegroundColor Yellow
Write-Host "Database: Using fallback configuration" -ForegroundColor Gray
Write-Host "Port: 5000" -ForegroundColor Gray
Write-Host "Mode: Development" -ForegroundColor Gray
Write-Host ""
Write-Host "Opening browser: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start server
npx tsx server/index.ts