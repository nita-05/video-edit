#!/bin/bash
set -e

# Ensure we're using Python 3.11
python3.11 --version || echo "Python 3.11 not available, using default"

# Install dependencies
pip install -r requirements.txt

# Force upgrade OpenAI to latest version to avoid compatibility issues
pip install --upgrade "openai>=1.12.0" --force-reinstall

echo "Build completed successfully"

