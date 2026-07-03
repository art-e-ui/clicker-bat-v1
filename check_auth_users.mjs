import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching auth users...");
  // Note: we can't select from auth.users directly as anon, but we can try to sign in with each admin's email and password to verify, or run an RPC if available.
  // Let's see if we can get anything from a select on public.user_roles or similar.
  const { data: roles, error: rolesErr } = await supabase
    .from('user_roles')
    .select('*');
  console.log("user_roles rows:", roles, "Error:", rolesErr);
}

run();
