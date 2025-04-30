// ui-client/components/MenuItemCardSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function MenuItemCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="p-0 relative">
        {/* Skeleton for Image */}
        <Skeleton className="aspect-video w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {/* Skeleton for Title */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        {/* Skeleton for Description */}
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-1/2 mb-3" />
         {/* Skeleton for Price/Badge */}
         <div className="flex justify-between items-center mt-auto pt-2">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-5 w-1/3" />
         </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        {/* Skeleton for Button */}
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default MenuItemCardSkeleton;
