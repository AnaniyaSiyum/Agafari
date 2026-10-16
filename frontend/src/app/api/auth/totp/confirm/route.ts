import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { verifyTotpCode } from '@/lib/totp';
import { signSessionToken, verifySessionToken, verifyPassword, getClientIp } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body.code || body.totpCode || '').trim();
    const setupToken = body.setupToken || req.cookies.get('agafari_setup_session')?.value;
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password ? String(body.password).trim() : null;

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit verification code.' }, { status: 400 });
    }

    let userId: string | null = null;

    // 1. Authenticate via limited setup token
    if (setupToken) {
      const payload = verifySessionToken(setupToken);
      if (payload && payload.userId && (payload.role === 'TOTP_SETUP' || payload.role === 'SYSTEM_ADMIN')) {
        userId = payload.userId;
      }
    }

    // 2. Fallback: Authenticate via credentials
    if (!userId && email && password) {
      const u = await queryOne<any>(
        'SELECT id, password_hash, status FROM users WHERE LOWER(email) = $1 LIMIT 1',
        [email]
      );
      if (u && (u.status === 'ACTIVE' || u.status === 'active') && u.password_hash) {
        const isValid = await verifyPassword(password, u.password_hash);
        if (isValid) {
          userId = u.id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired setup session. Please sign in again.' },
        { status: 401 }
      );
    }

    // 3. Fetch user and verify TOTP code against secret
    const user = await queryOne<any>(
      `SELECT id, email, full_name, role, totp_secret, totp_enabled, session_version 
       FROM users 
       WHERE id = $1 LIMIT 1`,
      [userId]
    );

    if (!user || !user.totp_secret) {
      return NextResponse.json(
        { error: 'No 2FA configuration found for this user. Please start setup again.' },
        { status: 400 }
      );
    }

    const isValidCode = verifyTotpCode(user.totp_secret, code);
    if (!isValidCode) {
      await logAudit({
        actorId: user.id,
        action: 'TOTP_SETUP_FAILED',
        targetType: 'USER',
        targetId: user.id,
        ip,
        metaJson: { reason: 'INVALID_CODE' },
      });
      return NextResponse.json({ error: 'Invalid 6-digit code. Please check your authenticator app and try again.' }, { status: 401 });
    }

    // 4. Mark TOTP as permanently enabled in the database
    await query('UPDATE users SET totp_enabled = 1 WHERE id = $1', [user.id]);

    await logAudit({
      actorId: user.id,
      action: 'TOTP_ENROLLMENT_CONFIRMED',
      targetType: 'USER',
      targetId: user.id,
      ip,
      metaJson: { email: user.email },
    });

    // 5. Issue full SYSTEM_ADMIN session token
    const fullSessionToken = signSessionToken({
      userId: user.id,
      email: user.email,
      membershipId: `mem-admin-${user.id}`,
      role: 'SYSTEM_ADMIN',
      scopeType: 'PLATFORM',
      scopeId: 'global',
      tenantId: 'global',
      sessionVersion: user.session_version || 1,
      isViewAs: false,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Two-factor authentication successfully enabled. Welcome to System Admin.',
      token: fullSessionToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || 'System Super Admin',
        role: 'SYSTEM_ADMIN',
        membershipRole: 'SYSTEM_ADMIN',
        scopeId: 'global',
        organizerId: 'global',
        tenantId: 'global',
      },
      redirectUrl: '/admin',
    });

    // Clear limited setup session cookie and set full production session cookie
    response.cookies.delete('agafari_setup_session');

    response.cookies.set('agafari_session', fullSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
