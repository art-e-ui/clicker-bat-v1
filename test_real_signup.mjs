import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `native_user_${Date.now()}@example.com`;
  const password = "Password123!";

  console.log("1. Signing up user natively via GoTrue...");
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error("Native signUp failed:", error);
    return;
  }
  console.log("Native signUp successful! User ID:", data.user.id);

  console.log("2. Fetching details via public.get_user_details RPC...");
  const { data: details, error: detailsErr } = await supabase.rpc('get_user_details', { p_email: email });
  console.log("Native User Details:", details, "Error:", detailsErr);

  console.log("3. Let's try signing in with native user to confirm...");
  const { data: signinData, error: signinErr } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (signinErr) {
    console.error("Native signin failed:", signinErr.message);
  } else {
    console.log("Native signin SUCCESS! Logged in User ID:", signinData.user.id);
  }
}

run();
