@echo off
title Paytm Purchase Care Hub Launcher
echo ========================================================
echo   Starting Paytm Purchase Care Hub Full-Stack System
echo ========================================================
echo.
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Paytm Care Backend (FastAPI)" cmd /k ".\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo [2/2] Starting React + Vite Frontend on http://localhost:5173 ...
start "Paytm Care Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Paytm Purchase Care Hub is Running!
echo   Dashboard UI: http://localhost:5173
echo   API Docs:     http://127.0.0.1:8000/docs
echo ========================================================
pause

