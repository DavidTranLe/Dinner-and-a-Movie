// ui-client/components/OrderHistoryRowSkeleton.tsx
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function OrderHistoryRowSkeleton() {
  // Match the number of columns in the actual table
  const numberOfColumns = 5; // ID, Order Time, Pickup Time, Status, Actions

  return (
    <TableRow>
      {Array.from({ length: numberOfColumns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export default OrderHistoryRowSkeleton;
