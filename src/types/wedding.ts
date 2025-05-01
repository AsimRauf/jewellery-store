export interface WeddingRing {
  _id: string;
  title: string;
  category: string;
  subcategory: string;
  style: string[];
  type: string[];
  SKU: string;
  basePrice: number;
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
  metalColorImages: Record<string, Array<{
    url: string;
    publicId: string;
  }>>;
  sizes: Array<{
    size: number;
    isAvailable: boolean;
    additionalPrice: number;
  }>;
  side_stone?: {
    type: string;
    number_of_stones: number;
    total_carat: number;
    shape: string;
    color: string;
    clarity: string;
  };
  media: {
    images: Array<{
      url: string;
      publicId: string;
    }>;
    video?: {
      url: string;
      publicId: string;
    };
  };
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  onSale?: boolean;
  originalPrice?: number;
}

export interface FilterState {
  styles: string[];
  types: string[];
  subcategories: string[];
  metalColors: string[];
  priceRange: [number, number] | null;
  finishTypes: string[];
}

export interface AvailableFilters {
  styles: string[];
  types: string[];
  subcategories: string[];
  metalColors: string[];
  priceRanges: [number, number][];
  finishTypes: string[];
}