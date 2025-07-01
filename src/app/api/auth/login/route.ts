import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, password, isAdmin } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.isActive) {
      return NextResponse.json({ 
        error: 'Invalid credentials or account is inactive' 
      }, { status: 401 });
    }

    // Check for account lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return NextResponse.json({ 
        error: `Account is temporarily locked. Please try again in ${waitMinutes} minutes.` 
      }, { status: 423 });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.save();
        return NextResponse.json({ 
          error: 'Account locked. Too many failed attempts. Please try again later.' 
        }, { status: 423 });
      }
      
      await user.save();
      return NextResponse.json({ 
        error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.` 
      }, { status: 401 });
    }

    // Check admin access if requested
    if (isAdmin && user.role !== 'admin') {
      console.log(`Unauthorized admin access attempt for user: ${email}`);
      return NextResponse.json({ 
        error: 'Unauthorized access. Admin privileges required.' 
      }, { status: 403 });
    }

    // Reset login security measures on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    // Generate tokens with role-specific claims
    const isAdminLogin = isAdmin && user.role === 'admin';
    const accessTokenExpiration = isAdminLogin ? '7d' : '2h';
    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
        isAdmin: user.role === 'admin',
        sessionId: `session_${user._id}_${Date.now()}`
      },
      process.env.JWT_SECRET!,
      { expiresIn: accessTokenExpiration }
    );

    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        sessionId: `refresh_${user._id}_${Date.now()}`
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '15d' } // Extended to 15 days as requested
    );

    // Update user's refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Verify the token was saved
    const updatedUser = await User.findById(user._id);
    if (updatedUser.refreshToken !== refreshToken) {
      console.error('Failed to save refresh token for user:', user._id);
    }

    // Prepare response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

    // Set secure cookies
    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: isAdminLogin ? 7 * 24 * 60 * 60 : 2 * 60 * 60, // 7 days for admin, 2 hours for others
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 24 * 60 * 60, // 15 days
      path: '/'  // Make it available on all paths
    });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }, { status: 500 });
  }
}
