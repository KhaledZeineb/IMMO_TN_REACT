@echo off
echo Starting IMMO_TN Backend Server...
echo.

cd /d "%~dp0"

echo Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if errorlevel 1 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo.
echo Starting server on port 3000...
echo.
npm start

pause
