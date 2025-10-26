# Social Media Platform Setup Guide

This guide explains how to complete the V-Port integrations for TikTok, Instagram, LinkedIn, and X (Twitter).

---

## ✅ **YouTube (Already Working)**

YouTube is fully functional! You've already set this up with:
- Google Cloud Console project
- OAuth 2.0 credentials
- YouTube Data API v3 enabled

**Status:** ✅ 100% Complete

---

## 🟡 **TikTok Integration** (Needs Setup)

### Step 1: Create TikTok Developer Account
1. Go to https://developers.tiktok.com/
2. Sign up for a developer account
3. Create a new app

### Step 2: Get OAuth Credentials
1. In your TikTok app dashboard, go to "Manage apps"
2. Note your **Client Key** and **Client Secret**
3. Add redirect URI: `http://localhost:5000/api/vport/callback/tiktok`

### Step 3: Add to `.env.local`
```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
```

### Step 4: Backend Implementation (TODO)
```python
# Add to backend/app.py

@app.route('/api/vport/connect/tiktok', methods=['GET'])
def vport_connect_tiktok():
    client_key = os.getenv('TIKTOK_CLIENT_KEY')
    redirect_uri = request.host_url.rstrip('/') + '/api/vport/callback/tiktok'
    
    params = {
        'client_key': client_key,
        'scope': 'user.info.basic,video.upload',
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'state': 'random_state_string'
    }
    
    auth_url = 'https://www.tiktok.com/auth/authorize/?' + urlencode(params)
    return jsonify({'auth_url': auth_url})

@app.route('/api/vport/callback/tiktok', methods=['GET'])
def vport_callback_tiktok():
    code = request.args.get('code')
    # Exchange code for access token
    # Store token in session/database
    return redirect('http://localhost:3000/dashboard')

@app.route('/api/vport/publish/tiktok', methods=['POST'])
def vport_publish_tiktok():
    # Upload video to TikTok using their API
    pass
```

**Estimated Time:** 2-3 hours

---

## 🟡 **Instagram Integration** (Needs Setup)

### Step 1: Create Meta Developer Account
1. Go to https://developers.facebook.com/
2. Create a new app
3. Add "Instagram Basic Display" product

### Step 2: Get OAuth Credentials
1. In your Meta app dashboard, go to "Instagram Basic Display"
2. Note your **App ID** and **App Secret**
3. Add redirect URI: `http://localhost:5000/api/vport/callback/instagram`

### Step 3: Add to `.env.local`
```env
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
```

### Step 4: Backend Implementation (TODO)
```python
# Add to backend/app.py

@app.route('/api/vport/connect/instagram', methods=['GET'])
def vport_connect_instagram():
    app_id = os.getenv('META_APP_ID')
    redirect_uri = request.host_url.rstrip('/') + '/api/vport/callback/instagram'
    
    params = {
        'client_id': app_id,
        'redirect_uri': redirect_uri,
        'scope': 'user_profile,user_media',
        'response_type': 'code'
    }
    
    auth_url = 'https://api.instagram.com/oauth/authorize?' + urlencode(params)
    return jsonify({'auth_url': auth_url})

@app.route('/api/vport/callback/instagram', methods=['GET'])
def vport_callback_instagram():
    code = request.args.get('code')
    # Exchange code for access token
    # Store token in session/database
    return redirect('http://localhost:3000/dashboard')

@app.route('/api/vport/publish/instagram', methods=['POST'])
def vport_publish_instagram():
    # Upload video to Instagram using Graph API
    pass
```

**Note:** Instagram Reels API requires business account and may have restrictions.

**Estimated Time:** 3-4 hours

---

## 🟡 **LinkedIn Integration** (Needs Setup)

### Step 1: Create LinkedIn Developer Account
1. Go to https://www.linkedin.com/developers/
2. Create a new app
3. Request access to "Share on LinkedIn" and "Video API"

### Step 2: Get OAuth Credentials
1. In your LinkedIn app dashboard, go to "Auth"
2. Note your **Client ID** and **Client Secret**
3. Add redirect URI: `http://localhost:5000/api/vport/callback/linkedin`

### Step 3: Add to `.env.local`
```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
```

