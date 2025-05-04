import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';

// Define a more specific type for the match conditions
interface MatchConditions {
  isActive: boolean;
  type?: string | { $in: string[] };
  shape?: string | { $in: string[] };
  color?: string | { $in: string[] };
  clarity?: string | { $in: string[] };
  cut?: string | { $in: string[] };
  carat?: { $gte?: number; $lte?: number };
  polish?: { $in: string[] };
  symmetry?: { $in: string[] };
  fluorescence?: { $in: string[] };
  fancyColor?: string;
  $or?: Array<Record<string, unknown>>;
  [key: string]: unknown; // Allow for additional properties
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for diamond category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Build match conditions with proper typing
    const matchConditions: MatchConditions = { isActive: true };

    // Handle URL category mapping
    if (category !== 'all') {
      if (category === 'natural') {
        matchConditions.type = 'natural';
      } else if (category === 'lab') {
        matchConditions.type = 'lab';
      } else if (category.startsWith('shape-')) {
        const shape = category
          .replace('shape-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.shape = shape;
      } else if (category.startsWith('color-')) {
        const color = category.replace('color-', '').toUpperCase();
        matchConditions.color = color;
      } else if (category.startsWith('clarity-')) {
        const clarity = category.replace('clarity-', '').toUpperCase();
        matchConditions.clarity = clarity;
      } else if (category.startsWith('fancy-')) {
        const fancyColor = category
          .replace('fancy-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.fancyColor = fancyColor;
      }
    }

    // Handle filter params
    const shapes = searchParams.get('shapes')?.split(',');
    if (shapes?.length) {
      // Override any shape from URL
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
      delete matchConditions.clarity;
      matchConditions.clarity = { $in: clarities };
    }

    const cuts = searchParams.get('cuts')?.split(',');
    if (cuts?.length) {
      matchConditions.cut = { $in: cuts };
    }

    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      delete matchConditions.type;
      matchConditions.type = { $in: types };
    }

    const polish = searchParams.get('polish')?.split(',');
    if (polish?.length) {
      matchConditions.polish = { $in: polish };
    }

    const symmetry = searchParams.get('symmetry')?.split(',');
    if (symmetry?.length) {
      matchConditions.symmetry = { $in: symmetry };
    }

    const fluorescence = searchParams.get('fluorescence')?.split(',');
    if (fluorescence?.length) {
      matchConditions.fluorescence = { $in: fluorescence };
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
      // Check both price and salePrice fields
      const priceQuery = [];
      
      // For regular price
      const regularPriceCondition: Record<string, number> = {};
      if (minPrice) regularPriceCondition.$gte = parseInt(minPrice);
      if (maxPrice) regularPriceCondition.$lte = parseInt(maxPrice);
      
      if (Object.keys(regularPriceCondition).length > 0) {
        priceQuery.push({ price: regularPriceCondition });
      }
      
      // For sale price (if it exists and is within range)
      const salePriceCondition: Record<string, number | null> = {};
      if (minPrice) salePriceCondition.$gte = parseInt(minPrice);
      if (maxPrice) salePriceCondition.$lte = parseInt(maxPrice);
      salePriceCondition.$ne = null;
      
      if (Object.keys(salePriceCondition).length > 0) {
        priceQuery.push({ salePrice: salePriceCondition });
      }
      
      // Add the price conditions to the main query
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
                title: 1,
                SKU: 1,
                price: 1,
                salePrice: 1,
                shape: 1,
                carat: 1,
                color: 1,
                clarity: 1,
                cut: 1,
                polish: 1,
                symmetry: 1,
                fluorescence: 1,
                type: 1,
                media: 1,
                certificate: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await Diamond.aggregate(pipeline);
    const totalCount = result.metadata[0]?.total || 0;
    
    console.log(`Found ${totalCount} diamonds matching the criteria`);

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
    console.error('Error fetching diamonds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diamonds' },
      { status: 500 }
    );
  }
}

export { handleRequest as GET };