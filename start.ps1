# Start Both Frontend and Backend
# This script runs both services in separate PowerShell windows

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Text Encryption App - Launcher" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Get the current directory
$projectRoot = $PSScriptRoot

# Check if node_modules exist
$backendModules = Test-Path "$projectRoot\backend\node_modules"
$frontendModules = Test-Path "$projectRoot\frontend\node_modules"

if (-not $backendModules -or -not $frontendModules) {
    Write-Host ""
    Write-Host "Dependencies not found. Installing..." -ForegroundColor Yellow
    
    if (-not $backendModules) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location "$projectRoot\backend"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
        Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
    }
    
    if (-not $frontendModules) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location "$projectRoot\frontend"
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
        Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
    }
    
    Set-Location $projectRoot
}

# Check if .env file exists in backend
if (-not (Test-Path "$projectRoot\backend\.env")) {
    Write-Host ""
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item "$projectRoot\backend\.env.example" "$projectRoot\backend\.env"
    
    # Generate encryption key
    $encryptionKey = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    $envContent = Get-Content "$projectRoot\backend\.env" -Raw
    $envContent = $envContent -replace 'your-256-bit-key-here-64-hex-characters-long-example-key-value', $encryptionKey
    Set-Content "$projectRoot\backend\.env" $envContent
    
    Write-Host "✓ Backend .env file created with encryption key" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting application..." -ForegroundColor Yellow
Write-Host ""

# Start Backend in a new PowerShell window
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend in a new PowerShell window
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Blue; npm start"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Application Starting!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new windows have opened:" -ForegroundColor Yellow
Write-Host "  1. Backend Server (Port 5000)" -ForegroundColor White
Write-Host "  2. Frontend Server (Port 3000)" -ForegroundColor White
Write-Host ""
Write-Host "Wait a few seconds for servers to start, then:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop the application:" -ForegroundColor Yellow
Write-Host "  - Close both PowerShell windows" -ForegroundColor White
Write-Host "  - Or press Ctrl+C in each window" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to open the browser automatically..." -ForegroundColor Green
Read-Host

# Open browser
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✓ Browser opened. Enjoy encrypting! 🔐" -ForegroundColor Green
Write-Host ""
