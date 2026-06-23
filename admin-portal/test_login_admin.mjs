import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  const { data, error } = await supabase.from('cb_admins').select('*').eq('email', 'admin@walmart.com');
  console.log("Admin in DB:", data);
}

checkUser();
