# 🚀 VEDIT - Complete Deployment Guide

## 📦 Deployment Architecture

This project consists of:
- **Frontend**: Next.js 14 (Deploy to Vercel)
- **Backend**: Flask API (Deploy to Render/Railway)

---

## 🌐 Step 1: Deploy Backend to Render/Railway

### Option A: Render (Recommended - Free Tier Available)

1. **Create Account**: Go to [render.com](https://render.com) and sign up

2. **Create New Web Service**:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the repository: `nita-05/Ai-editing`

3. **Configure Backend Settings**:
   ```
   Name: vedit-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Add Environment Variables** in Render Dashboard:
   ```
   OPENAI_API_KEY = your_openai_key
   CLOUDINARY_CLOUD_NAME = your_cloud_name
   CLOUDINARY_API_KEY = your_api_key
   CLOUDINARY_API_SECRET = your_api_secret
   GOOGLE_CLIENT_ID = your_google_client_id
   GOOGLE_CLIENT_SECRET = your_google_client_secret
   LINKEDIN_CLIENT_ID = your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET = your_linkedin_client_secret
   ```

5. **Important**: Update OAuth redirect URLs to your production backend URL

---

### Option B: Railway (Alternative)

1. **Create Account**: Go to [railway.app](https://railway.app)
2. **Deploy from GitHub**: Connect your repository
3. **Configure**: Select `backend` folder as root
4. **Add Environment Variables**: Same as above
5. **Get Production URL**: e.g., `https://vedit-backend.railway.app`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub

### 2. Import Project
1. Click "Add New Project"
2. Import your `Ai-editing` repository
3. Vercel auto-detects Next.js

### 3. Configure Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com

# Backend URLs (for API calls)
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Authentication
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=https://your-frontend-url.vercel.app

# AI Configuration
OPENAI_API_KEY=your_openai_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 4. Deploy
- Click "Deploy"
- Wait for build to complete (~3-5 minutes)

### 5. Update Backend CORS
After deployment, update `backend/app.py` line 44:

```python
CORS(app, resources={r"/api/*": {
    "origins": [
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://your-frontend-url.vercel.app"  # Add this
    ]
}})
```

Then push to GitHub - backend will auto-redeploy.

---

## 🔧 Step 3: Update Configuration Files

### Update backend/app.py
Replace line 44 with your production URLs:

```python
CORS(app, resources={r"/api/*": {
    "origins": [
        "https://your-frontend-domain.vercel.app",
        "http://localhost:3000"
    ]
}})
```

### Update Frontend API Calls
Replace all `http://localhost:5000` with your backend URL:

In `app/dashboard/real-ai-dashboard.tsx`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.onrender.com';
```

---

## 📋 Step 4: Deployment Checklist

### Before Pushing to GitHub:
- [ ] All API keys in `.env.local` are NOT pushed (already in `.gitignore`)
- [ ] `.gitignore` is configured
- [ ] `vercel.json` is created
- [ ] `requirements.txt` exists in backend
- [ ] All sensitive data is in environment variables only

### After Backend Deployment:
- [ ] Backend is running (check health endpoint)
- [ ] Environment variables are set
- [ ] OAuth redirect URLs updated in Google/LinkedIn apps
- [ ] Test `/api/health` endpoint

### After Frontend Deployment:
- [ ] Frontend is accessible
- [ ] Environment variables are set
- [ ] Can access dashboard
- [ ] API calls work from frontend

---

## 🌍 Step 5: Update OAuth Redirect URLs

### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URIs:
   ```
   https://your-backend-url.onrender.com/api/vport/callback/youtube
   ```

### LinkedIn OAuth:
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers)
2. Select your app
3. Auth tab → Authorized redirect URLs
4. Add:
   ```
   https://your-backend-url.onrender.com/api/vport/callback/linkedin
   ```

---

## 🧪 Step 6: Test Deployment

### Test Backend:
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "VEDIT Production Fast Backend with Real AI is running"
}
```

### Test Frontend:
1. Open: `https://your-frontend-url.vercel.app`
2. Try uploading a video
3. Test AI processing
4. Test publishing features

---

## 💰 Cost Estimation

### Free Tier (Sufficient for MVP):
- **Vercel**: Free forever (for hobby projects)
- **Render**: Free tier (with limitations)
- **Cloudinary**: Free 25GB storage
- **OpenAI**: Pay-as-you-go
- **Total Monthly Cost**: ~$10-20 (mostly OpenAI API usage)

---

## ⚠️ Important Notes

1. **Never commit** `.env.local` - It's in `.gitignore`
2. **Always use environment variables** for secrets
3. **Update CORS** after getting production URLs
4. **Update OAuth redirects** for each platform
5. **Test thoroughly** before going live

---

## 🆘 Troubleshooting

### Backend won't deploy:
- Check Python version in `runtime.txt`
- Check `requirements.txt` for errors
- Review build logs in Render dashboard

### Frontend can't reach backend:
- Check CORS settings
- Verify environment variable `NEXT_PUBLIC_API_URL`
- Check network tab in browser console

### OAuth not working:
- Verify redirect URLs match exactly
- Check environment variables are set correctly
- Review OAuth callback logs

---

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Verify environment variables
3. Test endpoints individually
4. Review this guide again

**Good luck with your deployment! 🚀**

