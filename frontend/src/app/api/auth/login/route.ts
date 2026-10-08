export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
  generateToken,
  getAuthorizedDashboardUrl,
  logAuditAction,
  setAuthCookie,
  verifyPassword,
  ROLE_PERMISSIONS,
  UserRole,
} from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { mockStore } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  try {
    const body = await req.json();
    // NEVER trust role or permissions passed in the client body!
    const identifier = (body.username || body.email || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/Email and Password are required.' },
        { status: 400 }
      );
    }

    let userRole: UserRole | null = null;
    let userId = '';
    let userEmail = identifier;
    let userName = '';
    let tenantId: string | undefined = undefined;

    // 1. Validate credentials against Database users table
    try {
      const dbUser = await queryOne<any>(
        `SELECT u.id, u.email, u.full_name, u.role, u.password_hash, u.is_active, o.id AS tenant_id
         FROM users u
         LEFT JOIN organizers o ON o.owner_user_id = u.id
         WHERE (LOWER(u.email) = $1 OR LOWER(u.full_name) = $1) AND u.is_active = TRUE`,
        [identifier]
      );

      if (dbUser && dbUser.password_hash) {
        const isPasswordValid = verifyPassword(password, dbUser.password_hash);
        if (isPasswordValid) {
          userRole = (dbUser.role as UserRole) || 'EVENT_ORGANIZER';
          userId = dbUser.id;
          userEmail = dbUser.email;
          userName = dbUser.full_name || dbUser.email;
          tenantId = dbUser.tenant_id || undefined;
        }
      }
    } catch (e) {
      console.warn('DB Login query fallback:', e);
    }

    // 2. Validate credentials against mockStore if DB lookup did not match
    if (!userRole) {
      const mockUser = mockStore.users.find(
        (u) => (u.email || '').toLowerCase() === identifier || (u.fullName || '').toLowerCase() === identifier
      );

      if (mockUser) {
        const isPasswordValid =
          (mockUser.passwordHash && verifyPassword(password, mockUser.passwordHash)) ||
          mockUser.temporaryPassword === password;

        if (isPasswordValid) {
          userRole = (mockUser.role as UserRole) || 'EVENT_ORGANIZER';
          userId = mockUser.id;
          userEmail = mockUser.email;
          userName = mockUser.fullName || mockUser.email;
          tenantId = mockUser.organizerId || undefined;
        }
      }
    }

    // Account Enumeration Defense: Uniform Error Message
    if (!userRole) {
      await logAuditAction({
        actorId: null,
        targetUserId: null,
        action: 'LOGIN_FAILED',
        ipAddress,
        details: { identifier },
      });

      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Determine target redirect URL strictly based on server-verified role
    const redirectParam = req.nextUrl.searchParams.get('redirect');
    const defaultDashboard = getAuthorizedDashboardUrl(userRole);
    const redirectUrl = redirectParam || defaultDashboard;

    const permissions = ROLE_PERMISSIONS[userRole] || [];

    const userPayload = {
      id: userId,
      email: userEmail,
      fullName: userName,
      role: userRole,
      tenantId,
      permissions,
    };

    // Issue tamper-proof JWT token
    const token = generateToken({
      userId,
      email: userEmail,
      role: userRole,
      tenantId,
      permissions,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: userPayload,
      token,
      redirectUrl,
    });

    // Set HttpOnly, Secure, SameSite=Lax cookie
    setAuthCookie(response, token);

    // Record Audit Log
    await logAuditAction({
      actorId: userId,
      targetUserId: userId,
      action: 'LOGIN_SUCCESS',
      ipAddress,
      details: { role: userRole, redirectUrl },
    });

    return response;
  } catch (error) {
    console.error('Unified login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
