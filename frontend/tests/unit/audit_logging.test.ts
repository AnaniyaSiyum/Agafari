import {
  logAuditEvent,
  logAudit,
  sanitizeAuditPayload,
  sanitizeStringContent,
  AuditEventInput,
} from '../../src/lib/audit';
import { mockStore } from '../../src/lib/mockData';

async function runAuditTests() {
  console.log('--- Starting Structured Audit Logging & Sanitization Unit Tests ---\n');

  // =========================================================================
  // Test 1: Forbidden Key Names Sanitization (Deep & Recursive)
  // =========================================================================
  console.log('[Test 1] Testing recursive forbidden key redaction...');
  const sensitiveObject = {
    userId: 'usr-123',
    action: 'USER_REGISTER',
    credentials: {
      password: 'PlaintextPassword123!',
      confirmPassword: 'PlaintextPassword123!',
      totpSecret: 'JBSWY3DPEHPK3PXP',
      jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.testSignature123456789',
      apiKey: 'sk_live_99887766554433221100',
    },
    paymentInfo: {
      creditCard: '4111-2222-3333-4444',
      cvv: '123',
      accountNumber: '9876543210',
    },
    metadata: [
      { key: 'sessionToken', token: 'bearer-secret-token' },
      { key: 'normalInfo', value: 'regular-data' },
    ],
  };

  const sanitized = sanitizeAuditPayload(sensitiveObject, false);

  if (sanitized.credentials.password !== '[REDACTED]') {
    throw new Error(`Expected password to be [REDACTED], got: ${sanitized.credentials.password}`);
  }
  if (sanitized.credentials.totpSecret !== '[REDACTED]') {
    throw new Error(`Expected totpSecret to be [REDACTED], got: ${sanitized.credentials.totpSecret}`);
  }
  if (sanitized.credentials.jwtToken !== '[REDACTED]') {
    throw new Error(`Expected jwtToken to be [REDACTED], got: ${sanitized.credentials.jwtToken}`);
  }
  if (sanitized.paymentInfo.creditCard !== '[REDACTED]') {
    throw new Error(`Expected creditCard to be [REDACTED], got: ${sanitized.paymentInfo.creditCard}`);
  }
  if (sanitized.paymentInfo.cvv !== '[REDACTED]') {
    throw new Error(`Expected cvv to be [REDACTED], got: ${sanitized.paymentInfo.cvv}`);
  }
  if (sanitized.metadata[0].token !== '[REDACTED]') {
    throw new Error(`Expected nested array token to be [REDACTED], got: ${sanitized.metadata[0].token}`);
  }
  if (sanitized.metadata[1].value !== 'regular-data') {
    throw new Error(`Non-sensitive field was corrupted: ${sanitized.metadata[1].value}`);
  }
  console.log('✓ All forbidden keys (passwords, secrets, tokens, cards, CVVs) redacted recursively.');

  // =========================================================================
  // Test 2: Freeform String Content Regex Scrubbing
  // =========================================================================
  console.log('\n[Test 2] Testing regex value scrubbing on unstructured strings...');
  
  // 2a. Credit Card in freeform note
  const cardString = 'User submitted order note with card 4111 2222 3333 4444 for billing';
  const scrubbedCard = sanitizeStringContent(cardString, false);
  if (scrubbedCard.includes('4111 2222 3333 4444')) {
    throw new Error(`Credit card number was not scrubbed: ${scrubbedCard}`);
  }
  if (!scrubbedCard.includes('[REDACTED_CARD]')) {
    throw new Error(`Expected [REDACTED_CARD] in output: ${scrubbedCard}`);
  }
  console.log('✓ Credit card PAN in unstructured string scrubbed to [REDACTED_CARD].');

  // 2b. JWT / Bearer Token in freeform text
  const jwtString = 'Header was Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIn0.signatureExampleSecretKey12345';
  const scrubbedJwt = sanitizeStringContent(jwtString, false);
  if (scrubbedJwt.includes('signatureExampleSecretKey12345')) {
    throw new Error(`JWT signature was not scrubbed: ${scrubbedJwt}`);
  }
  if (!scrubbedJwt.includes('[REDACTED_JWT]')) {
    throw new Error(`Expected [REDACTED_JWT] in output: ${scrubbedJwt}`);
  }
  console.log('✓ JWT / Bearer token in freeform string scrubbed to [REDACTED_JWT].');

  // 2c. Inline credentials (e.g. key=value)
  const inlineQuery = 'Failed redirect to https://agafari.com/auth?password=supersecretpassword99&user=admin';
  const scrubbedInline = sanitizeStringContent(inlineQuery, false);
  if (scrubbedInline.includes('supersecretpassword99')) {
    throw new Error(`Inline password was not scrubbed: ${scrubbedInline}`);
  }
  console.log('✓ Inline password=... in query fragment scrubbed.');

  // 2d. PII Masking (Email and Phone)
  const piiString = 'Contact customer support at support-team@agafari.com or phone +251911223344';
  const scrubbedPii = sanitizeStringContent(piiString, true);
  if (scrubbedPii.includes('support-team@agafari.com')) {
    throw new Error(`Email PII was not masked: ${scrubbedPii}`);
  }
  if (scrubbedPii.includes('911223344')) {
    throw new Error(`Phone PII was not masked: ${scrubbedPii}`);
  }
  console.log(`✓ Email and phone PII masked safely: "${scrubbedPii}"`);

  // =========================================================================
  // Test 3: Circular Reference Safety & Immutability
  // =========================================================================
  console.log('\n[Test 3] Testing circular reference handling and immutability...');
  const circularObj: any = { name: 'Tenant A', id: 'tenant-1' };
  circularObj.self = circularObj;

  const originalBefore = { ...sensitiveObject };
  const safeCircular = sanitizeAuditPayload(circularObj);
  if (safeCircular.self !== '[CIRCULAR]') {
    throw new Error(`Expected circular reference to be '[CIRCULAR]', got: ${safeCircular.self}`);
  }
  // Check original was not mutated
  if (sensitiveObject.credentials.password !== 'PlaintextPassword123!') {
    throw new Error('Original input object was mutated by sanitization!');
  }
  console.log('✓ Circular references handled safely without infinite loops or stack overflow.');
  console.log('✓ Input objects remain strictly immutable.');

  // =========================================================================
  // Test 4: Structured Audit Event Recording & Accurate Field Population
  // =========================================================================
  console.log('\n[Test 4] Testing structured logAuditEvent execution and storage...');
  const eventInput: AuditEventInput = {
    actorId: 'usr-admin-1',
    actorEmail: 'admin@agafari.com',
    actorRole: 'SYSTEM_ADMIN',
    targetResource: 'ROLE_ASSIGNMENT',
    targetId: 'usr-target-888',
    operation: 'UPDATE',
    action: 'ROLE_ASSIGNMENT_CHANGED',
    clientIp: '198.51.100.42',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AgafariAuditTest/1.0',
    outcome: 'SUCCESS',
    details: {
      previousRole: 'GUEST',
      assignedRole: 'EVENT_ORGANIZER',
      temporaryPassword: 'plaintext-should-be-scrubbed-1234',
      tokenNote: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.secretSignatureKey12345678',
      requestedBy: 'admin@agafari.com',
    },
  };

  const stored = await logAuditEvent(eventInput);

  // 4a. Validate ID and Timestamp
  if (!stored.id.startsWith('aud-')) {
    throw new Error(`Invalid audit event ID format: ${stored.id}`);
  }
  const eventDate = new Date(stored.timestamp);
  if (isNaN(eventDate.getTime())) {
    throw new Error(`Invalid ISO 8601 UTC timestamp: ${stored.timestamp}`);
  }
  // Check ISO 8601 UTC formatting ends with Z or has valid date
  if (!stored.timestamp.includes('T')) {
    throw new Error(`Timestamp is not standard ISO 8601 format: ${stored.timestamp}`);
  }

  // 4b. Validate Principal, Target, Operation & Outcome
  if (stored.actorId !== 'usr-admin-1') throw new Error(`Incorrect actorId: ${stored.actorId}`);
  if (stored.targetResource !== 'ROLE_ASSIGNMENT') throw new Error(`Incorrect targetResource: ${stored.targetResource}`);
  if (stored.targetId !== 'usr-target-888') throw new Error(`Incorrect targetId: ${stored.targetId}`);
  if (stored.operation !== 'UPDATE') throw new Error(`Incorrect operation: ${stored.operation}`);
  if (stored.action !== 'ROLE_ASSIGNMENT_CHANGED') throw new Error(`Incorrect action: ${stored.action}`);
  if (stored.outcome !== 'SUCCESS') throw new Error(`Incorrect outcome: ${stored.outcome}`);
  if (stored.clientIp !== '198.51.100.42') throw new Error(`Incorrect clientIp: ${stored.clientIp}`);
  if (!stored.userAgent.includes('AgafariAuditTest')) throw new Error(`Incorrect userAgent: ${stored.userAgent}`);

  // 4c. Validate that details inside stored audit log were scrubbed
  if (stored.details?.temporaryPassword !== '[REDACTED]') {
    throw new Error(`Audit event details leaked plaintext password: ${stored.details?.temporaryPassword}`);
  }
  if (stored.details?.tokenNote?.includes('secretSignatureKey12345678')) {
    throw new Error('Audit event details leaked bearer token signature!');
  }
  console.log(`✓ Audit event [${stored.id}] correctly generated:
    - Operation: ${stored.operation}
    - Action: ${stored.action}
    - Target: ${stored.targetResource}:${stored.targetId}
    - Outcome: ${stored.outcome}
    - Client: ${stored.clientIp} (${stored.userAgent})
    - ISO Timestamp: ${stored.timestamp}
    - Sensitive details scrubbed: temporaryPassword = "${stored.details?.temporaryPassword}"`);

  // =========================================================================
  // Test 5: In-Memory Sync & Backward-Compatibility Wrapper
  // =========================================================================
  console.log('\n[Test 5] Testing backward compatibility wrapper and mockStore sync...');
  const legacyId = await logAudit({
    actorId: 'usr-couple-2',
    action: 'TENANT_DELETED',
    targetType: 'TENANT',
    targetId: 'evt-test-99',
    ip: '10.0.0.1',
    metaJson: {
      tenantName: 'Test Wedding Event',
      secretKey: 'DoNotLogMe',
    },
  });

  if (!legacyId.startsWith('aud-')) {
    throw new Error(`Legacy logAudit returned invalid ID: ${legacyId}`);
  }

  // Verify it exists in mockStore.auditLogs
  const foundInMock = (mockStore as any).auditLogs.find((l: any) => l.id === legacyId);
  if (!foundInMock) {
    throw new Error('Audit entry was not found in mockStore.auditLogs');
  }
  if (foundInMock.operation !== 'DELETE') {
    throw new Error(`Expected operation to be mapped to DELETE, got: ${foundInMock.operation}`);
  }
  if (foundInMock.outcome !== 'SUCCESS') {
    throw new Error(`Expected outcome to be mapped to SUCCESS, got: ${foundInMock.outcome}`);
  }
  if (foundInMock.details?.secretKey !== '[REDACTED]') {
    throw new Error(`Legacy logAudit details leaked secretKey: ${foundInMock.details?.secretKey}`);
  }
  console.log('✓ Legacy logAudit correctly mapped to structured engine with full sanitization.');

  console.log('\n======================================================');
  console.log('✅ ALL STRUCTURED AUDIT LOGGING UNIT TESTS PASSED (5/5)');
  console.log('======================================================\n');
}

runAuditTests().catch((err) => {
  console.error('Audit unit test suite failed:', err);
  process.exit(1);
});
