@echo off
title AI Quiz Generator Launcher
echo =========================================
echo Starting AI Quiz Generator Services...
echo =========================================
echo.

:: 1. Start Django Backend
echo [1/2] Starting Django Backend in a new window...
start "Django Backend" cmd /k "cd backend && .\venv\Scripts\activate && python manage.py runserver 127.0.0.1:8000"

:: 2. Start React Frontend
echo [2/2] Starting React Frontend in a new window...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================
echo All services have been successfully launched!
echo They are running in the newly opened terminal windows.
echo.
echo You can access the app in your browser at:
echo http://localhost:5173/
echo =========================================
echo.
pause
