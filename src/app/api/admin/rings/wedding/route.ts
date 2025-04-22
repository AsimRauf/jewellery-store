import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const ringData = await request.json();

    // Add audit fields
    const ring = new WeddingRing({
      ...ringData,
      createdBy: decoded.userId,
      updatedBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await ring.save();

    return NextResponse.json({
      success: true,
      data: ring
    }, { status: 201 });

  } catch (error) {
    console.error('Wedding ring creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create ring' 
    }, { status: 500 });
  }
}