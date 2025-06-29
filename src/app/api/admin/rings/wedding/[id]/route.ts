import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import WeddingRing from '@/models/WeddingRing';
import { withAdminAuth } from '@/utils/authMiddleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async (req, user) => {
    try {
      await connectDB();

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
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async (req, user) => {
    try {
      await connectDB();

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
    filteredData.updatedBy = user.id;
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
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async (req, user) => {
    try {
      await connectDB();

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
  });
}
