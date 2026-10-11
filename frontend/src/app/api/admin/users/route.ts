export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  requirePermission,
  canManageUser,
  hashPassword,
  logAuditAction,
  sanitizeUser,
  getRoleRank,
  UserRole,
} from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import { getStoredUsers, saveStoredUser } from '@/lib/userStore';

// GET: List accounts — filtered by capability and scoped by tenant
export async function GET(req: NextRequest) {
  const auth = requirePermission(req, 'credentials:manage_scoped');
  if (!auth.ok) return auth.response;

  const actor = auth.user;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  try {
    let dbUsers: any[] = [];
    try {
      if (actor.role === 'SYSTEM_ADMIN') {
        dbUsers = await query(`
          SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at,
                 o.id AS organizer_id, o.business_name
          FROM users u
          LEFT JOIN organizers o ON o.owner_user_id = u.id
          ORDER BY u.created_at DESC
        `);
      } else {
        // Multi-tenant Scoping: Organizers can only list staff and users in their tenant
        dbUsers = await query(`
          SELECT u.id, u.email, u.full_name, u.role, u.is_active, u.created_at,
                 o.id AS organizer_id, o.business_name
          FROM users u
          LEFT JOIN organizers o ON o.owner_user_id = u.id
          WHERE u.created_by = $1 OR o.id = $2
          ORDER BY u.created_at DESC
        `, [actor.userId, actor.tenantId || '']);
      }
    } catch (dbErr) {
      console.warn('DB User GET query fallback:', dbErr);
    }

    const formatted: any[] = (dbUsers || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name || u.fullName,
      full_name: u.full_name || u.fullName,
      role: (u.role || '').toUpperCase(),
      companyName: u.business_name || u.companyName || u.full_name,
      company_name: u.business_name || u.companyName || u.full_name,
      organizerId: u.organizer_id || `org-${u.id}`,
      isActive: Boolean(u.is_active ?? true),
      createdAt: u.created_at || new Date().toISOString(),
    }));

    // Merge mockStore.users and persistent userStore for runtime synchronization
    const existingMap = new Map(formatted.map((u: any) => [(u.email || '').toLowerCase(), u]));

    const combinedList = [...mockStore.users, ...getStoredUsers()];
    for (const mockUser of combinedList) {
      const emailKey = (mockUser.email || '').toLowerCase();
      const existing = existingMap.get(emailKey);

      // Apply Downwards-Only filter: Organizers should not see higher or equal rank users unless system admin
      if (actor.role !== 'SYSTEM_ADMIN' && getRoleRank(mockUser.role) >= getRoleRank(actor.role)) {
        continue;
      }

      if (!existing) {
        const item = {
          id: mockUser.id,
          email: mockUser.email,
          fullName: mockUser.fullName,
          full_name: mockUser.fullName,
          role: mockUser.role,
          companyName: mockUser.companyName || mockUser.fullName,
          company_name: mockUser.companyName || mockUser.fullName,
          description: mockUser.description || '',
          organizerId: mockUser.organizerId || `org-${mockUser.id}`,
          temporaryPassword: mockUser.temporaryPassword || 'agafari2026',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        formatted.push(item);
        existingMap.set(emailKey, item);
      }
    }

    // Downwards-Only Filtering: Filter out accounts at or above actor's rank unless actor is system admin viewing list
    const actorRank = getRoleRank(actor.role);
    const safeUsers = formatted
      .filter((u) => actor.role === 'SYSTEM_ADMIN' || getRoleRank(u.role) < actorRank)
      .map((u) => sanitizeUser(u));

    return NextResponse.json({ users: safeUsers });
  } catch (e) {
    return NextResponse.json({ users: [...mockStore.users, ...getStoredUsers()].map((u) => sanitizeUser(u)) });
  }
}

const GLOBAL_ROLES: UserRole[] = [
  'SYSTEM_ADMIN',
  'EVENT_ORGANIZER',
  'BRIDE_GROOM',
  'LIVE_STREAMER',
  'GATE_SCANNER',
  'MODERATOR',
  'GUEST',
];

