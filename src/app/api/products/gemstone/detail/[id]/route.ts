import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Gemstone from '@/models/Gemstone';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const gemstoneId = pathParts[pathParts.length - 1];
    
    const gemstone = await Gemstone.findById(gemstoneId).lean();
    
    if (!gemstone) {
      return NextResponse.json(
        { error: 'Gemstone not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ gemstone });
  } catch (error) {
    console.error('Error fetching gemstone details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gemstone details' },
      { status: 500 }
    );
  }
}