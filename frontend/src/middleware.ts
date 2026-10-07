import { NextRequest, NextResponse } from 'next/server';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  exp?: number;
}

// Edge-compatible JWT verification helper using Web Crypto API
async function verifyJwtInMiddleware(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;

    const secret = process.env.JWT_SECRET || 'agafari-super-secret-jwt-key-2026-production';
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
    const sigPad = sigBase64.padEnd(sigBase64.length + (4 - (sigBase64.length % 4)) % 4, '=');
    const sigBytes = Uint8Array.from(atob(sigPad), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!isValid) return null;

    const payloadJson = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload: JwtPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get('agafari_token')?.value;

  // 1. Verify token signature & expiration if cookie exists
  const user = tokenCookie ? await verifyJwtInMiddleware(tokenCookie) : null;

  // 2. Protect System Admin routes (/system-admin, /system-admin/*)
  if (path === '/system-admin' || path.startsWith('/system-admin/')) {
    if (!user) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: Only SYSTEM_ADMIN can access system-admin routes
    if (user.role !== 'SYSTEM_ADMIN') {
      const adminUrl = new URL('/admin/dashboard', req.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  // 3. Protect General Admin routes (/admin, /admin/* EXCEPT /admin/login)
  if (
    (path === '/admin' || path.startsWith('/admin/')) &&
    !path.startsWith('/admin/login')
  ) {
    if (!user) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }

    // Role check: SYSTEM_ADMIN and EVENT_ORGANIZER / ADMIN allowed
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Protect Organizer Dashboard Routes
  if (path.startsWith('/organizer/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Protect Couple Dashboard Routes
  if (path.startsWith('/couple/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/system-admin',
    '/system-admin/:path*',
    '/organizer/dashboard/:path*',
    '/couple/dashboard/:path*',
  ],
};
