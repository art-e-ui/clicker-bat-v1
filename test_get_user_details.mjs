import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const testEmail = "rpc_admin_1783091877779@example.com"; // We will find the one we just created
  
  // Let's first search in cb_admins to get the latest admin email
  const { data: admins } = await supabase.from('cb_admins').select('*').order('created_at', { ascending: false }).limit(2);
  console.log("Recent Admins in cb_admins:", admins);

  if (admins && admins.length > 0) {
    for (const admin of admins) {
      console.log(`\nFetching auth.users details for: ${admin.email}`);
      const { data: details, error } = await supabase.rpc('get_user_details', { p_email: admin.email });
      console.log("Details:", details, "Error:", error);
    }
  }

  console.log("\nFetching auth.users details for owner: arkarnaung009@gmail.com");
  const { data: ownerDetails, error: ownerErr } = await supabase.rpc('get_user_details', { p_email: 'arkarnaung009@gmail.com' });
  console.log("Owner Details:", ownerDetails, "Error:", ownerErr);
}

run();
