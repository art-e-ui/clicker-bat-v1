import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newUserId = "627021c4-5696-415f-913a-7f2359250411"; // The created user ID from above
  const ownerId = "3c893485-6e92-442c-85af-df660a3c3af3"; // Owner ID

  console.log("Fetching user identities for new user...");
  const { data: newIdentities, error: newErr } = await supabase.rpc('get_user_identities', { p_user_id: newUserId });
  console.log("New User Identities:", newIdentities, "Error:", newErr);

  console.log("\nFetching user identities for owner...");
  const { data: ownerIdentities, error: ownerErr } = await supabase.rpc('get_user_identities', { p_user_id: ownerId });
  console.log("Owner Identities:", ownerIdentities, "Error:", ownerErr);
}

run();
