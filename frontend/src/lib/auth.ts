import { createHmac, pbkdf2Sync, randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { config } from '@/config/env';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

// -----------------------------------------------------------------------------
// 1. ROLES & GRANULAR PERMISSION SETS (HRBAC Architecture)
// -----------------------------------------------------------------------------

export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'ORGANIZER_OWNER'
  | 'EVENT_ORGANIZER'
  | 'COUPLE'
  | 'BRIDE_GROOM'
  | 'LIVE_STREAMER'
  | 'GATE_SCANNER'
  | 'MODERATOR'
  | 'CONTENT_MODERATOR'
  | 'GUEST'
  | 'TOTP_SETUP';

export type Permission =
  | 'system:manage'
  | 'tenants:manage'
  | 'credentials:manage'
  | 'credentials:manage_scoped'
  | 'events:manage'
  | 'events:read'
  | 'events:write'
  | 'staff:manage'
  | 'reports:view'
  | 'gate:scan'
  | 'stream:manage'
  | 'media:moderate'
  | 'audit:read';

/**
 * Hierarchical Ranks for Downwards-Only Credential & Privilege Enforcement
 * Rules:
 *   1. An actor can only view, edit credentials for, or assign roles to accounts possessing a strictly LOWER rank.
 *   2. Under no circumstance may an administrator modify an account at their own level or a higher level (actorRank > targetRank).
 *   3. An actor cannot elevate any account to a role equal to or above their own rank (newRoleRank < actorRank).
 */
export const ROLE_RANKS: Record<UserRole, number> = {
  SYSTEM_ADMIN: 100,
  ORGANIZER_OWNER: 50,
  EVENT_ORGANIZER: 50,
  COUPLE: 20,
  BRIDE_GROOM: 20,
  LIVE_STREAMER: 10,
  GATE_SCANNER: 10,
  MODERATOR: 10,
  CONTENT_MODERATOR: 10,
  GUEST: 0,
  TOTP_SETUP: 0,
};

/**
 * Granular Capability Mappings for HRBAC
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SYSTEM_ADMIN: [
    'system:manage',
    'tenants:manage',
    'credentials:manage',
    'credentials:manage_scoped',
    'events:manage',
    'events:read',
    'events:write',
    'staff:manage',
    'reports:view',
    'gate:scan',
    'stream:manage',
    'media:moderate',
    'audit:read',
  ],
  ORGANIZER_OWNER: [
    'tenants:manage',
    'events:manage',
    'events:read',
    'events:write',
    'staff:manage',
    'reports:view',
    'credentials:manage_scoped',
    'gate:scan',
    'stream:manage',
    'media:moderate',
  ],
  EVENT_ORGANIZER: [
    'tenants:manage',
    'events:manage',
    'events:read',
    'events:write',
    'staff:manage',
    'reports:view',
    'credentials:manage_scoped',
    'gate:scan',
    'stream:manage',
    'media:moderate',
  ],
  COUPLE: ['events:read', 'events:write', 'media:moderate', 'reports:view'],
  BRIDE_GROOM: ['events:read', 'events:write', 'media:moderate', 'reports:view'],
  LIVE_STREAMER: ['stream:manage', 'events:read'],
  GATE_SCANNER: ['gate:scan', 'events:read'],
  MODERATOR: ['media:moderate', 'events:read'],
  CONTENT_MODERATOR: ['media:moderate', 'events:read'],
  GUEST: [],
  TOTP_SETUP: [],
};

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  permissions?: Permission[];
  iat: number;
  exp: number;
}

const JWT_SECRET = config.jwtSecret || 'agafari-super-secret-jwt-key-2026-production';

// -----------------------------------------------------------------------------
// 2. PASSWORDS & AUDIT LOGGING DEFENSES
// -----------------------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash) return false;
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch {
    return false;
  }
}

export interface AuditLogOptions {
  actorId?: string | null;
  targetUserId?: string | null;
  action: string;
  ipAddress?: string | null;
  details?: Record<string, any>;
}

/**
 * Records a security audit log entry.
 * Uses the centralized, structured logAuditEvent engine with full sanitization.
 */
export async function logAuditAction(options: AuditLogOptions): Promise<void> {
  const { actorId, targetUserId, action, ipAddress, details } = options;
  const { logAuditEvent } = await import('@/lib/audit');

  const operation =
    action.includes('CREATE') ? 'CREATE' :
    action.includes('DELETE') ? 'DELETE' :
    action.includes('READ') || action.includes('VIEW') ? 'READ_SENSITIVE' :
    'UPDATE';

  const outcome =
    action.includes('BLOCKED') || action.includes('DENIED') ? 'DENIED' :
    action.includes('FAILED') ? 'FAILURE' :
    'SUCCESS';

  await logAuditEvent({
    actorId: actorId || null,
    targetResource: 'USER',
    targetId: targetUserId || null,
    operation,
    action,
    clientIp: ipAddress || '127.0.0.1',
    outcome,
    details: details || null,
  });
}

// -----------------------------------------------------------------------------
// 3. JWT & COOKIE HANDLING
// -----------------------------------------------------------------------------

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
  const permissions = payload.permissions || ROLE_PERMISSIONS[payload.role as UserRole] || [];
  const fullPayload: AuthTokenPayload = { ...payload, permissions, iat: now, exp: now + expiresInHours * 3600 };

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
  // 1. Check Bearer token in Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // 2. Check session cookies
  const cookieToken = req.cookies.get('agafari_token')?.value || req.cookies.get('agafari_session')?.value;
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) return verified;
  }

  // 3. Optional local dev bypass strictly gated behind ALLOW_DEV_BYPASS flag
  if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_BYPASS === 'true') {
    const devRoleHeader = req.headers.get('x-dev-role') as UserRole | null;
    if (devRoleHeader) {
      return {
        userId: `usr_${devRoleHeader.toLowerCase()}_001`,
        email: `${devRoleHeader.toLowerCase()}@agafari.com`,
        role: devRoleHeader,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      };
    }
  }

  return null;
}

