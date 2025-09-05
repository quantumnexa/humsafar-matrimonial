-- Admin User بنانے کا SQL Command
-- Email: admin@gmail.com
-- User ID: fd85c89b-80a3-4451-9bfa-7363283ac42a

-- پہلے چیک کریں کہ admin_users table موجود ہے
-- اگر نہیں ہے تو پہلے یہ command چلائیں:
/*
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS enable کریں
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users کے لیے policy
CREATE POLICY "Admin users can view all admin records" ON admin_users
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
*/

-- اب admin user add کریں
INSERT INTO admin_users (user_id, email, role, created_at, updated_at)
VALUES (
    'fd85c89b-80a3-4451-9bfa-7363283ac42a',
    'admin@gmail.com',
    'admin',
    NOW(),
    NOW()
);

-- Verify کریں کہ user add ہو گیا
SELECT * FROM admin_users WHERE email = 'admin@gmail.com';

-- اگر آپ کو auth.users table میں بھی user add کرنا ہے تو یہ command استعمال کریں:
-- (صرف اس صورت میں جب user auth.users میں موجود نہیں ہے)
/*
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at)
VALUES (
    'fd85c89b-80a3-4451-9bfa-7363283ac42a',
    'admin@gmail.com',
    NOW(),
    NOW(),
    NOW()
);
*/

-- استعمال کی ہدایات:
-- 1. Supabase Dashboard میں SQL Editor کھولیں
-- 2. یہ commands copy کر کے paste کریں
-- 3. Run کریں
-- 4. Admin panel میں admin@gmail.com سے login کریں