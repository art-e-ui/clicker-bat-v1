import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const newUserId = 'ID-' + Math.floor(10000 + Math.random() * 90000);
  const username = 'test_user_' + Date.now().toString().slice(-4);
  const email = username + '@merchant.wallmark.com';
  const phone = '1555555' + Date.now().toString().slice(-4);
  const referralCode = 'WK-TEST-AD02';

  const newUser = {
    id: newUserId,
    username: username,
    email: email,
    phone: phone,
    nickname: username,
    level: 'FREE VIP',
    rate: '$/1.0000',
    acceptance: 'Allowed',
    online: 'Online',
    balance: 0.00,
    frozen: 0.00,
    topup: 0.00,
    spent_today: 0.00,
    spent_current: 0.00,
    remaining: 10,
    withdraw: 'Enabled',
    tp_recharge: 0.00,
    be_recharge: 0.00,
    earnings: 0.00,
    commissions: 0.00,
    withdrawals: 0.00,
    invite_code: 'WK-INV-' + newUserId,
    subs: 0,
    inviter: 'Staff AD02SI1',
    referred_by_staff_id: 'AD02SI1',
    member_of_admin_id: 'AD02',
    referral_id: referralCode,
    invited_by_user_id: '',
    l1_agent: 'Staff AD02',
    l2_agent: 'AD02',
    ip: '192.168.1.50',
    reg_time: new Date().toISOString(),
    password: 'Password123!',
    password_plain: 'Password123!'
  };

  console.log("Trying to insert new user into cb_users...");
  const { data, error } = await supabase
    .from('cb_users')
    .insert([newUser])
    .select();

  console.log("Response data:", data);
  console.log("Response error:", error);
}

run();
