Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting Paytm Purchase Care Hub Full-Stack System   " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Launch FastAPI Backend
Write-Host "`n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Paytm Care Backend Running on http://127.0.0.1:8000' -ForegroundColor Cyan; .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

# 2. Launch React Vite Frontend
Write-Host "[2/2] Launching Vite Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Paytm Care Frontend Running on http://localhost:5173' -ForegroundColor Cyan; Set-Location frontend; npm run dev"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "  Paytm Purchase Care Hub is Running!" -ForegroundColor Yellow
Write-Host "  Frontend Web App:  http://localhost:5173" -ForegroundColor Green
Write-Host "  FastAPI Swagger:   http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

