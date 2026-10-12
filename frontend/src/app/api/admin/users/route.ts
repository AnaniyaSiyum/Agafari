import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireMembership } from '@/lib/requireMembership';
import { hashPassword, generateStrongPassword } from '@/lib/passwords';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';
import { AppRole, ScopeType } from '@/types/auth';

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const users = await query<any>(`
    SELECT u.id, u.email, u.phone, u.full_name, u.status, u.password_set_by, u.password_set_at,
           u.totp_enabled, u.created_at,
           m.id AS membership_id, m.role, m.scope_type, m.scope_id, m.status AS membership_status, m.expires_at
    FROM users u
    LEFT JOIN memberships m ON u.id = m.user_id
    ORDER BY u.created_at DESC
  `);

  return NextResponse.json({ success: true, users });
}

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { email, phone, fullName, role, scopeType, scopeId, password: customPassword } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await queryOne<any>('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    // Generate or use provided password
    const plainTextPassword = customPassword && String(customPassword).trim().length >= 8
      ? String(customPassword).trim()
      : generateStrongPassword(16);

    const passwordHash = await hashPassword(plainTextPassword);
    const userId = `usr-${crypto.randomUUID()}`;
    const membershipId = `mem-${crypto.randomUUID()}`;
    const adminId = auth.user.id;

    // Insert user
    await query(
      `INSERT INTO users (id, email, phone, full_name, password_hash, password_set_by, password_set_at, status, session_version, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'ACTIVE', 1, NOW())`,
      [userId, cleanEmail, phone || null, fullName || cleanEmail, passwordHash, adminId]
    );

    // Insert membership
    const finalScopeType: ScopeType = scopeType || (role === 'SYSTEM_ADMIN' ? 'PLATFORM' : role === 'ORGANIZER_OWNER' ? 'ORGANIZER' : 'EVENT');
    const finalScopeId = scopeId || (finalScopeType === 'PLATFORM' ? 'global' : 'event-default');

    await query(
      `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE', NOW())`,
      [membershipId, userId, role as AppRole, finalScopeType, finalScopeId]
    );

    // Immutable audit log (omits plaintext password)
    await logAudit({
      actorId: adminId,
      action: 'USER_CREATED',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { role, email: cleanEmail, scopeType: finalScopeType, scopeId: finalScopeId },
    });

    // Return plainTextPassword ONCE to the admin UI
    return NextResponse.json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: userId,
        email: cleanEmail,
        fullName: fullName || cleanEmail,
        role,
        scopeType: finalScopeType,
        scopeId: finalScopeId,
      },
      plainTextPassword, // Displayed once in dismissible admin modal, then discarded
    });
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json({ error: err.message || 'Failed to create user.' }, { status: 500 });
  }
}
