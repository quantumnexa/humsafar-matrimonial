# Fix Image Visibility Issue

## Problem
Profile images are showing when logged in but not when logged out. This is caused by:
1. Supabase storage bucket not being public
2. RLS policies that are too restrictive for anonymous users
3. Possible use of signed URLs instead of public URLs

## Solution
We need to:
1. Make the storage bucket public
2. Update RLS policies to allow anonymous access
3. Fix any existing image URLs that might be using signed URLs
4. Ensure the code uses public URLs directly

## Steps to Fix

### 1. Run the Comprehensive SQL Fix
Execute the `fix_image_urls.sql` file in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `fix_image_urls.sql`
4. Run the script

This script will:
- Make the storage bucket public
- Update all RLS policies
- Fix any existing image URLs
- Verify the changes

### 2. Verify Storage Bucket Settings
In your Supabase dashboard:

1. Go to Storage
2. Find the `humsafar-user-images` bucket
3. Make sure it's set to **Public** (should be fixed by the SQL script)
4. If not, manually enable public access

### 3. Test the Fix

1. Open your website in an incognito/private browser window (to simulate not being logged in)
2. Navigate to the profiles page
3. Check if profile images are now visible
4. Check the browser's Network tab to see if images are loading with 200 status codes

## What the Fix Does

1. **Makes the storage bucket public** - This is the key change that allows anonymous users to access images
2. **Adds a simple public viewing policy** - Allows anyone to view images in the bucket
3. **Grants SELECT permissions to anonymous users** - Ensures anonymous users can read from storage
4. **Keeps existing security for uploads/modifications** - Users can still only upload/modify their own images

## Alternative Quick Fix (If SQL doesn't work)

If running the SQL script doesn't work, you can manually:

1. Go to Supabase Dashboard → Storage
2. Click on `humsafar-user-images` bucket
3. Go to Settings
4. Enable "Public bucket" option
5. Save changes

This should immediately make all images in the bucket publicly accessible.

## Security Note

Making the bucket public means anyone with a direct link to an image can view it, but:
- Images are only discoverable through your app's profile pages
- Users still control their own image uploads/deletions
- This is standard practice for matrimonial/dating apps where profile browsing is expected