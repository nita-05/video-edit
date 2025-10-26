# 🚀 Complete Social Media Integration Setup Guide

**All backend code is now implemented!** You just need to get API credentials and add them to your `.env.local` file.

---

## ✅ What's Already Done

- ✅ **All OAuth flows implemented** (TikTok, Instagram, LinkedIn, X/Twitter)
- ✅ **All connection endpoints** working
- ✅ **All status endpoints** ready
- ✅ **All publish endpoints** coded
- ✅ **YouTube** fully functional

**You only need to:**
1. Create developer accounts
2. Get API credentials
3. Add them to `.env.local`
4. Restart backend
5. Click "Connect" in V-Port

---

## 📋 Setup Priority (Easiest First)

1. **TikTok** ⭐ Easiest, fastest approval
2. **LinkedIn** ⭐⭐ Moderate, good for business
3. **Instagram** ⭐⭐⭐ More complex, requires business account
4. **X (Twitter)** ⭐⭐⭐⭐ May require paid tier

---

## 1️⃣ TikTok Setup (⏱️ ~30 minutes)

### Step 1: Create TikTok Developer Account
1. Go to https://developers.tiktok.com/
2. Click "Register" → Sign in with your TikTok account
3. Complete the developer registration form
4. Verify your email

### Step 2: Create an App
1. Go to "My apps" → Click "Create an app"
2. Fill in app details:
   - **App name:** VEDIT
   - **Category:** Video & Entertainment
   - **Description:** AI-powered video editing platform
3. Click "Create"

### Step 3: Configure OAuth
1. In your app dashboard, go to "Login Kit"
2. Click "Configure"
3. Add redirect URI: `http://localhost:5000/api/vport/callback/tiktok`
4. Select scopes:
   - `user.info.basic`
   - `video.upload`
   - `video.publish`
5. Save settings

### Step 4: Get Credentials
1. Go to "App details"
2. Copy your **Client Key** and **Client Secret**

### Step 5: Add to `.env.local`
```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

### Step 6: Test
1. Restart backend: `start-backend-with-key.bat`
2. Go to V-Port tab
3. Click "Connect" on TikTok
4. Authorize the app
5. You should see "Connected" ✅

---

## 2️⃣ LinkedIn Setup (⏱️ ~45 minutes)

### Step 1: Create LinkedIn Developer Account
1. Go to https://www.linkedin.com/developers/
2. Sign in with your LinkedIn account
3. Click "Create app"

### Step 2: Fill App Details
1. **App name:** VEDIT
2. **LinkedIn Page:** Create or select a LinkedIn page (required)
3. **App logo:** Upload a logo (512x512px)
4. **Legal agreement:** Check the box
5. Click "Create app"

### Step 3: Request API Access
1. In your app dashboard, go to "Products"
2. Request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn** (may require approval)
3. Wait for approval (usually instant for Sign In, 1-2 days for Share)

### Step 4: Configure OAuth
1. Go to "Auth" tab
2. Add redirect URI: `http://localhost:5000/api/vport/callback/linkedin`
3. Copy your **Client ID** and **Client Secret**

### Step 5: Add to `.env.local`
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

### Step 6: Test
1. Restart backend
2. Go to V-Port tab
3. Click "Connect" on LinkedIn
4. Authorize the app
5. You should see "Connected" ✅

**Note:** Video upload requires "Share on LinkedIn" product approval.

---

## 3️⃣ Instagram Setup (⏱️ ~1-2 hours)

### Step 1: Create Meta Developer Account
1. Go to https://developers.facebook.com/
2. Sign in with Facebook account
3. Click "Get Started"
4. Complete registration

### Step 2: Create an App
1. Go to "My Apps" → "Create App"
2. Select use case: **Business**
3. Fill details:
   - **App name:** VEDIT
   - **App contact email:** your_email@example.com
4. Click "Create App"

### Step 3: Add Instagram Product
1. In app dashboard, find "Instagram" product
2. Click "Set Up"
3. Go to "Instagram Basic Display"
4. Click "Create New App"
5. Fill in display name: **VEDIT**

