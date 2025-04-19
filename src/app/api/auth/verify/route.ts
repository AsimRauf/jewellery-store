import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';

export async function POST(request: Request) {
  await connectDB();
  
  const { token } = await request.json();

  const user = await User.findOne({ verificationToken: token });
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return NextResponse.json({
    message: 'Email verified successfully'
  });
}