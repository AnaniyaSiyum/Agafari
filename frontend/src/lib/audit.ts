import crypto from 'crypto';
import { query } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

// -----------------------------------------------------------------------------
// 1. Audit Logger Types
// -----------------------------------------------------------------------------

export type AuditOperation = 'CREATE' | 'READ_SENSITIVE' | 'UPDATE' | 'DELETE';
export type AuditOutcome = 'SUCCESS' | 'FAILURE' | 'DENIED';

export interface AuditEventInput {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  targetResource: string; // e.g. 'USER', 'ROLE_ASSIGNMENT', 'PASSWORD', 'TENANT', 'EVENT', 'INVITATION_EXPORT', 'ACCOUNT_REQUEST', 'SESSION'
  targetId?: string | null;
  operation: AuditOperation;
  action: string; // Specific action verb, e.g. 'USER_CREATED', 'ROLE_ASSIGNED', 'PASSWORD_RESET', 'TENANT_DELETED'
  clientIp?: string | null;
  userAgent?: string | null;
  outcome: AuditOutcome;
  details?: Record<string, any> | null;
  req?: Request | null; // Optional NextRequest to auto-extract IP & User-Agent
}

export interface StoredAuditEvent {
  id: string;
  timestamp: string; // ISO 8601 UTC
  actorId: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  targetResource: string;
  targetId: string | null;
  operation: AuditOperation;
  action: string;
  clientIp: string;
  userAgent: string;
  outcome: AuditOutcome;
  details: Record<string, any> | null;
}

// Backward-compatible interface for legacy callers
export interface AuditParams {
  actorId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ip?: string | null;
  metaJson?: Record<string, any> | null;
  operation?: AuditOperation;
  outcome?: AuditOutcome;
  userAgent?: string | null;
}

// -----------------------------------------------------------------------------
// 2. Strict Log Sanitization Engine
// -----------------------------------------------------------------------------

const FORBIDDEN_KEY_PATTERNS = [
  'password',
  'passwd',
  'pwd',
  'secret',
  'token',
  'totp',
  'jwt',
  'hash',
  'salt',
  'bearer',
  'auth',
  'signingsecret',
  'privatekey',
  'credential',
  'creditcard',
  'cardnumber',
  'cvv',
  'cvc',
  'pan',
  'accountnumber',
  'iban',
  'ssn',
  'nationalid',
];

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return FORBIDDEN_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

// Regex for credit card PANs (13-19 digits, optional dashes/spaces)
const CREDIT_CARD_REGEX = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b(?:\d{4}[ -]?){2}\d{5,8}\b/g;

