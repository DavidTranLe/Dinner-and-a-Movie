// ui-client/components/MenuItemCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion'; // Import motion
import { cn } from "@/lib/utils"; // Import cn for conditional classes

// Import necessary shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

// Define the MenuItem type
type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageurl: string;
  available: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
  addToOrder: (item: MenuItem) => void; // Function to add item to order
}

// --- Animation Variants for each card ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 }, // Start slightly down and invisible
  visible: {
    opacity: 1,
    y: 0, // Animate to original position and fully visible
    transition: {
      duration: 0.4, // Control speed of individual card animation
      ease: "easeOut"
    }
  },
};


export function MenuItemCard({ item, addToOrder }: MenuItemCardProps) {
  const imageUrl = item.imageurl;
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageError(true);
  };

   React.useEffect(() => {
      setImageError(false);
   }, [item.id]);

  const handleAddToOrder = () => {
    if (item.available) {
      addToOrder(item);
    }
  };

  return (
    // Apply variants and add whileHover effect
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.03, y: -5 }} // Scale up and lift slightly on hover
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Add a spring transition for hover
      className="h-full" // Removed cursor-pointer
    >
      {/* Add group class for potential group-hover effects if needed later */}
      <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 group">
        <CardHeader className="p-0 relative">
          <div className="aspect-video w-full overflow-hidden bg-muted">
            {!imageError ? (
              <Image
                 src={imageUrl}
                 alt={item.name}
                 width={400}
                 height={225}
                 // Slightly zoom image on card hover using group-hover
                 className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                 onError={handleImageError}
                 priority={false}
               />
            ) : ( <div className="flex items-center justify-center h-full text-muted-foreground">Image not available</div> )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-1">{item.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-3">{item.description}</CardDescription>
          <div className="flex justify-between items-center mt-auto pt-2">
            <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
            <Badge variant={item.available ? "default" : "outline"} className={item.available ? "bg-green-500 text-white dark:text-black" : "border-red-500 text-red-500"}>{item.available ? 'Available' : 'Unavailable'}</Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2">
          {/* Explicitly add cursor-pointer when button is enabled */}
          <Button
             disabled={!item.available}
             className={cn(
                "w-full",
                item.available && "cursor-pointer" // Add cursor-pointer only when available
             )}
             variant={item.available ? "default" : "outline"}
             onClick={(e) => {
                 // Prevent hover effect from triggering if clicking button inside
                 e.stopPropagation();
                 handleAddToOrder();
             }}
             aria-label={`Add ${item.name} to order`}
          >
            {item.available ? ( <><PlusCircle className="mr-2 h-4 w-4" /> Add to Order</> ) : ( 'Unavailable' )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
