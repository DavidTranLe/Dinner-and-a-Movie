'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MenuItem } from '@/types';
import { useCart } from '@/context/cart-context';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
    console.log(`${item.name} added to cart`);
  };

  const initialSrc = item.imageurl || `https://placehold.co/600x400/cccccc/ffffff?text=No+Image`;

  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={initialSrc}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {

              const target = e.target as HTMLImageElement;
              console.error(`Failed to load image: ${target.src}`);
              target.onerror = null;
              target.src = `https://placehold.co/600x400/cccccc/ffffff?text=Load+Error`;
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-2">{item.description}</CardDescription>
        <p className="text-lg font-bold text-red-700">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