// POST: Create a new account with Downwards-Only role enforcement
export async function POST(req: NextRequest) {
  const auth = requirePermission(req, 'credentials:manage_scoped');
  if (!auth.ok) return auth.response;

  const actor = auth.user;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  try {
    const { email, password, fullName, companyName, description, role, eventId } = await req.json();

    if (!email || !fullName || !role) {
      return NextResponse.json({ error: 'Email, full name, and role are required.' }, { status: 400 });
    }

    if (!GLOBAL_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `role must be one of: ${GLOBAL_ROLES.join(', ')}.` },
        { status: 400 }
      );
    }

    // Downwards-Only Rule Check: Actor cannot create or assign a role equal to or exceeding their own rank
    const canManage = canManageUser(actor, role as UserRole, undefined, role as UserRole);
    if (!canManage.allowed) {
      await logAuditAction({
        actorId: actor.userId,
        targetUserId: null,
        action: 'USER_CREATE_BLOCKED_DOWNWARDS_ONLY',
        ipAddress,
        details: { attemptedRole: role, reason: canManage.reason },
      });

      return NextResponse.json(
        { error: canManage.reason },
        { status: 403 }
      );
    }

    const effectivePassword = password?.trim() || `agafari${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = hashPassword(effectivePassword);

    try {
      const existing = await queryOne('SELECT id FROM users WHERE lower(email) = lower($1)', [email.trim()]);
      if (existing) {
        return NextResponse.json({ error: `An account with email '${email}' already exists.` }, { status: 400 });
      }

      const newUserId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const effectiveName = (fullName || companyName || 'Agafari User').trim();

      await query(
        `INSERT INTO users (id, email, password_hash, full_name, role, created_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newUserId, email.toLowerCase().trim(), hashedPassword, effectiveName, role as UserRole, actor.userId]
      );

      let orgId = `org-${newUserId}`;
      if (role === 'EVENT_ORGANIZER') {
        const orgBizName = (companyName || fullName || 'Certified Event Agency').trim();
        await query(
          `INSERT INTO organizers (id, owner_user_id, business_name, created_by_admin_id)
           VALUES ($1, $2, $3, $4)`,
          [orgId, newUserId, orgBizName, actor.userId]
        );
      }

      const newUser = await queryOne('SELECT id, email, full_name, role FROM users WHERE id = $1', [newUserId]);

      // Sync into mockStore and persistent userStore
      const persistentRecord = {
        id: newUser.id,
        eventId: null,
        email: newUser.email,
        fullName: newUser.full_name || effectiveName,
        companyName: companyName || effectiveName,
        description: description || '',
        organizerId: orgId,
        role: newUser.role as UserRole,
        passwordHash: hashedPassword,
        temporaryPassword: effectivePassword,
        isActive: true,
      };
      mockStore.users.unshift(persistentRecord);
      saveStoredUser(persistentRecord);

      await logAuditAction({
        actorId: actor.userId,
        targetUserId: newUserId,
        action: 'USER_CREATE',
        ipAddress,
        details: { targetEmail: email, role, fullName: effectiveName },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Account created successfully with role '${role}'.`,
          user: sanitizeUser(persistentRecord),
        },
        { status: 201 }
      );
    } catch (dbErr) {
      console.warn('DB User Creation fallback:', dbErr);
      const newUserId = `usr-org-${Date.now()}`;
      const newMockUser = {
        id: newUserId,
        eventId: null,
        email: email.toLowerCase().trim(),
        fullName: (fullName || companyName || 'Agafari User').trim(),
        companyName: (companyName || fullName || 'Agafari User').trim(),
        description: description || '',
        organizerId: `org-${newUserId}`,
        role: role as UserRole,
        passwordHash: hashedPassword,
        temporaryPassword: effectivePassword,
        isActive: true,
      };
      mockStore.users.unshift(newMockUser);
      saveStoredUser(newMockUser);

      await logAuditAction({
        actorId: actor.userId,
        targetUserId: newUserId,
        action: 'USER_CREATE_MOCK_FALLBACK',
        ipAddress,
        details: { targetEmail: email, role },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Account created successfully with role '${role}'.`,
          user: sanitizeUser(newMockUser),
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
  }
}

