-- Complete Admin User Setup Script
-- یہ script Supabase Dashboard کے SQL Editor میں run کریں

-- Step 1: admin_users table بنائیں (اگر موجود نہیں ہے)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: RLS enable کریں
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Policy بنائیں
DROP POLICY IF EXISTS "Admin users can view all admin records" ON admin_users;
CREATE POLICY "Admin users can view all admin records" ON admin_users
    FOR ALL USING (true); -- Temporarily allow all access for setup

-- Step 4: Auth user بنائیں (manual step کے بجائے)
-- نوٹ: یہ direct auth.users میں insert نہیں کر سکتے، Supabase Dashboard استعمال کریں

-- Step 5: Admin user کو admin_users table میں add کریں
-- پہلے check کریں کہ موجود ہے یا نہیں
DO $$
BEGIN
    -- Check if admin user already exists
    IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@gmail.com') THEN
        INSERT INTO admin_users (user_id, email, role, created_at, updated_at)
        VALUES (
            'fd85c89b-80a3-4451-9bfa-7363283ac42a',
            'admin@gmail.com',
            'admin',
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Admin user added successfully';
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- Step 6: Verify admin user
SELECT 
    'Admin Users Table' as table_name,
    id, 
    user_id, 
    email, 
    role, 
    created_at
FROM admin_users 
WHERE email = 'admin@gmail.com';

-- اب آپ کو یہ کرنا ہے:
-- 1. Supabase Dashboard > Authentication > Users میں جائیں
-- 2. "Add User" کلک کریں
-- 3. Email: admin@gmail.com
-- 4. Password: humsafar123
-- 5. User UID: fd85c89b-80a3-4451-9bfa-7363283ac42a
-- 6. "Auto Confirm User" کو Yes کریں
-- 7. "Create User" کلک کریں