// Import the WeddingRing type from your models
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';

// Define a more specific type for the match conditions
interface MatchConditions {
  isActive: boolean;
  subcategory?: string | { $in: string[] };
  style?: string | { $in: string[] };
  type?: { $in: string[] };
  'metalOptions.color'?: string | { $in: string[] };
  'metalOptions.price'?: { $gte?: number; $lte?: number };
  $or?: Array<Record<string, unknown>>;
  [key: string]: unknown; // Allow for additional properties
}



async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Build match conditions with proper typing
    const matchConditions: MatchConditions = { isActive: true };

    // Handle URL category mapping - only apply if no subcategories filter is present
    if (category !== 'all' && !searchParams.has('subcategories')) {
      if (category === 'womens' || category === 'women-s-wedding-rings') {
        matchConditions.subcategory = "Women's Wedding Rings";
      } else if (category === 'mens' || category === 'men-s-wedding-rings') {
        matchConditions.subcategory = "Men's Wedding Rings";
      } else if (category === 'matching-sets') {
        matchConditions.subcategory = "His & Her Matching Sets";
      } else if (category.startsWith('metal-')) {
        const metalColor = category.replace('metal-', '').replace(/-/g, ' ');
        const formattedColor = metalColor.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        const fullColor = formattedColor.includes('Gold') ? formattedColor : `${formattedColor} Gold`;
        matchConditions['metalOptions.color'] = fullColor;
      } else if (category.startsWith('style-')) {
        const style = category.replace('style-', '').replace(/-/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.style = style;
      }
    }

    // Handle filter params - these should override URL category if present
    const subcategories = searchParams.get('subcategories')?.split(',');
    if (subcategories?.length) {
      // Override category-based subcategory if filter is present
      delete matchConditions.subcategory; // Remove any existing subcategory condition
      matchConditions.subcategory = { $in: subcategories.map(sub => decodeURIComponent(sub)) };
    }

    const styles = searchParams.get('styles')?.split(',');
    if (styles?.length) {
      // Override any style from URL
      delete matchConditions.style;
      matchConditions.style = { $in: styles.map(style => decodeURIComponent(style)) };
    }

    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      matchConditions.type = { $in: types.map(type => decodeURIComponent(type)) };
    }

    // Handle metal colors with special case for Two Tone Gold
    const metals = searchParams.get('metalColors')?.split(',');
    if (metals?.length) {
      // Remove any existing metal condition from URL
      delete matchConditions['metalOptions.color'];
      
      if (metals.includes('Two Tone Gold')) {
        const otherMetals = metals.filter(m => m !== 'Two Tone Gold');
        
        if (otherMetals.length > 0) {
          // If we have Two Tone Gold AND other metals
          matchConditions.$or = [
            { 'metalOptions.color': 'Two Tone Gold' },
            { 'metalOptions.color': { $in: otherMetals } }
          ];
        } else {
          // Only Two Tone Gold
          matchConditions['metalOptions.color'] = 'Two Tone Gold';
        }
      } else {
        // No Two Tone Gold, just regular metals
        matchConditions['metalOptions.color'] = { $in: metals };
      }
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      matchConditions['metalOptions.price'] = {};
      if (minPrice) matchConditions['metalOptions.price'].$gte = parseInt(minPrice);
      if (maxPrice) matchConditions['metalOptions.price'].$lte = parseInt(maxPrice);
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Sort options with proper typing
    const sort = searchParams.get('sort') || 'price-asc';
    const sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'price-desc':
        sortOptions['metalOptions.price'] = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions['metalOptions.price'] = 1;
    }

    console.log('Final match conditions:', JSON.stringify(matchConditions, null, 2));

    // Define the pipeline with proper typing
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
                title: 1,
                SKU: 1,
                basePrice: 1,
                metalOptions: 1,
                metalColorImages: 1,
                media: 1,
                style: 1,
                type: 1,
                subcategory: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await WeddingRing.aggregate(pipeline);
    const totalCount = result.metadata[0]?.total || 0;
    
    console.log(`Found ${totalCount} products matching the criteria`);

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
    console.error('Error fetching wedding rings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wedding rings' },
      { status: 500 }
    );
  }
}
export { handleRequest as GET };
