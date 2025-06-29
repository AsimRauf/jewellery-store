import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const ring = await WeddingRing.findById(id).lean();

    if (!ring) {
      return NextResponse.json({ error: 'Ring not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: ring
    });

  } catch (error) {
    console.error('Wedding ring fetch error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch ring' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    
    // Filter allowed fields to prevent unauthorized updates
    const allowedFields = [
      'title',
      'subcategory',
      'style',
      'type',
      'SKU',
      'basePrice',
      'metalOptions',
      'metalColorImages',
      'sizes',
      'side_stone',
      'media',
      'description',
      'isActive',
      'isFeatured',
      'isNew',
      'onSale',
      'originalPrice'
    ];
    
    const filteredData: Record<string, unknown> = {};
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = data[key];
      }
    });

    // Create a proper Mongoose Map for metalColorImages if provided
    if (filteredData.metalColorImages && typeof filteredData.metalColorImages === 'object') {
      const metalColorImagesMap = new Map();
      Object.entries(filteredData.metalColorImages as Record<string, unknown>).forEach(([color, images]) => {
        metalColorImagesMap.set(color, images);
      });
      filteredData.metalColorImages = metalColorImagesMap;
    }

    // Add update metadata
    filteredData.updatedBy = decoded.userId;
    filteredData.updatedAt = new Date();

    const ring = await WeddingRing.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    ).lean();

    if (!ring) {
      return NextResponse.json({ error: 'Ring not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: ring
    });

  } catch (error) {
    console.error('Wedding ring update error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update ring' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const ring = await WeddingRing.findByIdAndDelete(id);

    if (!ring) {
      return NextResponse.json({ error: 'Ring not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Ring deleted successfully'
    });

  } catch (error) {
    console.error('Wedding ring deletion error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete ring' 
    }, { status: 500 });
  }
}
