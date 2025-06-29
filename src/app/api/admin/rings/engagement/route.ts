import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import EngagementRing from '@/models/EngagementRing';
import { withAdminAuth } from '@/utils/authMiddleware';

// GET endpoint to list all engagement rings
export async function GET(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    // Parse query parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Build search filter
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { SKU: { $regex: search, $options: 'i' } },
        { 'main_stone.type': { $regex: search, $options: 'i' } },
        { 'main_stone.gemstone_type': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [rings, total] = await Promise.all([
      EngagementRing.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      EngagementRing.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: rings,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

    } catch (error) {
      console.error('Error fetching engagement rings:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch engagement rings' 
      }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

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
      metalColorImages: metalColorImagesMap
    };
    
    // Create or update the ring
    const ring = new EngagementRing(transformedData);
    
    // Debug
    console.log("Ring object before save (metalColorImages):", 
      ring.get('metalColorImages') instanceof Map ? "Is a Map" : "Not a Map");
    
    await ring.save();

    return NextResponse.json({
      success: true,
      data: ring
    }, { status: 201 });

    } catch (error) {
      console.error('Engagement ring creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create ring' 
      }, { status: 500 });
    }
  });
}