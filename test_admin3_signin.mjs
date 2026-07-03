import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function attemptSignin(email, password) {
  console.log(`Attempting signin for ${email} with password "${password}"...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error(`Signin failed with password "${password}":`, error.message);
    return false;
  } else {
    console.log(`Signin SUCCESS with password "${password}"! User ID:`, data.user.id);
    return true;
  }
}

async function run() {
  const email = "admin3@walmark-retailshop.com";

  console.log(`Checking admin user: ${email}`);
  const { data: details, error } = await supabase.rpc('get_user_details', { p_email: email });
  console.log("Details from auth.users:", details, "Error:", error);

  if (details && details.length > 0) {
    const success1 = await attemptSignin(email, "12345678");
    if (!success1) {
      await attemptSignin(email, "admin123");
    }
  }
}

run();
