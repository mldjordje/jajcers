import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE, getAdminAuthToken } from '@/lib/admin-auth';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const currentCookieValue = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const isAuthenticated = currentCookieValue === getAdminAuthToken();

  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
