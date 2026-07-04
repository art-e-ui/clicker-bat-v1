import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function run() {
  console.log("1. Signing in as Owner (arkarnaung009@gmail.com)...");
  const { data: ownerAuth, error: ownerErr } = await supabase.auth.signInWithPassword({
    email: 'arkarnaung009@gmail.com',
    password: 'Aragon@1226'
  });

  if (ownerErr) {
    console.error("Owner Sign-in failed:", ownerErr.message);
    return;
  }
  console.log("Owner Sign-in success! User ID:", ownerAuth.user.id);

  // Use the authenticated owner client for further queries
  const ownerClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  await ownerClient.auth.setSession({
    access_token: ownerAuth.session.access_token,
    refresh_token: ownerAuth.session.refresh_token
  });

  console.log("2. Fetching list of admins as Owner...");
  const { data: admins, error: adminsErr } = await ownerClient
    .from('cb_admins')
    .select('*')
    .order('created_at', { ascending: true });

  if (adminsErr) {
    console.error("Failed to fetch admins:", adminsErr.message);
    return;
  }
  console.log("Current cb_admins in database:", admins);

  // Let's create a temporary admin to test deletion
  const testEmail = `temp_del_admin_${Date.now()}@example.com`;
  const testPass = "Password123!";
  const testId = `AD${Math.floor(10 + Math.random() * 89)}`;

  console.log(`\n3. Creating temporary admin node: ${testEmail} (${testId})...`);
  const { data: newAdminId, error: createErr } = await ownerClient.rpc('create_admin_member', {
    p_email: testEmail,
    p_password: testPass,
    p_name: "Temp Deletion Admin",
    p_phone: "555-555-5555",
    p_account_id: testId
  });

  if (createErr) {
    console.error("Failed to create test admin:", createErr);
    return;
  }
  console.log("Test admin created successfully! ID:", newAdminId);

  // Now let's try to delete this newly created admin
  console.log(`\n4. Trying to delete admin with ID: ${newAdminId} from public.cb_admins...`);
  const { error: deleteErr } = await ownerClient
    .from('cb_admins')
    .delete()
    .eq('id', newAdminId);

  if (deleteErr) {
    console.error("DELETE from cb_admins failed:", deleteErr.message, deleteErr);
  } else {
    console.log("DELETE from cb_admins succeeded!");
  }

  console.log(`\n5. Trying to delete user role from public.user_roles...`);
  const { error: roleErr } = await ownerClient
    .from('user_roles')
    .delete()
    .eq('user_id', newAdminId);

  if (roleErr) {
    console.error("DELETE from user_roles failed:", roleErr.message, roleErr);
  } else {
    console.log("DELETE from user_roles succeeded!");
  }

  console.log(`\n6. Trying to delete from auth.users via public.delete_auth_user...`);
  const { data: rpcRes, error: rpcErr } = await ownerClient.rpc('delete_auth_user', { p_user_id: newAdminId });
  if (rpcErr) {
    console.error("RPC delete_auth_user failed:", rpcErr.message, rpcErr);
  } else {
    console.log("RPC delete_auth_user succeeded! Result:", rpcRes);
  }
}

run();
