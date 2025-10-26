#!/usr/bin/env bash
set -e

# Install system dependencies
sudo apt-get update
sudo apt-get install -y ffmpeg

# Install Python dependencies
cd backend
pip install -r requirements.txt