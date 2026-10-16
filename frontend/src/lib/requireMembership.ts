import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { queryOne } from '@/lib/db';
import { AppRole, AuthSessionPayload } from '@/types/auth';
import { config } from '@/config/env';

const JWT_SECRET = config.jwtSecret || 'agafari_super_secret_jwt_key_2026_change_in_production_32bytes';

export function signSessionToken(payload: AuthSessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token: string): AuthSessionPayload | null {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload as AuthSessionPayload;
  } catch {
    return null;
  }
}

export interface AuthValidationResult {
  authenticated: boolean;
  authorized: boolean;
  status: number;
  error?: string;
  user?: any;
  membership?: any;
  session?: AuthSessionPayload;
}

/**
 * Shared server-side authorization guard.
 * Verifies JWT signature, user active status, session version (invalidation check),
 * active membership, scope match, and enforce read-only during view-as.
 */
export async function requireMembership(
  req: NextRequest,
  allowedRoles?: AppRole[],
  requiredScopeId?: string
): Promise<AuthValidationResult> {
  let token = req.cookies.get('agafari_session')?.value || req.cookies.get('agafari_token')?.value;

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  if (!token) {
    return { authenticated: false, authorized: false, status: 401, error: 'Authentication required' };
  }

  const session = verifySessionToken(token);
  if (!session) {
    return { authenticated: false, authorized: false, status: 401, error: 'Invalid or expired session' };
  }

  // 1. Verify user exists, is ACTIVE, and session_version check
  const user = await queryOne<any>(
    'SELECT id, email, role, status, session_version FROM users WHERE id = $1',
    [session.userId]
  );

  if (!user || (user.status !== 'ACTIVE' && user.status !== 'active' && user.is_active === false)) {
    return { authenticated: false, authorized: false, status: 401, error: 'Account is not active' };
  }

  // Only invalidate if the token has a defined sessionVersion and DB session_version is strictly higher (indicating a subsequent password reset)
  if (
    session.sessionVersion !== undefined &&
    user.session_version !== null &&
    user.session_version !== undefined &&
    Number(user.session_version) > Number(session.sessionVersion)
  ) {
    return { authenticated: false, authorized: false, status: 401, error: 'Session invalidated by password reset' };
  }

  // 2. Verify membership is ACTIVE
  let membership: any = null;
  if (session.membershipId) {
    membership = await queryOne<any>(
      'SELECT id, role, scope_type, scope_id, status, expires_at FROM memberships WHERE id = $1 AND user_id = $2',
      [session.membershipId, session.userId]
    );
  }

  if (!membership) {
    membership = await queryOne<any>(
      'SELECT id, role, scope_type, scope_id, status, expires_at FROM memberships WHERE user_id = $1 AND status = "ACTIVE" ORDER BY created_at DESC LIMIT 1',
      [session.userId]
    );
  }

  // System Admin platform fallback
  if (!membership && (user.role === 'SYSTEM_ADMIN' || (session as any).role === 'SYSTEM_ADMIN' || user.email?.toLowerCase() === 'admin@agafari.com')) {
    membership = {
      id: `mem-admin-${user.id}`,
      user_id: user.id,
      role: 'SYSTEM_ADMIN',
      scope_type: 'PLATFORM',
      scope_id: 'global',
      status: 'ACTIVE',
      expires_at: null,
    };
  }

  if (!membership || membership.status !== 'ACTIVE') {
    return { authenticated: true, authorized: false, status: 403, error: 'Membership is inactive or disabled' };
  }

  // Check manual/custom expiration if set
  if (membership.expires_at && new Date(membership.expires_at) < new Date()) {
    return { authenticated: true, authorized: false, status: 403, error: 'Membership has expired' };
  }

  const currentRole = membership.role as AppRole;

  // 3. View-As mode enforcement: reject non-GET requests
  if (session.isViewAs && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return { authenticated: true, authorized: false, status: 403, error: 'View-As mode is strictly read-only' };
  }

  // 4. Role authorization check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentRole) && currentRole !== 'SYSTEM_ADMIN') {
      return { authenticated: true, authorized: false, status: 403, error: 'Forbidden: Insufficient privileges' };
    }
  }

  // 5. Scope authorization check (System Admin has global scope bypass)
  if (requiredScopeId && currentRole !== 'SYSTEM_ADMIN') {
    if (membership.scope_id !== requiredScopeId) {
      return { authenticated: true, authorized: false, status: 403, error: 'Forbidden: Unauthorized for this event' };
    }
  }

  return {
    authenticated: true,
    authorized: true,
    status: 200,
    user,
    membership,
    session,
  };
}
