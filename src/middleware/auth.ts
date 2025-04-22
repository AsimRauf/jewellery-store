import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!token && !refreshToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if it's an admin route
    const isAdminRoute = request.nextUrl.pathname.startsWith('/api/admin') || 
                        request.nextUrl.pathname.startsWith('/admin');

    try {
      // Verify access token
      const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };

      // Check admin access
      if (isAdminRoute && decoded.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('userId', decoded.userId);
      requestHeaders.set('userRole', decoded.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
    } catch (error) {
      console.error('Token verification failed:', error);
      // Token expired, redirect to refresh endpoint
      if (refreshToken) {
        // Instead of handling refresh here, redirect to the dedicated endpoint
        const refreshUrl = new URL('/api/auth/refresh', request.url);
        return NextResponse.redirect(refreshUrl);
      }

      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/admin/:path*',
    '/api/orders/:path*', 
    '/api/cart/:path*',
    '/admin/:path*'
  ]
};
