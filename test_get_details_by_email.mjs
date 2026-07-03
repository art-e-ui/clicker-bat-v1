import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Signing in as Owner...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'arkarnaung009@gmail.com',
    password: 'Aragon@1226'
  });

  if (authError) {
    console.error("Sign in failed:", authError);
    return;
  }
  
  console.log("Logged in! User ID:", authData.user.id);

  // Now let's fetch admins
  const { data: admins, error: errAdmins } = await supabase
    .from('cb_admins')
    .select('*')
    .order('created_at', { ascending: false });

  console.log("Admins in cb_admins:", admins, "Error:", errAdmins);

  if (admins && admins.length > 0) {
    const latestAdmin = admins[0];
    console.log(`\nFetching auth.users details for: ${latestAdmin.email}`);
    const { data: details, error } = await supabase.rpc('get_user_details', { p_email: latestAdmin.email });
    console.log("Details:", details, "Error:", error);
  }
}

run();
