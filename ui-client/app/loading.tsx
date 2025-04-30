// ui-client/app/loading.tsx
import React from 'react';
import MenuItemCardSkeleton from '@/components/MenuItemCardSkeleton'; // Import the menu item skeleton
import { Skeleton } from '@/components/ui/skeleton'; // Import base skeleton for controls

export default function LoadingMenu() {
  return (
    // Match the main layout structure of the page
    <main className="container mx-auto px-4 py-8">
        {/* Skeleton for Title */}
         <Skeleton className="h-10 w-1/3 mx-auto mb-6 sm:mb-8 lg:mb-10" />

         {/* Skeleton for Filter Controls */}
         <div className="mb-8 space-y-4 py-4">
             <Skeleton className="h-10 w-full max-w-sm mx-auto" />
             <div className="flex flex-wrap justify-center gap-2">
                 <Skeleton className="h-8 w-16 rounded-full" />
                 <Skeleton className="h-8 w-24 rounded-full" />
                 <Skeleton className="h-8 w-20 rounded-full" />
                 <Skeleton className="h-8 w-28 rounded-full" />
                 {/* Add more if you have more categories */}
             </div>
         </div>

         {/* Skeleton Grid for Menu Items */}
         {/* You can render a fixed number or estimate based on typical page load */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
             {Array.from({ length: 8 }).map((_, index) => (
                 <MenuItemCardSkeleton key={index} />
             ))}
         </div>
    </main>
  );
}
