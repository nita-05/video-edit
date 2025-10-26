#!/usr/bin/env bash
set -e

# Install system dependencies
apt-get update
apt-get install -y ffmpeg

# Install Python dependencies
cd backend
pip install -r requirements.txt