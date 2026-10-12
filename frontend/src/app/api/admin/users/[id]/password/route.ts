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

  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  const targetUser = await queryOne<any>('SELECT id, email, status FROM users WHERE id = $1', [userId]);
  if (!targetUser) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const customPassword = body.password;

    // Generate strong password or use provided
    const plainTextPassword =
      customPassword && String(customPassword).trim().length >= 8
        ? String(customPassword).trim()
        : generateStrongPassword(16);

    const passwordHash = await hashPassword(plainTextPassword);
    const adminId = auth.user.id;

    // Invalidate all existing sessions by incrementing session_version
    await query(
      `UPDATE users
       SET password_hash = $1,
           password_set_by = $2,
           password_set_at = NOW(),
           status = 'ACTIVE',
           session_version = session_version + 1
       WHERE id = $3`,
      [passwordHash, adminId, userId]
    );

    // Audit log (plaintext omitted)
    await logAudit({
      actorId: adminId,
      action: 'PASSWORD_RESET',
      targetType: 'USER',
      targetId: userId,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: { email: targetUser.email, targetUserId: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. All previous user sessions are now terminated.',
      plainTextPassword, // Shown once to admin
    });
  } catch (err: any) {
    console.error('Password reset error:', err);
    return NextResponse.json({ error: err.message || 'Failed to reset password.' }, { status: 500 });
  }
}
