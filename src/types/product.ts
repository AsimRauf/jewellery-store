export interface ProductVariant {
  size: string;
  carat: string;
  color: string;
  shape: string;
  material: string;
  imageBase64: string;
  imageUrl?: string;
  cloudinaryId?: string;
  finalPrice?: number;
}

export interface ProductSpecifications {
  sizes: Array<{ value: string; additionalPrice: number }>;
  carats: Array<{ value: string; additionalPrice: number }>;
  colors: Array<{ code: string; additionalPrice: number }>;
  shapes: Array<{ type: string; additionalPrice: number }>;
  materials: Array<{ name: string; additionalPrice: number }>;
}

export interface Product {
  name: string;
  category: string;
  basePrice: number;
  description: string;
  specifications: ProductSpecifications;
  variants: ProductVariant[];
}