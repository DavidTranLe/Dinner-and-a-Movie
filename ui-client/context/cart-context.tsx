'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { MenuItem, CartItem, CartContextType, CartState } from '@/types';

const defaultCartState: CartContextType = {
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateItemNotes: () => {},
  updatePartyMember: () => {},
  clearCart: () => {},
  getTotalPrice: () => 0,
};

const CartContext = createContext<CartContextType>(defaultCartState);

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartState>({ items: [] });

  const addItem = useCallback((itemToAdd: MenuItem, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(item => item.id === itemToAdd.id);
      let updatedItems;

      if (existingItemIndex > -1) {
        updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        updatedItems = [...prevCart.items, { ...itemToAdd, quantity: quantity }];
      }
      return { ...prevCart, items: updatedItems };
    });
  }, []);

  const removeItem = useCallback((itemId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.id !== itemId),
    }));
  }, []);

   const updateItemNotes = useCallback((itemId: number, notes: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.id === itemId ? { ...item, notes } : item
      ),
    }));
  }, []);

  const updatePartyMember = useCallback((itemId: number, partyMember: string) => {
    setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map(item =>
            item.id === itemId ? { ...item, partyMember } : item
        ),
    }));
}, []);


  const clearCart = useCallback(() => {
    setCart({ items: [] });
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart.items]);

  const contextValue: CartContextType = {
    items: cart.items,
    addItem,
    removeItem,
    updateItemNotes,
    updatePartyMember,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};
