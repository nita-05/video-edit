# 🎬 VEDIT - AI-Powered Video Editing Platform

**VEDIT** is a cutting-edge video editing platform that combines the power of AI with intuitive editing tools to help creators produce professional content with ease.

## ✨ Features

### 🎥 V-Editor (Multi-Track Timeline Editor)
- **Multi-track editing** with drag-and-drop simplicity
- **Trim & Split** videos with precision
- **Filter effects** (Vintage, Cinematic, Noir, and more)
- **Brightness, Contrast, Saturation** controls
- **Smart Titles** and **Subtitles** with AI-generated captions
- **Real-time preview** of edits

### 🤖 VIA (AI Chatbot Assistant)
- **Brainstorm ideas** for your content
- **Write scripts** automatically
- **Edit videos** with natural language commands
- **AI suggestions** based on your uploaded content
- **Voice Profiles** with AI-generated voices

### 📤 V-Port (Multi-Platform Publishing)
- **One-click publishing** to multiple platforms
- **Supported platforms**: YouTube, LinkedIn, TikTok, Instagram, X (Twitter)
- **Schedule posts** for optimal engagement
- **Auto-format** content for each platform

### 🎙️ VIA Profiles (AI Voice Clones)
- **Generate professional voiceovers** with AI
- **Multiple voice styles**: Professional, Casual, Dramatic
- **Customize tone and style**
- **Real-time audio preview**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- FFmpeg installed
- OpenAI API key
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nita-05/Ai-video.git
   cd Ai-video
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up Environment Variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Social Media OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   ```

5. **Start Development Servers**
   ```bash
   # Start Backend (Terminal 1)
   cd backend
   python app.py
   
   # Start Frontend (Terminal 2)
   npm run dev
   ```

6. **Open in Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 Documentation

- [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- [Social Media Setup](./COMPLETE_SOCIAL_MEDIA_SETUP.md)
- [User Guide](./COMPLETE_USER_GUIDE.md)
- [Quick Reference](./QUICK_SETUP_REFERENCE.md)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (React framework)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)

### Backend
- **Flask** (Python web framework)
- **OpenAI API** (GPT-4, Whisper, TTS)
- **MoviePy** (Video processing)
- **FFmpeg** (Video/audio manipulation)
- **OpenCV** (Computer vision)

### AI Features
- **GPT-4o** - Smart suggestions and chatbot
- **Whisper** - Automatic subtitles
- **Vision API** - Smart titles and emotion analysis
- **TTS API** - AI voice generation

## 📖 Usage

### Upload Media
1. Click "Upload Media" in the right sidebar
2. Select videos, images, or audio files
3. Files will appear in your timeline

### Edit Videos
1. Drag and drop clips in the timeline
2. Use trim controls to cut sections
3. Apply filters and effects
4. Add titles and subtitles
5. Enable AI features as needed

### Process with AI
1. Select the clips you want to process
2. Choose AI features to apply
3. Click "Start AI Processing"
4. Wait for processing to complete
5. Download or publish your video

### Publish to Platforms
1. Connect your social media accounts in V-Port
2. Process your video in V-Editor
3. Click "Export Anywhere" or go to V-Port
4. Select platforms and publish

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and Whisper APIs
- MoviePy community
- All the amazing open-source contributors

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ by the VEDIT Team**