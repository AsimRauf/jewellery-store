import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import Product, { IProduct } from '@/models/Product';
import { ProductSuggestion, MetalOption } from '@/types/product';

// Helper function to safely get the first image URL from various product structures
const getImageUrl = (item: IProduct, color?: string): string => {
    // 1. For products with metal color variations (Rings, Settings)
    if (color && item.metalOptions) {
        const images = (item.metalOptions as any)[color];
        if (images && images.length > 0 && images[0].url) {
            return images[0].url;
        }
    }

    // 2. For products with a 'media' object (Rings, Settings, etc.)
    if (item.media && item.media.images && item.media.images.length > 0 && item.media.images[0].url) {
        return item.media.images[0].url;
    }

    // 3. For products with a direct 'images' array (Diamonds, Gemstones)
    if (item.images && item.images.length > 0 && item.images[0].url) {
        return item.images[0].url;
    }

    return '/images/default-product.png'; // Default fallback image
};

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json([]);
        }

        const searchRegex = new RegExp(query, 'i');
        const limit = 10;

        const results = await Product.find({
            $or: [
                { title: searchRegex },
                { name: searchRegex },
                { category: searchRegex },
                { style: searchRegex },
                { type: searchRegex },
            ],
        }).limit(limit);

        const suggestions: ProductSuggestion[] = results.flatMap((item): ProductSuggestion[] => {
            const baseSuggestion = {
                _id: item._id.toString(),
                slug: item.slug,
                productType: item.productType,
            };

            if (item.metalOptions && item.metalOptions.length > 0) {
                return item.metalOptions.map((variant: MetalOption) => ({
                    ...baseSuggestion,
                    name: `${item.title || item.name} - ${variant.color}`,
                    imageUrl: getImageUrl(item, variant.color),
                    price: variant.price,
                    slug: item.slug || '',
                    metal: {
                        karat: variant.karat,
                        color: variant.color,
                    },
                }));
            }

            return [{
                ...baseSuggestion,
                name: item.name || item.title || '',
                imageUrl: getImageUrl(item),
                price: item.price,
            }];
        });

        return NextResponse.json(suggestions.slice(0, limit));

    } catch (error) {
        console.error('Search suggestions API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
