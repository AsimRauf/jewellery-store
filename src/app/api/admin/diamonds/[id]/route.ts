import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';
import { withAdminAuth } from '@/utils/authMiddleware';

// GET single diamond
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      const diamond = await Diamond.findById(id).lean();

      if (!diamond) {
        return NextResponse.json(
          { error: 'Diamond not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(diamond);

    } catch (error) {
      console.error('Error fetching diamond:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch diamond' 
      }, { status: 500 });
    }
  });
}

// PUT update diamond
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      const updateData = await request.json();
      
      // Add update metadata
      updateData.updatedAt = new Date();

      const diamond = await Diamond.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!diamond) {
        return NextResponse.json(
          { error: 'Diamond not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: diamond
      });

    } catch (error) {
      console.error('Error updating diamond:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to update diamond' 
      }, { status: 500 });
    }
  });
}

// DELETE diamond
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      const diamond = await Diamond.findByIdAndDelete(id);

      if (!diamond) {
        return NextResponse.json(
          { error: 'Diamond not found' },
          { status: 404 }
        );
      }

      // TODO: Delete associated images from Cloudinary
      // This could be done here or in a separate cleanup job

      return NextResponse.json({
        success: true,
        message: 'Diamond deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting diamond:', error);
      return NextResponse.json({ 
        error: 'Failed to delete diamond' 
      }, { status: 500 });
    }
  });
}
