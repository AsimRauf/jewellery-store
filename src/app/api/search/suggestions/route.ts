import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import EngagementRing from '@/models/EngagementRing';
import WeddingRing from '@/models/WeddingRing';
import Setting from '@/models/Setting';
import Diamond from '@/models/Diamond';
import Gemstone from '@/models/Gemstone';
import Bracelet from '@/models/Bracelet';
import Earring from '@/models/Earring';
import Necklace from '@/models/Necklace';
import MensJewelry from '@/models/MensJewelry';
import { ProductSuggestion, MetalOption } from '@/types/product';

// Helper function to safely get the first image URL from various product structures
const getImageUrl = (item: any, color?: string, productType?: string): string => {
    // 1. For products with metal color variations (Rings, Settings)
    if (color && item.metalColorImages) {
        const colorImages = item.metalColorImages[color] || item.metalColorImages.get?.(color);
        if (colorImages && colorImages.length > 0 && colorImages[0].url) {
            return colorImages[0].url;
        }
    }

    // 2. For products with metalOptions that have images
    if (color && item.metalOptions) {
        const metalOption = item.metalOptions.find((m: any) => m.color === color);
        if (metalOption && metalOption.images && metalOption.images.length > 0) {
            return metalOption.images[0].url;
        }
    }

    // 3. For products with a 'media' object (Rings, Settings, etc.)
    if (item.media && item.media.images && item.media.images.length > 0 && item.media.images[0].url) {
        return item.media.images[0].url;
    }

    // 4. For products with a direct 'images' array (Diamonds, Gemstones)
    if (item.images && item.images.length > 0 && item.images[0].url) {
        return item.images[0].url;
    }

    return '/images/engagement-section.png'; // Default fallback image
};

