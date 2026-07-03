import bcrypt from 'bcryptjs';

async function verify() {
  const password = "12345678";
  const hash = "$2a$10$IxUXH5MMk0MC2UP6hOH0keSOmR4uQqK7Hzqzlsd0YUXKXHi3v.anu";
  
  const matches = await bcrypt.compare(password, hash);
  console.log(`Does '${password}' match hash?`, matches);
}

verify();
