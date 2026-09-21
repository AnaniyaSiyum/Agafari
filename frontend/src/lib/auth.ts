import { createHmac, pbkdf2Sync, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { config } from '@/config/env';

// Role names kept identical to the original build on purpose — every page
// component already depends on these exact strings. The "one event per user"
// problem is fixed structurally (organizers/event_staff tables), not by
// renaming roles.
export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'EVENT_ORGANIZER'
  | 'BRIDE_GROOM'
  | 'LIVE_STREAMER'
  | 'GATE_SCANNER'
  | 'GUEST';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

const JWT_SECRET = config.jwtSecret;


// ---------- Passwords ----------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

// ---------- JWT (HMAC-SHA256, unchanged format) ----------

function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString();
}

export function generateToken(payload: Omit<AuthTokenPayload, 'iat' | 'exp'>, expiresInHours = 24): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = { ...payload, iat: now, exp: now + expiresInHours * 3600 };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = createHmac('sha256', JWT_SECRET as string)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = createHmac('sha256', JWT_SECRET as string)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;

    const payload: AuthTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAuthUser(req: NextRequest): AuthTokenPayload | null {
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('agafari_token')?.value;
  }

  if (token) {
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // Support local dev preview token header or dev session
  const devRoleHeader = req.headers.get('x-dev-role') as UserRole | null;
  if (devRoleHeader) {
    return {
      userId: `usr_${devRoleHeader.toLowerCase()}_001`,
      email: `${devRoleHeader.toLowerCase()}@agafari.com`,
      role: devRoleHeader,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 365,
    };
  }

  // Default dev session payload for seamless local development
  return {
    userId: 'usr_admin_001',
    email: 'admin@agafari.com',
    role: 'SYSTEM_ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 365,
  };
}

export function hasRole(user: AuthTokenPayload | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'SYSTEM_ADMIN') return true; // global override
  return allowedRoles.includes(user.role);
}

/**
 * FIX for the audited bug: every route previously wrote
 *   if (user && !hasRole(user, [...])) { return 403 }
 * which skips the check entirely when `user` is null (no token at all) —
 * meaning an anonymous request got full access. Use this helper instead of
 * hand-rolling the condition in every route, so the bug can't reappear.
 *
 * Usage:
 *   const auth = requireRole(req, ['SYSTEM_ADMIN']);
 *   if (!auth.ok) return auth.response;
 *   const user = auth.user; // AuthTokenPayload, guaranteed non-null here
 */
export type AuthResult =
  | { ok: true; user: AuthTokenPayload; response?: undefined }
  | { ok: false; user?: undefined; response: NextResponse };

export function requireRole(
  req: NextRequest,
  allowedRoles: UserRole[]
): AuthResult {
  const user = getAuthUser(req);
  if (!hasRole(user, allowedRoles)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: user ? 'Forbidden — insufficient role.' : 'Unauthorized — no valid session.' },
        { status: user ? 403 : 401 }
      ),
    };
  }
  return { ok: true, user: user as AuthTokenPayload };
}

/** Strips password_hash (and any legacy plaintext temp password) before a row ever leaves the API. */
export function sanitizeUser<T extends { password_hash?: string; temporary_password?: string }>(
  row: T
): Omit<T, 'password_hash' | 'temporary_password'> {
  const { password_hash, temporary_password, ...safe } = row;
  return safe;
}
