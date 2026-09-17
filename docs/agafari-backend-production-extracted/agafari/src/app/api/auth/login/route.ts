export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyPassword, sanitizeUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await queryOne<{
      id: string;
      email: string;
      password_hash: string;
      full_name: string;
      role: string;
      is_active: boolean;
    }>('SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE lower(email) = lower($1)', [
      email.trim(),
    ]);

    if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
      // Same error for "no such user" and "wrong password" — don't leak which one.
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role as any });

    const response = NextResponse.json({ success: true, user: sanitizeUser(user), token });
    response.cookies.set({
      name: 'agafari_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}
