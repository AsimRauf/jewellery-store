import { CartItem } from '@/types/cart';
import {
  DiamondProduct,
  GemstoneProduct,
  NecklaceProduct,
  BraceletProduct,
  EarringProduct,
 MensJewelryProduct,
} from '@/types/product';

// Function to generate a title for a diamond
export const getDiamondTitle = (diamond: DiamondProduct): string => {
  const { carat, shape, color, clarity } = diamond;
  return `${carat}ct ${shape} Diamond (${color}, ${clarity})`;
};

// Function to generate a title for a gemstone
export const getGemstoneTitle = (gemstone: GemstoneProduct): string => {
  const { carat, type, color } = gemstone;
  return `${carat}ct ${type} (${color})`;
};

// Function to generate a title for a necklace
export const getNecklaceTitle = (necklace: NecklaceProduct): string => {
  const { title, type, metal, style } = necklace;
  return `${title} ${type} ${metal} ${style}`;
};

// Function to generate a title for a bracelet
export const getBraceletTitle = (bracelet: BraceletProduct): string => {
  const { title, type, metal, style } = bracelet;
  return `${title} ${type} ${metal} ${style}`;
};

// Function to generate a title for an earring
export const getEarringTitle = (earring: EarringProduct): string => {
  const { title, type, metal, style } = earring;
  return `${title} ${type} ${metal} ${style}`;
};

// Function to generate a title for a men's jewelry item
export const getMensJewelryTitle = (item: MensJewelryProduct): string => {
 const { title, type, metal, style } = item;
 return `${title} ${type} ${metal} ${style}`;
};

// Function to get the title for any cart item
export const getCartItemTitle = (item: CartItem): string => {
  if (item.productType === 'diamond') {
    const diamond = item as unknown as DiamondProduct;
    if (diamond.shape && diamond.carat) {
      return getDiamondTitle(diamond);
    }
  }
  if (item.productType === 'gemstone') {
    const gemstone = item as unknown as GemstoneProduct;
    if (gemstone.type && gemstone.carat) {
      return getGemstoneTitle(gemstone);
    }
  }
  if (item.productType === 'necklace') {
    const necklace = item as unknown as NecklaceProduct;
    if (necklace.title && necklace.type && necklace.metal && necklace.style) {
      return getNecklaceTitle(necklace);
    }
  }
  if (item.productType === 'bracelet') {
    const bracelet = item as unknown as BraceletProduct;
    if (bracelet.title && bracelet.type && bracelet.metal && bracelet.style) {
      return getBraceletTitle(bracelet);
    }
  }
  if (item.productType === 'earring') {
    const earring = item as unknown as EarringProduct;
    if (earring.title && earring.type && earring.metal && earring.style) {
      return getEarringTitle(earring);
    }
  }
 if (item.productType === 'mens-jewelry') {
   const mensJewelry = item as unknown as MensJewelryProduct;
   if (mensJewelry.title && mensJewelry.type && mensJewelry.metal && mensJewelry.style) {
     return getMensJewelryTitle(mensJewelry);
   }
 }
  // For all other products (including fine jewelry), the title is already set correctly when added to cart.
  return item.title;
};
