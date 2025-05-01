// Import the WeddingRing type from your models
import mongoose from 'mongoose';
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
  'metalOptions.finish_type'?: { $in: string[] };
  'metalOptions.price'?: { $gte?: number; $lte?: number };
  metalOptions?: {
    $elemMatch: {
      color?: { $in: string[] };
      price?: { $gte?: number; $lte?: number };
      finish_type?: { $in: string[] };
    }
  };
  $or?: Array<Record<string, unknown>>;
  [key: string]: unknown; // Allow for additional properties
}

// Define a type for the product returned from MongoDB
interface ProductDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  SKU: string;
  basePrice: number;
  metalOptions: Array<{
    karat: string;
    color: string;
    price: number;
    finish_type?: string | null;
    isDefault: boolean;
  }>;
  metalColorImages: Record<string, Array<{
    url: string;
    publicId: string;
  }>>;
  media: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
    video?: {
      url: string;
      publicId: string;
    };
  };
  style: string[];
  type: string[];
  subcategory: string;
}

async function handleRequest(request: NextRequest) {
  try {
    await connectDB();
    
    const pathParts = request.nextUrl.pathname.split('/');
    const category = pathParts[pathParts.length - 1];
    const searchParams = request.nextUrl.searchParams;
    
    console.log('API Request for category:', category);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Start with a base condition that all products must match
    const matchConditions: MatchConditions = { isActive: true };

    // Handle URL category mapping
    if (category !== 'all') {
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
      delete matchConditions.subcategory;
      matchConditions.subcategory = { $in: subcategories.map(sub => decodeURIComponent(sub)) };
    }

    const styles = searchParams.get('styles')?.split(',');
    if (styles?.length) {
      // For array fields, use $in to match any of the selected styles
      delete matchConditions.style;
      matchConditions.style = { $in: styles.map(style => decodeURIComponent(style)) };
    }

    const types = searchParams.get('types')?.split(',');
    if (types?.length) {
      // For array fields, use $in to match any of the selected types
      matchConditions.type = { $in: types.map(type => decodeURIComponent(type)) };
    }

    // Handle metal colors
    const metals = searchParams.get('metalColors')?.split(',');
    if (metals?.length) {
      // Remove any existing metal condition
      delete matchConditions['metalOptions.color'];
      
      // Add a condition to match products where any metal option has one of the selected colors
      matchConditions['metalOptions.color'] = { 
        $in: metals.map(metal => decodeURIComponent(metal)) 
      };
      
      console.log('Metal filter:', JSON.stringify(matchConditions['metalOptions.color'], null, 2));
    }

    // Handle finish types
    const finishTypes = searchParams.get('finishTypes')?.split(',');
    if (finishTypes?.length) {
      // Create a condition for finish types that handles null/undefined values
      const finishTypeValues = finishTypes.map(finish => decodeURIComponent(finish));
      
      // If "Polished" is one of the selected finish types, also match null/undefined values
      if (finishTypeValues.includes('Polished')) {
        matchConditions['$or'] = [
          { 'metalOptions.finish_type': { $in: finishTypeValues } },
          { 'metalOptions.finish_type': { $exists: false } },
          { 'metalOptions.finish_type': null }
        ];
      } else {
        matchConditions['metalOptions.finish_type'] = { $in: finishTypeValues };
      }
      
      console.log('Finish type filter:', JSON.stringify(matchConditions['$or'] || matchConditions['metalOptions.finish_type'], null, 2));
    }

    // Handle price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      const priceCondition: { $gte?: number; $lte?: number } = {};
      if (minPrice) priceCondition.$gte = parseInt(minPrice);
      if (maxPrice) priceCondition.$lte = parseInt(maxPrice);
      
      // If we already have a metalOptions condition, we need to merge it with the price condition
      if (matchConditions.metalOptions) {
        matchConditions.metalOptions.$elemMatch.price = priceCondition;
      } else {
        matchConditions.metalOptions = {
          $elemMatch: {
            price: priceCondition
          }
        };
      }
    }

    console.log('Final match conditions:', JSON.stringify(matchConditions, null, 2));

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Sort options
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

    // Execute query with aggregation
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
    
    // Ensure result.products exists
    const products = result.products || [];
    
    // Log the first few products to help with debugging
    if (products.length > 0) {
      console.log('Sample products:');
      products.slice(0, 3).forEach((product: ProductDocument, index: number) => {
        console.log(`Product ${index + 1}: ${product.title}, Subcategory: ${product.subcategory}`);
        
        // Add null check for metalOptions
        if (product.metalOptions && Array.isArray(product.metalOptions)) {
          console.log(`  Metal options: ${JSON.stringify(product.metalOptions.map(m => m.color))}`);
        } else {
          console.log(`  Metal options: undefined or not an array`);
        }
        
        console.log(`  Style: ${product.style}`);
        console.log(`  Type: ${product.type}`);
      });
    }

    return NextResponse.json({
      products: products,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
        hasMore: skip + products.length < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching wedding rings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch wedding rings',
        products: [],  // Always include an empty products array
        pagination: {  // Always include pagination info
          total: 0,
          page: 1,
          limit: 12,
          pages: 0,
          hasMore: false
        }
      },
      { status: 500 }
    );
  }
}

export { handleRequest as GET };
