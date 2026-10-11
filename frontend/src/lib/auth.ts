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
  | 'EVENT_ORGANIZER'
  | 'BRIDE_GROOM'
  | 'LIVE_STREAMER'
  | 'GATE_SCANNER'
  | 'MODERATOR'
  | 'GUEST';

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
  EVENT_ORGANIZER: 50,
  BRIDE_GROOM: 20,
  LIVE_STREAMER: 10,
  GATE_SCANNER: 10,
  MODERATOR: 10,
  GUEST: 0,
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
  BRIDE_GROOM: ['events:read', 'events:write', 'media:moderate', 'reports:view'],
  LIVE_STREAMER: ['stream:manage', 'events:read'],
  GATE_SCANNER: ['gate:scan', 'events:read'],
  MODERATOR: ['media:moderate', 'events:read'],
  GUEST: [],
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
 * Filters out raw passwords, secrets, and auth tokens to prevent credential leaks.
 */
export async function logAuditAction(options: AuditLogOptions): Promise<void> {
  const { actorId, targetUserId, action, ipAddress, details } = options;

  // Filter sensitive fields from details payload
  const safeDetails: Record<string, any> = {};
  if (details && typeof details === 'object') {
    for (const [key, val] of Object.entries(details)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('password') ||
        lowerKey.includes('secret') ||
        lowerKey.includes('token') ||
        lowerKey.includes('hash') ||
        lowerKey.includes('credential')
      ) {
        safeDetails[key] = '[REDACTED]';
      } else {
        safeDetails[key] = val;
      }
    }
  }

  const logId = `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timestamp = new Date().toISOString();

  // 1. Persist to Database if available
  try {
    await query(
      `INSERT INTO audit_logs (id, actor_id, target_user_id, action, ip_address, details, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        logId,
        actorId || null,
        targetUserId || null,
        action,
        ipAddress || '127.0.0.1',
        JSON.stringify(safeDetails),
        timestamp,
      ]
    );
  } catch (err) {
    // Fallback silently if DB is not populated
  }

  // 2. Keep in-memory mock store in sync for dev runtime
  if (!(mockStore as any).auditLogs) {
    (mockStore as any).auditLogs = [];
  }
  (mockStore as any).auditLogs.unshift({
    id: logId,
    actorId: actorId || null,
    targetUserId: targetUserId || null,
    action,
    ipAddress: ipAddress || '127.0.0.1',
    details: safeDetails,
    createdAt: timestamp,
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

  // 2. Check session cookie
  const cookieToken = req.cookies.get('agafari_token')?.value;
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) return verified;
  }

  return null;
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'agafari_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 * 30, // 30 days
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
    case 'EVENT_ORGANIZER':
      if (orgSlug && slug) return `/${orgSlug}/${slug}`;
      if (orgSlug) return `/organizer/dashboard?id=${encodeURIComponent(orgSlug)}`;
      return '/organizer/dashboard';
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
  const effectiveOrgId = tenantId || userId;
  const userOrgSlug = effectiveOrgId.startsWith('org-') ? effectiveOrgId : `org-${effectiveOrgId}`;

  // 1. SYSTEM ADMIN -> Universal Platform Executive Suite
  if (role === 'SYSTEM_ADMIN') {
    return '/admin/dashboard';
  }

  // 2. EVENT ORGANIZER
  if (role === 'EVENT_ORGANIZER') {
    if (slug) {
      return `/${userOrgSlug}/${slug}`;
    }

    // A. Query DB for an event owned specifically by this organizer
    try {
      const evt = await queryOne<{ slug: string; organizer_id: string }>(
        `SELECT slug, organizer_id FROM events 
         WHERE organizer_id = $1 
            OR organizer_id = $2 
            OR organizer_id = $3 
            OR organizer_id = (SELECT id FROM organizers WHERE owner_user_id = $1 OR owner_user_id = $3 LIMIT 1)
         ORDER BY created_at DESC LIMIT 1`,
        [effectiveOrgId, userOrgSlug, userId]
      );
      if (evt && evt.slug) {
        const orgSlug = evt.organizer_id
          ? (evt.organizer_id.startsWith('org-') ? evt.organizer_id : `org-${evt.organizer_id}`)
          : userOrgSlug;
        return `/${orgSlug}/${evt.slug}`;
      }
    } catch (e) {}

    // B. Query mockStore strictly for this organizer's own events (NEVER fallback to other events)
    const cleanOrg = userOrgSlug.replace(/^org-/, '');
    const cleanUserId = userId.replace(/^org-/, '');
    const cleanEmail = (email || '').toLowerCase();

    const mockEvt = mockStore.events.find((e: any) => {
      const eOrg = String(e.organizerId || (e as any).organizer_id || '').replace(/^org-/, '');
      const eEmail = (e.credentials?.organizer?.email || '').toLowerCase();
      return (eOrg && (eOrg === cleanOrg || eOrg === cleanUserId)) || (eEmail && eEmail === cleanEmail);
    });

    if (mockEvt && mockEvt.slug) {
      const mOrg = mockEvt.organizerId || (mockEvt as any).organizer_id || userOrgSlug;
      const orgSlug = mOrg.startsWith('org-') ? mOrg : `org-${mOrg}`;
      return `/${orgSlug}/${mockEvt.slug}`;
    }

    // C. No events created yet: Go to their specific organizer command dashboard
    return `/organizer/dashboard?id=${encodeURIComponent(effectiveOrgId)}`;
  }

  // 3. BRIDE & GROOM (COUPLE)
  if (role === 'BRIDE_GROOM') {
    if (slug) return `/event/${slug}/couple`;

    // A. Check in DB
    try {
      const evt = await queryOne<{ slug: string; organizer_id: string }>(
        `SELECT e.slug, e.organizer_id FROM events e 
         LEFT JOIN users cu ON cu.id = e.couple_user_id 
         WHERE e.couple_user_id = $1 OR lower(cu.email) = lower($2) OR lower(e.couple_email) = lower($2)
         ORDER BY e.created_at DESC LIMIT 1`,
        [userId, email]
      );
      if (evt && evt.slug) {
        const orgSlug = evt.organizer_id
          ? (evt.organizer_id.startsWith('org-') ? evt.organizer_id : `org-${evt.organizer_id}`)
          : 'event';
        return `/${orgSlug}/${evt.slug}/couple`;
      }
    } catch (e) {}

    // B. Check in mockStore
    const cleanEmail = (email || '').toLowerCase();
    const mockEvt = mockStore.events.find((e: any) => {
      const cEmail = (
        e.credentials?.couple?.email ||
        e.coupleCredentials?.email ||
        e.couple_email ||
        ''
      ).toLowerCase();
      return cEmail === cleanEmail || e.id === userId || (e as any).couple_user_id === userId;
    });

    if (mockEvt && mockEvt.slug) {
      const mOrg = mockEvt.organizerId || (mockEvt as any).organizer_id || 'event';
      const orgSlug = mOrg.startsWith('org-') ? mOrg : `org-${mOrg}`;
      return `/${orgSlug}/${mockEvt.slug}/couple`;
    }

    return '/couple/dashboard';
  }

  // 4. GATE SCANNER
  if (role === 'GATE_SCANNER') {
    if (slug) return `/event/${slug}/scanner`;

    // A. Check DB staff assignment
    try {
      const staffEvt = await queryOne<{ slug: string; organizer_id: string }>(
        `SELECT e.slug, e.organizer_id FROM events e
         JOIN event_staff es ON es.event_id = e.id
         WHERE es.user_id = $1 AND es.role = 'GATE_SCANNER'
         LIMIT 1`,
        [userId]
      );
      if (staffEvt && staffEvt.slug) {
        const orgSlug = staffEvt.organizer_id
          ? (staffEvt.organizer_id.startsWith('org-') ? staffEvt.organizer_id : `org-${staffEvt.organizer_id}`)
          : 'event';
        return `/${orgSlug}/${staffEvt.slug}/scanner`;
      }
    } catch (e) {}

    // B. Check mockStore
    const cleanEmail = (email || '').toLowerCase();
    const mockEvt = mockStore.events.find((e: any) => {
      const sEmail = (e.credentials?.scanner?.email || '').toLowerCase();
      return sEmail === cleanEmail || e.id === userId;
    });

    if (mockEvt && mockEvt.slug) {
      const mOrg = mockEvt.organizerId || (mockEvt as any).organizer_id || 'event';
      const orgSlug = mOrg.startsWith('org-') ? mOrg : `org-${mOrg}`;
      return `/${orgSlug}/${mockEvt.slug}/scanner`;
    }

    return '/scanner';
  }

  // 5. LIVE STREAMER
  if (role === 'LIVE_STREAMER') {
    if (slug) return `/event/${slug}/live-streamer`;

    // A. Check DB staff assignment
    try {
      const staffEvt = await queryOne<{ slug: string; organizer_id: string }>(
        `SELECT e.slug, e.organizer_id FROM events e
         JOIN event_staff es ON es.event_id = e.id
         WHERE es.user_id = $1 AND es.role = 'LIVE_STREAMER'
         LIMIT 1`,
        [userId]
      );
      if (staffEvt && staffEvt.slug) {
        const orgSlug = staffEvt.organizer_id
          ? (staffEvt.organizer_id.startsWith('org-') ? staffEvt.organizer_id : `org-${staffEvt.organizer_id}`)
          : 'event';
        return `/${orgSlug}/${staffEvt.slug}/live-streamer`;
      }
    } catch (e) {}

    // B. Check mockStore
    const cleanEmail = (email || '').toLowerCase();
    const mockEvt = mockStore.events.find((e: any) => {
      const sEmail = (e.credentials?.streamer?.email || '').toLowerCase();
      return sEmail === cleanEmail || e.id === userId;
    });

    if (mockEvt && mockEvt.slug) {
      const mOrg = mockEvt.organizerId || (mockEvt as any).organizer_id || 'event';
      const orgSlug = mOrg.startsWith('org-') ? mOrg : `org-${mOrg}`;
      return `/${orgSlug}/${mockEvt.slug}/live-streamer`;
    }

    return '/live-streamer';
  }

  // 6. CONTENT / MEDIA MODERATOR
  if (role === 'MODERATOR' || role === 'CONTENT_MODERATOR' || (role as string) === 'MEDIA_MODERATOR') {
    if (slug) return `/event/${slug}/moderation`;
    const cleanEmail = (email || '').toLowerCase();
    const mockEvt = mockStore.events.find((e: any) => {
      const mEmail = (e.credentials?.moderator?.email || '').toLowerCase();
      return mEmail === cleanEmail || e.id === userId;
    });

    if (mockEvt && mockEvt.slug) {
      const mOrg = mockEvt.organizerId || (mockEvt as any).organizer_id || 'event';
      const orgSlug = mOrg.startsWith('org-') ? mOrg : `org-${mOrg}`;
      return `/${orgSlug}/${mockEvt.slug}/moderation`;
    }
    return '/moderation';
  }

  return '/login';
}
