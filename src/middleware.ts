import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/_next', '/favicon.ico', '/customer'];

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  owner: ['/pos', '/inventory', '/kitchen', '/reports', '/admin'],
  waiter: ['/pos', '/kitchen'],
  chef: ['/kitchen'],
  bartender: ['/kitchen'],
  cashier: ['/pos'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const userRole = request.cookies.get('user_role')?.value;
  if (userRole) {
    const allowed = ROLE_ROUTE_MAP[userRole];
    const hasAccess = allowed?.some((prefix) => pathname.startsWith(prefix));
    if (allowed && !hasAccess) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
