import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';
import { findBySlugOrId } from '@/utils/slugLookup';

export function GET(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    // Extract identifier (slug or ID) from URL path
    const pathParts = request.nextUrl.pathname.split('/');
    const identifier = pathParts[pathParts.length - 1];
    
    const product = await findBySlugOrId(WeddingRing, identifier);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}