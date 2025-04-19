import { ProductSpecifications, ProductVariant } from '@/types/product';

export function calculateFinalPrice(
  basePrice: number,
  specifications: ProductSpecifications,
  variant: ProductVariant
): number {
  let finalPrice = basePrice;

  // Add size price
  const sizeSpec = specifications.sizes.find((s) => s.value === variant.size);
  finalPrice += sizeSpec?.additionalPrice || 0;

  // Add carat price
  const caratSpec = specifications.carats.find((c) => c.value === variant.carat);
  finalPrice += caratSpec?.additionalPrice || 0;

  // Add color price
  const colorSpec = specifications.colors.find((c) => c.code === variant.color);
  finalPrice += colorSpec?.additionalPrice || 0;

  // Add shape price
  const shapeSpec = specifications.shapes.find((s) => s.type === variant.shape);
  finalPrice += shapeSpec?.additionalPrice || 0;

  // Add material price
  const materialSpec = specifications.materials.find((m) => m.name === variant.material);
  finalPrice += materialSpec?.additionalPrice || 0;

  return finalPrice;
}