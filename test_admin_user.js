// Test script to check if admin user exists in database
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found!')
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdminUser() {
  console.log('🔍 Testing admin user setup...')
  console.log('Email: admin@gmail.com')
  console.log('User ID: fd85c89b-80a3-4451-9bfa-7363283ac42a')
  console.log('\n' + '='.repeat(50))

  try {
    // Check if admin_users table exists and has our user
    console.log('\n1. Checking admin_users table...')
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'admin@gmail.com')

    if (adminError) {
      console.error('❌ Error querying admin_users table:', adminError.message)
      if (adminError.code === '42P01') {
        console.log('\n💡 Solution: admin_users table does not exist!')
        console.log('Run this SQL in Supabase Dashboard:')
        console.log(`
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all admin records" ON admin_users
    FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));`)
      }
      return
    }

    if (!adminUsers || adminUsers.length === 0) {
      console.log('❌ Admin user not found in admin_users table')
      console.log('\n💡 Solution: Run the INSERT command from add_admin_user.sql')
      return
    }

    console.log('✅ Admin user found in admin_users table:')
    console.log(JSON.stringify(adminUsers[0], null, 2))

    // Check if user exists in auth.users table
    console.log('\n2. Checking auth.users table...')
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(
      'fd85c89b-80a3-4451-9bfa-7363283ac42a'
    )

    if (authError) {
      console.error('❌ Error checking auth.users:', authError.message)
      console.log('\n💡 Solution: Create user in Supabase Dashboard:')
      console.log('1. Go to Authentication > Users')
      console.log('2. Click "Add User"')
      console.log('3. Email: admin@gmail.com')
      console.log('4. Password: [your-password]')
      console.log('5. Auto Confirm User: Yes')
      return
    }

    if (!authUser.user) {
      console.log('❌ User not found in auth.users table')
      console.log('\n💡 Solution: Create user in Supabase Dashboard (see above)')
      return
    }

    console.log('✅ User found in auth.users table:')
    console.log(`Email: ${authUser.user.email}`)
    console.log(`ID: ${authUser.user.id}`)
    console.log(`Created: ${authUser.user.created_at}`)

    console.log('\n' + '='.repeat(50))
    console.log('🎉 Admin user setup is complete!')
    console.log('You can now login at http://localhost:3000/admin')
    console.log('Email: admin@gmail.com')
    console.log('Password: [the password you set in Supabase Dashboard]')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testAdminUser()