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

      const { searchParams } = new URL(request.url);
      
      // Parse query parameters
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
      const type = searchParams.get('type') || '';
      const source = searchParams.get('source') || '';
      const color = searchParams.get('color') || '';
      const shape = searchParams.get('shape') || '';
      const clarity = searchParams.get('clarity') || '';
      const minCarat = searchParams.get('minCarat');
      const maxCarat = searchParams.get('maxCarat');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';

      // Build query
      const query: Record<string, unknown> = {};

      // Search across multiple fields
      if (search) {
        query.$or = [
          { sku: new RegExp(search, 'i') },
          { productNumber: new RegExp(search, 'i') },
          { type: new RegExp(search, 'i') },
          { color: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      // Filter by gemstone properties
      if (type) query.type = type;
      if (source) query.source = source;
      if (color) query.color = color;
      if (shape) query.shape = shape;
      if (clarity) query.clarity = clarity;

      // Carat range filter
      if (minCarat || maxCarat) {
        const caratQuery: Record<string, number> = {};
        if (minCarat) caratQuery.$gte = parseFloat(minCarat);
        if (maxCarat) caratQuery.$lte = parseFloat(maxCarat);
        query.carat = caratQuery;
      }

      // Price range filter
      if (minPrice || maxPrice) {
        const priceQuery: Record<string, number> = {};
        if (minPrice) priceQuery.$gte = parseFloat(minPrice);
        if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);
        query.price = priceQuery;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute queries
      const [gemstones, totalCount] = await Promise.all([
        GemstoneModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        GemstoneModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: gemstones,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error) {
      console.error('Gemstones fetch error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch gemstones' 
      }, { status: 500 });
    }
  });
}