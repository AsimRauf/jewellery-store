import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import GemstoneModel from '@/models/Gemstone';
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

    // Check if model is available (it should be in API routes)
    if (!GemstoneModel) {
      return NextResponse.json({ 
        error: 'Database model not available' 
      }, { status: 500 });
    }

    const data = await request.json();
    
    // Create the gemstone
    const gemstone = new GemstoneModel(data);
    await gemstone.save();

    return NextResponse.json({
      success: true,
      data: gemstone
    }, { status: 201 });

  } catch (error) {
    console.error('Gemstone creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create gemstone' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    // Check if model is available
    if (!GemstoneModel) {
      return NextResponse.json({ 
        error: 'Database model not available' 
      }, { status: 500 });
    }

    // Get all gemstones
    const gemstones = await GemstoneModel.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: gemstones
    });

  } catch (error) {
    console.error('Gemstones fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch gemstones' 
    }, { status: 500 });
  }
}