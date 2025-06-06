import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Gemstone from '@/models/Gemstone';

interface MatchConditions {
  isAvailable: boolean;
  type?: string | { $in: string[] };
  source?: string | { $in: string[] };
  shape?: string | { $in: string[] };
  color?: string | { $in: string[] };
  clarity?: string | { $in: string[] };
  cut?: string | { $in: string[] };
  origin?: string | { $in: string[] };
  treatment?: string | { $in: string[] };
  carat?: { $gte?: number; $lte?: number };
  $or?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for gemstone category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Build match conditions
    const matchConditions: MatchConditions = { isAvailable: true };

    // Handle URL category mapping
    if (category !== 'all') {
      if (category === 'natural') {
        matchConditions.source = 'natural';
      } else if (category === 'lab') {
        matchConditions.source = 'lab';
      } else if (category.startsWith('type-')) {
        const type = category
          .replace('type-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.type = type;
      } else if (category.startsWith('shape-')) {
        const shape = category
          .replace('shape-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.shape = shape;
      } else if (category.startsWith('color-')) {
        const color = category
          .replace('color-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.color = color;
      } else {
        // Handle direct gemstone type names (ruby, emerald, sapphire, etc.)
        const type = category
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.type = type;
      }
    }

    // Handle filter params
    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      delete matchConditions.type;
      matchConditions.type = { $in: types };
    }

    const shapes = searchParams.get('shapes')?.split(',');
    if (shapes?.length) {
      delete matchConditions.shape;
      matchConditions.shape = { $in: shapes };
    }

    const colors = searchParams.get('colors')?.split(',');
    if (colors?.length) {
      delete matchConditions.color;
      matchConditions.color = { $in: colors };
    }

    const clarities = searchParams.get('clarities')?.split(',');
    if (clarities?.length) {
      matchConditions.clarity = { $in: clarities };
    }

    const cuts = searchParams.get('cuts')?.split(',');
    if (cuts?.length) {
      matchConditions.cut = { $in: cuts };
    }

    const sources = searchParams.get('sources')?.split(',');
    if (sources?.length) {
      delete matchConditions.source;
      matchConditions.source = { $in: sources };
    }

    const origins = searchParams.get('origins')?.split(',');
    if (origins?.length) {
      matchConditions.origin = { $in: origins };
    }

    const treatments = searchParams.get('treatments')?.split(',');
    if (treatments?.length) {
      matchConditions.treatment = { $in: treatments };
    }

    const minCarat = searchParams.get('minCarat');
    const maxCarat = searchParams.get('maxCarat');
    if (minCarat || maxCarat) {
      matchConditions.carat = {};
      if (minCarat) matchConditions.carat.$gte = parseFloat(minCarat);
      if (maxCarat) matchConditions.carat.$lte = parseFloat(maxCarat);
    }

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
      case 'carat-asc':
        sortOptions.carat = 1;
        break;
      case 'carat-desc':
        sortOptions.carat = -1;
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
                sku: 1,
                type: 1,
                source: 1,
                carat: 1,
                shape: 1,
                color: 1,
                clarity: 1,
                cut: 1,
                origin: 1,
                treatment: 1,
                price: 1,
                salePrice: 1,
                images: 1,
                certificateLab: 1,
                hardness: 1,
                isAvailable: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await Gemstone.aggregate(pipeline);
    const totalCount = result.metadata[0]?.total || 0;
    
    console.log(`Found ${totalCount} gemstones matching the criteria`);

    return NextResponse.json({
      products: result.products,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + result.products.length < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching gemstones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gemstones' },
      { status: 500 }
    );
  }
}

export { handleRequest as GET };