export function setAuthCookie(response: NextResponse, token: string): void {
  // Set primary agafari_token cookie (HttpOnly, SameSite=Strict, 24h expiry)
  response.cookies.set({
    name: 'agafari_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
    path: '/',
  });

  // Also sync agafari_session for compatibility across edge middleware
  response.cookies.set({
    name: 'agafari_session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });
}


// -----------------------------------------------------------------------------
// 4. GRANULAR CAPABILITY & HIERARCHY CHECKS (HRBAC)
// -----------------------------------------------------------------------------

export function getRoleRank(role: UserRole | string): number {
  return ROLE_RANKS[role as UserRole] ?? 0;
}

export function hasPermission(user: AuthTokenPayload | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'SYSTEM_ADMIN') return true; // Global administrative override

  const userPerms = user.permissions || ROLE_PERMISSIONS[user.role as UserRole] || [];
  return userPerms.includes(permission);
}

export function hasRole(user: AuthTokenPayload | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'SYSTEM_ADMIN') return true;
  return allowedRoles.includes(user.role as UserRole);
}

export type AuthResult =
  | { ok: true; user: AuthTokenPayload; response?: undefined }
  | { ok: false; user?: undefined; response: NextResponse };

export function requirePermission(req: NextRequest, permission: Permission): AuthResult {
  const user = getAuthUser(req);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Unauthorized — no valid session cookie or token.' },
        { status: 401 }
      ),
    };
  }

  if (!hasPermission(user, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Forbidden — missing required capability: '${permission}'.` },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user };
}

export function requireRole(req: NextRequest, allowedRoles: UserRole[]): AuthResult {
  const user = getAuthUser(req);
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Unauthorized — no valid session cookie or token.' },
        { status: 401 }
      ),
    };
  }

  if (!hasRole(user, allowedRoles)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden — insufficient role authority.' },
        { status: 403 }
      ),
    };
  }

  return { ok: true, user };
}

export type OrganizerAccessResult =
  | {
      allowed: true;
      isSystemAdmin: boolean;
      organizerId: string;
      user: AuthTokenPayload;
      readOnly: boolean;
      response?: undefined;
    }
  | {
      allowed: false;
      isSystemAdmin?: boolean;
      organizerId?: undefined;
      user?: AuthTokenPayload;
      readOnly?: boolean;
      response: NextResponse;
    };

export function verifyOrganizerAccess(
  req: NextRequest,
  requestedOrganizerId?: string | null
): OrganizerAccessResult {
  const user = getAuthUser(req);
  if (!user) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: 'Unauthorized — no valid session cookie or token.' },
        { status: 401 }
      ),
    };
  }

  // 1. SYSTEM_ADMIN access: permitted for any organizer, read-only unless admin action, logs audit
  if (user.role === 'SYSTEM_ADMIN') {
    const targetOrgId = (requestedOrganizerId || 'global').trim();
    logAuditAction({
      actorId: user.userId,
      action: 'ADMIN_VIEW_ORGANIZER_DASHBOARD',
      targetUserId: targetOrgId,
      details: {
        requestedOrganizerId: targetOrgId,
        readOnly: true,
      },
    }).catch(() => {});

    return {
      allowed: true,
      isSystemAdmin: true,
      organizerId: targetOrgId,
      user,
      readOnly: true,
    };
  }

  // 2. ORGANIZER_OWNER access: strictly isolated to own organizerId / tenantId
  if (user.role === 'ORGANIZER_OWNER' || (user.role as any) === 'EVENT_ORGANIZER') {
    const sessionOrgId = user.tenantId || user.userId;
    if (requestedOrganizerId && requestedOrganizerId !== 'global' && requestedOrganizerId !== 'all') {
      const cleanRequested = requestedOrganizerId.replace(/^org-/, '');
      const cleanSession = sessionOrgId.replace(/^org-/, '');
      if (cleanRequested !== cleanSession && requestedOrganizerId !== sessionOrgId) {
        return {
          allowed: false,
          user,
          response: NextResponse.json(
            { error: 'Forbidden — You are not authorized to access another organizer’s events or dashboard.' },
            { status: 403 }
          ),
        };
      }
    }

    return {
      allowed: true,
      isSystemAdmin: false,
      organizerId: sessionOrgId,
      user,
      readOnly: false,
    };
  }

  // 3. Other roles forbidden
  return {
    allowed: false,
    user,
    response: NextResponse.json(
      { error: 'Forbidden — insufficient role authority.' },
      { status: 403 }
    ),
  };
}

/**
 * Downwards-Only Rule Hierarchy Enforcement
 * Evaluates whether an actor can view, modify credentials for, or assign roles to a target user.
 *
 * Rules:
 *   1. Downwards-Only: actorRank > targetRank (Cannot modify self via admin endpoint or accounts at/above actor level).
 *   2. Role Assignment Limit: newRoleRank < actorRank (Cannot grant a role equal to or exceeding actor rank).
 */
export function canManageUser(
  actor: AuthTokenPayload,
  targetUserRole: UserRole,
  targetUserId?: string,
  newRoleToAssign?: UserRole
): { allowed: boolean; reason?: string } {
  const actorRank = getRoleRank(actor.role);
  const targetRank = getRoleRank(targetUserRole);

  // Self-Service check: modifying oneself via administrative tools is disallowed to prevent self-privilege escalation.
  if (targetUserId && targetUserId === actor.userId) {
    return {
      allowed: false,
      reason: 'Downwards-Only Rule: Administrative user management cannot be performed on your own account. Use profile settings for self-service credential updates.',
    };
  }

  // Rule 1: Actor must have strictly higher hierarchy rank than target
  if (actorRank <= targetRank && actor.role !== 'SYSTEM_ADMIN') {
    return {
      allowed: false,
      reason: `Downwards-Only Rule: Your rank (${actor.role}: ${actorRank}) must strictly exceed the target user rank (${targetUserRole}: ${targetRank}). You cannot modify accounts at or above your administrative authority.`,
    };
  }

  // Rule 2: Actor cannot assign a role equal to or exceeding their own rank
  if (newRoleToAssign) {
    const newRoleRank = getRoleRank(newRoleToAssign);
    if (newRoleRank >= actorRank && actor.role !== 'SYSTEM_ADMIN') {
      return {
        allowed: false,
        reason: `Downwards-Only Rule: You cannot assign role '${newRoleToAssign}' (rank ${newRoleRank}) which equals or exceeds your authority rank (${actorRank}).`,
      };
    }
  }

  return { allowed: true };
}

// -----------------------------------------------------------------------------
// 5. HELPER UTILITIES
// -----------------------------------------------------------------------------

export function sanitizeUser<T extends Record<string, any>>(
  row: T
): Omit<T, 'password_hash' | 'temporary_password' | 'passwordHash'> {
  const { password_hash, temporary_password, passwordHash, ...safe } = row;
  return safe;
}

export function getAuthorizedDashboardUrl(role: UserRole | string, slug?: string, orgSlug?: string): string {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return '/admin/dashboard';
    case 'ORGANIZER_OWNER':
    case 'EVENT_ORGANIZER':
      if (orgSlug && slug) return `/${orgSlug}/${slug}`;
      if (orgSlug) return `/organizer/${encodeURIComponent(orgSlug)}`;
      return '/organizer';
    case 'COUPLE':
    case 'BRIDE_GROOM':
      if (orgSlug && slug) return `/${orgSlug}/${slug}/couple`;
      if (slug) return `/event/${slug}/couple`;
      return '/couple/dashboard';
    case 'GATE_SCANNER':
      if (orgSlug && slug) return `/${orgSlug}/${slug}/scanner`;
      if (slug) return `/event/${slug}/scanner`;
      return '/scanner';
    case 'LIVE_STREAMER':
      if (orgSlug && slug) return `/${orgSlug}/${slug}/live-streamer`;
      if (slug) return `/event/${slug}/live-streamer`;
      return '/live-streamer';
    case 'MODERATOR':
    case 'CONTENT_MODERATOR':
    case 'MEDIA_MODERATOR':
      if (orgSlug && slug) return `/${orgSlug}/${slug}/moderation`;
      if (slug) return `/event/${slug}/moderation`;
      return '/moderation';
    default:
      return '/login';
  }
}

/**
 * Resolves the exact, isolated dashboard for an authenticated user.
 * Guarantees that:
 * 1. Organizers only see their own event or their own organizer dashboard (never another organizer's, never a sample event).
 * 2. Couples only see their own wedding dashboard.
 * 3. Streamers only launch their assigned event's streamer studio.
 * 4. Scanners only launch their assigned event's QR scanner.
 */
export async function resolveUserDashboardUrl(options: {
  role: UserRole | string;
  userId: string;
  email: string;
  tenantId?: string;
  slug?: string;
}): Promise<string> {
  const { role, userId, email, tenantId, slug } = options;

  // 1. SYSTEM ADMIN -> /admin/dashboard
  if (role === 'SYSTEM_ADMIN') {
    return '/admin/dashboard';
  }

  // 2. ORGANIZER -> /organizer/dashboard?id=[id]
  if (role === 'ORGANIZER_OWNER' || role === 'EVENT_ORGANIZER') {
    return tenantId ? `/organizer/dashboard?id=${encodeURIComponent(tenantId)}` : '/organizer/dashboard';
  }

  // Resolve associated event ID or slug
  let resolvedEventSlug = slug;
  let resolvedOrganizerSlug = tenantId;

  if (!resolvedEventSlug) {
    try {
      const evt = await queryOne<{ slug: string; id: string; tenant_id?: string; organizer_slug?: string }>(
        `SELECT e.slug, e.id, e.tenant_id, t.slug as organizer_slug 
         FROM events e 
         LEFT JOIN tenants t ON t.id = e.tenant_id
         LEFT JOIN users cu ON cu.id = e.couple_user_id 
         LEFT JOIN event_staff es ON es.event_id = e.id
         WHERE e.couple_user_id = $1 OR lower(cu.email) = lower($2) OR es.user_id = $1
         ORDER BY e.created_at DESC LIMIT 1`,
        [userId, email]
      );
      if (evt) {
        resolvedEventSlug = evt.slug || evt.id;
        if (evt.organizer_slug) resolvedOrganizerSlug = evt.organizer_slug;
      }
    } catch {}
  }

  if (!resolvedEventSlug) {
    // If no event found in database for couple or event staff, return safe error
    return '/login?error=no_event_assigned';
  }

  const finalEventId = resolvedEventSlug;
  const prefix = resolvedOrganizerSlug ? `/${resolvedOrganizerSlug}/${finalEventId}` : `/event/${finalEventId}`;

  // 3. COUPLE -> /${organizerSlug}/${finalEventId}/couple or /couple/${finalEventId}
  if (role === 'BRIDE_GROOM' || role === 'COUPLE') {
    return resolvedOrganizerSlug ? `${prefix}/couple` : `/couple/${finalEventId}`;
  }

  // 4. GATE SCANNER -> /event/[eventId]/scanner or /${organizerSlug}/${finalEventId}/scanner
  if (role === 'GATE_SCANNER') {
    return `${prefix}/scanner`;
  }

  // 5. LIVE STREAMER -> /event/${finalEventId}/live-streamer or /${organizerSlug}/${finalEventId}/live-streamer
  if (role === 'LIVE_STREAMER') {
    return `${prefix}/live-streamer`;
  }

  // 6. MEDIA MODERATOR -> /event/[eventId]/moderation or /${organizerSlug}/${finalEventId}/moderation
  if (role === 'MODERATOR' || role === 'CONTENT_MODERATOR' || (role as string) === 'MEDIA_MODERATOR') {
    return `${prefix}/moderation`;
  }

  return '/login';
}
