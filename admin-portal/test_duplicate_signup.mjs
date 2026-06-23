import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExists() {
  console.log("Testing if admin@walmart.com exists in auth.users by attempting signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@walmart.com',
    password: 'password123'
  });

  if (error) {
    console.error("Signup returned error:", error.message);
  } else {
    console.log("Signup succeeded! This means the user DID NOT EXIST in auth.users!");
  }
}

checkExists();
