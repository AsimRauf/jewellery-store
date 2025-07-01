export interface Earring {
  _id: string;
  slug: string;
  sku: string;
  productNumber: string;
  name: string;
  title: string;
  type: string; // Stud, Drop, Dangle, Hoop, Huggie, Chandelier, Cluster, Climber, Threader, Jacket
  backType?: string; // Push Back, Screw Back, Lever Back, French Wire, Clip On, Magnetic, Threader
  metal: string; // 14K Gold, 18K Gold, White Gold, Rose Gold, Yellow Gold, Platinum, Sterling Silver, Titanium
  style: string; // Classic, Modern, Vintage, Bohemian, Minimalist, Statement, Romantic, Edgy
  length?: string; // For drop/dangle earrings
  width?: string; // For hoops and other wide earrings
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
