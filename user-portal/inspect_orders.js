import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('cb_orders').select('*').limit(1);
  console.log("Error querying cb_orders:", error);
  console.log("Sample cb_orders row:", data);
  
  // Try inserting a dummy order
  const newOrder = {
    id: Date.now(),
    username: 'test_user',
    timestamp: new Date().toISOString(),
    status: 'Pending',
    title: 'Test',
    price: 100,
    profit: 10,
    type: 'gear'
  };

  const { error: insErr } = await supabase.from('cb_orders').insert([newOrder]);
  console.log("Insert Error:", insErr);
}

check();
