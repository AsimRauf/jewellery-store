import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import BraceletModel from '@/models/Bracelet';
import { withAdminAuth } from '@/utils/authMiddleware';

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available (it should be in API routes)
      if (!BraceletModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const data = await request.json();
      
      // Create the bracelet
      const bracelet = new BraceletModel(data);
      await bracelet.save();

      return NextResponse.json({
        success: true,
        data: bracelet
      }, { status: 201 });

    } catch (error) {
      console.error('Bracelet creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create bracelet' 
      }, { status: 500 });
    }
  });
}

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available
      if (!BraceletModel) {
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
      const closure = searchParams.get('closure') || '';
      const metal = searchParams.get('metal') || '';
      const style = searchParams.get('style') || '';
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

      // Filter by bracelet properties
      if (type) query.type = type;
      if (closure) query.closure = closure;
      if (metal) query.metal = metal;
      if (style) query.style = style;

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
      const [bracelets, totalCount] = await Promise.all([
        BraceletModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        BraceletModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: bracelets,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error) {
      console.error('Bracelets fetch error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bracelets' 
      }, { status: 500 });
    }
  });
}
