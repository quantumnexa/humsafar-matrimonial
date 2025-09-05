# Admin User Setup Guide

یہ guide آپ کو Humsafar Matrimonial System میں admin user create کرنے میں مدد کرے گا۔

## Prerequisites

- Supabase project access
- Database admin privileges
- Access to Supabase Dashboard

## Step-by-Step Instructions

### Step 1: Create Admin Users Table

1. Supabase Dashboard میں جائیں
2. **SQL Editor** پر click کریں
3. `create_admin_user.sql` file کا content copy کریں
4. SQL Editor میں paste کریں اور **RUN** کریں

### Step 2: Create Auth User (Manual Method - Recommended)

1. Supabase Dashboard میں **Authentication** section پر جائیں
2. **Users** tab پر click کریں
3. **Add User** button پر click کریں
4. Admin user کی details fill کریں:
   - **Email**: `admin@humsafar.pk` (یا آپ کی پسند کا email)
   - **Password**: ایک strong password (کم از کم 8 characters)
   - **Auto Confirm User**: ✅ (checked)
5. **Create User** پر click کریں

### Step 3: Get User ID

1. Users list میں آپ کا نیا created user نظر آئے گا
2. User کی **ID** copy کریں (یہ UUID format میں ہوگا)

### Step 4: Add User to Admin Table

1. واپس **SQL Editor** میں جائیں
2. یہ query run کریں (USER_ID کو actual ID سے replace کریں):

```sql
INSERT INTO admin_users (user_id, role) 
VALUES ('YOUR_COPIED_USER_ID_HERE', 'admin');
```

### Step 5: Verify Admin User

یہ query run کر کے verify کریں کہ admin user successfully create ہوا:

```sql
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
```

### Step 6: Test Admin Login

1. Application کو browser میں open کریں
2. `/admin` route پر جائیں (مثلاً: `http://localhost:3000/admin`)
3. Created email اور password سے login کریں
4. Successfully login ہونے پر admin dashboard نظر آنا چاہیے

## Alternative Method (Advanced)

اگر آپ کے پاس service role key ہے تو آپ SQL سے directly user create کر سکتے ہیں:

```sql
-- Service role privileges کے ساتھ run کریں
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Auth user create کریں
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin@humsafar.pk',
        crypt('your_secure_password', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW()
    ) RETURNING id INTO new_user_id;
    
    -- Admin entry create کریں
    INSERT INTO admin_users (user_id, role) 
    VALUES (new_user_id, 'admin');
    
    RAISE NOTICE 'Admin user created with ID: %', new_user_id;
END $$;
```

## Troubleshooting

### Common Issues:

1. **"Table admin_users doesn't exist"**
   - Solution: پہلے `create_admin_user.sql` script run کریں

2. **"User not found in admin_users table"**
   - Solution: Step 4 میں INSERT query properly run کریں

3. **"Access denied. Admin privileges required."**
   - Solution: User ID correctly copy کیا ہے اور admin_users table میں entry موجود ہے

4. **Login page redirect loop**
   - Solution: Browser cache clear کریں اور cookies delete کریں

### Verification Commands:

```sql
-- Check if admin_users table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'admin_users';

-- Check auth users
SELECT id, email, created_at FROM auth.users 
WHERE email = 'admin@humsafar.pk';

-- Check admin entries
SELECT * FROM admin_users;
```

## Security Notes

- Strong password استعمال کریں
- Admin credentials کو secure رکھیں
- Regular users کو admin access نہ دیں
- Admin activities کو monitor کریں

## Next Steps

Admin user create کرنے کے بعد:

1. Admin dashboard explore کریں
2. User profiles manage کریں
3. Payments اور analytics check کریں
4. System settings configure کریں

اگر کوئی issue آئے تو development team سے contact کریں۔