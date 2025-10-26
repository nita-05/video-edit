# FFmpeg Setup Guide for Windows

## Quick Fix for Audio Issues

The current error `'FFMPEG_AudioWriter' object has no attribute 'ext'` indicates FFmpeg audio processing issues.

### Method 1: Install FFmpeg (Recommended)

1. **Download FFmpeg:**
   - Go to https://ffmpeg.org/download.html
   - Download Windows builds from https://www.gyan.dev/ffmpeg/builds/
   - Choose "release builds" → "ffmpeg-release-essentials.zip"

2. **Install FFmpeg:**
   ```bash
   # Extract to C:\ffmpeg
   # Add C:\ffmpeg\bin to your PATH environment variable
   ```

3. **Verify Installation:**
   ```bash
   ffmpeg -version
   ```

### Method 2: Use Conda (Alternative)

```bash
conda install ffmpeg
```

### Method 3: Use Chocolatey (Windows Package Manager)

```bash
choco install ffmpeg
```

## Test Your Setup

Run the test script to verify everything works:

```bash
cd backend
python test_setup.py
```

## Current Workaround

The code has been updated to work without FFmpeg audio processing by:
- Removing problematic audio parameters
- Using simplified video writing
- Focusing on visual effects only

## Expected Results

After proper FFmpeg installation, you should see:
- ✅ MoviePy video writing works
- ✅ Audio processing works
- ✅ All AI features work properly
- ✅ No more `'FFMPEG_AudioWriter' object has no attribute 'ext'` errors

## Troubleshooting

If you still have issues:

1. **Check FFmpeg PATH:**
   ```bash
   where ffmpeg
   ```

2. **Restart your terminal/IDE** after adding FFmpeg to PATH

3. **Test with simple video:**
   ```python
   import moviepy.editor as mp
   clip = mp.ColorClip(size=(100, 100), color=(255, 0, 0), duration=1)
   clip.write_videofile("test.mp4", verbose=False, logger=None)
   ```

4. **Check MoviePy version:**
   ```python
   import moviepy
   print(moviepy.__version__)
   ```

The current code will work without FFmpeg, but installing it will enable full audio processing capabilities.
