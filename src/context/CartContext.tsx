'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
// Define the cart item type
interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  cartItemId?: string;
  metalOption?: {
    karat: string;
    color: string;
  };
  size?: number;
}

// Define the cart context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
        // Check if item already exists in cart
        const existingItemIndex = currentItems.findIndex(item => 
          item._id === newItem._id && 
          item.metalOption?.karat === newItem.metalOption?.karat && 
          item.metalOption?.color === newItem.metalOption?.color &&
          item.size === newItem.size
        );

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
          // Add a unique identifier to each cart item to prevent key conflicts
          const uniqueItem = {
            ...newItem,
            cartItemId: `${newItem._id}-${newItem.metalOption?.karat}-${newItem.metalOption?.color}-${Date.now()}`
          };
          updatedItems = [...currentItems, uniqueItem];
        }
        
        // Log the before and after state for debugging
        console.log('Before update:', currentItems);
        console.log('After update:', updatedItems);
        
        return updatedItems;
      });
    });
    
    // Reset processing flag after a delay
    setTimeout(() => {
      setIsProcessingAction(false);
    }, 500);
  };

  // Remove an item from the cart
  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item._id !== id));
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(currentItems => 
      currentItems.map(item => 
        item._id === id ? { ...item, quantity } : item
      )
    );
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
      clearCart,
      itemCount,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};