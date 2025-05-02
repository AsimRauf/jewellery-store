import React from 'react';

interface MetalOption {
  karat: string;
  color: string;
  price?: number;
  finish_type?: string | null;
}

// Define a common product interface that works for both product types
interface BaseProduct {
  _id: string;
  title: string;
  style?: string[];
  type?: string[];
  subcategory?: string;
  main_stone?: {
    type: string;
    gemstone_type?: string;
    number_of_stones?: number;
    carat_weight: number;
    shape?: string;
    color?: string;
    clarity?: string;
  };
  side_stone?: {
    type: string;
    number_of_stones: number;
    total_carat: number;
    shape?: string;
    color?: string;
    clarity?: string;
  };
}

interface ProductFeaturesProps {
  product: BaseProduct;
  selectedMetal: MetalOption | null;
}

export default function ProductFeatures({ product, selectedMetal }: ProductFeaturesProps) {
  if (!product) return null;

  

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-amber-50 border-b border-amber-100">
        <h2 className="text-xl font-cinzel text-amber-800">Product Features</h2>
      </div>
      
      <div className="p-6">
        <dl className="space-y-4">
          {/* Metal Information */}
          {selectedMetal && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Metal</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {selectedMetal.karat} {selectedMetal.color}
                {selectedMetal.finish_type && ` (${selectedMetal.finish_type} finish)`}
              </dd>
            </div>
          )}
          
          {/* Style */}
          {product.style && product.style.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Style</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.style.join(', ')}
              </dd>
            </div>
          )}
          
          {/* Type */}
          {product.type && product.type.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.type.join(', ')}
              </dd>
            </div>
          )}
          
          {/* Subcategory (for wedding rings) */}
          {product.subcategory && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{product.subcategory}</dd>
            </div>
          )}
          
          {/* Main Stone (for engagement rings) */}
          {product.main_stone?.type && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Main Stone</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.main_stone.carat_weight}ct {product.main_stone.type}
                {product.main_stone.shape && `, ${product.main_stone.shape} shape`}
                {product.main_stone.color && `, ${product.main_stone.color} color`}
                {product.main_stone.clarity && `, ${product.main_stone.clarity} clarity`}
              </dd>
            </div>
          )}
          
          {/* Side Stones */}
          {product.side_stone?.type && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Side Stones</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {product.side_stone.number_of_stones} {product.side_stone.type} stones
                {product.side_stone.total_carat && `, ${product.side_stone.total_carat}ct total`}
                {product.side_stone.shape && `, ${product.side_stone.shape} shape`}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}