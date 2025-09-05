# Production Deployment Guide

## Issue Fixed
The login error "Cannot connect to authentication service" was occurring because:
1. Supabase client was using hardcoded values instead of environment variables
2. Environment variables were not properly configured for production

## Changes Made

### 1. Updated Supabase Client Configuration
- Modified `lib/supabaseClient.ts` to use environment variables
- Added error handling for missing environment variables

### 2. Created Next.js Configuration
- Added `next.config.js` with proper environment variable handling
- Configured image domains for Supabase storage

## Production Deployment Steps

### Step 1: Environment Variables Setup
In your hosting platform (Vercel, Netlify, etc.), add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://znmrwfqycwlnrefksdaq.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubXJ3ZnF5Y3dsbnJlZmtzZGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzkxMTYsImV4cCI6MjA3MjMxNTExNn0.KcyAzNQIYvql0ZhEYf_0GKRk_xMC_1VbntTkxUmXlc4
NEXT_PUBLIC_SITE_URL=https://www.humsafarforeverlove.com
```

### Step 2: Supabase Configuration
1. Go to your Supabase Dashboard
2. Navigate to Authentication > URL Configuration
3. Add your production domain to:
   - Site URL: `https://www.humsafarforeverlove.com`
   - Redirect URLs: `https://www.humsafarforeverlove.com/dashboard`

### Step 3: Google OAuth Configuration
1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client
4. Add to Authorized redirect URIs:
   - `https://znmrwfqycwlnrefksdaq.supabase.co/auth/v1/callback`
   - `https://www.humsafarforeverlove.com/auth/callback`

### Step 4: Build and Deploy
1. Run `npm run build` to test the build locally
2. Deploy to your hosting platform
3. Verify environment variables are loaded correctly

## Testing
After deployment:
1. Visit your production site
2. Try logging in with email/password
3. Test Google OAuth login
4. Check browser console for any errors

## Troubleshooting

### If login still fails:
1. Check browser console for error messages
2. Verify environment variables in hosting platform
3. Ensure Supabase URL configuration is correct
4. Check Google OAuth redirect URIs

### Common Issues:
- **Environment variables not loading**: Redeploy after adding variables
- **CORS errors**: Check Supabase URL configuration
- **Google OAuth fails**: Verify redirect URIs in Google Console

## Support
If issues persist, check:
1. Supabase Dashboard > Logs
2. Browser Developer Tools > Console
3. Network tab for failed requests