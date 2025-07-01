export interface Bracelet {
  _id: string;
  slug: string;
  sku: string;
  productNumber: string;
  name: string;
  title: string;
  type: string; // Tennis, Chain, Bangle, Charm, Cuff, Link, Beaded, Wrap, Tennis Diamond, Pearl
  closure?: string; // Lobster Clasp, Spring Ring, Toggle, Magnetic, Hook & Eye, Box Clasp, Slide, None
  metal: string; // 14K Gold, 18K Gold, White Gold, Rose Gold, Yellow Gold, Platinum, Sterling Silver, Titanium
  style: string; // Classic, Modern, Vintage, Bohemian, Minimalist, Statement, Romantic, Edgy
  length?: string; // 6", 6.5", 7", 7.5", 8", 8.5", 9", Custom
  width?: string; // Thin, Medium, Wide, Extra Wide
  adjustable: boolean; // True for adjustable bracelets, false for fixed size
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
