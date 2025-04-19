import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import Product from '@/models/Product';
import { connectDB } from '@/utils/db';
import { calculateFinalPrice } from '@/utils/priceCalculator';
import { ProductVariant } from '@/types/product';

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { 
      name, 
      category, 
      basePrice, 
      description, 
      specifications,
      variants 
    } = await request.json();

    // Process each variant's image
    const processedVariants = await Promise.all(
      variants.map(async (variant: ProductVariant) => {
        const uploadResponse = await cloudinary.uploader.upload(variant.imageBase64, {
          folder: 'jewelry-variants'
        });

        return {
          ...variant,
          imageUrl: uploadResponse.secure_url,
          cloudinaryId: uploadResponse.public_id,
          finalPrice: calculateFinalPrice(basePrice, specifications, variant)
        };
      })
    );

    const product = await Product.create({
      name,
      category,
      basePrice,
      description,
      specifications,
      variants: processedVariants
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error('Product creation failed:', error);
    return NextResponse.json({ error: 'Product creation failed' }, { status: 500 });
  }
}