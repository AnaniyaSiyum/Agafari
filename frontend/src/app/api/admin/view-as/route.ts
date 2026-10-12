import { NextRequest, NextResponse } from 'next/server';
import { requireMembership, signSessionToken, verifySessionToken } from '@/lib/requireMembership';
import { logAudit } from '@/lib/audit';
import { queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
  const auth = await requireMembership(req, ['SYSTEM_ADMIN']);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { targetUserId, membershipId } = await req.json();
    if (!targetUserId && !membershipId) {
      return NextResponse.json({ error: 'targetUserId or membershipId is required.' }, { status: 400 });
    }

    const membership = await queryOne<any>(
      `SELECT m.id, m.user_id, m.role, m.scope_type, m.scope_id, m.status,
              u.email, u.full_name, u.session_version
       FROM memberships m
       JOIN users u ON m.user_id = u.id
       WHERE ${membershipId ? 'm.id = $1' : 'm.user_id = $1'} AND m.status = 'ACTIVE'
       LIMIT 1`,
      [membershipId || targetUserId]
    );

    if (!membership) {
      return NextResponse.json({ error: 'Target active membership not found.' }, { status: 404 });
    }

    const adminId = auth.user.id;

    // Issue signed session token in read-only view-as mode
    const viewAsToken = signSessionToken({
      userId: membership.user_id,
      email: membership.email,
      membershipId: membership.id,
      role: membership.role,
      scopeType: membership.scope_type,
      scopeId: membership.scope_id,
      sessionVersion: membership.session_version || 1,
      isViewAs: true,
      viewAsOriginalAdminId: adminId,
    });

    // Immutable audit log
    await logAudit({
      actorId: adminId,
      action: 'VIEW_AS_START',
      targetType: 'USER',
      targetId: membership.user_id,
      ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      metaJson: {
        targetRole: membership.role,
        scopeType: membership.scope_type,
        scopeId: membership.scope_id,
        readOnly: true,
      },
    });

    // Resolve target dashboard route
    let redirectUrl = '/admin';
    switch (membership.role) {
      case 'ORGANIZER_OWNER':
        redirectUrl = '/organizer';
        break;
      case 'COUPLE':
        redirectUrl = `/couple/${membership.scope_id}`;
        break;
      case 'GATE_SCANNER':
        redirectUrl = `/event/${membership.scope_id}/scanner`;
        break;
      case 'MEDIA_MODERATOR':
        redirectUrl = `/event/${membership.scope_id}/moderation`;
        break;
    }

    const res = NextResponse.json({
      success: true,
      message: `Switched to View-As mode for ${membership.email} (READ-ONLY).`,
      redirectUrl,
    });

    res.cookies.set('agafari_session', viewAsToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600 * 4,
    });

    return res;
  } catch (err: any) {
    console.error('View-As start error:', err);
    return NextResponse.json({ error: err.message || 'Failed to start view-as mode.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('agafari_session')?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session || !session.isViewAs || !session.viewAsOriginalAdminId) {
    return NextResponse.json({ error: 'Not currently in View-As mode.' }, { status: 400 });
  }

  const originalAdminId = session.viewAsOriginalAdminId;
  const adminUser = await queryOne<any>(
    `SELECT u.id, u.email, u.session_version, m.id AS membership_id, m.role, m.scope_type, m.scope_id
     FROM users u
     JOIN memberships m ON u.id = m.user_id
     WHERE u.id = $1 AND m.role = 'SYSTEM_ADMIN' AND m.status = 'ACTIVE'
     LIMIT 1`,
    [originalAdminId]
  );

  if (!adminUser) {
    return NextResponse.json({ error: 'Original admin account not found.' }, { status: 404 });
  }

  // Restore admin session
  const adminToken = signSessionToken({
    userId: adminUser.id,
    email: adminUser.email,
    membershipId: adminUser.membership_id,
    role: 'SYSTEM_ADMIN',
    scopeType: 'PLATFORM',
    scopeId: 'global',
    sessionVersion: adminUser.session_version || 1,
    isViewAs: false,
  });

  await logAudit({
    actorId: originalAdminId,
    action: 'VIEW_AS_STOP',
    targetType: 'USER',
    targetId: session.userId,
    ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
    metaJson: { revertedToAdmin: originalAdminId },
  });

  const res = NextResponse.json({
    success: true,
    message: 'Exited View-As mode.',
    redirectUrl: '/admin',
  });

  res.cookies.set('agafari_session', adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 86400 * 7,
  });

  return res;
}
