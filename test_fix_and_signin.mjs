import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

// Let's create a custom postgres function or trigger/RPC to update auth.users metadata if we can,
// or wait! We already have direct ways to update or run queries, but wait... we don't have raw SQL execution unless we define a postgres function.
// Oh, is there another reason? Let's check if we can update the sub.
// Wait, we can't update auth.users directly from supabase-js unless we have service_role, but we don't have service_role.
// However, can we create an RPC in Postgres to update it, or better, can we just fix the SQL function and then create a new user to test?
// Let's first look at how we can fix `v_user_id` being NULL during insert.
// We can assign `v_user_id := gen_random_uuid();` BEFORE the insert, and then use `v_user_id` in both the `INSERT` and any other tables!
// Yes! Let's do that!
// Wait! Let's check if there is any other difference.
// Let's check the `is_sso_user` column. Is there a column `is_sso_user` in auth.users?
// Let's fetch the columns of auth.users or check if there are other columns that native GoTrue sets.
// Actually, let's write an RPC that prints out the full row of a native user and our custom user to see all differences!
// Let's do this to be 100% sure we don't miss anything.

async function run() {
  const nativeEmail = "native_user_1783094769460@example.com";
  const customEmail = "rpc_admin_1783094701343@example.com";

  console.log("Fetching details for native user:");
  const { data: nat } = await supabase.rpc('get_user_details', { p_email: nativeEmail });
  console.log(nat);

  console.log("Fetching details for custom user:");
  const { data: cust } = await supabase.rpc('get_user_details', { p_email: customEmail });
  console.log(cust);
}

run();
