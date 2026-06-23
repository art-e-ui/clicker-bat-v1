import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('cb_orders').select('*').limit(1);
  console.log(error);
  const { data: cols } = await supabase.rpc('get_schema');
  console.log(cols);
}
check();
