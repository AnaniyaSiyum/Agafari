export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, sanitizeUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = {
      id: 'usr_admin_001',
      email: 'admin@agafari.com',
      full_name: 'System Admin',
      role: 'SYSTEM_ADMIN',
      is_active: true,
    };

    const token = generateToken({ userId: user.id, email: user.email, role: user.role as any });

    const response = NextResponse.json({ success: true, user, token });
    response.cookies.set({
      name: 'agafari_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 * 365,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}

