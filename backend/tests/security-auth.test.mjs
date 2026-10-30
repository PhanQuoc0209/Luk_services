import test from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode('luk_jwt_secret_super_secure_random_key_testing_only_123');

async function signTestToken(user) {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);
}

async function verifyTestToken(token) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

function checkAdminRole(user) {
  if (!user || user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN_ADMIN_ONLY');
  }
  return true;
}

test('Security & Auth: Password hashing and comparison', async () => {
  const plain = 'AdminLuk@2026!';
  const hash = await bcrypt.hash(plain, 10);

  const isMatch = await bcrypt.compare(plain, hash);
  assert.equal(isMatch, true, 'Correct password should match hash');

  const isWrong = await bcrypt.compare('WrongPassword!', hash);
  assert.equal(isWrong, false, 'Wrong password should fail');
});

test('Security & Auth: JWT signing and verification', async () => {
  const user = { id: 'u_1', email: 'admin@lukglobal.vn', name: 'Admin LUK', role: 'ADMIN' };
  const token = await signTestToken(user);
  assert.ok(typeof token === 'string' && token.length > 20);

  const payload = await verifyTestToken(token);
  assert.equal(payload.id, user.id);
  assert.equal(payload.email, user.email);
  assert.equal(payload.role, 'ADMIN');
});

test('Security & Auth: Server-side Admin authorization guard blocks non-admins', async () => {
  const regularUser = { id: 'u_2', email: 'student@lukglobal.vn', name: 'Student', role: 'USER' };
  assert.throws(
    () => checkAdminRole(regularUser),
    /FORBIDDEN_ADMIN_ONLY/,
    'Regular user must not pass admin check'
  );

  const adminUser = { id: 'u_1', email: 'admin@lukglobal.vn', name: 'Admin', role: 'ADMIN' };
  assert.doesNotThrow(() => checkAdminRole(adminUser));
});
