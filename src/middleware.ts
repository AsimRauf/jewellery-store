import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const verifyToken = async (token: string) => {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secretKey);
  return payload as { userId: string; role: string };
};

export async function middleware(request: NextRequest) {
  try {
    if (request.nextUrl.pathname === '/api/auth/refresh') {
      return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') || 
                        request.nextUrl.pathname.startsWith('/api/admin');
    
    const isRegularUserRoute = request.nextUrl.pathname === '/' || 
                              request.nextUrl.pathname.startsWith('/shop') ||
                              request.nextUrl.pathname.startsWith('/collections');
    
    const isProtectedApiRoute = request.nextUrl.pathname.startsWith('/api/user') ||
                               request.nextUrl.pathname.startsWith('/api/orders') ||
                               request.nextUrl.pathname.startsWith('/api/cart') ||
                               request.nextUrl.pathname.startsWith('/api/upload');

    if (request.nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === '/login') {
      if (token || refreshToken) {
        const response = NextResponse.next();
        if (token) {
          response.cookies.set('token', token, { httpOnly: true });
        }
        if (refreshToken) {
          response.cookies.set('refreshToken', refreshToken, { httpOnly: true });
        }
        return response;
      }
      return NextResponse.next();
    }

    if (!token && (isAdminRoute || isProtectedApiRoute)) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
      try {
        const decoded = await verifyToken(token);

        if (isAdminRoute && decoded.role !== 'admin') {
          if (request.nextUrl.pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
          }
          return NextResponse.redirect(new URL('/', request.url));
        }
        
        if (isRegularUserRoute && decoded.role === 'admin' && 
            !request.nextUrl.searchParams.has('bypass_admin_redirect')) {
          return NextResponse.redirect(new URL('/admin/rings/wedding', request.url));
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('userId', decoded.userId);
        requestHeaders.set('userRole', decoded.role);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        console.error('Token verification error:', error);
        if (!request.nextUrl.pathname.startsWith('/api/') && refreshToken) {
          return NextResponse.next();
        }
        
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Token expired' }, { status: 401 });
        }
        
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
    
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Make sure to include all routes that need protection
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/upload/:path*',
    '/api/user/:path*',
    '/api/orders/:path*', 
    '/api/cart/:path*',
    '/api/auth/refresh',
    '/login'
  ],
};