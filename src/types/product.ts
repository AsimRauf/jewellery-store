import {
  IEngagementRing,
  IWeddingRing,
  ISetting,
  IDiamond,
  IGemstone,
  IBracelet,
  IEarring,
  INecklace,
  IMensJewelry,
} from '@/models';
import { DiamondShape } from '@/models/Diamond';
import { GemstoneType } from '@/models/Gemstone';

export interface MetalOption {
  karat: string;
  color: string;
  price: number;
}

// Base interface for common product properties
export interface BaseProduct {
  _id: string;
  name: string;
  title: string;
  slug: string;
  price: number;
  productType: string;
  imageUrl: string;
}
export interface ProductSuggestion {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productType: string;
  price: number;
  salePrice?: number;
  metal?: {
    karat: string;
    color: string;
  };
}

// Interface for Ring products (Engagement, Wedding, Settings)
export interface RingProduct extends BaseProduct, IEngagementRing, IWeddingRing, ISetting {}

// Interface for Diamond products
export interface DiamondProduct extends BaseProduct, IDiamond {
  shape: DiamondShape;
  carat: number;
}

// Interface for Gemstone products
export interface GemstoneProduct extends BaseProduct, IGemstone {
  type: typeof GemstoneType[keyof typeof GemstoneType];
  carat: number;
}

// Interface for Bracelet products
export interface BraceletProduct extends BaseProduct, IBracelet {}

// Interface for Earring products
export interface EarringProduct extends BaseProduct, IEarring {}

// Interface for Necklace products
export interface NecklaceProduct extends BaseProduct, INecklace {}

// Interface for Men's Jewelry products
export interface MensJewelryProduct extends BaseProduct, IMensJewelry {}

// A union type for any product
export type AnyProduct =
  | RingProduct
  | DiamondProduct
  | GemstoneProduct
  | BraceletProduct
  | EarringProduct
  | NecklaceProduct
  | MensJewelryProduct;
