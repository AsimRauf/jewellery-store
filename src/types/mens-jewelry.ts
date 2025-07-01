export interface MensJewelry {
    _id: string;
    slug: string;
    sku: string;
    productNumber: string;
    name: string;
    title: string;
    type: string; // Ring, Necklace, Bracelet, Watch, Cufflinks, Tie Clip, Chain, Pendant, Signet Ring, Wedding Band
    metal: string; // 14K Gold, 18K Gold, White Gold, Rose Gold, Yellow Gold, Platinum, Sterling Silver, Titanium, Stainless Steel, Tungsten, Palladium
    style: string; // Classic, Modern, Vintage, Industrial, Minimalist, Bold, Executive, Casual
    finish: string; // Polished, Matte, Brushed, Hammered, Sandblasted, Antiqued
    size?: string; // Ring sizes (5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15) or Custom
    length?: string; // For chains/necklaces: 18", 20", 22", 24", 26", 28", 30", Custom
    width?: string; // mm measurements for bracelets/chains
    thickness?: string; // mm measurements for bands/rings
    weight?: number; // in grams
    engravingAvailable: boolean;
    engravingDetails?: {
        maxCharacters?: number;
        fonts?: string[];
        placement?: string[];
    };
    gemstones?: Array<{
        type: string;
        size?: string;
        color?: string;
        quantity?: number;
    }>;
    dimensions?: {
        length?: string;
        width?: string;
        thickness?: string;
        diameter?: string;
    };
    price: number;
    salePrice?: number;
    discountPercentage?: number;
    images?: Array<{ url: string; publicId: string }>;
    description?: string;
    features?: string[];
    careInstructions?: string;
    isAvailable: boolean;
    stockQuantity?: number;
    createdAt: Date;
    updatedAt: Date;
}
