import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import GemstoneModel from '@/models/Gemstone';
import { withAdminAuth } from '@/utils/authMiddleware';

// GET single gemstone
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!GemstoneModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const gemstone = await GemstoneModel.findById(id).lean();

      if (!gemstone) {
        return NextResponse.json(
          { error: 'Gemstone not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(gemstone);

    } catch (error) {
      console.error('Error fetching gemstone:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch gemstone' 
      }, { status: 500 });
    }
  });
}

// PUT update gemstone
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!GemstoneModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const updateData = await request.json();
      
      // Add update metadata
      updateData.updatedAt = new Date();

      const gemstone = await GemstoneModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!gemstone) {
        return NextResponse.json(
          { error: 'Gemstone not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: gemstone
      });

    } catch (error) {
      console.error('Error updating gemstone:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to update gemstone' 
      }, { status: 500 });
    }
  });
}

// DELETE gemstone
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!GemstoneModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const gemstone = await GemstoneModel.findByIdAndDelete(id);

      if (!gemstone) {
        return NextResponse.json(
          { error: 'Gemstone not found' },
          { status: 404 }
        );
      }

      // TODO: Delete associated images from Cloudinary
      // This could be done here or in a separate cleanup job

      return NextResponse.json({
        success: true,
        message: 'Gemstone deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting gemstone:', error);
      return NextResponse.json({ 
        error: 'Failed to delete gemstone' 
      }, { status: 500 });
    }
  });
}
