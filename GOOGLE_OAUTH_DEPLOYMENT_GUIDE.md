# Google OAuth Deployment Guide

## Problem
Google OAuth redirect URLs showing localhost instead of production domain when deployed.

## Solution

### 1. Environment Variables Setup

**For Local Development (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://znmrwfqycwlnrefksdaq.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For Production (.env.production):**
```
NEXT_PUBLIC_SUPABASE_URL=https://znmrwfqycwlnrefksdaq.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=https://www.humsafarforeverlove.com
```

### 2. Code Changes Made

Updated `app/auth/page.tsx` to use environment variable:
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/dashboard`
  }
})
```

### 3. Deployment Steps

1. **Update Environment Variables:**
   - Production domain is set to `https://www.humsafarforeverlove.com`
   - Set the same variables in your hosting platform (Vercel, Netlify, etc.)

2. **Google Cloud Console Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add your production domain to "Authorized redirect URIs":
     - `https://www.humsafarforeverlove.com/auth/callback`
     - `https://znmrwfqycwlnrefksdaq.supabase.co/auth/v1/callback`

3. **Supabase Configuration:**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your production domain to "Site URL"
   - Add redirect URLs in "Redirect URLs" section:
     - `https://www.humsafarforeverlove.com/dashboard`
     - `https://www.humsafarforeverlove.com/auth`

### 4. Testing

1. Deploy your application
2. Test Google OAuth login on production
3. Verify redirect URLs are correct
4. Check browser network tab for any localhost references

### 5. Common Issues

- **Still showing localhost:** Clear browser cache and cookies
- **OAuth error:** Check Google Console redirect URIs
- **Supabase error:** Verify Site URL and Redirect URLs in Supabase dashboard

### 6. Environment Variable Priority

Next.js loads environment variables in this order:
1. `.env.production.local` (production only)
2. `.env.local` (always loaded except test)
3. `.env.production` (production only)
4. `.env`

Make sure your production hosting platform environment variables override local ones.