#!/usr/bin/env node
require('dotenv').config({ path: './.env' });

console.log('🔍 Environment Variables Check:');
console.log('================================\n');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
console.log('\nPLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID ? '✅ SET' : '❌ NOT SET');
console.log('PLAID_SECRET:', process.env.PLAID_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('PLAID_ENV:', process.env.PLAID_ENV || 'sandbox');

console.log('\n================================');
console.log('SUPABASE_URL value:', process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 30) + '...' : 'MISSING');
console.log('SUPABASE_ANON_KEY value:', process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 30) + '...' : 'MISSING');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.log('\n❌ CRITICAL: Backend Supabase credentials are missing!');
  console.log('Check your .env file has SUPABASE_URL and SUPABASE_ANON_KEY');
} else {
  console.log('\n✅ All required environment variables are set!');
}
