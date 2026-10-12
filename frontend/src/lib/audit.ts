import crypto from 'crypto';
import { query } from '@/lib/db';

export interface AuditParams {
  actorId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  ip?: string | null;
  metaJson?: Record<string, any> | null;
}

/**
 * Redacts any potential passwords, plaintexts, or secrets from audit metadata.
 */
function sanitizeMeta(meta: Record<string, any> | null | undefined): Record<string, any> | null {
  if (!meta) return null;
  const sanitized: Record<string, any> = {};
  const forbiddenKeys = ['password', 'plaintext', 'secret', 'token', 'totp', 'totpsecret', 'hash'];

  for (const [key, value] of Object.entries(meta)) {
    if (forbiddenKeys.some((f) => key.toLowerCase().includes(f))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMeta(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * IMMUTABLE INSERT-ONLY AUDIT LOG
 * Under no circumstances does this module provide an update or delete query.
 */
export async function logAudit(params: AuditParams): Promise<string> {
  const id = `aud-${crypto.randomUUID()}`;
  const actorId = params.actorId || null;
  const action = params.action.trim().toUpperCase();
  const targetType = params.targetType || null;
  const targetId = params.targetId || null;
  const ip = params.ip || null;
  const metaClean = sanitizeMeta(params.metaJson);
  const metaJsonString = metaClean ? JSON.stringify(metaClean) : null;

  try {
    await query(
      `INSERT INTO audit_log (id, actor_id, action, target_type, target_id, ip, meta_json, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [id, actorId, action, targetType, targetId, ip, metaJsonString]
    );
  } catch (err) {
    console.error('Audit log insert failed:', err);
    throw err;
  }

  return id;
}
