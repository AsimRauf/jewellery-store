import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Bracelet from '@/models/Bracelet';
import { findBySlugOrId } from '@/utils/slugLookup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const bracelet = await findBySlugOrId(Bracelet, identifier);
    
    if (!bracelet) {
      return NextResponse.json(
        { error: 'Bracelet not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ bracelet });
  } catch (error) {
    console.error('Error fetching bracelet details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bracelet details' },
      { status: 500 }
    );
  }
}
