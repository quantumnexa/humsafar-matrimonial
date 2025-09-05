# Complete Image Visibility Fix Guide

## Problem Summary
Images are visible when users are logged in but not when they're logged out. This is a common issue with Supabase storage configurations.

## Root Causes Identified

1. **Storage Bucket Not Public**: The `humsafar-user-images` bucket was not set to public
2. **Restrictive RLS Policies**: Row Level Security policies were blocking anonymous access
3. **Signed URLs in Dashboard**: The dashboard was using `createSignedUrl` which requires authentication
4. **Inconsistent URL Handling**: Different parts of the app handled image URLs differently

## Complete Solution

### Step 1: Run the SQL Fix

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix_image_urls.sql`
4. Click **Run**

This will:
- Make the storage bucket public
- Update all RLS policies to allow anonymous access
- Fix any existing signed URLs to use public URLs
- Verify the changes

### Step 2: Code Updates (Already Applied)

The following code changes have been made:

#### Updated `dashboard/page.tsx`
- Modified `getDisplayUrlFromImageUrl` function to:
  - Check if the bucket is public
  - Use `getPublicUrl` for public buckets
  - Fall back to signed URLs only for private buckets
  - Return existing public URLs directly

#### Updated `fix_image_urls.sql`
- Comprehensive SQL script that fixes all storage and RLS issues
- Updates existing image URLs from signed to public format
- Includes verification queries

### Step 3: Verification Steps

#### 3.1 Check Supabase Dashboard
1. Go to **Storage** in your Supabase dashboard
2. Find the `humsafar-user-images` bucket
3. Verify it shows as **Public** (should have a globe icon)

#### 3.2 Test Image Access
1. Open your website in an **incognito/private browser window**
2. Navigate to the profiles page (`/profiles`)
3. Check if profile images are now visible
4. Open browser **Developer Tools** (F12)
5. Go to **Network** tab
6. Refresh the page
7. Look for image requests - they should return **200 OK** status

#### 3.3 Verify URL Format
Image URLs should now look like:
```
https://your-project.supabase.co/storage/v1/object/public/humsafar-user-images/user-id/filename.jpg
```

Not like (signed URLs):
```
https://your-project.supabase.co/storage/v1/object/sign/humsafar-user-images/...
```

### Step 4: Test Different Scenarios

1. **Logged Out User**: Images should be visible
2. **Logged In User**: Images should still work (no regression)
3. **Dashboard**: Image upload and display should work normally
4. **Profile Pages**: Individual profile images should load
5. **Homepage**: Featured profile images should display

## What Each File Does

### `fix_image_urls.sql`
- Makes storage bucket public
- Updates RLS policies for both `storage.objects` and `user_images` tables
- Fixes existing image URLs
- Includes verification queries

### `dashboard/page.tsx` (Updated)
- Smart URL handling that works with both public and private buckets
- Uses public URLs when bucket is public
- Falls back to signed URLs for private buckets

### `fix_image_visibility.md`
- Quick reference guide for the fix
- Step-by-step instructions

## Troubleshooting

### If Images Still Don't Show

1. **Check Browser Console**: Look for 403 or 404 errors
2. **Verify SQL Execution**: Make sure the SQL script ran without errors
3. **Check Bucket Status**: Ensure the bucket is actually public in Supabase dashboard
4. **Clear Browser Cache**: Hard refresh (Ctrl+F5) or clear cache
5. **Check Network Tab**: See what URLs are being requested

### Common Issues

1. **403 Forbidden**: RLS policies still blocking access
   - Re-run the SQL script
   - Check if policies were created correctly

2. **404 Not Found**: Image doesn't exist or wrong URL
   - Check if image URLs in database are correct
   - Verify file exists in storage

3. **Mixed Content**: HTTP/HTTPS issues
   - Ensure all URLs use HTTPS
   - Check browser security settings

## Security Notes

- Making the bucket public means anyone can view images if they have the URL
- This is standard for profile images in matrimonial sites
- Users can still control which images to upload
- Admin approval process remains in place
- RLS policies still protect the `user_images` table metadata

## Performance Benefits

- Public URLs load faster (no signature generation)
- Reduced server load (no auth checks for image access)
- Better caching by CDNs and browsers
- Improved user experience for logged-out visitors

---

**Status**: ✅ All fixes have been applied. Run the SQL script to complete the fix.