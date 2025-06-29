import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import GemstoneModel from '@/models/Gemstone';
import { withAdminAuth } from '@/utils/authMiddleware';

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

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
  });
}

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

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
  });
}