import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/utils/email';

export async function POST(request: Request) {
  await connectDB();
  
  const { firstName, lastName, email, password, phoneNumber } = await request.json();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    verificationToken,
    isVerified: false
  });

  await sendVerificationEmail(email, verificationToken);

  return NextResponse.json({
    message: 'Registration successful. Please check your email to verify your account.',
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
  }, { status: 201 });
}