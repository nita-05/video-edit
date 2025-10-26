#!/usr/bin/env bash
set -e

# Install Python dependencies (includes imageio-ffmpeg which provides FFmpeg)
cd backend
pip install -r requirements.txt