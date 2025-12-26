# Quick Start Script for Text Encryption App
# Run this script from the project root directory

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Text Encryption App - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Generate encryption key
Write-Host ""
Write-Host "Generating encryption key..." -ForegroundColor Yellow
$encryptionKey = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host "✓ Encryption key generated" -ForegroundColor Green

# Setup backend
Write-Host ""
Write-Host "Setting up backend..." -ForegroundColor Yellow
Set-Location backend

if (Test-Path ".env") {
    Write-Host "! .env file already exists, skipping..." -ForegroundColor Yellow
} else {
    Copy-Item .env.example .env
    $envContent = Get-Content .env -Raw
    $envContent = $envContent -replace 'your-256-bit-key-here-64-hex-characters-long-example-key-value', $encryptionKey
    Set-Content .env $envContent
    Write-Host "✓ Backend .env file created" -ForegroundColor Green
}

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Setup frontend
Write-Host ""
Write-Host "Setting up frontend..." -ForegroundColor Yellow
Set-Location frontend

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Summary
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start the backend (in one terminal):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the frontend (in another terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open your browser to: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Or use Docker:" -ForegroundColor Yellow
Write-Host "   docker-compose up --build" -ForegroundColor Gray
Write-Host ""
Write-Host "Your encryption key: $encryptionKey" -ForegroundColor Cyan
Write-Host "This key has been saved to backend/.env" -ForegroundColor Gray
Write-Host ""