### Step 4: Configure OAuth
1. In "Instagram Basic Display" settings:
2. Add redirect URI: `http://localhost:5000/api/vport/callback/instagram`
3. Add deauthorize callback: `http://localhost:5000/api/vport/deauth/instagram`
4. Add data deletion request: `http://localhost:5000/api/vport/delete/instagram`
5. Save changes

### Step 5: Get Credentials
1. Go to "Basic Display" → "Instagram App ID"
2. Copy **Instagram App ID** and **Instagram App Secret**

### Step 6: Add Test Users
1. Go to "Roles" → "Instagram Testers"
2. Add your Instagram account
3. Accept the invitation in your Instagram app (Settings → Apps and Websites)

### Step 7: Add to `.env.local`
```env
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
```

### Step 8: Test
1. Restart backend
2. Go to V-Port tab
3. Click "Connect" on Instagram
4. Authorize the app
5. You should see "Connected" ✅

**Important Notes:**
- Instagram requires a **Business or Creator account** for Reels API
- Video must be publicly accessible via URL (use Cloudinary)
- App review required for production use

---

## 4️⃣ X (Twitter) Setup (⏱️ ~1-2 hours)

### Step 1: Apply for Developer Account
1. Go to https://developer.twitter.com/
2. Sign in with your X/Twitter account
3. Click "Sign up for Free Account"
4. Fill application form:
   - **Primary use case:** Building tools for content creators
   - **Description:** AI video editing platform for creators
5. Submit application
6. **Wait for approval** (can take 1-2 days)

### Step 2: Create a Project and App
1. Once approved, go to Developer Portal
2. Create a new project:
   - **Project name:** VEDIT
   - **Use case:** Making a bot
3. Create an app within the project:
   - **App name:** VEDIT-App

### Step 3: Configure OAuth 2.0
1. In app settings, go to "User authentication settings"
2. Click "Set up"
3. Enable **OAuth 2.0**
4. App permissions:
   - ✅ Read
   - ✅ Write
5. Type of App: **Web App**
6. App info:
   - **Callback URI:** `http://localhost:5000/api/vport/callback/twitter`
   - **Website URL:** `http://localhost:3000`
7. Save settings

### Step 4: Get Credentials
1. Go to "Keys and tokens"
2. Copy your **Client ID** (OAuth 2.0)
3. Generate and copy **Client Secret**

### Step 5: Add to `.env.local`
```env
X_CLIENT_ID=your_client_id_here
# Note: Twitter OAuth 2.0 with PKCE doesn't require client secret in some flows
# But keep it for future use
```

### Step 6: Test
1. Restart backend
2. Go to V-Port tab
3. Click "Connect" on X
4. Authorize the app
5. You should see "Connected" ✅

**Important Notes:**
- **Free tier** may have limited video upload capabilities
- **Basic tier ($100/month)** recommended for video uploads
- OAuth 2.0 with PKCE is implemented (more secure)

---

## 🔧 Your `.env.local` File Should Look Like This:

```env
# OpenAI (Already working)
OPENAI_API_KEY=sk-...

# Cloudinary (Already working)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Google OAuth (Already working)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# YouTube (Already working)
YOUTUBE_CLIENT_ID=...  # Can be same as GOOGLE_CLIENT_ID
YOUTUBE_CLIENT_SECRET=...  # Can be same as GOOGLE_CLIENT_SECRET

# NextAuth (Already working)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# TikTok (NEW - Add these)
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Instagram (NEW - Add these)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# LinkedIn (NEW - Add these)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# X/Twitter (NEW - Add these)
X_CLIENT_ID=your_twitter_client_id
```

---

## 🧪 Testing Each Platform

### Test Checklist:
1. ✅ Add credentials to `.env.local`
2. ✅ Restart backend: `start-backend-with-key.bat`
3. ✅ Go to http://localhost:3000/dashboard
4. ✅ Click V-Port tab
5. ✅ Click "Connect" on the platform
6. ✅ Complete OAuth flow
7. ✅ See "Connected" status
8. ✅ Try publishing a video (optional)

