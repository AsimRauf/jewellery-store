import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Earring from '@/models/Earring';
import { findBySlugOrId } from '@/utils/slugLookup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const earring = await findBySlugOrId(Earring, identifier);
    
    if (!earring) {
      return NextResponse.json(
        { error: 'Earring not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ earring });
  } catch (error) {
    console.error('Error fetching earring details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earring details' },
      { status: 500 }
    );
  }
}
