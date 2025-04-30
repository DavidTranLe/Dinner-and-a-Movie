// ui-client/app/orders/loading.tsx
import React from 'react';
import OrderHistoryRowSkeleton from '@/components/OrderHistoryRowSkeleton'; // Import the row skeleton
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LoadingOrders() {
    const numberOfColumns = 5; // Match the actual table columns
    return (
        // Match the main layout structure of the page
        <main className="container mx-auto px-4 py-8">
            {/* Skeleton for Title */}
            <Skeleton className="h-8 w-1/4 mb-6" />

            {/* Skeleton for Filter/Sort Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <Skeleton className="h-10 w-full sm:w-auto sm:flex-grow max-w-xs" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>

            {/* Skeleton Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableCaption>Loading orders...</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: numberOfColumns }).map((_, index) => (
                                <TableHead key={index}>
                                    <Skeleton className="h-5 w-full" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Render multiple skeleton rows */}
                        {Array.from({ length: 5 }).map((_, index) => (
                            <OrderHistoryRowSkeleton key={index} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}

