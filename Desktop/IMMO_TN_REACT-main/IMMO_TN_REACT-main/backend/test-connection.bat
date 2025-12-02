@echo off
echo Testing IMMO_TN Backend Connection...
echo.

echo Testing Database Connection...
node -e "const pool = require('./src/config/database'); pool.query('SELECT NOW()').then(() => { console.log('✅ Database connection successful'); process.exit(0); }).catch(err => { console.error('❌ Database error:', err.message); process.exit(1); });"

if errorlevel 1 (
    echo.
    echo ERROR: Database connection failed!
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Database 'immo_tn' exists
    echo 3. Credentials in .env are correct
    pause
    exit /b 1
)

echo.
echo Testing API Health...
timeout /t 2 /nobreak >nul
curl http://localhost:3000/api/health 2>nul
if errorlevel 1 (
    echo Server is not running. Please start it first with 'npm start'
    pause
    exit /b 1
)

echo.
echo ✅ All tests passed!
pause
