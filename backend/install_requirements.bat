@echo off
echo Installing Python dependencies for VEDIT Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo Python found! Installing dependencies...
echo.

REM Install requirements
pip install -r requirements.txt

echo.
echo Installing additional AI/ML dependencies...
pip install scikit-learn matplotlib pillow

echo.
echo Backend dependencies installed successfully!
echo.
echo Next steps:
echo 1. Set up your environment variables in .env
echo 2. Run: python enhanced_app.py
echo.
pause
