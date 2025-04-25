'use client'

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export function Header() {
  'use client';
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-red-700 transition-colors">
          RestaurantApp
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-600 hover:text-red-700 transition-colors">
            Home
          </Link>
          <Link href="/orders" className="text-gray-600 hover:text-red-700 transition-colors">
            Orders
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-red-700 transition-colors">
            Login
          </Link>
          <Link href="/checkout" className="relative flex items-center text-gray-600 hover:text-red-700 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1">Checkout</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
