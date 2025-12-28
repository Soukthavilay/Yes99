import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ໝາຍເຫດ: Middleware ຂອງ Next.js UI ຈະໃຊ້ Edge Runtime 
// ເຊິ່ງບໍ່ສາມາດອ່ານ localStorage ໄດ້, ດັ່ງນັ້ນພວກເຮົາຈະອີງໃສ່ Cookies

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ອະນຸຍາດໃຫ້ເຂົ້າ Public Routes
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/_next') || 
    pathname === '/favicon.ico' ||
    pathname === '/mockServiceWorker.js' ||
    pathname.startsWith('/customer/order/')
  ) {
    return NextResponse.next();
  }

  // 2. ກວດສອບ Auth Token ຈາກ Cookie (BFF Approach)
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    // ຖ້າບໍ່ມີ Token ໃຫ້ໄປໜ້າ Login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. RBAC Logic: ກວດສອບ Role ຈາກ Cookie (ປົກກະຕິ Backend ຈະ Encode Role ໄວ້ໃນ JWT)
  const userRole = request.cookies.get('user_role')?.value;

  // ຕົວຢ່າງການກວດສອບ Route ຕາມ Role
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (pathname.startsWith('/inventory') && !['ADMIN', 'STOCK'].includes(userRole || '')) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Config ວ່າຈະໃຫ້ Middleware ເຮັດວຽກຢູ່ Paths ໃດແດ່
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
