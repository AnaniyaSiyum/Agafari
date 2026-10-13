import { NextRequest, NextResponse } from 'next/server';

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

function getHomeDashboardForRole(role: string): string {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return '/admin';
    case 'ORGANIZER_OWNER':
    case 'EVENT_ORGANIZER':
      return '/organizer';
    case 'COUPLE':
    case 'BRIDE_GROOM':
      return '/couple/dashboard';
    case 'GATE_SCANNER':
      return '/scanner';
    case 'LIVE_STREAMER':
      return '/live-streamer';
    case 'MEDIA_MODERATOR':
    case 'MODERATOR':
      return '/moderation';
    default:
      return '/login';
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get('agafari_session')?.value || req.cookies.get('agafari_token')?.value;

  // Verify JWT session cookie
  const user = tokenCookie ? await verifyJwtInMiddleware(tokenCookie) : null;

  // 1. Legacy Login Page Redirects to Unified Gateway
  if (path === '/admin/login' || path === '/organizer/login' || path === '/couple/login') {
    const loginUrl = new URL('/login', req.url);
    if (req.nextUrl.searchParams.has('redirect')) {
      loginUrl.searchParams.set('redirect', req.nextUrl.searchParams.get('redirect')!);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already Authenticated User Visiting /login
  if (path === '/login' && user) {
    const redirectParam = req.nextUrl.searchParams.get('redirect');
    const targetUrl = redirectParam || getHomeDashboardForRole(user.role);
    return NextResponse.redirect(new URL(targetUrl, req.url));
  }

  // Helper function to build standard unauthenticated redirect
  const redirectToLogin = () => {
    return NextResponse.redirect(new URL('/login', req.url));
  };

  // Helper function to handle unauthorized role access (redirect to user's authorized home)
  const redirectToAuthorizedHome = () => {
    if (!user) return redirectToLogin();
    const authorizedHome = getHomeDashboardForRole(user.role);
    return NextResponse.redirect(new URL(authorizedHome, req.url));
  };

  // Skip auth checks for public guest feeds (e.g. /:organizerSlug/:eventSlug/feed)
  if (path.endsWith('/feed')) {
    return NextResponse.next();
  }

  // Classify dashboard routes
  const isSystemAdminRoute = path === '/system-admin' || path.startsWith('/system-admin/');
  const isAdminRoute = (path === '/admin' || path.startsWith('/admin/')) && !path.startsWith('/admin/login');
  const isOrganizerDashboard = path === '/organizer' || path === '/organizer/dashboard' || path.startsWith('/organizer/dashboard/');
  const isCoupleDashboard = path === '/couple/dashboard' || path.startsWith('/couple/dashboard/') || path.startsWith('/couple/') || path.endsWith('/couple') || path.endsWith('/couple-portal');
  const isScannerRoute = path === '/scanner' || path.startsWith('/scanner/') || path.endsWith('/scanner');
  const isLiveStreamerRoute = path === '/live-streamer' || path.startsWith('/live-streamer/') || path.endsWith('/live-streamer');
  const isModerationRoute = path === '/moderation' || path.startsWith('/moderation/') || path.endsWith('/moderation');

  // Detect Dedicated Organizer Event Control Dashboard: /[organizerSlug]/[eventSlug]
  const pathSegments = path.split('/').filter(Boolean);
  const isDedicatedOrganizerControlPage =
    pathSegments.length === 2 &&
    !['admin', 'system-admin', 'organizer', 'login', 'api', 'event', 'couple', '_next', 'branding', 'images', 'favicon.ico'].includes(pathSegments[0].toLowerCase());

  // 3. Protect Dedicated Organizer Event Control Pages (e.g., /[organizerSlug]/[eventSlug])
  if (isDedicatedOrganizerControlPage) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'ORGANIZER_OWNER'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }

    // Strict Multi-Tenant Isolation Guard:
    // Organizers cannot navigate into another agency's dedicated event dashboard
    if (user.role === 'EVENT_ORGANIZER' || user.role === 'ORGANIZER_OWNER') {
      const requestedOrgSlug = pathSegments[0].toLowerCase().replace(/^org-/, '');
      const userOrgSlug = (user.tenantId || user.userId || '').toLowerCase().replace(/^org-/, '');
      if (requestedOrgSlug && userOrgSlug && requestedOrgSlug !== userOrgSlug) {
        return redirectToAuthorizedHome();
      }
    }
  }

  // 4. Protect System Admin routes (/system-admin, /system-admin/*)
  if (isSystemAdminRoute) {
    if (!user) return redirectToLogin();
    if (user.role !== 'SYSTEM_ADMIN') {
      return redirectToAuthorizedHome();
    }
  }

  // 5. Protect General Admin routes (/admin, /admin/*)
  if (isAdminRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }
  }

  // 6. Protect Organizer Dashboard Routes (/organizer/dashboard, /organizer/dashboard/*)
  if (isOrganizerDashboard) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }
  }

  // 7. Protect Couple Dashboard & Portal Routes (/couple/dashboard, */couple, */couple-portal)
  if (isCoupleDashboard) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'BRIDE_GROOM'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }
  }

  // 8. Protect Gate Scanner Control Routes (/scanner, */scanner)
  if (isScannerRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'GATE_SCANNER', 'BRIDE_GROOM'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }
  }

  // 9. Protect Live Streamer Studio Routes (/live-streamer, */live-streamer)
  if (isLiveStreamerRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'LIVE_STREAMER', 'BRIDE_GROOM'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
    }
  }

  // 10. Protect Media Moderation Suite Routes (/moderation, */moderation)
  if (isModerationRoute) {
    if (!user) return redirectToLogin();
    const allowedRoles = ['SYSTEM_ADMIN', 'EVENT_ORGANIZER', 'MODERATOR', 'BRIDE_GROOM'];
    if (!allowedRoles.includes(user.role)) {
      return redirectToAuthorizedHome();
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
    '/login',
    '/admin/login',
    '/organizer/login',
    '/couple/login',
    '/admin',
    '/admin/:path*',
    '/system-admin',
    '/system-admin/:path*',
    '/organizer/dashboard',
    '/organizer/dashboard/:path*',
    '/couple/dashboard',
    '/couple/dashboard/:path*',
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
