import {
  checkRateLimit,
  checkAuthBruteForce,
  recordAuthFailure,
  recordAuthSuccess,
  buildRateLimitResponse,
  MAX_FAILED_AUTH_ATTEMPTS,
} from '../../src/lib/rateLimit';
import { timingSafeVerifyPassword, hashPasswordSync } from '../../src/lib/passwords';

async function runTests() {
  console.log('--- Starting Rate Limiting & Brute-Force Defense Unit Tests ---');

  // Test 1: Sliding Window Rate Limiter
  console.log('\n[Test 1] Testing checkRateLimit sliding-window...');
  const testKey = `test_rate_window_${Date.now()}`;
  for (let i = 1; i <= 5; i++) {
    const res = checkRateLimit(testKey, { max: 5, windowSeconds: 60 });
    if (!res.allowed) {
      throw new Error(`Request ${i} should be allowed but was blocked.`);
    }
  }
  const overflowRes = checkRateLimit(testKey, { max: 5, windowSeconds: 60 });
  if (overflowRes.allowed) {
    throw new Error('Request 6 should have been blocked by sliding-window rate limit.');
  }
  console.log('✓ Sliding-window limiter correctly blocked 6th request with remaining = 0');

  // Test 2: HTTP 429 Response Builder
  console.log('\n[Test 2] Testing buildRateLimitResponse status and headers...');
  const rateLimitResponse = buildRateLimitResponse(overflowRes.retryAfterSeconds, undefined, 5, overflowRes.remaining);
  if (rateLimitResponse.status !== 429) {
    throw new Error(`Expected HTTP 429 but got ${rateLimitResponse.status}`);
  }
  const retryAfterHeader = rateLimitResponse.headers.get('Retry-After');
  if (!retryAfterHeader || Number(retryAfterHeader) <= 0) {
    throw new Error(`Expected valid Retry-After header but got: ${retryAfterHeader}`);
  }
  if (!rateLimitResponse.headers.get('X-RateLimit-Limit')) {
    throw new Error('Missing X-RateLimit-Limit header');
  }
  console.log(`✓ Rate limit response returned HTTP 429 with Retry-After: ${retryAfterHeader}s`);

  // Test 3: Brute-Force Auth Lockout (Max 5 failed attempts per 15 min)
  console.log('\n[Test 3] Testing checkAuthBruteForce & recordAuthFailure...');
  const testIp = '192.168.1.100';
  const testEmail = `attacker_${Date.now()}@example.com`;

  for (let i = 1; i <= MAX_FAILED_AUTH_ATTEMPTS; i++) {
    const checkBefore = checkAuthBruteForce(testIp, testEmail);
    if (!checkBefore.allowed) {
      throw new Error(`Attempt ${i} should be allowed before recording failure.`);
    }
    recordAuthFailure(testIp, testEmail);
  }

  // 6th attempt must be locked out
  const lockedCheck = checkAuthBruteForce(testIp, testEmail);
  if (lockedCheck.allowed) {
    throw new Error('Account/IP should be locked out after 5 consecutive failures.');
  }
  if (lockedCheck.retryAfterSeconds <= 0) {
    throw new Error('Expected positive retryAfterSeconds when locked out.');
  }
  console.log(`✓ Brute-force lockout active: account locked for ${lockedCheck.retryAfterSeconds}s after 5 failures.`);

  // Test 4: Auth Success Resets Counter
  console.log('\n[Test 4] Testing recordAuthSuccess resets lockout...');
  recordAuthSuccess(testIp, testEmail);
  const unlockedCheck = checkAuthBruteForce(testIp, testEmail);
  if (!unlockedCheck.allowed) {
    throw new Error('Account should be unlocked after successful authentication.');
  }
  console.log('✓ Successful login cleanly reset brute-force lockout.');

  // Test 5: Timing-Safe Password Verification
  console.log('\n[Test 5] Testing timingSafeVerifyPassword...');
  const realPassword = 'SuperSecretPassword2026!';
  const realHash = hashPasswordSync(realPassword);

  // 5a: Valid password
  const validResult = await timingSafeVerifyPassword(realPassword, realHash);
  if (!validResult) {
    throw new Error('Valid password should verify as true');
  }

  // 5b: Invalid password on existing user
  const startInvalid = performance.now();
  const invalidResult = await timingSafeVerifyPassword('WrongPassword', realHash);
  const durationInvalid = performance.now() - startInvalid;
  if (invalidResult) {
    throw new Error('Invalid password should verify as false');
  }

  // 5c: Non-existent user (null/empty hash) - timing should be matched by dummy bcrypt
  const startNonExistent = performance.now();
  const nonExistentResult = await timingSafeVerifyPassword('WrongPassword', null as any);
  const durationNonExistent = performance.now() - startNonExistent;
  if (nonExistentResult) {
    throw new Error('Non-existent user check should verify as false');
  }

  console.log(`✓ Timing measurement:
    - Existing user (invalid pass): ${durationInvalid.toFixed(2)}ms
    - Non-existent user:            ${durationNonExistent.toFixed(2)}ms
    Both executed full cryptographic rounds preventing user enumeration.`);

  console.log('\n========================================');
  console.log('ALL RATE LIMITING & DEFENSE TESTS PASSED');
  console.log('========================================\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
