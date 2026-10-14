export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  requirePermission,
  canManageUser,
  hashPassword,
  logAuditAction,
  sanitizeUser,
  UserRole,
} from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import { updateStoredUserCredentials } from '@/lib/userStore';

const VALID_ROLES: UserRole[] = [
  'SYSTEM_ADMIN',
  'EVENT_ORGANIZER',
  'BRIDE_GROOM',
  'LIVE_STREAMER',
  'GATE_SCANNER',
  'MODERATOR',
  'GUEST',
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Capability Enforcement: Require 'credentials:manage' permission
  const auth = requirePermission(req, 'credentials:manage');
  if (!auth.ok) return auth.response;

  const actor = auth.user;
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  try {
    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const body = await req.json();
    const { email, fullName, role, newPassword } = body;

    // 2. Resolve Target User's Current Role
    let targetUserRole: UserRole = 'GUEST';
    try {
      const dbTarget = await queryOne<{ role: UserRole }>('SELECT role FROM users WHERE id = $1', [userId]);
      if (dbTarget) targetUserRole = dbTarget.role;
    } catch {
      const mockTarget = mockStore.users.find((u) => u.id === userId);
      if (mockTarget) targetUserRole = mockTarget.role;
    }

    // 3. Downwards-Only Rule Check
    const canManage = canManageUser(actor, targetUserRole, userId, role as UserRole);
    if (!canManage.allowed) {
      await logAuditAction({
        actorId: actor.userId,
        targetUserId: userId,
        action: 'CREDENTIALS_UPDATE_BLOCKED_DOWNWARDS_ONLY',
        ipAddress,
        details: { targetUserRole, attemptedRole: role, reason: canManage.reason },
      });

      return NextResponse.json({ error: canManage.reason }, { status: 403 });
    }

    // Validate email format if provided
    if (email && typeof email === 'string') {
      const emailTrimmed = email.trim().toLowerCase();
      if (!emailTrimmed.includes('@') || emailTrimmed.length < 5) {
        return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
      }

      try {
        const existingDbUser = await queryOne<any>(
          'SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id != $2',
          [emailTrimmed, userId]
        );
        if (existingDbUser) {
          return NextResponse.json(
            { error: `The email '${emailTrimmed}' is already used by another user account.` },
            { status: 409 }
          );
        }
      } catch (dbErr) {
        console.warn('DB Unique Email Check fallback:', dbErr);
      }
    }

    // Validate role if provided
    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role specified. Must be one of: ${VALID_ROLES.join(', ')}.` },
        { status: 400 }
      );
    }

    const hashedPassword = newPassword && newPassword.trim() ? hashPassword(newPassword.trim()) : null;
    let updatedUser: any = null;

    // 4. Update Database Record
    try {
      await query(
        `UPDATE users SET
           email = COALESCE($2, email),
           full_name = COALESCE($3, full_name),
           role = COALESCE($4, role),
           password_hash = COALESCE($5, password_hash),
           temporary_password = COALESCE($6, temporary_password),
           status = 'ACTIVE'
         WHERE id = $1`,
        [
          userId,
          email ? email.trim().toLowerCase() : null,
          fullName ? fullName.trim() : null,
          role || null,
          hashedPassword,
          newPassword && newPassword.trim() ? newPassword.trim() : null,
        ]
      );

      // Ensure user has an ACTIVE membership record
      const existingMem = await queryOne('SELECT id FROM memberships WHERE user_id = $1 LIMIT 1', [userId]);
      if (!existingMem) {
        const uRole = role || targetUserRole || 'EVENT_ORGANIZER';
        const isOrg = uRole === 'EVENT_ORGANIZER' || uRole === 'ORGANIZER_OWNER';
        const isCouple = uRole === 'BRIDE_GROOM' || uRole === 'COUPLE';
        const memRole = isOrg ? 'ORGANIZER_OWNER' : (isCouple ? 'COUPLE' : uRole);
        const scopeType = isOrg ? 'ORGANIZER' : (isCouple ? 'EVENT' : (uRole === 'SYSTEM_ADMIN' ? 'PLATFORM' : 'EVENT'));
        const scopeId = isOrg ? `org-${userId}` : (uRole === 'SYSTEM_ADMIN' ? 'global' : 'event-default');

        await query(
          `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status)
           VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
           ON DUPLICATE KEY UPDATE status = 'ACTIVE'`,
          [`mem-${userId}`, userId, memRole, scopeType, scopeId]
        );
      } else {
        await query(`UPDATE memberships SET status = 'ACTIVE' WHERE user_id = $1`, [userId]);
      }

      updatedUser = await queryOne(
        'SELECT id, email, full_name, role, is_active, created_at FROM users WHERE id = $1',
        [userId]
      );
    } catch (dbErr) {
      console.warn('DB User Credentials Update fallback:', dbErr);
    }

    // 5. Synchronize mockStore and persistent userStore
    if (newPassword && newPassword.trim()) {
      const persisted = updateStoredUserCredentials(userId, newPassword.trim());
      if (persisted && !updatedUser) {
        updatedUser = {
          id: persisted.id,
          email: persisted.email,
          full_name: persisted.fullName,
          fullName: persisted.fullName,
          role: persisted.role,
          created_at: new Date().toISOString(),
        };
      }
    }

    const mockIdx = mockStore.users.findIndex((u) => u.id === userId);
    if (mockIdx >= 0) {
      if (email) mockStore.users[mockIdx].email = email.trim().toLowerCase();
      if (fullName) mockStore.users[mockIdx].fullName = fullName.trim();
      if (role) mockStore.users[mockIdx].role = role as UserRole;
      if (hashedPassword) {
        mockStore.users[mockIdx].passwordHash = hashedPassword;
        mockStore.users[mockIdx].temporaryPassword = newPassword.trim();
      }
      if (!updatedUser) {
        updatedUser = {
          id: mockStore.users[mockIdx].id,
          email: mockStore.users[mockIdx].email,
          full_name: mockStore.users[mockIdx].fullName,
          fullName: mockStore.users[mockIdx].fullName,
          role: mockStore.users[mockIdx].role,
          created_at: new Date().toISOString(),
        };
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    await logAuditAction({
      actorId: actor.userId,
      targetUserId: userId,
      action: 'SYSTEM_ADMIN_CREDENTIALS_UPDATE',
      ipAddress,
      details: { emailUpdated: !!email, nameUpdated: !!fullName, roleUpdated: !!role, passwordUpdated: !!newPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'User credentials and permissions updated successfully.',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('Failed to update credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating user credentials.' },
      { status: 500 }
    );
  }
}
