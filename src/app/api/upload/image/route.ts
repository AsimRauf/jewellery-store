import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { withAdminAuth } from '@/utils/authMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req, user) => {
    try {

    const { file, category, index, colorKey } = await request.json();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine the folder path based on category
    let folderPath = `jewelry-store/rings/${category}`;
    
    // If the category is 'settings', use a dedicated folder
    if (category === 'settings') {
      folderPath = 'jewelry-store/rings/settings';
    }

    try {
      // Generate a unique public_id based on color and index
      let publicId = '';
      
      if (colorKey) {
        // For metal color images, include the color in the public_id
        const colorSlug = colorKey.toLowerCase().replace(/\s+/g, '_');
        publicId = `${colorSlug}_image_${index !== undefined ? index : Date.now()}`;
      } else {
        // For regular images, just use index or timestamp
        publicId = `image_${index !== undefined ? index : Date.now()}`;
      }
      
      const result = await cloudinary.uploader.upload(file, {
        folder: folderPath,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        public_id: publicId
      });

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        index: index // Return the index to maintain order
      });
    } catch (cloudinaryError: unknown) {
      console.error('Cloudinary upload error:', cloudinaryError);
      
      // Check if it's a connection error - need to check type first with unknown
      if (
        typeof cloudinaryError === 'object' && 
        cloudinaryError !== null && 
        'message' in cloudinaryError && 
        typeof cloudinaryError.message === 'string' && 
        cloudinaryError.message.includes('ENOTFOUND')
      ) {
        return NextResponse.json({ 
          error: 'Cannot connect to Cloudinary. Please check your internet connection or Cloudinary configuration.' 
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: typeof cloudinaryError === 'object' && cloudinaryError !== null && 'message' in cloudinaryError 
          ? String(cloudinaryError.message) 
          : 'Image upload to Cloudinary failed' 
      }, { status: 500 });
    }

    } catch (error) {
      console.error('Image upload error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }, { status: 500 });
    }
  });
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};