import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';
import { withAdminAuth } from '@/utils/authMiddleware';

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
    
    // Create or update the setting
    try {
      const setting = new Setting(transformedData);
      
      // Debug
      console.log("Setting object before save (metalColorImages):", 
        setting.get('metalColorImages') instanceof Map ? "Is a Map" : "Not a Map");
      
      await setting.save();

      return NextResponse.json({
        success: true,
        data: setting
      }, { status: 201 });
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      return NextResponse.json({ 
        error: mongoError instanceof Error ? mongoError.message : 'Failed to save setting to database'
      }, { status: 500 });
    }

    } catch (error) {
      console.error('Setting creation error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to create setting' 
      }, { status: 500 });
    }
  });
}

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
        { style: { $in: [new RegExp(search, 'i')] } },
        { type: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [settings, total] = await Promise.all([
      Setting.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Setting.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: settings,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

    } catch (error) {
      console.error('Settings fetch error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch settings' 
      }, { status: 500 });
    }
  });
}