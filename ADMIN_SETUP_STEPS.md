# Admin User Setup - Step by Step Guide

## مسئلہ:
Admin login نہیں ہو رہا کیونکہ:
1. `admin_users` table موجود نہیں ہے
2. Auth user موجود نہیں ہے

## حل - یہ steps follow کریں:

### Step 1: Supabase Dashboard کھولیں
1. https://supabase.com پر جائیں
2. اپنے project میں login کریں
3. اپنا project select کریں

### Step 2: Database Table بنائیں
1. **SQL Editor** میں جائیں (left sidebar میں)
2. `setup_admin_complete.sql` فائل کھولیں
3. تمام SQL code copy کریں
4. SQL Editor میں paste کریں
5. **RUN** button دبائیں

### Step 3: Auth User بنائیں
1. **Authentication** میں جائیں (left sidebar میں)
2. **Users** tab کلک کریں
3. **Add User** button دبائیں
4. یہ details بھریں:
   - **Email**: `admin@gmail.com`
   - **Password**: `humsafar123`
   - **User UID**: `fd85c89b-80a3-4451-9bfa-7363283ac42a`
   - **Auto Confirm User**: ✅ Yes
5. **Create User** دبائیں

### Step 4: Verify Setup
1. SQL Editor میں واپس جائیں
2. یہ query run کریں:
```sql
SELECT * FROM admin_users WHERE email = 'admin@gmail.com';
```
3. اگر result آئے تو setup successful ہے

### Step 5: Test Login
1. http://localhost:3000/admin پر جائیں
2. Login کریں:
   - **Email**: `admin@gmail.com`
   - **Password**: `humsafar123`

## اگر پھر بھی مسئلہ ہو:

### Browser Console Check کریں:
1. F12 دبائیں
2. Console tab کھولیں
3. Login کرنے کی کوشش کریں
4. Errors دیکھیں اور مجھے بتائیں

### Common Issues:
- **"User not found"**: Auth user نہیں بنا
- **"Access denied"**: admin_users table میں entry نہیں ہے
- **"Invalid credentials"**: Password غلط ہے

## Important Notes:
- User UID exactly یہ ہونا چاہیے: `fd85c89b-80a3-4451-9bfa-7363283ac42a`
- Email exactly یہ ہونا چاہیے: `admin@gmail.com`
- Auto Confirm User ضروری ہے

اگر کوئی step unclear ہے تو مجھے بتائیں!