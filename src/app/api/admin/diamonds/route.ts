import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';
import { withAdminAuth } from '@/utils/authMiddleware';

// Define an interface for Mongoose validation errors
interface MongooseValidationError extends Error {
  name: string;
  errors: {
    [key: string]: {
      message: string;
      name: string;
      properties: unknown;
      kind: string;
      path: string;
      value: unknown;
    }
  };
}

// Type guard to check if an error is a Mongoose validation error
function isValidationError(error: unknown): error is MongooseValidationError {
  return (
    typeof error === 'object' && 
    error !== null && 
    'name' in error && 
    error.name === 'ValidationError' &&
    'errors' in error
  );
}

// Define interface for image structure
interface DiamondImage {
  url: string;
  publicId: string;
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (_req, user) => {
    try {
      await connectDB();

    const data = await request.json();
    
    // Validate the images array format
    if (data.images && Array.isArray(data.images)) {
      // Ensure each image has the correct structure
      data.images = data.images.map((img: unknown) => {
        if (typeof img === 'object' && img !== null && 'url' in img && 'publicId' in img) {
          return {
            url: (img as DiamondImage).url,
            publicId: (img as DiamondImage).publicId
          };
        }
        return null;
      }).filter(Boolean); // Remove any null entries
    }
    
    // Create the transformed data with user info
    const transformedData = {
      ...data,
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Log the data for debugging
    console.log('Creating diamond with data:', JSON.stringify(transformedData, null, 2));
    
    // Create the diamond
    const diamond = new Diamond(transformedData);
    
    // Save with explicit error handling
    try {
      await diamond.save();
    } catch (error: unknown) {
      console.error('Error saving diamond:', error);
      
      // If there's a validation error, provide more detailed information
      if (isValidationError(error)) {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message,
          value: error.errors[key].value
        }));
        
        return NextResponse.json({ 
          error: 'Validation error', 
          details: validationErrors 
        }, { status: 400 });
      }
      
      // Re-throw the error to be caught by the outer catch block
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: diamond
    }, { status: 201 });

    } catch (error) {
      console.error('Diamond creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create diamond' 
      }, { status: 500 });
    }
  });
}

// GET endpoint to list all diamonds
export async function GET(request: NextRequest) {
  return withAdminAuth(request, async (req, user) => {
    try {
      await connectDB();

    // Parse query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const shape = url.searchParams.get('shape');
    const minCarat = url.searchParams.get('minCarat');
    const maxCarat = url.searchParams.get('maxCarat');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Build query
    const query: Record<string, unknown> = {};
    
    if (type) query.type = type;
    if (shape) query.shape = shape;
    if (minCarat) query.carat = { $gte: parseFloat(minCarat) };
    if (maxCarat) query.carat = { ...query.carat as Record<string, number>, $lte: parseFloat(maxCarat) };
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) query.price = { ...query.price as Record<string, number>, $lte: parseFloat(maxPrice) };

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const diamonds = await Diamond.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Diamond.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: diamonds,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

    } catch (error) {
      console.error('Diamond listing error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to list diamonds' 
      }, { status: 500 });
    }
  });
}