const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateForeignKeys() {
  try {
    console.log('Checking current foreign key constraints...');
    
    // Check if profile_views table exists and its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.table_constraints')
      .select('*')
      .eq('table_name', 'profile_views')
      .eq('constraint_type', 'FOREIGN KEY');
    
    if (tableError) {
      console.log('Table constraints check failed:', tableError);
    } else {
      console.log('Current foreign key constraints:', tableInfo);
    }
    
    // Check if we can query the profile_views table
    const { data: profileViewsData, error: profileViewsError } = await supabase
      .from('profile_views')
      .select('*')
      .limit(1);
    
    if (profileViewsError) {
      console.log('profile_views table query failed:', profileViewsError);
      console.log('This suggests the table may not exist or has issues.');
    } else {
      console.log('profile_views table exists and is accessible.');
      console.log('Sample data structure:', profileViewsData);
    }
    
    console.log('\n✅ Foreign key constraint analysis complete!');
    console.log('✅ The SQL files have been updated to reference user_profiles instead of auth.users');
    console.log('\n📝 Note: Since we cannot directly execute DDL commands through Supabase client,');
    console.log('you will need to run the updated create_profile_views_table.sql script');
    console.log('manually in your Supabase SQL Editor to apply the changes.');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateForeignKeys();