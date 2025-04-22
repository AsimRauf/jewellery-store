import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Get the refresh token from cookies
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }
    
    // Parse cookies to get refresh token
    const refreshTokenCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('refreshToken='));
      
    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }
    
    const refreshToken = refreshTokenCookie.split('=')[1];
    
    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
        role: string;
      };
    } catch (error) {
      console.error('Refresh token verification error:', error);
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    
    // Connect to database and find user
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        email: user.email,
        isAdmin: user.role === 'admin'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    // Generate new refresh token (rotating refresh tokens for better security)
    const newRefreshToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();
    
    // Create response with new tokens
    const response = NextResponse.json({
      message: 'Token refreshed successfully'
    });
    
    // Set new tokens as cookies
    response.cookies.set('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'  // Make it available on all paths
    });
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}