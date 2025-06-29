import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import EngagementRing from '@/models/EngagementRing';
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