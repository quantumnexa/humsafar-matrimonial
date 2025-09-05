-- Complete Image Visibility Fix for Humsafar Matrimonial
-- This script fixes the issue where images are visible when logged in but not when logged out

-- Step 1: Make the storage bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'humsafar-user-images';

-- Step 2: Drop existing restrictive policies for storage.objects
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;

-- Step 3: Create new policies for storage.objects that allow public viewing
-- Allow anyone to view images in the humsafar-user-images bucket
CREATE POLICY "Public can view humsafar images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'humsafar-user-images');

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Users can upload own images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'humsafar-user-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own images
CREATE POLICY "Users can update own images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'humsafar-user-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'humsafar-user-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Step 4: Update RLS policies for user_images table
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own images" ON user_images;
DROP POLICY IF EXISTS "Users can insert own images" ON user_images;
DROP POLICY IF EXISTS "Users can update own images" ON user_images;
DROP POLICY IF EXISTS "Users can delete own images" ON user_images;
DROP POLICY IF EXISTS "Public can view approved images" ON user_images;
DROP POLICY IF EXISTS "Allow public read access" ON user_images;

-- Create new policies for user_images table
-- Allow anyone to view user images (for public profile browsing)
CREATE POLICY "Public can view user images" ON user_images
  FOR SELECT
  USING (true);

-- Allow users to insert their own images
CREATE POLICY "Users can insert own images" ON user_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own images
CREATE POLICY "Users can update own images" ON user_images
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images" ON user_images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 5: Fix any existing signed URLs to use public URLs
-- Update image URLs that contain signed URL parameters to use public URLs
UPDATE user_images 
SET image_url = CASE 
  WHEN image_url LIKE '%/storage/v1/object/sign/%' THEN 
    REPLACE(
      REPLACE(image_url, '/storage/v1/object/sign/', '/storage/v1/object/public/'),
      SUBSTRING(image_url FROM '\\?.*$'), ''
    )
  WHEN image_url LIKE '%?token=%' THEN 
    SUBSTRING(image_url FROM '^[^?]*')
  ELSE image_url
END
WHERE image_url LIKE '%/storage/v1/object/sign/%' 
   OR image_url LIKE '%?token=%'
   OR image_url LIKE '%&token=%';

-- Step 6: Grant necessary permissions
-- Grant SELECT permission to anonymous users for storage.objects
GRANT SELECT ON storage.objects TO anon;

-- Grant SELECT permission to anonymous users for user_images
GRANT SELECT ON user_images TO anon;

-- Step 7: Verification queries
-- Check if bucket is now public
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'humsafar-user-images';

-- Check storage policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- Check user_images policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_images';

-- Check sample image URLs to ensure they're using public format
SELECT id, user_id, image_url, is_main
FROM user_images 
LIMIT 5;

-- Success message
SELECT 'Image visibility fix completed successfully! Images should now be visible to all users.' as status;