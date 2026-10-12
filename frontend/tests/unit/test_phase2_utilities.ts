import { hashPassword, verifyPassword, generateStrongPassword } from '@/lib/passwords';
import { generateTotpSecret, generateCurrentTotpCode, verifyTotpCode } from '@/lib/totp';
import { recordFailedLogin, isRateLimited, resetFailedLogins, getRateLimitKey } from '@/lib/rateLimit';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';

async function testPhase2() {
  console.log('--- Testing Phase 2 Utilities ---');

  // 1. Password Hashing & Verification
  const pass = 'SuperSecret123!';
  const hash = await hashPassword(pass);
  console.log('Password hash generated:', hash.slice(0, 15) + '...');
  const isValid = await verifyPassword(pass, hash);
  const isInvalid = await verifyPassword('WrongPassword', hash);
  if (!isValid || isInvalid) throw new Error('Password verification failed');
  console.log('✓ Password hash and verify passed');

  // 2. Strong Password Generator
  const generated = generateStrongPassword(16);
  if (generated.length !== 16) throw new Error('Generated password length incorrect');
  console.log('✓ Strong password generator passed:', generated.length, 'characters');

  // 3. TOTP
  const secret = generateTotpSecret();
  const code = generateCurrentTotpCode(secret);
  const isTotpValid = verifyTotpCode(secret, code);
  const isTotpWrong = verifyTotpCode(secret, '000000');
  if (!isTotpValid || isTotpWrong) throw new Error('TOTP validation failed');
  console.log('✓ TOTP generation and verification passed');

  // 4. Rate Limiting
  const key = getRateLimitKey('127.0.0.1', 'test_user');
  resetFailedLogins(key);
  for (let i = 1; i <= 5; i++) {
    const res = recordFailedLogin(key);
    if (res.limited) throw new Error(`Should not be limited at attempt ${i}`);
  }
  const sixth = recordFailedLogin(key);
  if (!sixth.limited) throw new Error('Should be rate limited on 6th attempt');
  const check = isRateLimited(key);
  if (!check.limited) throw new Error('isRateLimited should return true');
  resetFailedLogins(key);
  console.log('✓ Rate limiting after 6 rapid failed attempts passed');

  // 5. Audit Log (Insert-Only & Redaction)
  const auditId = await logAudit({
    actorId: 'usr-admin-1',
    action: 'TEST_ACTION',
    targetType: 'USER',
    targetId: 'usr-test-1',
    ip: '127.0.0.1',
    metaJson: {
      password: 'plainTextPassword123',
      info: 'test info',
    },
  });

  const row = await queryOne<any>('SELECT * FROM audit_log WHERE id = $1', [auditId]);
  if (!row) throw new Error('Audit log row not found');
  const meta = typeof row.meta_json === 'string' ? JSON.parse(row.meta_json) : row.meta_json;
  if (meta.password !== '[REDACTED]' || meta.info !== 'test info') {
    throw new Error('Audit log failed to redact sensitive secret');
  }
  console.log('✓ Audit log insertion and redaction passed');

  console.log('--- ALL PHASE 2 TESTS PASSED SUCCESSFULLY ---');
  process.exit(0);
}

testPhase2().catch((err) => {
  console.error('Phase 2 Test Error:', err);
  process.exit(1);
});
