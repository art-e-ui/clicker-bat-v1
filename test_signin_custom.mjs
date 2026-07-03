import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `rpc_admin_${Date.now()}@example.com`;
  const password = "Password123!";
  const randomAccountId = `AD${Math.floor(10 + Math.random() * 89)}`;
  
  console.log(`1. Creating a new admin using the database function 'create_admin_member' with Account ID: ${randomAccountId}...`);
  const { data: newUserId, error: rpcError } = await supabase.rpc('create_admin_member', {
    p_email: email,
    p_password: password,
    p_name: 'Test Admin login',
    p_phone: '1234567890',
    p_account_id: randomAccountId
  });

  if (rpcError) {
    console.error("RPC creation failed:", rpcError);
    return;
  }
  console.log("Successfully created user in db. User ID:", newUserId);

  console.log("2. Attempting to sign in via Supabase auth...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error("Sign in FAILED:", authError.message, authError);
  } else {
    console.log("Sign in SUCCESS! Logged in as User ID:", authData.user.id);
  }
}

run();
