@echo off
setlocal
title Paytm Purchase Care Hub Launcher
cd /d "%~dp0"

echo =================================================================
echo   Starting Paytm Purchase Care Hub Full-Stack System
echo =================================================================
echo.

:: Detect Python executable
set PYTHON_EXE=python
if exist "venv\Scripts\python.exe" (
    set "PYTHON_EXE=venv\Scripts\python.exe"
) else if exist "backend\venv\Scripts\python.exe" (
    set "PYTHON_EXE=backend\venv\Scripts\python.exe"
)

echo [1/2] Launching FastAPI Backend on 0.0.0.0:8000 ...
start "Paytm Care Backend (FastAPI)" cmd /k "cd /d "%~dp0" && "%PYTHON_EXE%" -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo [2/2] Launching React + Vite Frontend on 0.0.0.0:5173 ...
start "Paytm Care Frontend (Vite)" cmd /k "cd /d "%~dp0\frontend" && npm run dev -- --host"

echo.
echo =================================================================
echo   Paytm Purchase Care Hub is Running!
echo.
echo   [PC Browser Access]:
echo     Frontend: http://localhost:5173
echo     API Docs: http://127.0.0.1:8000/docs
echo.
echo   [Mobile Phone Access over Wi-Fi]:
echo     Open on Mobile: http://172.31.98.52:5173
echo.
echo   [Mobile Phone Access via Developer Options (USB Cable)]:
echo     1. Enable USB Debugging in Developer Options on your phone.
echo     2. Run in a terminal:
echo        adb reverse tcp:5173 tcp:5173
echo        adb reverse tcp:8000 tcp:8000
echo     3. Open http://localhost:5173 in Chrome on your phone!
echo =================================================================
pause
