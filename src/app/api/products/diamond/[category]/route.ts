import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';

export async function GET(
  request: NextRequest,
  context: { params: { category?: string } }
) {
  try {
    // First, await the params object itself
    const params = await context.params;
    
    await connectDB();
    
    // Add connection status log
    console.log('MongoDB Connection Status: Connected');
    
    // Get and validate category parameter
    const category = params.category;
    if (!category) {
      return NextResponse.json(
        { error: 'Category parameter is required' },
        { status: 400 }
      );
    }

    // Log category and query parameters for debugging
    console.log('Category:', category);
    console.log('Search Params:', Object.fromEntries(request.nextUrl.searchParams.entries()));
    
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Build base query with strict typing
    const query: Record<string, any> = { isActive: true };
    
    // Handle category parameter
    if (category !== 'all') {
      if (category === 'natural') {
        query.type = 'natural';
      } else if (category === 'lab') {
        query.type = 'lab';
      } else if (category.startsWith('shape-')) {
        const shape = category
          .replace('shape-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        query.shape = shape;
      } else if (category.startsWith('color-')) {
        const color = category.replace('color-', '').toUpperCase();
        query.color = color;
      } else if (category.startsWith('clarity-')) {
        const clarity = category.replace('clarity-', '').toUpperCase();
        query.clarity = clarity;
      } else if (category.startsWith('fancy-')) {
        const fancyColor = category
          .replace('fancy-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        query.fancyColor = fancyColor;
      }
    }
    
    // Get filter parameters
    const shapes = searchParams.get('shapes')?.split(',') || [];
    const colors = searchParams.get('colors')?.split(',') || [];
    const clarities = searchParams.get('clarities')?.split(',') || [];
    const cuts = searchParams.get('cuts')?.split(',') || [];
    const minCarat = searchParams.get('minCarat') ? parseFloat(searchParams.get('minCarat')!) : undefined;
    const maxCarat = searchParams.get('maxCarat') ? parseFloat(searchParams.get('maxCarat')!) : undefined;
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const types = searchParams.get('types')?.split(',') || [];
    const polish = searchParams.get('polish')?.split(',') || [];
    const symmetry = searchParams.get('symmetry')?.split(',') || [];
    const fluorescence = searchParams.get('fluorescence')?.split(',') || [];
    const sort = searchParams.get('sort') || 'price-asc';
    
    // Apply filters
    if (shapes.length > 0) {
      query.shape = { $in: shapes };
    }
    
    if (colors.length > 0) {
      query.color = { $in: colors };
    }
    
    if (clarities.length > 0) {
      query.clarity = { $in: clarities };
    }
    
    if (cuts.length > 0) {
      query.cut = { $in: cuts };
    }
    
    if (minCarat !== undefined || maxCarat !== undefined) {
      query.carat = {};
      if (minCarat !== undefined) {
        query.carat.$gte = minCarat;
      }
      if (maxCarat !== undefined) {
        query.carat.$lte = maxCarat;
      }
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      // Check both price and salePrice fields
      const priceQuery = [];
      
      // For regular price
      const regularPriceCondition: any = {};
      if (minPrice !== undefined) {
        regularPriceCondition.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        regularPriceCondition.$lte = maxPrice;
      }
      
      if (Object.keys(regularPriceCondition).length > 0) {
        priceQuery.push({ price: regularPriceCondition });
      }
      
      // For sale price (if it exists and is within range)
      const salePriceCondition: any = {};
      if (minPrice !== undefined) {
        salePriceCondition.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        salePriceCondition.$lte = maxPrice;
      }
      
      if (Object.keys(salePriceCondition).length > 0) {
        priceQuery.push({ 
          salePrice: { ...salePriceCondition, $ne: null } 
        });
      }
      
      // Add the price conditions to the main query
      if (priceQuery.length > 0) {
        query.$or = priceQuery;
      }
    }
    
    if (types.length > 0) {
      query.type = { $in: types };
    }
    
    if (polish.length > 0) {
      query.polish = { $in: polish };
    }
    
    if (symmetry.length > 0) {
      query.symmetry = { $in: symmetry };
    }
    
    if (fluorescence.length > 0) {
      query.fluorescence = { $in: fluorescence };
    }
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions = { salePrice: 1, price: 1 };
        break;
      case 'price-desc':
        sortOptions = { salePrice: -1, price: -1 };
        break;
      case 'carat-asc':
        sortOptions = { carat: 1 };
        break;
      case 'carat-desc':
        sortOptions = { carat: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { salePrice: 1, price: 1 };
    }
    
    // Count total products matching the query
    const total = await Diamond.countDocuments(query);
    
    // Log the query to the console
    console.log('MongoDB Query:', JSON.stringify(query, null, 2));
    
    // Fetch products with pagination
    const products = await Diamond.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();
    
    // If no products found, return empty array with appropriate message
    if (products.length === 0) {
      console.log("No diamonds found for query:", query);
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        message: "No diamonds found matching your criteria"
      });
    }
    
    return NextResponse.json({
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('Error fetching diamonds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diamonds' },
      { status: 500 }
    );
  }
}