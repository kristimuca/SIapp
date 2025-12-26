@echo off
REM Start Both Frontend and Backend
REM This script runs both services in separate command windows

echo ================================
echo Text Encryption App - Launcher
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed
echo.

REM Get the current directory
set PROJECT_ROOT=%~dp0

REM Check if node_modules exist
if not exist "%PROJECT_ROOT%backend\node_modules" (
    echo Installing backend dependencies...
    cd "%PROJECT_ROOT%backend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo Backend dependencies installed
)

if not exist "%PROJECT_ROOT%frontend\node_modules" (
    echo Installing frontend dependencies...
    cd "%PROJECT_ROOT%frontend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo Frontend dependencies installed
)

REM Check if .env file exists in backend
if not exist "%PROJECT_ROOT%backend\.env" (
    echo Creating backend .env file...
    copy "%PROJECT_ROOT%backend\.env.example" "%PROJECT_ROOT%backend\.env"
    echo Backend .env file created
    echo.
    echo IMPORTANT: Please generate an encryption key by running:
    echo node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    echo.
    echo Then update backend\.env with the generated key
    echo.
)

echo.
echo Starting application...
echo.

REM Start Backend in a new command window
echo Starting Backend Server (Port 5000)...
start "Backend Server - Port 5000" cmd /k "cd /d %PROJECT_ROOT%backend && echo Starting Backend Server... && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend in a new command window
echo Starting Frontend Server (Port 3000)...
start "Frontend Server - Port 3000" cmd /k "cd /d %PROJECT_ROOT%frontend && echo Starting Frontend Server... && npm start"

echo.
echo ================================
echo Application Starting!
echo ================================
echo.
echo Two new windows have opened:
echo   1. Backend Server (Port 5000)
echo   2. Frontend Server (Port 3000)
echo.
echo Wait a few seconds for servers to start, then:
echo.
echo Open your browser to: http://localhost:3000
echo.
echo To stop: Close both command windows or press Ctrl+C
echo.

REM Wait and open browser
timeout /t 8 /nobreak
start http://localhost:3000

echo Browser opened. Enjoy encrypting!
echo.
pause
