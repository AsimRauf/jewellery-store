import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import NecklaceModel from '@/models/Necklace';
import { withAdminAuth } from '@/utils/authMiddleware';

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available (it should be in API routes)
      if (!NecklaceModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const data = await request.json();
      
      // Create the necklace
      const necklace = new NecklaceModel(data);
      await necklace.save();

      return NextResponse.json({
        success: true,
        data: necklace
      }, { status: 201 });

    } catch (error) {
      console.error('Necklace creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create necklace' 
      }, { status: 500 });
    }
  });
}

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available
      if (!NecklaceModel) {
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
      const metal = searchParams.get('metal') || '';
      const style = searchParams.get('style') || '';
      const length = searchParams.get('length') || '';
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
          { name: new RegExp(search, 'i') },
          { type: new RegExp(search, 'i') },
          { metal: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') }
        ];
      }

      // Filter by necklace properties
      if (type) query.type = type;
      if (metal) query.metal = metal;
      if (style) query.style = style;
      if (length) query.length = length;

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
      const [necklaces, totalCount] = await Promise.all([
        NecklaceModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        NecklaceModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: necklaces,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error) {
      console.error('Necklaces fetch error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch necklaces' 
      }, { status: 500 });
    }
  });
}
