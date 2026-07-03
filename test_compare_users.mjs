import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const nativeEmail = "native_user_1783094769460@example.com";
  const customEmail = "admin3@walmark-retailshop.com";

  console.log("Checking columns of native user:");
  const { data: nat, error: natErr } = await supabase.rpc('get_user_details', { p_email: nativeEmail });
  console.log(nat, natErr);

  console.log("Checking columns of custom user:");
  const { data: cust, error: custErr } = await supabase.rpc('get_user_details', { p_email: customEmail });
  console.log(cust, custErr);
}

run();
