@echo off
REM EventHub - Full Stack Startup Script
REM This script starts both backend and frontend

echo.
echo ============================================
echo  EventHub - Full Stack Startup
echo ============================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 22 or higher
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven
    pause
    exit /b 1
)

echo [1/4] Starting Backend Server...
echo Building and starting Spring Boot application on port 8081...
cd eventbooking
start "EventHub Backend" cmd /k mvn spring-boot:run
timeout /t 8

echo.
echo [2/4] Backend should now be starting...
echo Waiting for backend to fully initialize...
timeout /t 5

cd ..

echo.
echo [3/4] Starting Frontend Server...
echo Starting React development server on port 5173...
cd event-booking-react
start "EventHub Frontend" cmd /k npm run dev

echo.
echo ============================================
echo  SERVERS STARTING
echo ============================================
echo.
echo Backend:  http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Note: If frontend opens in browser, backend is still initializing
echo Give backend ~30 seconds to fully start, then refresh frontend
echo.
echo H2 Database Console: http://localhost:8081/h2-console
echo.
pause