### Step 4: Backend Implementation (TODO)
```python
# Add to backend/app.py

@app.route('/api/vport/connect/linkedin', methods=['GET'])
def vport_connect_linkedin():
    client_id = os.getenv('LINKEDIN_CLIENT_ID')
    redirect_uri = request.host_url.rstrip('/') + '/api/vport/callback/linkedin'
    
    params = {
        'response_type': 'code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'scope': 'w_member_social'
    }
    
    auth_url = 'https://www.linkedin.com/oauth/v2/authorization?' + urlencode(params)
    return jsonify({'auth_url': auth_url})

@app.route('/api/vport/callback/linkedin', methods=['GET'])
def vport_callback_linkedin():
    code = request.args.get('code')
    # Exchange code for access token
    # Store token in session/database
    return redirect('http://localhost:3000/dashboard')

@app.route('/api/vport/publish/linkedin', methods=['POST'])
def vport_publish_linkedin():
    # Upload video to LinkedIn using their API
    pass
```

**Estimated Time:** 2-3 hours

---

## 🟡 **X (Twitter) Integration** (Needs Setup)

### Step 1: Create X Developer Account
1. Go to https://developer.twitter.com/
2. Apply for developer access (may take 1-2 days for approval)
3. Create a new app

### Step 2: Get OAuth Credentials
1. In your X app dashboard, go to "Keys and tokens"
2. Note your **API Key** and **API Secret**
3. Enable OAuth 2.0 and add redirect URI: `http://localhost:5000/api/vport/callback/twitter`

### Step 3: Add to `.env.local`
```env
X_API_KEY=your_api_key_here
X_API_SECRET=your_api_secret_here
```

### Step 4: Backend Implementation (TODO)
```python
# Add to backend/app.py

@app.route('/api/vport/connect/twitter', methods=['GET'])
def vport_connect_twitter():
    api_key = os.getenv('X_API_KEY')
    redirect_uri = request.host_url.rstrip('/') + '/api/vport/callback/twitter'
    
    # Twitter uses OAuth 2.0 with PKCE
    # Generate code_verifier and code_challenge
    
    params = {
        'response_type': 'code',
        'client_id': api_key,
        'redirect_uri': redirect_uri,
        'scope': 'tweet.read tweet.write users.read',
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256'
    }
    
    auth_url = 'https://twitter.com/i/oauth2/authorize?' + urlencode(params)
    return jsonify({'auth_url': auth_url})

@app.route('/api/vport/callback/twitter', methods=['GET'])
def vport_callback_twitter():
    code = request.args.get('code')
    # Exchange code for access token using PKCE
    # Store token in session/database
    return redirect('http://localhost:3000/dashboard')

@app.route('/api/vport/publish/twitter', methods=['POST'])
def vport_publish_twitter():
    # Upload video to Twitter using their API
    pass
```

**Note:** X (Twitter) API access may require paid subscription for video uploads.

**Estimated Time:** 3-4 hours

---

## 📋 **Summary**

| Platform | Setup Time | Difficulty | Notes |
|----------|------------|------------|-------|
| YouTube | ✅ Done | Easy | Already working |
| TikTok | 2-3 hours | Medium | Straightforward OAuth |
| Instagram | 3-4 hours | Hard | Requires business account |
| LinkedIn | 2-3 hours | Medium | May need API approval |
| X (Twitter) | 3-4 hours | Hard | May require paid tier |

**Total Estimated Time:** 10-14 hours for all platforms

---

## 🚀 **Quick Start Priority**

If you want to enable these platforms quickly, prioritize in this order:

1. **TikTok** (Easiest, most creator-friendly)
2. **LinkedIn** (Good for business content)
3. **Instagram** (Popular but more complex)
4. **X (Twitter)** (May have API restrictions)

---

## 💡 **Alternative Approach**

Instead of direct API integration, you could use:

1. **Zapier/Make.com** - Automate publishing via no-code tools
2. **Buffer/Hootsuite API** - Use social media management platforms
3. **Manual Download** - Users download and upload manually (current state)

The current implementation already supports **downloading the edited video**, so users can manually upload to any platform.

---

## ✅ **What's Already Working**

Remember, you already have:
- ✅ Full video editing pipeline
- ✅ 35+ AI features
- ✅ YouTube publishing
- ✅ Download functionality
- ✅ Scheduling backend

Users can edit videos with VEDIT and publish to any platform manually until you add the OAuth integrations.

---

## 📞 **Need Help?**

If you want to implement these integrations, I can:
1. Write the complete backend code for each platform
2. Add frontend connection status tracking
3. Implement error handling and retries
4. Add platform-specific video format optimization

Just let me know which platform you want to tackle first! 🚀

