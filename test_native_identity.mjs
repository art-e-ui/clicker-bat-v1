import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const nativeUserId = "3078443c-8d78-4b6b-a65b-4f72e5c36a9c";

  console.log("Fetching user identities for native user...");
  const { data: identities, error } = await supabase.rpc('get_user_identities', { p_user_id: nativeUserId });
  console.log("Native Identities:", JSON.stringify(identities, null, 2), "Error:", error);
}

run();