// Helper function to get the appropriate price for a product
const getProductPrice = (item: any, metalOption?: any): number => {
    if (metalOption && metalOption.price) {
        return metalOption.price;
    }
    if (item.price) {
        return item.price;
    }
    if (item.basePrice) {
        return item.basePrice;
    }
    if (item.salePrice) {
        return item.salePrice;
    }
    return 0;
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
        const lowerCaseQuery = query.toLowerCase().trim();
        const limit = 10;

        // Search across all product collections with proper error handling
        const searchPromises: Array<{
            promise: Promise<any[]>;
            productType: string;
        }> = [];

        // Helper function to safely add search promises
        const addSearchPromise = (model: any, searchQuery: any, productType: string) => {
            if (model) {
                searchPromises.push({
                    promise: model.find(searchQuery).limit(limit),
                    productType
                });
            }
        };

        // Engagement Rings
        let engagementRingQuery;
        if (['ring', 'rings', 'engagement ring', 'engagement rings'].includes(lowerCaseQuery)) {
            engagementRingQuery = { isActive: true };
        } else {
            engagementRingQuery = {
                $or: [
                    { title: searchRegex },
                    { category: searchRegex },
                    { style: { $in: [searchRegex] } },
                    { type: { $in: [searchRegex] } },
                ],
                isActive: true
            };
        }
        addSearchPromise(EngagementRing, engagementRingQuery, 'Engagement Ring');

        // Wedding Rings
        let weddingRingQuery;
        if (['ring', 'rings', 'wedding ring', 'wedding rings', 'wedding band', 'wedding bands'].includes(lowerCaseQuery)) {
            weddingRingQuery = { isActive: true };
        } else {
            weddingRingQuery = {
                $or: [
                    { title: searchRegex },
                    { category: searchRegex },
                    { subcategory: searchRegex },
                    { style: { $in: [searchRegex] } },
                    { type: { $in: [searchRegex] } },
                ],
                isActive: true
            };
        }
        addSearchPromise(WeddingRing, weddingRingQuery, 'Wedding Ring');

        // Settings
        let settingQuery;
        if (['setting', 'settings'].includes(lowerCaseQuery)) {
            settingQuery = { isActive: true };
        } else {
            settingQuery = {
                $or: [
                    { title: searchRegex },
                    { category: searchRegex },
                    { style: { $in: [searchRegex] } },
                    { type: { $in: [searchRegex] } },
                ],
                isActive: true
            };
        }
        addSearchPromise(Setting, settingQuery, 'Setting');

        // Diamonds
        let diamondQuery;
        if (['diamond', 'diamonds'].includes(lowerCaseQuery)) {
            diamondQuery = { isAvailable: true };
        } else {
            diamondQuery = {
                $or: [
                    { type: searchRegex },
                    { shape: searchRegex },
                    { color: searchRegex },
                    { clarity: searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(Diamond, diamondQuery, 'Diamond');

        // Gemstones
        let gemstoneQuery;
        if (['gemstone', 'gemstones'].includes(lowerCaseQuery)) {
            gemstoneQuery = { isAvailable: true };
        } else {
            gemstoneQuery = {
                $or: [
                    { type: searchRegex },
                    { shape: searchRegex },
                    { color: searchRegex },
                    { source: searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(Gemstone, gemstoneQuery, 'Gemstone');

        // Bracelets
        let braceletQuery;
        if (['bracelet', 'bracelets'].includes(lowerCaseQuery)) {
            braceletQuery = { isAvailable: true };
        } else {
            braceletQuery = {
                $or: [
                    { name: searchRegex },
                    { type: searchRegex },
                    { metal: searchRegex },
                    { style: searchRegex },
                    { 'gemstones.type': searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(Bracelet, braceletQuery, 'Bracelet');

        // Earrings
        let earringQuery;
        if (['earring', 'earrings'].includes(lowerCaseQuery)) {
            earringQuery = { isAvailable: true };
        } else {
            earringQuery = {
                $or: [
                    { name: searchRegex },
                    { type: searchRegex },
                    { metal: searchRegex },
                    { style: searchRegex },
                    { 'gemstones.type': searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(Earring, earringQuery, 'Earring');

        // Necklaces
        let necklaceQuery;
        if (['necklace', 'necklaces'].includes(lowerCaseQuery)) {
            necklaceQuery = { isAvailable: true };
        } else {
            necklaceQuery = {
                $or: [
                    { name: searchRegex },
                    { type: searchRegex },
                    { metal: searchRegex },
                    { style: searchRegex },
                    { 'gemstones.type': searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(Necklace, necklaceQuery, 'Necklace');

        // Men's Jewelry
        let mensJewelryQuery;
        if (["men's jewelry", "mens jewelry", "men's", "mens"].includes(lowerCaseQuery)) {
            mensJewelryQuery = { isAvailable: true };
        } else {
            mensJewelryQuery = {
                $or: [
                    { name: searchRegex },
                    { type: searchRegex },
                    { metal: searchRegex },
                    { style: searchRegex },
                    { 'gemstones.type': searchRegex },
                ],
                isAvailable: true
            };
        }
        addSearchPromise(MensJewelry, mensJewelryQuery, 'Mens Jewelry');

        // Execute all search promises
        const results = await Promise.allSettled(searchPromises.map(item => item.promise));
        const allProducts: any[] = [];

        // Process results and add productType
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value && searchPromises[index]) {
                const products = result.value.map((product: any) => {
                    const productType = searchPromises[index].productType;
                    return { ...product.toObject(), productType };
                });
                allProducts.push(...products);
            }
        });

        // Convert to suggestions format
        const suggestions: ProductSuggestion[] = allProducts.flatMap((item, itemIndex): ProductSuggestion[] => {
            const baseSuggestion = {
                _id: item._id.toString(),
                slug: item.slug,
                productType: item.productType,
            };

            // Handle products with metal options (Rings, Settings)
            if (item.metalOptions && item.metalOptions.length > 0) {
                return item.metalOptions.map((variant: any, variantIndex: number) => ({
                    ...baseSuggestion,
                    _id: `${item._id.toString()}-${variant.karat}-${variant.color}-${variantIndex}`, // Unique ID for each variant
                    name: `${item.title || item.name} - ${variant.karat} ${variant.color}`,
                    imageUrl: getImageUrl(item, variant.color, item.productType),
                    price: getProductPrice(item, variant),
                    slug: item.slug || '',
                    metal: {
                        karat: variant.karat,
                        color: variant.color,
                    },
                }));
            }

            // Handle diamonds and gemstones
            if (item.productType === 'Diamond') {
                const name = `${item.carat}ct ${item.shape} ${item.color} ${item.clarity} Diamond`;
                return [{
                    ...baseSuggestion,
                    name,
                    imageUrl: getImageUrl(item, undefined, item.productType),
                    price: getProductPrice(item),
                }];
            }

            if (item.productType === 'Gemstone') {
                const name = `${item.carat}ct ${item.type} ${item.color} ${item.shape}`;
                return [{
                    ...baseSuggestion,
                    name,
                    imageUrl: getImageUrl(item, undefined, item.productType),
                    price: getProductPrice(item),
                }];
            }

            // Handle other products
            return [{
                ...baseSuggestion,
                name: item.name || item.title || '',
                imageUrl: getImageUrl(item, undefined, item.productType),
                price: getProductPrice(item),
            }];
        });

        // Sort by relevance and limit results
        const sortedSuggestions = suggestions
            .sort((a, b) => {
                // Prioritize exact matches in name
                const aExact = a.name.toLowerCase().includes(query.toLowerCase());
                const bExact = b.name.toLowerCase().includes(query.toLowerCase());
                if (aExact && !bExact) return -1;
                if (!aExact && bExact) return 1;
                return 0;
            })
            .slice(0, limit);

        return NextResponse.json(sortedSuggestions);

    } catch (error) {
        console.error('Search suggestions API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
