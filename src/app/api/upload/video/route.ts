import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { withAdminAuth } from '@/utils/authMiddleware';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  return withAdminAuth(request, async () => {
    try {

    const { file, category } = await request.json();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Determine the folder path based on category
    let folderPath = `jewelry-store/rings/${category}/videos`;
    
    // If the category is 'settings', use a dedicated folder
    if (category === 'settings') {
      folderPath = 'jewelry-store/rings/settings/videos';
    } else if (category.startsWith('gemstones')) {
      folderPath = `jewelry-store/gemstones/${category.split('/')[1]}/videos`;
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: folderPath,
      resource_type: 'video',
      allowed_formats: ['mp4', 'mov', 'webm'],
      chunk_size: 6000000,
      eager: [
        { format: 'mp4', quality: 'auto' }
      ]
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id
    });

    } catch (error) {
      console.error('Video upload error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }, { status: 500 });
    }
  });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};