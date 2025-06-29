import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/utils/db';
import User from '@/models/User';

interface JWTPayload {
  userId: string;
  role: string;
  email: string;
  isAdmin: boolean;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isAdmin: boolean;
  sessionId: string;
}



/**
 * Middleware to verify JWT token and optionally check for admin role
 */
export async function verifyAuth(
  request: NextRequest, 
  requireAdmin: boolean = false
): Promise<{ success: boolean; user?: AuthUser; error?: string; status?: number }> {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return { 
        success: false, 
        error: 'Authentication required - No token provided', 
        status: 401 
      };
    }

    // Verify token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch {
      // Token expired or invalid
      return { 
        success: false, 
        error: 'Invalid or expired token', 
        status: 401 
      };
    }

    // Connect to database to verify user still exists and is active
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return { 
        success: false, 
        error: 'User not found or inactive', 
        status: 401 
      };
    }

    // Check if user is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return { 
        success: false, 
        error: `Account is temporarily locked. Please try again in ${waitMinutes} minutes.`, 
        status: 423 
      };
    }

    // Check admin role if required
    if (requireAdmin && decoded.role !== 'admin') {
      return { 
        success: false, 
        error: 'Admin access required', 
        status: 403 
      };
    }

    // Return successful authentication
    return {
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        isAdmin: decoded.isAdmin,
        sessionId: decoded.sessionId
      }
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return { 
      success: false, 
      error: 'Authentication failed', 
      status: 500 
    };
  }
}

/**
 * Helper function to create authenticated API response
 */
export function createAuthErrorResponse(error: string, status: number = 401) {
  return NextResponse.json({ error }, { status });
}

/**
 * Wrapper for admin-only API routes
 */
export async function withAdminAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await verifyAuth(request, true);
  
  if (!authResult.success) {
    return createAuthErrorResponse(
      authResult.error || 'Authentication failed', 
      authResult.status || 401
    );
  }

  return handler(request, authResult.user!);
}

/**
 * Wrapper for user-authenticated API routes
 */
export async function withUserAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const authResult = await verifyAuth(request, false);
  
  if (!authResult.success) {
    return createAuthErrorResponse(
      authResult.error || 'Authentication failed', 
      authResult.status || 401
    );
  }

  return handler(request, authResult.user!);
}