// PATCH: Update user password, name, or role with Downwards-Only enforcement
export async function PATCH(req: NextRequest) {
  const auth = requirePermission(req, 'credentials:manage_scoped');
  if (!auth.ok) return auth.response;

  const actor = auth.user;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  try {
    const { userId, newPassword, fullName, role } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });

    if (role && !GLOBAL_ROLES.includes(role)) {
      return NextResponse.json({ error: `role must be one of ${GLOBAL_ROLES.join(', ')}.` }, { status: 400 });
    }

    // 1. Fetch Target User's Current Role from DB or mockStore
    let targetUserRole: UserRole = 'GUEST';
    try {
      const targetDbUser = await queryOne<{ role: UserRole }>('SELECT role FROM users WHERE id = $1', [userId]);
      if (targetDbUser) targetUserRole = targetDbUser.role;
    } catch {
      const mockTarget = mockStore.users.find((u) => u.id === userId);
      if (mockTarget) targetUserRole = mockTarget.role;
    }

    // 2. Downwards-Only Rule Check: Validate rank hierarchy
    const canManage = canManageUser(actor, targetUserRole, userId, role as UserRole);
    if (!canManage.allowed) {
      await logAuditAction({
        actorId: actor.userId,
        targetUserId: userId,
        action: 'USER_UPDATE_BLOCKED_DOWNWARDS_ONLY',
        ipAddress,
        details: { targetUserRole, attemptedNewRole: role, reason: canManage.reason },
      });

      return NextResponse.json({ error: canManage.reason }, { status: 403 });
    }

    const hashedPassword = newPassword ? hashPassword(newPassword.trim()) : null;

    try {
      await query(
        `UPDATE users SET
           password_hash = COALESCE($2, password_hash),
           full_name = COALESCE($3, full_name),
           role = COALESCE($4, role)
         WHERE id = $1`,
        [userId, hashedPassword, fullName?.trim() ?? null, role ?? null]
      );

      const updated = await queryOne('SELECT id, email, full_name, role FROM users WHERE id = $1', [userId]);

      if (updated) {
        const idx = mockStore.users.findIndex((u) => u.id === userId);
        if (idx >= 0) {
          if (fullName) mockStore.users[idx].fullName = fullName;
          if (role) mockStore.users[idx].role = role as UserRole;
          if (hashedPassword) mockStore.users[idx].passwordHash = hashedPassword;
        }

        await logAuditAction({
          actorId: actor.userId,
          targetUserId: userId,
          action: 'CREDENTIALS_UPDATE',
          ipAddress,
          details: { updatedFields: { fullName: !!fullName, role: role || undefined, passwordUpdated: !!newPassword } },
        });

        return NextResponse.json({ success: true, user: sanitizeUser(updated) });
      }
    } catch (dbErr) {
      console.warn('DB User update fallback:', dbErr);
      const idx = mockStore.users.findIndex((u) => u.id === userId);
      if (idx >= 0) {
        if (fullName) mockStore.users[idx].fullName = fullName;
        if (role) mockStore.users[idx].role = role as UserRole;
        if (hashedPassword) mockStore.users[idx].passwordHash = hashedPassword;

        await logAuditAction({
          actorId: actor.userId,
          targetUserId: userId,
          action: 'CREDENTIALS_UPDATE_MOCK',
          ipAddress,
          details: { updatedFields: { fullName: !!fullName, role: role || undefined } },
        });

        return NextResponse.json({ success: true, user: sanitizeUser(mockStore.users[idx]) });
      }
    }

    return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Failed to update user account.' }, { status: 500 });
  }
}

// DELETE: Remove an account with Downwards-Only enforcement
export async function DELETE(req: NextRequest) {
  const auth = requirePermission(req, 'credentials:manage');
  if (!auth.ok) return auth.response;

  const actor = auth.user;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  const userId = new URL(req.url).searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId is required.' }, { status: 400 });

  try {
    let targetUserRole: UserRole = 'GUEST';
    try {
      const targetDbUser = await queryOne<{ role: UserRole }>('SELECT role FROM users WHERE id = $1', [userId]);
      if (targetDbUser) targetUserRole = targetDbUser.role;
    } catch {
      const mockTarget = mockStore.users.find((u) => u.id === userId);
      if (mockTarget) targetUserRole = mockTarget.role;
    }

    const canManage = canManageUser(actor, targetUserRole, userId);
    if (!canManage.allowed) {
      await logAuditAction({
        actorId: actor.userId,
        targetUserId: userId,
        action: 'USER_DELETE_BLOCKED_DOWNWARDS_ONLY',
        ipAddress,
        details: { targetUserRole, reason: canManage.reason },
      });

      return NextResponse.json({ error: canManage.reason }, { status: 403 });
    }

    // Delete user from DB and mockStore
    try {
      await query('DELETE FROM users WHERE id = $1', [userId]);
    } catch (dbErr) {
      console.warn('DB User delete fallback:', dbErr);
    }

    const idx = mockStore.users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      mockStore.users.splice(idx, 1);
    }

    await logAuditAction({
      actorId: actor.userId,
      targetUserId: userId,
      action: 'USER_DELETE',
      ipAddress,
      details: { deletedUserId: userId, targetUserRole },
    });

    return NextResponse.json({ success: true, message: 'User account deleted successfully.' });
  } catch (err: any) {
    console.error('Failed to delete user:', err);
    return NextResponse.json({ error: 'Failed to delete user account.' }, { status: 500 });
  }
}
