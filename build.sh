#!/bin/bash
# Build script for backend deployment on Render

echo "Installing Python dependencies..."

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p uploads
mkdir -p processed

echo "Build completed successfully!"
