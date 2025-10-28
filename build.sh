#!/bin/bash
# Build script for backend deployment on Render

# Install FFmpeg (if not already installed)
# sudo apt-get update
# sudo apt-get install -y ffmpeg

# Create uploads directory if it doesn't exist
mkdir -p uploads
mkdir -p processed

# Install Python dependencies
pip install -r requirements.txt

# The application will be started by the start command in render.yaml
