import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout successful' });
  
  // Clear the access token
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  
  // Also clear the refresh token
  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}