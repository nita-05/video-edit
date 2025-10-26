# Google OAuth Setup Guide

## 🔑 **Step 1: Create Google OAuth Credentials**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "VEDIT Video Editor"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (for production)

## 🔧 **Step 2: Configure Environment Variables**

Create a `.env.local` file in your project root with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/vedit_db

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 **Step 3: Install Required Dependencies**

```bash
npm install @auth/mongodb-adapter
```

## ✅ **Step 4: Test the Integration**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Go to** `http://localhost:3000/auth`

3. **Click "Continue with Google"** - you should be redirected to Google's OAuth page

4. **Sign in with your Google account** - you'll be redirected back to the dashboard

## 🔒 **Security Notes**

- **NEXTAUTH_SECRET**: Generate a random string (32+ characters)
- **Never commit** `.env.local` to version control
- **Use HTTPS** in production
- **Update redirect URIs** for production domain

## 🎯 **What This Enables**

- ✅ **Real Google OAuth** - No more simulation
- ✅ **Secure authentication** - Industry-standard OAuth 2.0
- ✅ **User data persistence** - Stored in MongoDB
- ✅ **Session management** - Automatic login/logout
- ✅ **Profile information** - Real user name, email, avatar

## 🆘 **Troubleshooting**

**Error: "redirect_uri_mismatch"**
- Check that your redirect URI in Google Console matches exactly
- Make sure there are no trailing slashes

**Error: "invalid_client"**
- Verify your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Make sure they're correctly set in `.env.local`

**Error: "access_denied"**
- User cancelled the OAuth flow
- This is normal behavior

## 📱 **Production Setup**

For production deployment:

1. **Update redirect URIs** in Google Console
2. **Set NEXTAUTH_URL** to your production domain
3. **Use environment variables** in your hosting platform
4. **Enable HTTPS** for security

---

**Your VEDIT app now has real Google OAuth authentication! 🎉**
