// Test script to verify Supabase authentication and RLS policies
// Run this in browser console or Node.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://znmrwfqycwlnrefksdaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpubXJ3ZnF5Y3dsbnJlZmtzZGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzkxMTYsImV4cCI6MjA3MjMxNTExNn0.KcyAzNQIYvql0ZhEYf_0GKRk_xMC_1VbntTkxUmXlc4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing Supabase connection...');
  
  // Test 1: Check if we can connect
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('✅ Connection successful');
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
  
  // Test 2: Check current user
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user ? user.id : 'No user logged in');
  
  // Test 3: Try to insert a test profile (this should fail without auth)
  if (!user) {
    console.log('No user logged in, trying to insert profile (should fail)...');
    const { data, error } = await supabase.from('user_profiles').insert({
      user_id: 'test-user-id',
      first_name: 'Test',
      last_name: 'User'
    });
    
    if (error) {
      console.log('✅ RLS working correctly - insert blocked:', error.message);
    } else {
      console.log('❌ RLS not working - insert succeeded without auth');
    }
  }
}

testAuth();
