# 🎬 VEDIT Complete User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [V-Editor: Video Editing](#v-editor-video-editing)
3. [VIA Chatbot: AI Assistant](#via-chatbot-ai-assistant)
4. [VIA Profiles: Voice Generation](#via-profiles-voice-generation)
5. [V-Port: Social Media Publishing](#v-port-social-media-publishing)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### 1. Start the Application

**Backend (Flask Server):**
```bash
start-backend-with-key.bat
```
This starts the backend server at `http://localhost:5000`

**Frontend (Next.js):**
```bash
npm run dev
```
This starts the frontend at `http://localhost:3000`

### 2. Sign In
- Open `http://localhost:3000` in your browser
- Click "Sign in with Google"
- Authorize the application

---

## V-Editor: Video Editing

### Overview
The V-Editor is your main workspace with a **3-track timeline** for advanced video editing.

### Step-by-Step: Basic Video Editing

#### 1. Upload Videos
- Click the **"Upload Video"** button (top left)
- Select one or multiple video files
- Videos will appear in the **upload area** at the top

#### 2. Add Videos to Timeline
You have **3 tracks** (Track 1, Track 2, Track 3) for layering videos:

**Method 1: Drag and Drop**
- Drag a video from the upload area
- Drop it onto any track (Track 1, 2, or 3)
- Videos on higher tracks will overlay videos on lower tracks

**Method 2: Click to Add**
- Click a video in the upload area to select it
- It will be added to Track 1 by default

#### 3. Arrange Clips on Timeline
- **Drag clips** between tracks to reorder
- **Click a clip** to select it (blue border appears)
- Selected clips will be included in the final merge

#### 4. Trim Videos
Two ways to trim:

**Method A: Manual Trim (Precise)**
- Set **Start Time** (e.g., 5 seconds)
- Set **End Time** (e.g., 15 seconds)
- This will trim ALL selected clips to this duration

**Method B: AI Auto-Trim**
- Toggle **"Auto Trim"** feature ON
- AI will automatically detect and remove silent/boring parts

#### 5. Apply AI Features

**Visual Effects:**
- ✅ **Color Correct**: Auto-adjusts colors for better quality
- ✅ **Increase Brightness**: Makes video brighter (adjustable strength)
- ✅ **Increase Saturation**: Makes colors more vibrant
- ✅ **Increase Contrast**: Enhances light/dark differences

**Filter Presets:**
- Select from dropdown: Vintage, Cinematic, Cool, Warm, Black & White, Sepia
- Each preset applies a professional color grade

**Text & Titles:**
- ✅ **Smart Title**: AI generates a centered title for your video
- ✅ **Generate Subtitles**: Auto-transcribes speech and adds subtitles
- ✅ **Burn-in Subtitles**: Permanently embeds subtitles into video

**Advanced AI:**
- ✅ **Smart Cropping**: Auto-crops to focus on important content
- ✅ **Motion Tracking**: Tracks and highlights moving objects
- ✅ **Smart Graphics**: Adds AI-generated graphics overlays

#### 6. Process Video

**Option A: Use AI Chatbot**
- Type a natural command like:
  ```
  Trim 7 seconds, vintage filter, centered smart title, 
  generate and burn in subtitles, color correct, 
  make brightness and saturation stronger, start
  ```
- AI will understand and apply all features

**Option B: Manual Processing**
- Toggle ON the features you want
- Click **"Start AI Merge"** button
- Wait for processing (progress modal shows status)

#### 7. Download Result
- Once processing completes, click **"Download Processed Video"**
- Video downloads with all effects applied
- **Audio is preserved** from original video

---

## VIA Chatbot: AI Assistant

### What It Does
The VIA Chatbot is your AI-powered editing assistant that understands natural language commands.

### How to Use

#### 1. Open Chat Panel
- Located on the right side of the dashboard
- Shows chat history and input box

#### 2. Ask Questions
```
"How do I add subtitles?"
"What's the best filter for outdoor videos?"
"Can you help me trim my video?"
```

#### 3. Give Editing Commands
The AI understands complex multi-step commands:

**Example Commands:**
```
"Trim 8 seconds, add vintage filter, and generate subtitles"

"Make my video brighter and add a smart title"

"Trim from 15s to 20s and 22s to 28s, merge them, 
add centered title, subtitles, color correct, 
increase brightness and saturation"

"Apply cinematic filter and auto-trim silent parts"
```

#### 4. Get AI Suggestions
- Click **"Get AI Suggestions"** button
- AI analyzes your video and suggests improvements
- Suggestions appear in chat

#### 5. Command Format
For best results, use this structure:
```
[Action] + [Duration/Range] + [Effects] + [Filters] + "start"
```

**Examples:**
- `Trim 10 seconds, vintage filter, subtitles, start`
- `Color correct, increase brightness, smart title, start`
- `Auto trim, cinematic filter, burn in subtitles, start`

---

## VIA Profiles: Voice Generation

### What It Does
Generate AI voices for voiceovers, narration, or audio content using OpenAI's TTS.

### Step-by-Step

#### 1. Access VIA Profiles
- Click **"VIA Profiles"** tab in the dashboard
- You'll see 4 voice profiles:
  - **Default Voice** (Alloy - Neutral)
  - **Professional Voice** (Echo - Clear & Authoritative)
  - **Casual Voice** (Nova - Friendly & Warm)
  - **Dramatic Voice** (Onyx - Deep & Powerful)

#### 2. Preview Voice Samples
- Each card has a **Play button** (▶️)
- Click to hear a sample of that voice
- Samples are generated on-demand using real AI

#### 3. Generate Custom Voice
1. Click **"Generate Voice"** on any profile
2. A prompt appears: **"Enter text to generate voice sample:"**
3. Type your text (e.g., "Welcome to my channel! Today we're exploring...")
4. Click OK
5. Wait 2-5 seconds for generation
6. Audio auto-plays when ready
7. The new sample replaces the preview

#### 4. Use Cases
- **Voiceovers**: Generate narration for your videos
- **Intros/Outros**: Create professional channel intros
- **Multilingual Content**: Generate voices in different languages
- **Accessibility**: Add audio descriptions

#### 5. Voice Characteristics

| Voice | Best For | Tone |
|-------|----------|------|
| **Default (Alloy)** | General purpose, tutorials | Neutral, clear |
| **Professional (Echo)** | Business, presentations | Authoritative, confident |
| **Casual (Nova)** | Vlogs, social media | Friendly, conversational |
| **Dramatic (Onyx)** | Trailers, storytelling | Deep, cinematic |

---

## V-Port: Social Media Publishing

### What It Does
Publish your edited videos directly to YouTube and LinkedIn (more platforms coming soon).

### Setup (One-Time)

#### YouTube Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable **YouTube Data API v3**
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/vport/callback/youtube`
6. Copy Client ID and Secret
7. Add to `.env.local`:
   ```
   YOUTUBE_CLIENT_ID=your_client_id
   YOUTUBE_CLIENT_SECRET=your_client_secret
   ```

#### LinkedIn Setup
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Request access to **Share on LinkedIn** and **Sign In with LinkedIn**
4. Add redirect URI: `http://localhost:5000/api/vport/callback/linkedin`
5. Copy Client ID and Secret
6. Add to `.env.local`:
   ```
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   ```

### Step-by-Step: Publishing

#### 1. Connect Platform
- Click **"V-Port"** tab in dashboard
- Click **"Connect"** on YouTube or LinkedIn
- Sign in with your account
- Authorize the app
- You'll be redirected back with "Connected" status

#### 2. Publish Video
1. Edit and process your video first
2. Go to V-Port tab
3. Click **"Publish"** on connected platform
4. Enter video details:
   - **Title**: Video title
   - **Description**: Video description
   - **Tags**: Comma-separated tags (YouTube only)
   - **Privacy**: Public/Private/Unlisted
5. Click **"Upload"**
6. Wait for upload to complete
7. Success message shows video URL

#### 3. Check Status
- Click **"Status"** to see connection status
- Shows if you're connected and account info

---

## Advanced Features

### Multi-Track Timeline Editing

#### Understanding Tracks
- **Track 1 (Bottom)**: Base layer
- **Track 2 (Middle)**: Overlay layer
- **Track 3 (Top)**: Top overlay layer

#### Use Cases

**Picture-in-Picture:**
1. Add main video to Track 1
2. Add smaller video to Track 2
3. Process with "Smart Cropping" on Track 2 clip

**Split Screen:**
1. Add first video to Track 1
2. Add second video to Track 2
3. Both play simultaneously

**Transitions:**
1. Add clips sequentially on same track
2. AI will create smooth transitions

### Filter Presets Explained

| Preset | Effect | Best For |
|--------|--------|----------|
| **Vintage** | Warm tones, slight grain | Nostalgic content, retro vibes |
| **Cinematic** | Wide color range, film-like | Professional videos, movies |
| **Cool** | Blue tones, crisp | Tech videos, modern content |
| **Warm** | Orange/yellow tones | Cozy content, sunsets |
| **Black & White** | Monochrome | Artistic, dramatic content |
| **Sepia** | Brown tones, old photo look | Historical, vintage content |

### Brightness & Saturation Levels

**Brightness:**
- Default: +20% increase
- "Make brightness stronger": +40% increase
- Adjusts overall lightness

**Saturation:**
- Default: +30% increase
- "Make saturation stronger": +50% increase
- Makes colors more vivid

**Contrast:**
- Default: +25% increase
- Enhances difference between light/dark areas

### Smart Title Customization

The AI generates titles based on:
- Video content analysis
- Your prompt/command
- Video length and style

**Tips for Better Titles:**
- Mention topic in your command: "Add title about cooking"
- Use descriptive prompts: "Create professional title for tutorial"
- Titles appear centered for 5 seconds by default

---

## Troubleshooting

### Video Won't Upload
**Problem**: "Failed to upload file to server"

**Solutions:**
1. Check file size (max 500MB recommended)
2. Ensure backend is running (`http://localhost:5000`)
3. Check browser console for errors
4. Try a different video format (MP4 recommended)

### Processing Stuck
**Problem**: Processing takes too long or hangs

**Solutions:**
1. Restart backend: Close terminal, run `start-backend-with-key.bat`
2. Reduce video length (trim to <2 minutes for testing)
3. Disable some AI features to speed up
4. Check backend terminal for errors

### No Sound in Downloaded Video
**Problem**: Downloaded video has no audio

**Solutions:**
1. Ensure original video has audio (play in VLC to confirm)
2. Check backend logs for audio processing errors
3. Try re-uploading and processing again
4. Verify FFmpeg is installed correctly

### AI Features Not Applied
**Problem**: "Applied 0 effects" or features missing

**Solutions:**
1. **Toggle features ON** before clicking "Start AI Merge"
2. Use clear commands: "Trim 5 seconds, vintage filter, subtitles, start"
3. Check that clips are **selected** (blue border) on timeline
4. Restart backend if issue persists

### OAuth Connection Fails
**Problem**: Can't connect to YouTube/LinkedIn

**Solutions:**
1. Verify redirect URI matches exactly:
   - YouTube: `http://localhost:5000/api/vport/callback/youtube`
   - LinkedIn: `http://localhost:5000/api/vport/callback/linkedin`
2. Check `.env.local` has correct credentials
3. Restart backend after adding credentials
4. Clear browser cache and try again

### Voice Generation Fails
**Problem**: "TTS synthesis failed" error

**Solutions:**
1. Check OpenAI API key is set: `set-openai-key.bat`
2. Verify you have OpenAI credits
3. Ensure text is not empty
4. Try shorter text (< 1000 characters)

---

## Quick Reference Commands

### Common AI Commands
```bash
# Basic trim and filter
"Trim 10 seconds, vintage filter, start"

# Full enhancement
"Color correct, increase brightness, increase saturation, start"

# Subtitles and title
"Generate subtitles, burn them in, add smart title, start"

# Complex edit
"Trim 15s to 25s, cinematic filter, smart title, 
subtitles, color correct, brightness stronger, start"

# Auto everything
"Auto trim, smart cropping, motion tracking, 
smart graphics, subtitles, start"
```

### Keyboard Shortcuts
- **Ctrl + Upload**: Quick upload
- **Click clip**: Select/deselect for merge
- **Drag clip**: Move between tracks

### File Locations
- **Uploaded videos**: `uploads/`
- **Processed videos**: Root directory (auto-download)
- **Voice samples**: Root directory (`.mp3` files)
- **Backend logs**: Terminal window

---

## Best Practices

### For Best Video Quality
1. Upload high-quality source videos (1080p recommended)
2. Use Color Correct + Brightness for overall enhancement
3. Apply one filter preset at a time
4. Keep videos under 5 minutes for faster processing

### For Fastest Processing
1. Trim videos before applying effects
2. Use fewer AI features simultaneously
3. Disable Motion Tracking and Smart Graphics if not needed
4. Process one video at a time

### For Social Media
1. **YouTube Shorts**: Trim to 60 seconds, vertical format
2. **LinkedIn**: Keep under 10 minutes, professional tone
3. Use subtitles for accessibility
4. Add smart titles for engagement

---

## Support

### Check Backend Status
Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "healthy",
  "openai": "connected",
  "features": "enabled"
}
```

### View Diagnostics
Visit: `http://localhost:5000/api/diag`

Shows all enabled features and configuration.

### Common Error Codes
- **400**: Bad request (check your input)
- **500**: Server error (check backend logs)
- **404**: Endpoint not found (check URL)

---

## What's Next?

### Coming Soon
- Instagram Reels publishing
- TikTok publishing
- X (Twitter) publishing
- More voice profiles
- Batch processing
- Video templates
- Advanced timeline editing

### Feature Requests
Have ideas? The system is built to be extensible!

---

**🎉 You're ready to create amazing videos with VEDIT!**

Start with a simple edit, then explore advanced features as you get comfortable.

