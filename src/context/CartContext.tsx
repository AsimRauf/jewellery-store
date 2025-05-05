'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { CartItem } from '@/types/cart';

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, updatedItem?: Partial<CartItem>) => void;
  updateItem: (id: string, updatedItem: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

// Create the context with default values
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  updateItem: () => {},
  clearCart: () => {},
  itemCount: 0,
  subtotal: 0
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize cart from localStorage if available
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, loaded]);

  // Calculate total item count
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Add an item to the cart with protection against duplicates
  const addItem = (newItem: CartItem) => {
    // If already processing an action, ignore this call
    if (isProcessingAction) {
      console.log('Already processing an action, ignoring this call');
      return;
    }
    
    // Set processing flag
    setIsProcessingAction(true);
    
    // Use a function to update items to ensure we're working with the latest state
    flushSync(() => {
      setItems(currentItems => {
        // For customized items, always add as new item
        if (newItem.customization?.isCustomized) {
          const cartItemId = `${newItem._id}-${Date.now()}`;
          return [...currentItems, { ...newItem, cartItemId }];
        }
        
        // For regular items, check for duplicates
        const itemIdentifier = `${newItem._id}-${newItem.metalOption?.karat || ''}-${newItem.metalOption?.color || ''}-${newItem.size || ''}-${newItem.productType || ''}`;
        
        // Check if item already exists in cart using the identifier
        const existingItemIndex = currentItems.findIndex(item => {
          if (item.customization?.isCustomized) return false; // Never match customized items
          const currentIdentifier = `${item._id}-${item.metalOption?.karat || ''}-${item.metalOption?.color || ''}-${item.size || ''}-${item.productType || ''}`;
          return currentIdentifier === itemIdentifier;
        });

        // Create a new array to avoid mutation
        let updatedItems;
        
        if (existingItemIndex > -1) {
          // Update quantity if item exists
          updatedItems = [...currentItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
          };
        } else {
          // Add new item if it doesn't exist
          const cartItemId = `${itemIdentifier}-${Date.now()}`;
          updatedItems = [...currentItems, { ...newItem, cartItemId }];
        }
        
        return updatedItems;
      });
    });
    
    // Reset processing flag after a delay
    setTimeout(() => {
      setIsProcessingAction(false);
    }, 500);
  };

  // Remove an item from the cart using cartItemId instead of product _id
  const removeItem = (cartItemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Update an item in the cart with new properties
  const updateItem = (cartItemId: string, updatedItem: Partial<CartItem>) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.cartItemId === cartItemId ? { ...item, ...updatedItem } : item
      )
    );
  };

  // Update item quantity using cartItemId
  const updateQuantity = (cartItemId: string, quantity: number, updatedItem?: Partial<CartItem>) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    if (updatedItem) {
      updateItem(cartItemId, { ...updatedItem, quantity });
    } else {
      updateItem(cartItemId, { quantity });
    }
  };

  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };

  // Provide the cart context to children
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateItem,
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};