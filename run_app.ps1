$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   Starting Paytm Purchase Care Hub Full-Stack System            " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

# Detect Python
$PythonExe = "python"
if (Test-Path "$ScriptDir\venv\Scripts\python.exe") {
    $PythonExe = "$ScriptDir\venv\Scripts\python.exe"
} elseif (Test-Path "$ScriptDir\backend\venv\Scripts\python.exe") {
    $PythonExe = "$ScriptDir\backend\venv\Scripts\python.exe"
}

# 1. Launch FastAPI Backend bound to 0.0.0.0:8000
Write-Host "`n[1/2] Launching FastAPI Backend on 0.0.0.0:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir'; Write-Host 'Paytm Care Backend Running on 0.0.0.0:8000' -ForegroundColor Cyan; & '$PythonExe' -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# 2. Launch React Vite Frontend bound to 0.0.0.0:5173
Write-Host "[2/2] Launching Vite Frontend on 0.0.0.0:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; Write-Host 'Paytm Care Frontend Running on 0.0.0.0:5173' -ForegroundColor Cyan; npm run dev -- --host"

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host "  Paytm Purchase Care Hub is Running!" -ForegroundColor Yellow
Write-Host "  [PC Browser]:        http://localhost:5173" -ForegroundColor Green
Write-Host "  [Mobile over Wi-Fi]: http://172.31.98.52:5173" -ForegroundColor Cyan
Write-Host "  [Developer Options]: Enable USB Debugging & run:" -ForegroundColor Magenta
Write-Host "      adb reverse tcp:5173 tcp:5173" -ForegroundColor White
Write-Host "      adb reverse tcp:8000 tcp:8000" -ForegroundColor White
Write-Host "      Then open http://localhost:5173 on your phone!" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
