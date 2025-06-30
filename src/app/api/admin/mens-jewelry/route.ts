import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import MensJewelryModel from '@/models/MensJewelry';
import { withAdminAuth } from '@/utils/authMiddleware';

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available (it should be in API routes)
      if (!MensJewelryModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const data = await request.json();
      
      // Create the men's jewelry item
      const mensJewelry = new MensJewelryModel(data);
      await mensJewelry.save();

      return NextResponse.json({
        success: true,
        data: mensJewelry
      }, { status: 201 });

    } catch (error) {
      console.error('Men\'s jewelry creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create men\'s jewelry item' 
      }, { status: 500 });
    }
  });
}

export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      // Check if model is available
      if (!MensJewelryModel) {
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
      const finish = searchParams.get('finish') || '';
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

      // Filter by men's jewelry properties
      if (type) query.type = type;
      if (metal) query.metal = metal;
      if (style) query.style = style;
      if (finish) query.finish = finish;

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
      const [mensJewelryItems, totalCount] = await Promise.all([
        MensJewelryModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        MensJewelryModel.countDocuments(query)
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return NextResponse.json({
        success: true,
        data: mensJewelryItems,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });

    } catch (error) {
      console.error('Men\'s jewelry fetch error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch men\'s jewelry items' 
      }, { status: 500 });
    }
  });
}
