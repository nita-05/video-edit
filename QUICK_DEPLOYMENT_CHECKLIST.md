# ✅ Quick Deployment Checklist

## Before Pushing to GitHub

- [x] `.gitignore` is properly configured
- [x] All API keys are in environment variables (NOT in code)
- [x] `.env.local` will NOT be pushed (it's in `.gitignore`)
- [x] Code is ready for deployment
- [x] `vercel.json` is created
- [x] `backend/Procfile` is created
- [x] `backend/requirements.txt` is updated
- [x] `backend/runtime.txt` is created

## Deployment Steps

### 1️⃣ Push to GitHub FIRST
```bash
git add .
git commit -m "Initial commit: VEDIT AI Platform ready for deployment"
git push -u origin main
```

### 2️⃣ Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. Sign up/Sign in
3. Click "New Web Service"
4. Connect your GitHub repo: `nita-05/Ai-editing`
5. Configure:
   - **Name**: `vedit-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
6. Add environment variables (from your `.env.local`)
7. Deploy

### 3️⃣ Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import" your repository `nita-05/Ai-editing`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `/` (default)
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com`
   - All other env vars from `.env.local`
6. Deploy

### 4️⃣ Update Backend CORS
After getting production URLs, update `backend/app.py`:
- Line 44: Add your Vercel URL to CORS origins
- Push changes → Backend auto-redeploys

### 5️⃣ Update OAuth Redirect URLs
- Google OAuth: Add backend callback URL
- LinkedIn OAuth: Add backend callback URL

### 6️⃣ Test Everything
- [ ] Backend health check works
- [ ] Frontend loads
- [ ] Can upload videos
- [ ] AI processing works
- [ ] Social media publishing works

## Quick Commands

```bash
# Check if .env.local is ignored
git status | grep .env.local

# Push to GitHub
git push -u origin main

# After deployment, test backend
curl https://your-backend.onrender.com/api/health

# Test frontend
open https://your-frontend.vercel.app
```

## Estimated Deployment Time
- Backend: ~5-10 minutes
- Frontend: ~3-5 minutes
- Total: ~15 minutes

## Cost
- Render: Free tier available
- Vercel: Free tier available
- **Total monthly cost**: $0 on free tiers

---

**Ready to deploy! 🚀**

