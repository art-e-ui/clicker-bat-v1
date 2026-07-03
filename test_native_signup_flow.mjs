import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

// 1. Create a non-persistent Supabase client
const tempSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// 2. Create the main Supabase client (acting as Admin/Owner)
const mainSupabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_native_admin_${Date.now()}@walmark-retailshop.com`;
  const password = "Password123!";

  console.log(`1. Signing up user natively using tempSupabase: ${email}`);
  const { data: signUpData, error: signUpErr } = await tempSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: "Native Admin Test",
        email_verified: true
      }
    }
  });

  if (signUpErr) {
    console.error("Native signUp failed:", signUpErr);
    return;
  }

  const userId = signUpData.user.id;
  console.log("Native signUp success! User ID:", userId);

  console.log("2. Registering admin role in public.user_roles...");
  const { error: roleErr } = await mainSupabase
    .from('user_roles')
    .insert([{ user_id: userId, role: 'admin' }]);

  if (roleErr) {
    console.error("Role assignment failed:", roleErr);
    return;
  }
  console.log("Role assigned successfully!");

  console.log("3. Inserting administrative details in public.cb_admins...");
  const { error: adminErr } = await mainSupabase
    .from('cb_admins')
    .insert([{
      id: userId,
      account_id: `AD${Math.floor(Math.random() * 90) + 10}`,
      name: "Native Admin Test",
      email,
      phone: "+1 222 333 4444",
      status: "Active"
    }]);

  if (adminErr) {
    console.error("Inserting cb_admins failed:", adminErr);
    return;
  }
  console.log("cb_admins entry created successfully!");

  console.log("4. Attempting login as the newly created native admin...");
  const { data: signInData, error: signInErr } = await tempSupabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInErr) {
    console.error("Signin failed for natively created admin:", signInErr.message);
  } else {
    console.log("Signin SUCCESS! Active Session User ID:", signInData.user.id);
  }
}

run();
