import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import MensJewelryModel from '@/models/MensJewelry';
import { withAdminAuth } from '@/utils/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single men's jewelry item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!MensJewelryModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const mensJewelry = await MensJewelryModel.findById(id).lean();

      if (!mensJewelry) {
        return NextResponse.json(
          { error: 'Men\'s jewelry item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(mensJewelry);

    } catch (error) {
      console.error('Error fetching men\'s jewelry item:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch men\'s jewelry item' 
      }, { status: 500 });
    }
  });
}

// PUT update men's jewelry item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!MensJewelryModel) {
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
            if (key === 'price' || key === 'salePrice' || key === 'discountPercentage' ||
                key === 'length' || key === 'width' || key === 'thickness' || key === 'weight' || key === 'totalPieces') {
              updateData[key] = value === '' ? null : parseFloat(value);
            } else if (key === 'isAvailable') {
              updateData[key] = value === 'true';
            } else if (key === 'features') {
              try {
                updateData[key] = JSON.parse(value);
              } catch {
                updateData[key] = value ? [value] : [];
              }
            } else if (key === 'gemstones') {
              try {
                updateData[key] = JSON.parse(value);
              } catch {
                updateData[key] = [];
              }
            } else if (key === 'engraving') {
              try {
                updateData[key] = JSON.parse(value);
              } catch {
                updateData[key] = { available: false };
              }
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

              // Create folder path based on metal type
              const metal = (updateData.metal as string || 'gold').toLowerCase().replace(/[^a-z0-9]/g, '-');
              const folderPath = `jewelry-store/fine-jewelry/mens/${metal}`;
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

      const mensJewelry = await MensJewelryModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!mensJewelry) {
        return NextResponse.json(
          { error: 'Men\'s jewelry item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: mensJewelry
      });

    } catch (error) {
      console.error('Error updating men\'s jewelry item:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to update men\'s jewelry item' 
      }, { status: 500 });
    }
  });
}

// DELETE men's jewelry item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withAdminAuth(request, async () => {
    try {
      await connectDB();

      if (!MensJewelryModel) {
        return NextResponse.json({ 
          error: 'Database model not available' 
        }, { status: 500 });
      }

      const mensJewelry = await MensJewelryModel.findById(id);

      if (!mensJewelry) {
        return NextResponse.json(
          { error: 'Men\'s jewelry item not found' },
          { status: 404 }
        );
      }

      // Delete associated images from Cloudinary
      if (mensJewelry.images && mensJewelry.images.length > 0) {
        console.log('Deleting images from Cloudinary:', mensJewelry.images.length);
        for (const image of mensJewelry.images) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (deleteError) {
            console.error('Error deleting image from Cloudinary:', image.publicId, deleteError);
            // Continue with deletion even if image cleanup fails
          }
        }
      }

      // Delete the men's jewelry item
      await MensJewelryModel.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: 'Men\'s jewelry item deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting men\'s jewelry item:', error);
      return NextResponse.json({ 
        error: 'Failed to delete men\'s jewelry item' 
      }, { status: 500 });
    }
  });
}
