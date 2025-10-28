@echo off
echo ========================================
echo   Starting VEDIT Backend
echo ========================================
echo.

cd backend

REM Try to use the Python installation found
C:\Users\nitab\AppData\Local\Programs\Python\Python311\python.exe app.py

if %errorlevel% neq 0 (
    echo.
    echo Python311 failed, trying Python313...
    C:\Users\nitab\AppData\Local\Programs\Python\Python313\python.exe app.py
)

pause

