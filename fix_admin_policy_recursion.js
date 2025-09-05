const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixAdminPolicyRecursion() {
  try {
    console.log('Testing profile_views table access...');
    
    // Test if we can access the profile_views table without infinite recursion
    const { data, error } = await supabase
      .from('profile_views')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Profile views table access error:', error);
      
      if (error.message && error.message.includes('infinite recursion')) {
        console.log('\n❌ INFINITE RECURSION DETECTED!');
        console.log('The problematic admin policy is still active.');
        console.log('\n🔧 MANUAL FIX REQUIRED:');
        console.log('Please run this SQL in Supabase SQL Editor:');
        console.log('\nDROP POLICY IF EXISTS "Admins can view all profile views" ON profile_views;');
        console.log('\nThis will remove the policy causing the circular dependency.');
      } else {
        console.log('\n❌ OTHER DATABASE ERROR:');
        console.log('Error details:', error);
      }
    } else {
      console.log('\n✅ SUCCESS!');
      console.log('Profile views table is accessible - no infinite recursion detected.');
      console.log('The policy issue appears to be resolved.');
      
      if (data && data.length > 0) {
        console.log(`Found ${data.length} profile view record(s).`);
      } else {
        console.log('No profile view records found (table is empty).');
      }
    }
    
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR:', error);
    console.log('\n🔧 MANUAL FIX REQUIRED:');
    console.log('Run this SQL in Supabase SQL Editor:');
    console.log('DROP POLICY IF EXISTS "Admins can view all profile views" ON profile_views;');
  }
}

fixAdminPolicyRecursion();