import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import EngagementRing from '@/models/EngagementRing';
import { withAdminAuth } from '@/utils/authMiddleware';

// GET single engagement ring
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    const ring = await EngagementRing.findById(id).lean();

    if (!ring) {
      return NextResponse.json(
        { error: 'Engagement ring not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ring
    });

    } catch (error) {
      console.error('Error fetching engagement ring:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch engagement ring' 
      }, { status: 500 });
    }
  });
}

// PUT update engagement ring
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    const updateData = await request.json();
    
    // Handle metalColorImages if provided
    const filteredData = { ...updateData };
    
    if (updateData.metalColorImages && typeof updateData.metalColorImages === 'object') {
      // Convert object to Map for Mongoose
      const metalColorImagesMap = new Map();
      Object.entries(updateData.metalColorImages).forEach(([color, images]) => {
        metalColorImagesMap.set(color, images);
      });
      filteredData.metalColorImages = metalColorImagesMap;
    }

    // Add update metadata
    filteredData.updatedAt = new Date();

    const ring = await EngagementRing.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!ring) {
      return NextResponse.json(
        { error: 'Engagement ring not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ring
    });

    } catch (error) {
      console.error('Error updating engagement ring:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to update engagement ring' 
      }, { status: 500 });
    }
  });
}

// DELETE engagement ring
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    const ring = await EngagementRing.findByIdAndDelete(id);

    if (!ring) {
      return NextResponse.json(
        { error: 'Engagement ring not found' },
        { status: 404 }
      );
    }

    // TODO: Delete associated images from Cloudinary
    // This could be done here or in a separate cleanup job

    return NextResponse.json({
      success: true,
      message: 'Engagement ring deleted successfully'
    });

    } catch (error) {
      console.error('Error deleting engagement ring:', error);
      return NextResponse.json({ 
        error: 'Failed to delete engagement ring' 
      }, { status: 500 });
    }
  });
}
