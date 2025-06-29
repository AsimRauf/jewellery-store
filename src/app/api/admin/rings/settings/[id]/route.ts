import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Setting from '@/models/Setting';
import { withAdminAuth } from '@/utils/authMiddleware';

// GET single setting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    const setting = await Setting.findById(id).lean();

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: setting
    });

    } catch (error) {
      console.error('Error fetching setting:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch setting' 
      }, { status: 500 });
    }
  });
}

// PUT update setting
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

    const setting = await Setting.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: setting
    });

    } catch (error) {
      console.error('Error updating setting:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to update setting' 
      }, { status: 500 });
    }
  });
}

// DELETE setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

    const setting = await Setting.findByIdAndDelete(id);

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    // TODO: Delete associated images from Cloudinary
    // This could be done here or in a separate cleanup job

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully'
    });

    } catch (error) {
      console.error('Error deleting setting:', error);
      return NextResponse.json({ 
        error: 'Failed to delete setting' 
      }, { status: 500 });
    }
  });
}
