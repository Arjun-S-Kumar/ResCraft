@echo off
REM ResCraft Backend Setup Script for Windows

echo.
echo ====================================
echo ResCraft Backend Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found: 
python --version
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"
echo Current directory: %cd%
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo.
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the ResCraft backend:
echo.
echo 1. Make sure you're in the backend directory
echo 2. Run: python app.py
echo.
echo The backend will start on http://localhost:5000
echo.
pause
