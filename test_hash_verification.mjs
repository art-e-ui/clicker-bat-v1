import bcrypt from 'bcryptjs';

const password = "Password123!";
const customHash = "$2a$10$2fXIG1JmdTw5qtNKJ3CSa.BcoeoYu4QT9molVv3PI3kwjuuIsTqc.";
const nativeHash = "$2a$10$DhkR.2HqZ.iEGwgUHOarEuzRZtqZwhrYfqilMCffMecjyimX672Je";

async function verify() {
  const matchesCustom = await bcrypt.compare(password, customHash);
  console.log("Does 'Password123!' match CUSTOM hash?", matchesCustom);

  const matchesNative = await bcrypt.compare(password, nativeHash);
  console.log("Does 'Password123!' match NATIVE hash?", matchesNative);
}

verify();
