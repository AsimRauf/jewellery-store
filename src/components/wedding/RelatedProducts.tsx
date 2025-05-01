'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WeddingRing } from '@/types/wedding';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RelatedProductsProps {
  currentProductId: string;
  subcategory: string;
  style?: string;
}

export default function RelatedProducts({ 
  currentProductId, 
  subcategory, 
  style 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<WeddingRing[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        // Construct query parameters
        const params = new URLSearchParams();
        params.set('subcategories', subcategory);
        if (style) params.set('styles', style);
        params.set('limit', '4');
        
        const response = await fetch(`/api/products/wedding/all?${params.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch related products');
        
        const data = await response.json();
        
        // Filter out the current product
        const filteredProducts = data.products.filter(
          (product: WeddingRing) => product._id !== currentProductId
        );
        
        // Limit to 4 products
        setProducts(filteredProducts.slice(0, 4));
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentProductId && subcategory) {
      fetchRelatedProducts();
    }
  }, [currentProductId, subcategory, style]);
  
  if (loading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-cinzel mb-6">You May Also Like</h2>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="my-12">
      <h2 className="text-2xl font-cinzel mb-6">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // Get default metal option
          const defaultMetal = product.metalOptions.find(m => m.isDefault) || product.metalOptions[0];
          
          // Get image for the default metal
          let imageUrl = '';
          if (product.metalColorImages && product.metalColorImages[defaultMetal.color]?.length > 0) {
            imageUrl = product.metalColorImages[defaultMetal.color][0].url;
          } else if (product.media.images.length > 0) {
            imageUrl = product.media.images[0].url;
          }
          
          // Create slug from product title and ID
          const slug = `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product._id}`;
          
          return (
            <Link 
              key={product._id} 
              href={`/products/rings/wedding/${slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                {imageUrl ? (
                  <Image 
                    src={imageUrl} 
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                {product.title}
              </h3>
              
              <p className="mt-1 text-sm text-gray-500">
                {defaultMetal.karat} {defaultMetal.color}
              </p>
              
              <p className="mt-1 text-sm font-medium text-gray-900">
                ${defaultMetal.price.toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}