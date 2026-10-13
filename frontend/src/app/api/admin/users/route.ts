import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireMembership } from '@/lib/requireMembership';
import { hashPassword, generateStrongPassword } from '@/lib/passwords';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';
import { AppRole, ScopeType } from '@/types/auth';

export const dynamic = 'force-dynamic';

async function ensureTemporaryPasswordColumn() {
  try {
    await query('ALTER TABLE users ADD COLUMN temporary_password VARCHAR(255) NULL AFTER password_hash');
  } catch {
    // Column already exists or table modified
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    const rawUsers = await query<any>(`
      SELECT u.id, u.email, u.phone, u.full_name, u.role AS user_role, u.status, u.temporary_password,
             u.password_set_by, u.password_set_at, u.totp_enabled, u.created_at,
             m.id AS membership_id, m.role AS membership_role, m.scope_type, m.scope_id,
             m.status AS membership_status, m.expires_at,
             o.id AS organizer_id, o.business_name
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id
      LEFT JOIN organizers o ON u.id = o.owner_user_id
      ORDER BY u.created_at DESC
    `);

    const users = rawUsers.map((u) => {
      let displayRole: string = u.user_role || 'GUEST';
      if (u.user_role === 'EVENT_ORGANIZER' || u.membership_role === 'ORGANIZER_OWNER') {
        displayRole = 'EVENT_ORGANIZER';
      } else if (u.user_role === 'BRIDE_GROOM' || u.membership_role === 'COUPLE') {
        displayRole = 'BRIDE_GROOM';
      } else if (u.user_role === 'LIVE_STREAMER' || u.membership_role === 'MEDIA_MODERATOR') {
        displayRole = 'LIVE_STREAMER';
      } else if (u.user_role === 'GATE_SCANNER' || u.membership_role === 'GATE_SCANNER') {
        displayRole = 'GATE_SCANNER';
      } else if (u.user_role === 'SYSTEM_ADMIN' || u.membership_role === 'SYSTEM_ADMIN') {
        displayRole = 'SYSTEM_ADMIN';
      }

      return {
        id: u.id,
        email: u.email,
        phone: u.phone,
        fullName: u.full_name,
        companyName: u.business_name || u.full_name,
        description: u.business_name ? `Official certified event management partner (${u.business_name}).` : undefined,
        role: displayRole,
        status: u.status,
        temporaryPassword: u.temporary_password || undefined,
        passwordSetBy: u.password_set_by,
        passwordSetAt: u.password_set_at,
        totpEnabled: !!u.totp_enabled,
        createdAt: u.created_at,
        membershipId: u.membership_id,
        membershipRole: u.membership_role,
        scopeType: u.scope_type,
        scopeId: u.scope_id,
        organizerId: u.organizer_id,
      };
    });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch users.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    const body = await req.json();
    const { email, phone, fullName, companyName, description, role, scopeType, scopeId, password: customPassword } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await queryOne<any>('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    // Use exact custom password if provided, or generate strong password
    const plainTextPassword = customPassword && String(customPassword).trim().length > 0
      ? String(customPassword).trim()
      : generateStrongPassword(12);

    const passwordHash = await hashPassword(plainTextPassword);
    const userId = `usr-${crypto.randomUUID()}`;
    const membershipId = `mem-${crypto.randomUUID()}`;
    const adminId = auth.user.id;

    // Normalize roles for users table vs memberships table
    const isOrganizer = role === 'EVENT_ORGANIZER' || role === 'ORGANIZER_OWNER';
    const isCouple = role === 'BRIDE_GROOM' || role === 'COUPLE';
    const isStreamer = role === 'LIVE_STREAMER' || role === 'MEDIA_MODERATOR';

    const userDbRole = isOrganizer
      ? 'EVENT_ORGANIZER'
      : isCouple
      ? 'BRIDE_GROOM'
      : isStreamer
      ? 'LIVE_STREAMER'
      : role === 'GATE_SCANNER'
      ? 'GATE_SCANNER'
      : role === 'SYSTEM_ADMIN'
      ? 'SYSTEM_ADMIN'
      : 'GUEST';

    const membershipRole = isOrganizer
      ? 'ORGANIZER_OWNER'
      : isCouple
      ? 'COUPLE'
      : isStreamer
      ? 'MEDIA_MODERATOR'
      : role === 'GATE_SCANNER'
      ? 'GATE_SCANNER'
      : 'SYSTEM_ADMIN';

    // 1. Insert user with explicit role and temporary_password
    await query(
      `INSERT INTO users (id, email, phone, full_name, role, password_hash, temporary_password, password_set_by, password_set_at, status, session_version, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), 'ACTIVE', 1, NOW())`,
      [userId, cleanEmail, phone || null, fullName || cleanEmail, userDbRole, passwordHash, plainTextPassword, adminId]
    );

    // 2. Insert membership with normalized membership role
    const finalScopeType: ScopeType = scopeType || (membershipRole === 'SYSTEM_ADMIN' ? 'PLATFORM' : membershipRole === 'ORGANIZER_OWNER' ? 'ORGANIZER' : 'EVENT');
    const finalScopeId = scopeId || (finalScopeType === 'PLATFORM' ? 'global' : isOrganizer ? `org-${userId}` : 'event-default');

    await query(
      `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW())`,
      [membershipId, userId, membershipRole, finalScopeType, finalScopeId]
    );

    // 3. If organizer, insert into organizers table
    let organizerId = undefined;
    if (isOrganizer) {
      organizerId = `org-${userId}`;
      const businessName = companyName || fullName || cleanEmail;
      await query(
        `INSERT INTO organizers (id, owner_user_id, business_name, contact_phone, created_by_admin_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON DUPLICATE KEY UPDATE business_name = $3`,
        [organizerId, userId, businessName, phone || null, adminId]
      );
    }

    // 4. Immutable audit log
    await logAudit({
      actorId: adminId,
      action: isOrganizer ? 'ORGANIZER_CREATED' : 'USER_CREATED',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { role: userDbRole, email: cleanEmail, scopeType: finalScopeType, scopeId: finalScopeId, organizerId },
    });

    return NextResponse.json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: userId,
        email: cleanEmail,
        fullName: fullName || cleanEmail,
        companyName: companyName || fullName || cleanEmail,
        role: userDbRole,
        scopeType: finalScopeType,
        scopeId: finalScopeId,
        organizerId,
        temporaryPassword: plainTextPassword,
      },
      plainTextPassword,
    });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: err.message || 'Failed to create user.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await ensureTemporaryPasswordColumn();

  try {
    const body = await req.json();
    const userId = body.userId || body.id;
    const newPassword = body.newPassword || body.password;

    if (!userId || !newPassword) {
      return NextResponse.json({ error: 'User ID and new password are required.' }, { status: 400 });
    }

    const cleanPass = String(newPassword).trim();
    if (cleanPass.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters.' }, { status: 400 });
    }

    const target = await queryOne<any>('SELECT id, email, role FROM users WHERE id = $1', [userId]);
    if (!target) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const passwordHash = await hashPassword(cleanPass);
    const adminId = auth.user.id;

    await query(
      `UPDATE users
       SET password_hash = $1,
           temporary_password = $2,
           password_set_by = $3,
           password_set_at = NOW(),
           status = 'ACTIVE',
           session_version = session_version + 1
       WHERE id = $4`,
      [passwordHash, cleanPass, adminId, userId]
    );

    await logAudit({
      actorId: adminId,
      action: 'PASSWORD_RESET',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { email: target.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
      temporaryPassword: cleanPass,
    });
  } catch (err: any) {
    console.error('Error updating password:', err);
    return NextResponse.json({ error: err.message || 'Failed to update password.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const target = await queryOne<any>(
      'SELECT id, email, role FROM users WHERE id = $1 OR LOWER(email) = $1 LIMIT 1',
      [userId.toLowerCase()]
    );

    if (!target) {
      return NextResponse.json({
        success: true,
        message: `User record with id ${userId} removed.`,
        deletedUserId: userId,
      });
    }

    if (target.email.toLowerCase() === 'admin@agafari.com') {
      return NextResponse.json(
        { error: 'Cannot delete the primary System Super Admin account.' },
        { status: 403 }
      );
    }

    const actualId = target.id;

    await query('DELETE FROM memberships WHERE user_id = $1', [actualId]);
    await query('DELETE FROM account_requests WHERE requested_by = $1', [actualId]);
    await query('DELETE FROM organizers WHERE owner_user_id = $1 OR id = $1', [actualId]);
    await query('DELETE FROM users WHERE id = $1', [actualId]);

    await logAudit({
      actorId: auth.user.id,
      action: 'USER_DELETED',
      targetType: 'USER',
      targetId: actualId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { email: target.email, role: target.role },
    });

    return NextResponse.json({
      success: true,
      message: `User ${target.email} permanently deleted.`,
      deletedUserId: actualId,
    });
  } catch (err: any) {
    console.error('Error deleting user:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete user.' }, { status: 500 });
  }
}
