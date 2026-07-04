import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = `test_staff_${Date.now()}@example.com`;
  const password = "Password123!";
  const staffId = `AD02SI${Date.now().toString().slice(-3)}`;
  const referralCode = `WK-TEST-${Date.now().toString().slice(-4)}`;

  console.log(`Testing create_staff_member with:
Email: ${email}
Staff ID: ${staffId}
Referral Code: ${referralCode}
`);

  const { data, error } = await supabase.rpc('create_staff_member', {
    p_email: email,
    p_password: password,
    p_name: "Test Staff Member",
    p_phone: "123456789",
    p_staff_id: staffId,
    p_admin_id: "AD02",
    p_department: "Operations",
    p_referral_code: referralCode
  });

  console.log("Response data:", data);
  console.log("Response error:", error);
}

run();
