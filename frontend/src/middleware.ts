import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, buildRateLimitResponse } from '@/lib/rateLimit';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
  permissions?: string[];
  exp?: number;
}

// Edge-compatible Web Crypto JWT verification
async function verifyJwtInMiddleware(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, signature] = parts;

    const secret = process.env.JWT_SECRET || 'agafari_super_secret_jwt_key_2026_change_in_production_32bytes';
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
    const sigPad = sigBase64.padEnd(sigBase64.length + ((4 - (sigBase64.length % 4)) % 4), '=');
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

  // Standard API rate limiter across all /api/* routes (120 req/min per IP)
  if (path.startsWith('/api/')) {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`general_api:${ip}`, { max: 120, windowSeconds: 60 });
    if (!rateCheck.success) {
      return buildRateLimitResponse(rateCheck.retryAfterSeconds, undefined, 120, 0);
    }
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get('agafari_session')?.value || req.cookies.get('agafari_token')?.value;

  // Verify JWT session cookie
  const user = tokenCookie ? await verifyJwtInMiddleware(tokenCookie) : null;

  // 1. Legacy Login Page Redirects to Unified Gateway preserving target
  if (path === '/admin/login' || path === '/organizer/login' || path === '/couple/login') {
    const loginUrl = new URL('/login', req.url);
    if (req.nextUrl.searchParams.has('redirect')) {
      loginUrl.searchParams.set('redirect', req.nextUrl.searchParams.get('redirect')!);
    } else {
      loginUrl.searchParams.set('redirect', path.replace(/\/login$/, ''));
    }
    return NextResponse.redirect(loginUrl);
  }

  // Helper function to build standard unauthenticated redirect preserving original target path and query
  const redirectToLogin = () => {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  };

  // Skip auth checks for public guest feeds (e.g. /:organizerSlug/:eventSlug/feed)
  if (path.endsWith('/feed')) {
    return NextResponse.next();
  }

  // Classify dashboard routes
  const isSystemAdminRoute = path === '/system-admin' || path.startsWith('/system-admin/');
  const isAdminRoute = (path === '/admin' || path.startsWith('/admin/')) && !path.startsWith('/admin/login');
  const isOrganizerDashboard = path === '/organizer' || path.startsWith('/organizer/');
  const isCoupleDashboard =
    path.startsWith('/couple/') ||
    (path.endsWith('/couple') && path !== '/couple') ||
    path.endsWith('/couple-portal');
  const isScannerRoute = path === '/scanner' || path.startsWith('/scanner/') || path.endsWith('/scanner');
  const isLiveStreamerRoute = path === '/live-streamer' || path.startsWith('/live-streamer/') || path.endsWith('/live-streamer');
  const isModerationRoute = path === '/moderation' || path.startsWith('/moderation/') || path.endsWith('/moderation');

  // Detect Dedicated Organizer Event Control Dashboard: /[organizerSlug]/[eventSlug]
  const pathSegments = path.split('/').filter(Boolean);
  const isDedicatedOrganizerControlPage =
    pathSegments.length === 2 &&
    !['admin', 'system-admin', 'organizer', 'login', 'api', 'event', 'couple', '_next', 'branding', 'images', 'favicon.ico'].includes(pathSegments[0].toLowerCase());

  // Helper for authenticated role redirects to prevent login loop
  const redirectAuthenticatedUser = (u: JwtPayload) => {
    if (u.role === 'COUPLE' || u.role === 'BRIDE_GROOM') {
      const coupleSlug = u.eventSlug || u.slug || u.scopeId;
      return NextResponse.redirect(new URL(coupleSlug ? `/couple/${encodeURIComponent(coupleSlug)}` : '/', req.url));
    }
    if (u.role === 'EVENT_ORGANIZER' || u.role === 'ORGANIZER_OWNER') {
      return NextResponse.redirect(new URL('/organizer', req.url));
    }
    if (u.role === 'SYSTEM_ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return redirectToLogin();
  };

  // 3. Protect Dedicated Organizer Event Control Pages (e.g., /[organizerSlug]/[eventSlug])
  if (isDedicatedOrganizerControlPage) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  // 4. Protect System Admin routes (/system-admin, /system-admin/*)
  if (isSystemAdminRoute) {
    if (!user) return redirectToLogin();
    if (user.role !== 'SYSTEM_ADMIN') {
      return redirectAuthenticatedUser(user);
    }
  }

  // 5. Protect General Admin routes (/admin, /admin/*)
  if (isAdminRoute) {
    if (!user) return redirectToLogin();
    if (user.role !== 'SYSTEM_ADMIN') {
      return redirectAuthenticatedUser(user);
    }
    if (path === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
  }

  // 6. Protect Couple Dashboard & Portal Routes (/couple, /couple/*, */couple, */couple-portal)
  if (isCoupleDashboard) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['BRIDE_GROOM', 'COUPLE', 'SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  // 7. Protect Gate Scanner Control Routes (/scanner, */scanner)
  if (isScannerRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['GATE_SCANNER', 'SYSTEM_ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  // 8. Protect Live Streamer Studio Routes (/live-streamer, */live-streamer)
  if (isLiveStreamerRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['LIVE_STREAMER', 'SYSTEM_ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  // 9. Protect Media Moderation Suite Routes (/moderation, */moderation)
  if (isModerationRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['MEDIA_MODERATOR', 'MODERATOR', 'SYSTEM_ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  // 10. Protect Organizer Dashboard Routes (/organizer, /organizer/*)
  if (isOrganizerDashboard) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER'];
    if (!allowedRoles.includes(user.role)) {
      return redirectAuthenticatedUser(user);
    }
  }

  const response = NextResponse.next();

  // Inject user identity headers for downstream API processing if authenticated
  if (user) {
    response.headers.set('X-User-Id', user.userId);
    response.headers.set('X-User-Role', user.role);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin',
    '/admin/:path*',
    '/system-admin',
    '/system-admin/:path*',
    '/organizer',
    '/organizer/:path*',
    '/couple',
    '/couple/:path*',
    '/scanner',
    '/scanner/:path*',
    '/live-streamer',
    '/live-streamer/:path*',
    '/moderation',
    '/moderation/:path*',
    '/:organizerSlug/:eventSlug',
    '/:organizerSlug/:eventSlug/:path*',
    '/event/:slug/couple',
    '/event/:slug/couple-portal',
    '/event/:slug/scanner',
    '/event/:slug/live-streamer',
    '/event/:slug/moderation',
  ],
};
