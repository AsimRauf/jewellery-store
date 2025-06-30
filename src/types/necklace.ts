export interface Necklace {
  _id: string;
  slug?: string;
  sku: string;
  productNumber: string;
  title: string;
  type: string; // Pendant, Chain, Choker, Statement, Layered, Lariat, Collar, Tennis, Pearl, Charm
  length?: string; // 14", 16", 18", 20", 22", 24", 26", 28", Custom
  metal: string; // 14K Gold, 18K Gold, White Gold, Rose Gold, Yellow Gold, Platinum, Sterling Silver, Titanium
  style: string; // Classic, Modern, Vintage, Bohemian, Minimalist, Statement, Romantic, Edgy
  chainWidth?: string; // Thin, Medium, Thick, Extra Thick
  claspType?: string; // Lobster, Spring Ring, Toggle, Magnetic, Hook, Ball Clasp
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
  };
  weight?: number; // in grams
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
