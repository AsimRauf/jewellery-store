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

export interface MetalOption {
  karat: string;
  color: string;
  price: number;
}

// Base interface for common product properties
export interface BaseProduct {
  _id: string;
  name: string;
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
  metal?: {
    karat: string;
    color: string;
  };
}

// Interface for Ring products (Engagement, Wedding, Settings)
export interface RingProduct extends BaseProduct, IEngagementRing, IWeddingRing, ISetting {}

// Interface for Diamond products
export interface DiamondProduct extends BaseProduct, IDiamond {}

// Interface for Gemstone products
export interface GemstoneProduct extends BaseProduct, IGemstone {}

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