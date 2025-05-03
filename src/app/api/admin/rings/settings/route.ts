import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';
import jwt from 'jsonwebtoken';

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
}

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

    // Get all settings
    const settings = await Setting.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch settings' 
    }, { status: 500 });
  }
}