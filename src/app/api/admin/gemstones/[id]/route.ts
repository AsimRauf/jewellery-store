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

      const contentType = request.headers.get('content-type');
      let updateData: Record<string, unknown>;

      if (contentType?.includes('application/json')) {
        // Handle JSON updates (simple field updates)
        updateData = await request.json();
      } else {
        // Handle FormData updates (with potential image uploads)
        const formData = await request.formData();
        updateData = {};

        // Process all form fields
        for (const [key, value] of formData.entries()) {
          if (key === 'newImages') continue; // Skip image files for now
          if (key === 'imagesToDelete') continue; // Skip deletion list for now
          if (key === 'images') {
            // Parse existing images
            try {
              updateData[key] = JSON.parse(value as string);
            } catch {
              updateData[key] = [];
            }
          } else if (typeof value === 'string') {
            // Convert string values to appropriate types
            if (key === 'carat' || key === 'price' || key === 'salePrice' || key === 'discountPercentage' || key === 'hardness' || key === 'refractive_index') {
              updateData[key] = value === '' ? 0 : parseFloat(value);
            } else if (key === 'isAvailable') {
              updateData[key] = value === 'true';
            } else {
              updateData[key] = value;
            }
          }
        }

        // Handle image uploads if any
        const newImages = formData.getAll('newImages') as File[];
        if (newImages.length > 0 && newImages[0].size > 0) {
          // Here you would typically upload to Cloudinary and get URLs
          // For now, we'll skip this and just update other fields
          console.log('New images detected:', newImages.length);
        }

        // Handle image deletions
        const imagesToDelete = formData.get('imagesToDelete');
        if (imagesToDelete) {
          try {
            const deleteList = JSON.parse(imagesToDelete as string);
            console.log('Images to delete:', deleteList);
            // Here you would typically delete from Cloudinary
          } catch (e) {
            console.error('Error parsing images to delete:', e);
          }
        }
      }
      
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
