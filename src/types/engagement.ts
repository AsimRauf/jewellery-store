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
  metalOptions: MetalOption[];
  main_stone?: {
    type: string;
    gemstone_type?: string;
    carat_weight: number;
  };
  media: {
    images: MediaImage[];
    video: {
      url: string;
      publicId: string;
    };
  };
  description: string;
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