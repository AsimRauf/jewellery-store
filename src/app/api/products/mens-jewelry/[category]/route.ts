import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import MensJewelry from '@/models/MensJewelry';

// Define match conditions for men's jewelry filtering
interface MatchConditions {
  isAvailable: boolean;
  type?: string | { $in: string[] };
  metal?: string | { $in: string[] };
  style?: string | { $in: string[] };
  finish?: string | { $in: string[] };
  price?: { $gte?: number; $lte?: number };
  size?: string | { $in: string[] };
  length?: { $gte?: number; $lte?: number };
  width?: { $gte?: number; $lte?: number };
  $or?: Array<Record<string, unknown>>;
  name?: { $regex: string; $options: string };
  [key: string]: unknown;
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for mens jewelry category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Build match conditions
    const matchConditions: MatchConditions = { isAvailable: true };

    // Handle URL category mapping
    if (category !== 'all') {
      if (category.startsWith('type-')) {
        const type = category
          .replace('type-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.type = type;
      } else if (category.startsWith('metal-')) {
        const metal = category
          .replace('metal-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.metal = metal;
      } else if (category.startsWith('style-')) {
        const style = category
          .replace('style-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.style = style;
      } else if (category.startsWith('finish-')) {
        const finish = category
          .replace('finish-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.finish = finish;
      }
    }

    // Handle filter params
    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      delete matchConditions.type;
      matchConditions.type = { $in: types };
    }

    const metals = searchParams.get('metals')?.split(',');
    if (metals?.length) {
      delete matchConditions.metal;
      matchConditions.metal = { $in: metals };
    }

    const styles = searchParams.get('styles')?.split(',');
    if (styles?.length) {
      delete matchConditions.style;
      matchConditions.style = { $in: styles };
    }

    const finishes = searchParams.get('finishes')?.split(',');
    if (finishes?.length) {
      delete matchConditions.finish;
      matchConditions.finish = { $in: finishes };
    }

    const sizes = searchParams.get('sizes')?.split(',');
    if (sizes?.length) {
      matchConditions.size = { $in: sizes };
    }

    // Length filtering (for necklaces/chains in inches)
    const minLength = searchParams.get('minLength');
    const maxLength = searchParams.get('maxLength');
    if (minLength || maxLength) {
      matchConditions.length = {};
      if (minLength) matchConditions.length.$gte = parseFloat(minLength);
      if (maxLength) matchConditions.length.$lte = parseFloat(maxLength);
    }

    // Width filtering (in mm)
    const minWidth = searchParams.get('minWidth');
    const maxWidth = searchParams.get('maxWidth');
    if (minWidth || maxWidth) {
      matchConditions.width = {};
      if (minWidth) matchConditions.width.$gte = parseFloat(minWidth);
      if (maxWidth) matchConditions.width.$lte = parseFloat(maxWidth);
    }

    // Search functionality
    const search = searchParams.get('search');
    if (search) {
      matchConditions.name = { $regex: search, $options: 'i' };
    }

    // Price filtering
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      const priceQuery = [];
      
      const regularPriceCondition: Record<string, number> = {};
      if (minPrice) regularPriceCondition.$gte = parseInt(minPrice);
      if (maxPrice) regularPriceCondition.$lte = parseInt(maxPrice);
      
      if (Object.keys(regularPriceCondition).length > 0) {
        priceQuery.push({ price: regularPriceCondition });
      }
      
      const salePriceCondition: Record<string, number | null> = {};
      if (minPrice) salePriceCondition.$gte = parseInt(minPrice);
      if (maxPrice) salePriceCondition.$lte = parseInt(maxPrice);
      salePriceCondition.$ne = null;
      
      if (Object.keys(salePriceCondition).length > 0) {
        priceQuery.push({ salePrice: salePriceCondition });
      }
      
      if (priceQuery.length > 0) {
        matchConditions.$or = priceQuery;
      }
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Sort options
    const sort = searchParams.get('sort') || 'price-asc';
    const sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'price-desc':
        sortOptions.salePrice = -1;
        sortOptions.price = -1;
        break;
      case 'name-asc':
        sortOptions.name = 1;
        break;
      case 'name-desc':
        sortOptions.name = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.salePrice = 1;
        sortOptions.price = 1;
    }

    console.log('Final match conditions:', JSON.stringify(matchConditions, null, 2));

    // Define the pipeline
    const pipeline = [
      { $match: matchConditions },
      { $sort: sortOptions },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          products: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                slug: 1,
                name: 1,
                sku: 1,
                price: 1,
                salePrice: 1,
                type: 1,
                metal: 1,
                style: 1,
                finish: 1,
                size: 1,
                length: 1,
                width: 1,
                images: 1,
                isAvailable: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await MensJewelry.aggregate(pipeline);
    const totalCount = result.metadata[0]?.total || 0;
    
    console.log(`Found ${totalCount} men's jewelry items matching the criteria`);

    return NextResponse.json({
      products: result.products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + result.products.length < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching men\'s jewelry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch men\'s jewelry' },
      { status: 500 }
    );
  }
}

export { handleRequest as GET };
