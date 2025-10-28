#!/bin/bash
# Build script for backend deployment on Render

echo "Setting up Python 3.11.7..."

# Force Python 3.11 if available
python3.11 --version 2>/dev/null && python3.11 -m venv .venv || python3 -m venv .venv

source .venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads
mkdir -p processed

echo "Build completed successfully!"
