import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract ID from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const diamondId = pathParts[pathParts.length - 1];
    
    const diamond = await Diamond.findById(diamondId).lean();
    
    if (!diamond) {
      return NextResponse.json(
        { error: 'Diamond not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ diamond });
  } catch (error) {
    console.error('Error fetching diamond details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diamond details' },
      { status: 500 }
    );
  }
}