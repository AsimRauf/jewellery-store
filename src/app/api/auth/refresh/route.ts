import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    console.log('Refresh endpoint called');
    
    // Get the refresh token from cookies using Next.js cookie API
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      console.log('No refresh token found in cookies');
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
        role: string;
      };
      console.log('Token verified successfully for user:', decoded.userId);
    } catch (error) {
      console.error('Refresh token verification error:', error);
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    
    // Connect to database and find user
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.log('User not found:', decoded.userId);
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    
    if (user.refreshToken !== refreshToken) {
      console.log('Token mismatch in database for user:', decoded.userId);
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email,
        isAdmin: user.role === 'admin',
        sessionId: `session_${user._id}_${Date.now()}`
      },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' } // Extended to 2 hours
    );
    
    // Generate new refresh token (rotating refresh tokens for better security)
    const newRefreshToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        sessionId: `refresh_${user._id}_${Date.now()}`
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '15d' } // Extended to 15 days
    );
    
    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();
    
    // Create response with new tokens
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
    
    // Set new tokens as cookies
    response.cookies.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/'
    });
    
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60, // 15 days
      path: '/'  // Make it available on all paths
    });
    
    // Check if there's a return URL in the query
    const url = request.nextUrl.searchParams.get('returnUrl');
    if (url && !url.includes('/api/auth/')) {
      console.log('Redirecting to:', url);
      return NextResponse.redirect(new URL(url, request.url));
    }
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}