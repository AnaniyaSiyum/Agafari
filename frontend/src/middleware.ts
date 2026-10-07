import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const tokenCookie = req.cookies.get('agafari_token')?.value;

  // Protect Admin Dashboard Routes
  if (path.startsWith('/admin/dashboard')) {
    if (!tokenCookie) {
      const loginUrl = new URL('/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Organizer Dashboard Routes
  if (path.startsWith('/organizer/dashboard')) {
    if (!tokenCookie) {
      const loginUrl = new URL('/organizer/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Couple Dashboard Routes
  if (path.startsWith('/couple/dashboard')) {
    if (!tokenCookie) {
      const loginUrl = new URL('/couple/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/organizer/dashboard/:path*',
    '/couple/dashboard/:path*',
  ],
};
