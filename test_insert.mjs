const supabaseUrl = "https://zxamlpfvggvoynhssbzd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YW1scGZ2Z2d2b3luaHNzYnpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTcxNDYsImV4cCI6MjA5NzQ3MzE0Nn0.ooXFK1txYdWUhuW9KQ7ekXRDFCwI8YXmdXllC2nsMO4";

async function testInsert() {
  const newOrder = {
    id: `ORD-${Date.now()}`,
    username: 'testuser',
    timestamp: new Date().toISOString(),
    status: 'Pending',
    title: 'Test Order',
    price: 100,
    profit: 5,
    type: 'gear'
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/cb_orders`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(newOrder)
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

testInsert();
