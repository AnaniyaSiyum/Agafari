import { NextRequest, NextResponse } from 'next/server';
import { requireMembership } from '@/lib/requireMembership';
import { hashPassword, generateStrongPassword } from '@/lib/passwords';
import { logAudit } from '@/lib/audit';
import { query, queryOne } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const requestId = params.id;
  const adminId = auth.user.id;

  const request = await queryOne<any>('SELECT * FROM account_requests WHERE id = $1', [requestId]);
  if (!request) {
    return NextResponse.json({ error: 'Request not found.' }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = (body.action || 'APPROVE').toUpperCase();

    const details = typeof request.details_json === 'string'
      ? JSON.parse(request.details_json)
      : request.details_json;

    const email = details.email;
    const user = await queryOne<any>('SELECT id, status FROM users WHERE email = $1', [email]);

    if (action === 'REJECT') {
      await query(
        `UPDATE account_requests SET status = 'REJECTED', handled_by = $1, updated_at = NOW() WHERE id = $2`,
        [adminId, requestId]
      );

      if (user) {
        await query(`UPDATE users SET status = 'DISABLED' WHERE id = $1`, [user.id]);
        await query(`UPDATE memberships SET status = 'DISABLED' WHERE user_id = $1`, [user.id]);
      }

      await logAudit({
        actorId: adminId,
        action: 'ACCOUNT_REQUEST_REJECTED',
        targetType: 'ACCOUNT_REQUEST',
        targetId: requestId,
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        metaJson: { requestId, email },
      });

      return NextResponse.json({ success: true, message: 'Account request rejected.' });
    }

    // ACTION: APPROVE
    const customPassword = body.password;
    const plainTextPassword =
      customPassword && String(customPassword).trim().length >= 8
        ? String(customPassword).trim()
        : generateStrongPassword(16);

    const passwordHash = await hashPassword(plainTextPassword);

    if (user) {
      await query(
        `UPDATE users
         SET password_hash = $1,
             password_set_by = $2,
             password_set_at = NOW(),
             status = 'ACTIVE',
             session_version = session_version + 1
         WHERE id = $3`,
        [passwordHash, adminId, user.id]
      );

      await query(
        `UPDATE memberships SET status = 'ACTIVE' WHERE user_id = $1 AND scope_id = $2`,
        [user.id, request.scope_id]
      );
    }

    await query(
      `UPDATE account_requests SET status = 'DONE', handled_by = $1, updated_at = NOW() WHERE id = $2`,
      [adminId, requestId]
    );

    await logAudit({
      actorId: adminId,
      action: 'ACCOUNT_REQUEST_APPROVED',
      targetType: 'ACCOUNT_REQUEST',
      targetId: requestId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { requestId, email, role: request.role, scopeId: request.scope_id },
    });

    return NextResponse.json({
      success: true,
      message: 'Account request approved and activated. Passwords must be delivered via private secure channels.',
      email,
      role: request.role,
      scopeId: request.scope_id,
      plainTextPassword, // Displayed once, then discarded
    });
  } catch (err: any) {
    console.error('Error handling request:', err);
    return NextResponse.json({ error: err.message || 'Failed to process request.' }, { status: 500 });
  }
}
