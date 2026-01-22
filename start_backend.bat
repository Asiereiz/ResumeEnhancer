@echo off
cd /d "%~dp0"
cd backend
call .venv\Scripts\activate
echo Starting Backend on 0.0.0.0:8000...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
if %errorlevel% neq 0 (
    echo Backend crashed with error code %errorlevel%
    pause
)
pause
