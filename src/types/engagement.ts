export interface MetalOption {
  karat: string;
  color: string;
  price: number;
  isDefault: boolean;
}

export interface MediaImage {
  url: string;
  publicId: string;
}

export interface EngagementRing {
  _id: string;
  title: string;
  category: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
  originalPrice?: number;
  isNew?: boolean;
  onSale?: boolean;
  metalOptions: Array<{
    karat: string;
    color: string;
    price: number;
    description?: string;
    finish_type?: string | null;
    width_mm?: number;
    total_carat_weight?: number;
    isDefault: boolean;
  }>;
  main_stone?: {
    type: string;
    gemstone_type?: string;
    number_of_stones: number;
    carat_weight: number;
    shape: string;
    color: string;
    clarity: string;
    hardness: number;
  };
  media: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
    video: {
      url: string;
      publicId: string;
    };
  };
  description: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface FilterState {
  styles: string[];
  types: string[];
  metalColors: string[];
  priceRange: [number, number] | null;
  caratRange: [number, number] | null;
  gemstoneTypes: string[];
  stoneTypes: string[];
}

export interface AvailableFilters {
  styles: string[];
  types: string[];
  metalColors: string[];
  priceRanges: [number, number][];
  caratRanges: [number, number][];
  gemstoneTypes: string[];
  stoneTypes: string[];
}