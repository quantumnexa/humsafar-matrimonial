-- Script to create an admin user in Humsafar Matrimonial System
-- This script creates both the auth user and admin_users table entry

-- Step 1: First, you need to create a user in Supabase Auth
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Or use the following approach:

-- Note: Replace 'admin@humsafar.pk' and 'your_secure_password' with actual values
-- You can run this in Supabase SQL Editor

-- Step 2: Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users table
CREATE POLICY "Admin users can view all admin records" ON admin_users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() AND au.role = 'admin'
        )
    );

CREATE POLICY "Admin users can insert admin records" ON admin_users
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.user_id = auth.uid() AND au.role = 'admin'
        )
    );

-- Step 3: Insert admin user into admin_users table
-- Replace 'USER_ID_HERE' with the actual user ID from auth.users table
-- You can get the user ID by running: SELECT id, email FROM auth.users WHERE email = 'admin@humsafar.pk';

-- Example insert (replace USER_ID_HERE with actual UUID):
-- INSERT INTO admin_users (user_id, role) 
-- VALUES ('USER_ID_HERE', 'admin');

-- Step 4: Alternative approach - Create user and admin entry in one go
-- This requires service role key and should be run with elevated privileges

/*
-- Method 1: If you want to create a new user with admin privileges
-- Run this in Supabase SQL Editor with service role

DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Create auth user (this requires service role privileges)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@humsafar.pk',
        crypt('your_secure_password', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO new_user_id;
    
    -- Create admin entry
    INSERT INTO admin_users (user_id, role) 
    VALUES (new_user_id, 'admin');
    
    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;
*/

-- Step 5: Manual method (Recommended)
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" button
-- 3. Enter email: admin@humsafar.pk
-- 4. Enter password: your_secure_password
-- 5. Click "Create User"
-- 6. Copy the user ID from the users list
-- 7. Run the following query with the copied user ID:

-- INSERT INTO admin_users (user_id, role) 
-- VALUES ('PASTE_USER_ID_HERE', 'admin');

-- Step 6: Verify admin user creation
-- Run this query to verify the admin user was created successfully:
/*
SELECT 
    au.id as admin_id,
    au.user_id,
    au.role,
    au.created_at,
    u.email,
    u.created_at as auth_created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.role = 'admin';
*/

-- Instructions:
-- 1. First create the admin_users table by running the CREATE TABLE statement above
-- 2. Use the manual method (Step 5) to create the auth user via Supabase Dashboard
-- 3. Insert the user into admin_users table using the INSERT statement
-- 4. Verify using the SELECT query at the end
-- 5. You can now login to admin panel using the created email and password