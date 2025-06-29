import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';

// Define a more specific type for the match conditions
interface MatchConditions {
  isActive: boolean;
  style?: string | { $in: string[] };
  type?: string | { $in: string[] };
  'metalOptions.color'?: string | { $in: string[] };
  compatibleStoneShapes?: string | { $in: string[] };
  basePrice?: { $gte?: number; $lte?: number };
  [key: string]: unknown;
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for settings category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    const matchConditions: MatchConditions = { isActive: true };

    // Handle URL category mapping
    if (category !== 'all') {
      if (category.startsWith('style-')) {
        const style = category
          .replace('style-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.style = style;
      } else if (category.startsWith('metal-')) {
        // Special case for Two Tone Gold
        if (category === 'metal-two-tone-gold') {
          matchConditions['metalOptions.color'] = 'Two Tone Gold';
        } else {
          const metalColor = category
            .replace('metal-', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          const fullColor = metalColor.includes('Gold') ? metalColor : `${metalColor} Gold`;
          matchConditions['metalOptions.color'] = fullColor;
        }
      } else if (category.startsWith('type-')) {
        const type = category
          .replace('type-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.type = type;
      } else if (category.startsWith('stone-shape-')) {
        const shape = category
          .replace('stone-shape-', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        matchConditions.compatibleStoneShapes = shape;
      }
    }

    // Handle filter params
    const styles = searchParams.get('styles')?.split(',');
    if (styles?.length) {
      // Override any style from URL
      delete matchConditions.style;
      matchConditions.style = { $in: styles };
    }

    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      delete matchConditions.type;
      matchConditions.type = { $in: types };
    }

    const metalColors = searchParams.get('metalColors')?.split(',');
    if (metalColors?.length) {
      delete matchConditions['metalOptions.color'];
      matchConditions['metalOptions.color'] = { $in: metalColors };
    }

    const stoneShapes = searchParams.get('stoneShapes')?.split(',');
    if (stoneShapes?.length) {
      delete matchConditions.compatibleStoneShapes;
      matchConditions.compatibleStoneShapes = { $in: stoneShapes };
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      matchConditions.basePrice = {};
      if (minPrice) matchConditions.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) matchConditions.basePrice.$lte = parseFloat(maxPrice);
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
        sortOptions.basePrice = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      case 'popular':
        sortOptions.isFeatured = -1;
        sortOptions.basePrice = 1;
        break;
      default:
        sortOptions.basePrice = 1;
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
                title: 1,
                SKU: 1,
                basePrice: 1,
                metalOptions: 1,
                metalColorImages: 1,
                sizes: 1,
                side_stone: 1,
                media: 1,
                description: 1,
                isActive: 1,
                isFeatured: 1,
                isNew: 1,
                onSale: 1,
                originalPrice: 1,
                canAcceptStone: 1,
                compatibleStoneShapes: 1,
                settingHeight: 1,
                bandWidth: 1,
                style: 1,
                type: 1,
                category: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ];

    const [result] = await Setting.aggregate(pipeline);
    const totalCount = result.metadata[0]?.total || 0;
    
    console.log(`Found ${totalCount} settings matching the criteria`);

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
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export { handleRequest as GET };