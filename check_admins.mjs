const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

async function checkAdmins() {
  const adminRes = await fetch(`${supabaseUrl}/rest/v1/cb_admins?select=*`, { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } });
  const staffRes = await fetch(`${supabaseUrl}/rest/v1/cb_staff?select=*`, { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } });

  console.log("Admins:", await adminRes.json());
  console.log("Staff:", await staffRes.json());
}

checkAdmins();
