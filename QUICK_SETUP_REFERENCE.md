# 🚀 Quick Setup Reference Card

## ✅ What's Already Working
- YouTube (fully functional)
- All backend code for TikTok, Instagram, LinkedIn, X

## 🎯 What You Need To Do

### 1. TikTok (⏱️ 30 min)
```
1. Go to: https://developers.tiktok.com/
2. Create app
3. Get: Client Key + Client Secret
4. Add redirect: http://localhost:5000/api/vport/callback/tiktok
5. Add to .env.local:
   TIKTOK_CLIENT_KEY=...
   TIKTOK_CLIENT_SECRET=...
```

### 2. Instagram (⏱️ 1-2 hours)
```
1. Go to: https://developers.facebook.com/
2. Create Meta app → Add Instagram product
3. Get: App ID + App Secret
4. Add redirect: http://localhost:5000/api/vport/callback/instagram
5. Add to .env.local:
   META_APP_ID=...
   META_APP_SECRET=...
```

### 3. LinkedIn (⏱️ 45 min)
```
1. Go to: https://www.linkedin.com/developers/
2. Create app → Request "Share on LinkedIn" product
3. Get: Client ID + Client Secret
4. Add redirect: http://localhost:5000/api/vport/callback/linkedin
5. Add to .env.local:
   LINKEDIN_CLIENT_ID=...
   LINKEDIN_CLIENT_SECRET=...
```

### 4. X/Twitter (⏱️ 1-2 hours)
```
1. Go to: https://developer.twitter.com/
2. Apply for developer account (wait for approval)
3. Create app → Enable OAuth 2.0
4. Get: Client ID
5. Add redirect: http://localhost:5000/api/vport/callback/twitter
6. Add to .env.local:
   X_CLIENT_ID=...
```

## 🔄 After Adding Credentials

```bash
# 1. Stop backend
taskkill /FI "WINDOWTITLE eq vedit-backend*" /F /T

# 2. Restart backend
start-backend-with-key.bat

# 3. Test in browser
# Go to http://localhost:3000/dashboard
# Click V-Port tab
# Click "Connect" on each platform
```

## 📋 Your .env.local Template

```env
# Already Working ✅
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Add These 🆕
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
META_APP_ID=
META_APP_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
X_CLIENT_ID=
```

## ✅ Testing Checklist

- [ ] TikTok credentials added
- [ ] Instagram credentials added
- [ ] LinkedIn credentials added
- [ ] X credentials added
- [ ] Backend restarted
- [ ] TikTok connects successfully
- [ ] Instagram connects successfully
- [ ] LinkedIn connects successfully
- [ ] X connects successfully

## 🆘 Troubleshooting

**"Missing credentials" error**
→ Check spelling in `.env.local`

**OAuth fails**
→ Verify redirect URI matches exactly

**"Connected" doesn't show**
→ Check browser console for errors

**Backend not picking up changes**
→ Restart backend completely

## 📚 Full Documentation

- **Complete Guide:** `COMPLETE_SOCIAL_MEDIA_SETUP.md`
- **Platform Comparison:** `SOCIAL_MEDIA_SETUP_GUIDE.md`
- **Implementation Status:** `VEDIT_AUDIT_REPORT.md`

## 🎉 Result

After setup, you'll have:
✅ YouTube publishing (already working)
✅ TikTok publishing
✅ Instagram Reels
✅ LinkedIn videos
✅ X (Twitter) posts

**All with AI-powered editing from one platform!** 🚀

