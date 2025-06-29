import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { withAdminAuth } from '@/utils/authMiddleware';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  return withAdminAuth(request, async (req, user) => {
    try {

    const { publicId, resourceType = 'image' } = await request.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
        result
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to delete file',
        result
      }, { status: 400 });
    }

    } catch (error) {
      console.error('Delete error:', error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : 'Failed to delete file'
      }, { status: 500 });
    }
  });
}
