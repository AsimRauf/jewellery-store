'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductImage {
  url: string;
  publicId: string;
  _id?: string;
}

interface MetalOption {
  karat: string;
  color: string;
  price: number;
  finish_type?: string | null;
  isDefault?: boolean;
}

interface Product {
  _id: string;
  title: string;
  metalOptions: MetalOption[];
  metalColorImages?: {
    [color: string]: ProductImage[];
  };
  media: {
    images: ProductImage[];
    video?: {
      url: string;
      publicId: string;
    };
  };
  style?: string[];
  subcategory?: string;
  main_stone?: {
    type: string;
    carat_weight: number;
  };
}

interface RelatedProductsProps {
  currentProductId: string;
  productType: 'wedding' | 'engagement';
  subcategory?: string;
  style?: string;
}

export default function RelatedProducts({ 
  currentProductId, 
  productType,
  subcategory, 
  style 
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        // Construct query parameters
        const params = new URLSearchParams();
        if (subcategory) params.set('subcategories', subcategory);
        if (style) params.set('styles', style);
        params.set('limit', '4');
        
        // Use the appropriate API endpoint based on product type
        const endpoint = productType === 'wedding' 
          ? '/api/products/wedding/all' 
          : '/api/products/engagement/all';
        
        const response = await fetch(`${endpoint}?${params.toString()}`);
        
        if (!response.ok) throw new Error(`Failed to fetch related ${productType} products`);
        
        const data = await response.json();
        
        // Filter out the current product
        const filteredProducts = data.products.filter(
          (product: Product) => product._id !== currentProductId
        );
        
        // Limit to 4 products
        setProducts(filteredProducts.slice(0, 4));
      } catch (err) {
        console.error(`Error fetching related ${productType} products:`, err);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentProductId && (subcategory || style)) {
      fetchRelatedProducts();
    }
  }, [currentProductId, subcategory, style, productType]);

  // Function to get image URL for a product and color
  const getImageUrl = (product: Product, color: string): string => {
    // If the product has metal color images for the specified color, use the first one
    if (color && product.metalColorImages && product.metalColorImages[color] && product.metalColorImages[color].length > 0) {
      return product.metalColorImages[color][0].url;
    }
    
    // Otherwise, use the first image from the product's media
    if (product.media && product.media.images && product.media.images.length > 0) {
      return product.media.images[0].url;
    }
    
    // If no images are available, return a placeholder
    return '/placeholder-image.jpg';
  };

  // Function to handle adding to cart
  const handleAddToCart = (product: Product) => {
    // Prevent multiple clicks
    if (addingProductId) {
      return;
    }
    
    setAddingProductId(product._id);
    
    // Find the default metal option
    const defaultMetal = product.metalOptions.find(m => m.isDefault) || product.metalOptions[0];
    
    if (!defaultMetal) {
      setAddingProductId(null);
      return;
    }
    
    // Add the product to cart
    addItem({
      _id: product._id,
      title: product.title,
      price: defaultMetal.price,
      quantity: 1,
      image: getImageUrl(product, defaultMetal.color),
      metalOption: {
        karat: defaultMetal.karat,
        color: defaultMetal.color
      },
      productType: productType
    });
    
    // Show a toast notification
    toast.success(`Added ${product.title} to cart!`, {
      position: 'bottom-right',
      duration: 3000
    });
    
    // Reset after a short delay
    setTimeout(() => {
      setAddingProductId(null);
    }, 500);
  };
  
  if (loading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-cinzel mb-8 text-center">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="my-16 border-t border-gray-100 pt-12">
      <h2 className="text-2xl font-cinzel mb-8 text-center">You May Also Like</h2>
      
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
          
          // Determine product URL based on type
          const productUrl = productType === 'wedding'
            ? `/products/rings/wedding/${slug}`
            : `/products/rings/engagement/${slug}`;
          
          return (
            <div key={product._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <Link href={productUrl}>
                  <div className="aspect-square overflow-hidden">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Quick add to cart button */}
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={addingProductId === product._id}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                  aria-label="Add to cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <Link href={productUrl}>
                  <h3 className="font-cinzel text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                
                <div className="space-y-1">
                  <p className="text-amber-600 font-semibold text-lg">
                    ${defaultMetal.price.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">{defaultMetal.karat} {defaultMetal.color}</p>
                </div>
                
                {/* Metal Options */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.metalOptions.slice(0, 3).map((metal) => (
                    <Link 
                      key={`${metal.karat}-${metal.color}`}
                      href={`${productUrl}?metal=${encodeURIComponent(metal.karat)}-${encodeURIComponent(metal.color)}`}
                      className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      {metal.karat} {metal.color}
                    </Link>
                  ))}
                  {product.metalOptions.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                      +{product.metalOptions.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Display finish type if available (for wedding rings) */}
                {defaultMetal.finish_type && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="inline-block">
                      {defaultMetal.finish_type} Finish
                    </span>
                  </div>
                )}
                
                {/* Display main stone info if available (for engagement rings) */}
                {product.main_stone && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="inline-block">
                      {product.main_stone.carat_weight}ct {product.main_stone.type}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href={productType === 'wedding' && subcategory 
            ? `/wedding/${subcategory.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` 
            : `/engagement/all`}
          className="inline-block px-6 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-50 transition-colors"
        >
          View More {productType === 'wedding' ? subcategory : 'Engagement'} Rings
        </Link>
      </div>
    </div>
  );
}