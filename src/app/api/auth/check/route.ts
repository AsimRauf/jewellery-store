import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { connectDB } from '@/utils/db';
import User from '@/models/User';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const encoder = new TextEncoder();
    const secretKey = encoder.encode(process.env.JWT_SECRET!);
    
    try {
      const { payload } = await jwtVerify(token, secretKey);
      await connectDB();
      const user = await User.findById(payload.userId).select('-password -refreshToken');

      if (!user) {
        return NextResponse.json({ authenticated: false });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('JWT verification error:', error);
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Error in authentication check:', error);
    return NextResponse.json({ authenticated: false });
  }
}