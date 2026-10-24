export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, verifyPassword, hashPassword, logAuditAction } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';
import {
  checkAuthBruteForce,
  recordAuthFailure,
  recordAuthSuccess,
  buildRateLimitResponse,
  getClientIp,
} from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json({ error: 'Unauthorized — no active session.' }, { status: 401 });
  }

  const ipAddress = getClientIp(req);

  // Strict Brute-Force Rate Limiting on Password Verification (5 failed attempts / 15 min)
  const bruteCheck = checkAuthBruteForce(ipAddress, `self_pwd:${authUser.userId}`);
  if (!bruteCheck.allowed) {
    return buildRateLimitResponse(
      bruteCheck.retryAfterSeconds,
      `Too many failed password attempts. Account temporarily locked for security. Please try again in ${bruteCheck.retryAfterSeconds} seconds.`,
      5,
      0
    );
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Both current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    let passwordVerified = false;
    let dbUser: any = null;

    // 1. Mandatory Server-Side Verification of Current Password in DB
    try {
      dbUser = await queryOne<any>(
        'SELECT id, password_hash FROM users WHERE id = $1 OR LOWER(email) = LOWER($2)',
        [authUser.userId, authUser.email]
      );
      if (dbUser && dbUser.password_hash) {
        passwordVerified = verifyPassword(currentPassword, dbUser.password_hash);
      }
    } catch (e) {
      console.warn('DB self credentials verify fallback:', e);
    }

    // 2. Verify current password in mockStore if DB lookup did not succeed
    if (!passwordVerified) {
      const mockUser = mockStore.users.find(
        (u) => u.id === authUser.userId || (u.email || '').toLowerCase() === authUser.email.toLowerCase()
      );
      if (mockUser) {
        passwordVerified =
          (mockUser.passwordHash && verifyPassword(currentPassword, mockUser.passwordHash)) ||
          mockUser.temporaryPassword === currentPassword;
      }
    }

    if (!passwordVerified) {
      recordAuthFailure(ipAddress, `self_pwd:${authUser.userId}`);
      await logAuditAction({
        actorId: authUser.userId,
        targetUserId: authUser.userId,
        action: 'SELF_PASSWORD_CHANGE_FAILED',
        ipAddress,
        details: { reason: 'Invalid current password' },
      });

      return NextResponse.json(
        { error: 'Current password verification failed. Please enter your exact current password.' },
        { status: 400 }
      );
    }

    recordAuthSuccess(ipAddress, `self_pwd:${authUser.userId}`);

    // Hash new password server-side before storing
    const newHash = hashPassword(newPassword.trim());

    // 3. Update Database Record
    try {
      await query(
        'UPDATE users SET password_hash = $1 WHERE id = $2 OR LOWER(email) = LOWER($3)',
        [newHash, authUser.userId, authUser.email]
      );
    } catch (e) {
      console.warn('DB self credentials update fallback:', e);
    }

    // 4. Update mockStore
    const mockUser = mockStore.users.find(
      (u) => u.id === authUser.userId || (u.email || '').toLowerCase() === authUser.email.toLowerCase()
    );
    if (mockUser) {
      mockUser.passwordHash = newHash;
      mockUser.temporaryPassword = newPassword.trim();
    }

    await logAuditAction({
      actorId: authUser.userId,
      targetUserId: authUser.userId,
      action: 'SELF_PASSWORD_CHANGE_SUCCESS',
      ipAddress,
      details: { email: authUser.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been changed successfully.',
    });
  } catch (error) {
    console.error('Self password change error:', error);
    return NextResponse.json(
      { error: 'Failed to update your password.' },
      { status: 500 }
    );
  }
}