// Regex for Bearer tokens or JWTs (header.payload.signature)
const JWT_OR_BEARER_REGEX = /\b(?:Bearer\s+)?[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g;

// Regex for API Keys (e.g. sk_live_..., ghp_..., xoxb-...)
const API_KEY_REGEX = /\b(?:sk_(?:live|test)_[0-9a-zA-Z]{20,}|ghp_[0-9a-zA-Z]{30,}|xoxb-[0-9a-zA-Z-]+)\b/g;

// Regex for inline key=value credentials in query strings or free-form text
const INLINE_CREDENTIAL_REGEX = /(password|passwd|secret|token|apiKey|api_key)=([^&\s]+)/gi;

// Regex for masking email addresses (PII)
const EMAIL_PII_REGEX = /\b([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b/g;

// Regex for masking phone numbers (PII)
const PHONE_PII_REGEX = /\b(\+?\d{1,4})[ -]?\d{2,4}[ -]?\d{2,4}[ -]?(\d{2,4})\b/g;

/**
 * Scrubs freeform string values for sensitive secrets, credit cards, tokens, and PII.
 */
export function sanitizeStringContent(text: string, maskPii: boolean = true): string {
  if (!text || typeof text !== 'string') return text;

  let cleaned = text;

  // 1. Scrub credit card numbers
  cleaned = cleaned.replace(CREDIT_CARD_REGEX, '[REDACTED_CARD]');

  // 2. Scrub JWTs and Bearer tokens
  cleaned = cleaned.replace(JWT_OR_BEARER_REGEX, '[REDACTED_JWT]');

  // 3. Scrub API Keys
  cleaned = cleaned.replace(API_KEY_REGEX, '[REDACTED_TOKEN]');

  // 4. Scrub inline credentials
  cleaned = cleaned.replace(INLINE_CREDENTIAL_REGEX, '$1=[REDACTED]');

  // 5. Mask PII if requested (email and phone)
  if (maskPii) {
    cleaned = cleaned.replace(EMAIL_PII_REGEX, '$1***@$2');
    cleaned = cleaned.replace(PHONE_PII_REGEX, '$1***$2');
  }

  return cleaned;
}

/**
 * Deeply and recursively sanitizes an arbitrary payload, scrubbing sensitive keys
 * and pattern-matching values. Handles circular references safely.
 */
export function sanitizeAuditPayload<T>(input: T, maskPii: boolean = true): T {
  const seen = new WeakSet<object>();

  function walk(value: any, keyName?: string): any {
    if (value === null || value === undefined) return value;

    // 1. Leaf Primitives
    if (typeof value !== 'object') {
      if (keyName && isSensitiveKey(keyName)) {
        return '[REDACTED]';
      }
      if (typeof value === 'string') {
        return sanitizeStringContent(value, maskPii);
      }
      return value;
    }

    // 2. Circular Reference Guard
    if (seen.has(value)) {
      return '[CIRCULAR]';
    }
    seen.add(value);

    // 3. Arrays
    if (Array.isArray(value)) {
      return value.map((item) => walk(item, keyName));
    }

    // 4. Objects (Recurse to inspect and sanitize child fields)
    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = walk(v, k);
    }
    return result;
  }

  return walk(input);
}

// -----------------------------------------------------------------------------
// 3. Request Header Extraction Helpers
// -----------------------------------------------------------------------------

export function extractClientIp(req?: Request | null): string {
  if (!req || !('headers' in req) || typeof req.headers?.get !== 'function') {
    return '127.0.0.1';
  }

  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
}

export function extractUserAgent(req?: Request | null): string {
  if (!req || !('headers' in req) || typeof req.headers?.get !== 'function') {
    return 'unknown';
  }
  return req.headers.get('user-agent')?.trim() || 'unknown';
}

// -----------------------------------------------------------------------------
// 4. Centralized Structured Audit Logging Service
// -----------------------------------------------------------------------------

/**
 * Records an immutable audit log entry for security-critical operations.
 * Enforces ISO 8601 UTC timestamps, authenticated principal tracking,
 * operation classification, outcome status, client IP / user-agent, and
 * strict multi-tier payload sanitization.
 */
export async function logAuditEvent(event: AuditEventInput): Promise<StoredAuditEvent> {
  const id = `aud-${crypto.randomUUID()}`;
  const timestamp = new Date().toISOString(); // ISO 8601 UTC

  // Auto-extract IP and User-Agent if request object was provided
  const clientIp = event.clientIp || extractClientIp(event.req);
  const userAgent = event.userAgent || extractUserAgent(event.req);

  // Deeply sanitize metadata details
  const safeDetails = event.details ? sanitizeAuditPayload(event.details) : null;

  // Mask actor email if present
  const safeActorEmail = event.actorEmail ? sanitizeStringContent(event.actorEmail) : null;

  const storedEvent: StoredAuditEvent = {
    id,
    timestamp,
    actorId: event.actorId || null,
    actorEmail: safeActorEmail,
    actorRole: event.actorRole || null,
    targetResource: event.targetResource.trim().toUpperCase(),
    targetId: event.targetId || null,
    operation: event.operation,
    action: event.action.trim().toUpperCase(),
    clientIp,
    userAgent,
    outcome: event.outcome,
    details: safeDetails,
  };

  const metaJsonString = JSON.stringify({
    operation: storedEvent.operation,
    outcome: storedEvent.outcome,
    userAgent: storedEvent.userAgent,
    timestamp: storedEvent.timestamp,
    actorEmail: storedEvent.actorEmail,
    actorRole: storedEvent.actorRole,
    ...(storedEvent.details || {}),
  });

  // Helper with fast timeout for DB persistence
  const withTimeout = (promise: Promise<any>, ms: number = 800) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB operation timed out')), ms)),
    ]);

  // 1. Persist to MySQL audit_log table
  try {
    await withTimeout(
      query(
        `INSERT INTO audit_log (id, actor_id, action, target_type, target_id, ip, meta_json, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          storedEvent.id,
          storedEvent.actorId,
          storedEvent.action,
          storedEvent.targetResource,
          storedEvent.targetId,
          storedEvent.clientIp,
          metaJsonString,
          storedEvent.timestamp,
        ]
      )
    );
  } catch (err) {
    // Tolerant of unmigrated local environments
  }

  // 2. Also write to audit_logs (table from migration 005) for unified backward compatibility
  try {
    await withTimeout(
      query(
        `INSERT INTO audit_logs (id, actor_id, target_user_id, action, ip_address, details, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          storedEvent.id,
          storedEvent.actorId,
          storedEvent.targetId,
          storedEvent.action,
          storedEvent.clientIp,
          metaJsonString,
          storedEvent.timestamp,
        ]
      )
    );
  } catch (err) {
    // Tolerant of unmigrated local environments
  }

  // 3. Keep in-memory mockStore in sync for tests and offline development
  if (!(mockStore as any).auditLogs) {
    (mockStore as any).auditLogs = [];
  }
  (mockStore as any).auditLogs.unshift(storedEvent);

  return storedEvent;
}

// -----------------------------------------------------------------------------
// 5. Backward Compatibility Wrappers
// -----------------------------------------------------------------------------

/**
 * Backward-compatible logAudit matching the previous signature while using the
 * new structured engine under the hood.
 */
export async function logAudit(params: AuditParams): Promise<string> {
  const operation: AuditOperation =
    params.operation ||
    (params.action.includes('CREATE') || params.action.includes('POST')
      ? 'CREATE'
      : params.action.includes('DELETE') || params.action.includes('RESET')
      ? 'DELETE'
      : params.action.includes('READ') || params.action.includes('EXPORT') || params.action.includes('VIEW')
      ? 'READ_SENSITIVE'
      : 'UPDATE');

  const outcome: AuditOutcome =
    params.outcome ||
    (params.action.includes('FAIL') || params.action.includes('BLOCKED')
      ? 'FAILURE'
      : params.action.includes('DENIED')
      ? 'DENIED'
      : 'SUCCESS');

  const event = await logAuditEvent({
    actorId: params.actorId,
    targetResource: params.targetType || 'SYSTEM',
    targetId: params.targetId,
    operation,
    action: params.action,
    clientIp: params.ip,
    userAgent: params.userAgent,
    outcome,
    details: params.metaJson,
  });

  return event.id;
}