### Troubleshooting:
- **"Missing credentials" error:** Check `.env.local` spelling
- **OAuth redirect fails:** Verify redirect URI matches exactly
- **"Connected" doesn't show:** Check browser console for errors
- **Backend error:** Check terminal for error messages

---

## 📊 Implementation Status

| Platform | Backend Code | Status Endpoint | Publish Endpoint | Ready to Use |
|----------|--------------|-----------------|------------------|--------------|
| YouTube | ✅ | ✅ | ✅ | ✅ Working |
| TikTok | ✅ | ✅ | ✅ | 🟡 Needs credentials |
| Instagram | ✅ | ✅ | ✅ | 🟡 Needs credentials |
| LinkedIn | ✅ | ✅ | ✅ | 🟡 Needs credentials |
| X (Twitter) | ✅ | ✅ | ✅ | 🟡 Needs credentials |

**All code is complete!** Just add your API credentials.

---

## 🎯 Quick Start (Do This First)

**Priority 1: TikTok** (Easiest)
1. Go to https://developers.tiktok.com/
2. Create app
3. Get Client Key & Secret
4. Add to `.env.local`
5. Restart backend
6. Test connection

**Priority 2: LinkedIn** (Good for business content)
1. Go to https://www.linkedin.com/developers/
2. Create app
3. Get Client ID & Secret
4. Add to `.env.local`
5. Restart backend
6. Test connection

**Priority 3: Instagram** (Most popular)
1. Go to https://developers.facebook.com/
2. Create Meta app
3. Add Instagram product
4. Get App ID & Secret
5. Add to `.env.local`
6. Restart backend
7. Test connection

**Priority 4: X/Twitter** (May need paid tier)
1. Apply for developer account
2. Wait for approval
3. Create app
4. Get Client ID
5. Add to `.env.local`
6. Restart backend
7. Test connection

---

## 💡 Pro Tips

1. **Start with TikTok** - It's the easiest and fastest to set up
2. **Use test accounts** - Test with personal accounts before going live
3. **Check rate limits** - Each platform has API rate limits
4. **Read platform policies** - Ensure your app complies with their terms
5. **Keep credentials secure** - Never commit `.env.local` to git

---

## 🆘 Need Help?

### Common Issues:

**"Redirect URI mismatch"**
- Solution: Ensure redirect URI in developer console exactly matches:
  - TikTok: `http://localhost:5000/api/vport/callback/tiktok`
  - Instagram: `http://localhost:5000/api/vport/callback/instagram`
  - LinkedIn: `http://localhost:5000/api/vport/callback/linkedin`
  - Twitter: `http://localhost:5000/api/vport/callback/twitter`

**"Invalid client credentials"**
- Solution: Double-check Client ID/Secret in `.env.local`
- Make sure there are no extra spaces or quotes

**"Scope not approved"**
- Solution: Some platforms require approval for certain scopes
- Apply for additional permissions in developer console

**Backend not picking up new env vars**
- Solution: Restart the backend completely
- Run: `taskkill /FI "WINDOWTITLE eq vedit-backend*" /F /T` then `start-backend-with-key.bat`

---

## ✅ What Happens After Setup

Once you add credentials and restart:

1. **V-Port tab** will show all platforms
2. **Click "Connect"** on any platform
3. **OAuth flow** opens in new window
4. **Authorize** the app
5. **Redirected back** to dashboard
6. **"Connected" status** shows green
7. **Ready to publish** videos!

---

## 🎉 You're All Set!

After completing these setups, your VEDIT platform will have:
- ✅ Full YouTube integration
- ✅ TikTok publishing
- ✅ Instagram Reels
- ✅ LinkedIn video posts
- ✅ X (Twitter) tweets with video

**All from one platform with AI-powered editing!** 🚀

---

**Questions? Check the platform-specific documentation:**
- TikTok: https://developers.tiktok.com/doc/
- Instagram: https://developers.facebook.com/docs/instagram-api
- LinkedIn: https://learn.microsoft.com/en-us/linkedin/
- X: https://developer.twitter.com/en/docs

