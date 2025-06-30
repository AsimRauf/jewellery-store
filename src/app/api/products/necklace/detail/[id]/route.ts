import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Necklace from '@/models/Necklace';
import { findBySlugOrId } from '@/utils/slugLookup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const necklace = await findBySlugOrId(Necklace, identifier);
    
    if (!necklace) {
      return NextResponse.json(
        { error: 'Necklace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ necklace });
  } catch (error) {
    console.error('Error fetching necklace details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch necklace details' },
      { status: 500 }
    );
  }
}
