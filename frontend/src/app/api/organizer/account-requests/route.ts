import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireMembership } from '@/lib/requireMembership';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';
import { AppRole } from '@/types/auth';

export async function GET(req: NextRequest) {
  const auth = await requireMembership(req, ['ORGANIZER_OWNER', 'SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const requests = await query<any>(`
    SELECT id, requested_by, role, scope_id, details_json, status, handled_by, created_at, updated_at
    FROM account_requests
    ORDER BY created_at DESC
  `);

  return NextResponse.json({ success: true, requests });
}

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['ORGANIZER_OWNER', 'SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const { role, eventId, scopeId, fullName, email, phone, notes } = body;

    const targetScopeId = eventId || scopeId;
    if (!role || !targetScopeId || !email) {
      return NextResponse.json({ error: 'Role, eventId, and email are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const allowedStaffRoles: AppRole[] = ['COUPLE', 'GATE_SCANNER', 'MEDIA_MODERATOR'];
    if (!allowedStaffRoles.includes(role as AppRole)) {
      return NextResponse.json({ error: 'Invalid requested role. Allowed: COUPLE, GATE_SCANNER, MEDIA_MODERATOR' }, { status: 400 });
    }

    const requestId = `req-${crypto.randomUUID()}`;
    const userId = `usr-${crypto.randomUUID()}`;
    const membershipId = `mem-${crypto.randomUUID()}`;
    const organizerId = auth.user.id;

    // 1. Create or check user
    const existingUser = await queryOne<any>('SELECT id, status FROM users WHERE email = $1', [cleanEmail]);
    let targetUserId = existingUser?.id;

    if (!targetUserId) {
      targetUserId = userId;
      // Account stays PENDING and cannot log in until system admin sets password and activates
      await query(
        `INSERT INTO users (id, email, phone, full_name, password_hash, status, session_version, created_at)
         VALUES ($1, $2, $3, $4, NULL, 'PENDING', 1, NOW())`,
        [targetUserId, cleanEmail, phone || null, fullName || cleanEmail]
      );
    }

    // 2. Insert disabled membership
    await query(
      `INSERT INTO memberships (id, user_id, role, scope_type, scope_id, status, created_at)
       VALUES ($1, $2, $3, 'EVENT', $4, 'DISABLED', NOW())`,
      [membershipId, targetUserId, role as AppRole, targetScopeId]
    );

    // 3. Insert account request
    const detailsJson = JSON.stringify({ fullName, email: cleanEmail, phone, notes });
    await query(
      `INSERT INTO account_requests (id, requested_by, role, scope_id, details_json, status, created_at)
       VALUES ($1, $2, $3, $4, $5, 'OPEN', NOW())`,
      [requestId, organizerId, role, targetScopeId, detailsJson]
    );

    // 4. Audit Log
    await logAudit({
      actorId: organizerId,
      action: 'ACCOUNT_REQUEST_CREATED',
      targetType: 'ACCOUNT_REQUEST',
      targetId: requestId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { role, eventId: targetScopeId, email: cleanEmail },
    });

    return NextResponse.json({
      success: true,
      message: 'Account request submitted. The account is PENDING until the System Admin sets a password and activates it.',
      requestId,
      status: 'PENDING',
    });
  } catch (err: any) {
    console.error('Error submitting account request:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit request.' }, { status: 500 });
  }
}
