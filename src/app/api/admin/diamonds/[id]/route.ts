import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Diamond from '@/models/Diamond';
import { withAdminAuth } from '@/utils/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
            if (key === 'carat' || key === 'price' || key === 'salePrice' || key === 'discountPercentage' || 
                key === 'crownAngle' || key === 'crownHeight' || key === 'pavilionAngle' || key === 'pavilionDepth') {
              updateData[key] = value === '' ? 0 : parseFloat(value);
            } else if (key === 'isAvailable') {
              updateData[key] = value === 'true';
            } else {
              updateData[key] = value;
            }
          }
        }

        // Handle image deletions first
        const imagesToDelete = formData.get('imagesToDelete');
        if (imagesToDelete) {
          try {
            const deleteList = JSON.parse(imagesToDelete as string);
            console.log('Images to delete:', deleteList);
            
            // Delete from Cloudinary
            for (const publicId of deleteList) {
              try {
                await cloudinary.uploader.destroy(publicId);
              } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', publicId, deleteError);
                // Continue with other deletions even if one fails
              }
            }
          } catch (e) {
            console.error('Error parsing images to delete:', e);
          }
        }

        // Handle image uploads if any
        const newImages = formData.getAll('newImages') as File[];
        if (newImages.length > 0 && newImages[0].size > 0) {
          console.log('New images detected:', newImages.length);
          
          // Convert files to base64 and upload to Cloudinary
          const uploadedImages = [];
          for (const file of newImages) {
            try {
              // Convert File to buffer, then to base64
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

              // Upload to Cloudinary directly
              const folderPath = `jewelry-store/rings/diamonds/${updateData.type || 'natural'}`;
              const publicId = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              
              const result = await cloudinary.uploader.upload(base64, {
                folder: folderPath,
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                transformation: [
                  { quality: 'auto:good' },
                  { fetch_format: 'auto' }
                ],
                public_id: publicId
              });

              uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id
              });
            } catch (uploadError) {
              console.error('Error uploading image:', uploadError);
            }
          }

          // Add new images to existing images
          if (uploadedImages.length > 0) {
            const currentImages = updateData.images as Array<{ url: string; publicId: string }> || [];
            updateData.images = [...currentImages, ...uploadedImages];
          }
        }
      }
      
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
