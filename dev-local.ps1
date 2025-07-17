Write-Host "Starting Sapient Slingshot - Local Development Mode" -ForegroundColor Green
Write-Host ""

# Set environment variables for local development
$env:NODE_ENV = "development"
$env:HOST = "localhost"

# Try different ports if 5000 is busy
$ports = @(5000, 3000, 8000, 3001, 5001)
$serverStarted = $false

foreach ($port in $ports) {
    try {
        Write-Host "Trying port $port..." -ForegroundColor Yellow
        
        # Check if port is available
        $tcpConnection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
        
        if (-not $tcpConnection.TcpTestSucceeded) {
            $env:PORT = $port.ToString()
            
            Write-Host "[SERVER] Starting on localhost:$port" -ForegroundColor Green
            Write-Host "Open in browser: http://localhost:$port" -ForegroundColor Cyan
            Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
            Write-Host ""
            
            npx tsx server/index.ts
            $serverStarted = $true
            break
        } else {
            Write-Host "Port $port is already in use, trying next..." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Port $port failed, trying next..." -ForegroundColor Yellow
    }
}

if (-not $serverStarted) {
    Write-Host "ERROR: Could not start server on any available port" -ForegroundColor Red
    Write-Host "Please check if other applications are using ports 5000, 3000, 8000, 3001, 5001" -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"