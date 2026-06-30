import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: users } = await supabase.from('cb_users').select('username').limit(1);
  if (users && users.length > 0) {
    const username = users[0].username;
    console.log("Updating", username);
    const { error } = await supabase.from('cb_users').update({ online: 'Online' }).eq('username', username);
    console.log("Update error:", error);
  }
}

main();
