import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: Record<string, unknown> = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { SKU: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await WeddingRing.countDocuments(query);

    // Get rings with pagination
    const rings = await WeddingRing.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: rings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Wedding rings fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch rings' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    // Verify token and check admin role
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await request.json();
    
    // Log the received data for debugging
    console.log("Received metalColorImages:", JSON.stringify(data.metalColorImages, null, 2));
    
    // Create a proper Mongoose Map for metalColorImages
    const metalColorImagesMap = new Map();
    
    if (data.metalColorImages && typeof data.metalColorImages === 'object') {
      Object.entries(data.metalColorImages).forEach(([color, images]) => {
        metalColorImagesMap.set(color, images);
      });
    }
    
    // Create the transformed data with the Map
    const transformedData = {
      ...data,
      metalColorImages: metalColorImagesMap,
      createdBy: decoded.userId,
      updatedBy: decoded.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create or update the ring
    const ring = new WeddingRing(transformedData);
    
    // Debug
    console.log("Ring object before save (metalColorImages):", 
      ring.get('metalColorImages') instanceof Map ? "Is a Map" : "Not a Map");
    
    await ring.save();

    return NextResponse.json({
      success: true,
      data: ring
    }, { status: 201 });

  } catch (error) {
    console.error('Wedding ring creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create ring' 
    }, { status: 500 });
  }
}