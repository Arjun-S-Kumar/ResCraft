@echo off
REM ResCraft Backend Run Script for Windows

cd /d "%~dp0backend"

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run the Flask app
echo.
echo Starting ResCraft Backend...
echo Backend will run on http://localhost:5000
echo Press Ctrl+C to stop
echo.
python app.py
pause
