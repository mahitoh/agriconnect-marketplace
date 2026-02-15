// One-time script to add the 'suspended' column to profiles table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  console.log('Adding "suspended" column to profiles table...');

  const { error } = await supabaseAdmin.rpc('exec_sql', {
    query: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;`
  });

  if (error) {
    // If RPC doesn't exist, try a different approach
    console.log('RPC not available, trying direct approach...');
    
    // Try updating a row to see if column exists
    const { data, error: testError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Cannot access profiles table:', testError.message);
      process.exit(1);
    }

    console.log('\n⚠️  Cannot run ALTER TABLE via Supabase JS client.');
    console.log('Please run this SQL in your Supabase Dashboard > SQL Editor:\n');
    console.log('─'.repeat(60));
    console.log(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;`);
    console.log(`CREATE INDEX IF NOT EXISTS idx_profiles_suspended ON profiles(suspended);`);
    console.log('─'.repeat(60));
    console.log('\nGo to: https://supabase.com/dashboard → Your Project → SQL Editor');
    process.exit(0);
  }

  console.log('✅ Migration completed successfully!');
}

runMigration();
