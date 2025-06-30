import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import MensJewelry from '@/models/MensJewelry';
import { findBySlugOrId } from '@/utils/slugLookup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const mensJewelry = await findBySlugOrId(MensJewelry, identifier);
    
    if (!mensJewelry) {
      return NextResponse.json(
        { error: 'Men\'s jewelry item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ mensJewelry });
  } catch (error) {
    console.error('Error fetching men\'s jewelry details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch men\'s jewelry details' },
      { status: 500 }
    );
  }
}
