import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';
import { findBySlugOrId } from '@/utils/slugLookup';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const product = await findBySlugOrId(Setting, identifier);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching setting details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch setting details' },
      { status: 500 }
    );
  }
}