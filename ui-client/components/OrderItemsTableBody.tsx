// ui-client/components/OrderItemsTableBody.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import {
    TableBody, // Keep TableBody import if needed by parent, though we render rows directly
    TableCell,
    TableRow,
} from "@/components/ui/table";

// --- Types ---
type Item = {
    id: number; orderid: number; itemid: number; price: number; notes: string; firstName: string;
};
type OrderDetailItem = Item & { menuItemName: string; menuItemImageurl: string; };

// --- Helper Function ---
const formatCurrency = (amount: number) => { /* ... */ return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount); };

// --- Component Props ---
interface OrderItemsTableBodyProps { items: OrderDetailItem[]; }

// --- OrderItemsTableBody Component (Client Component) ---
export function OrderItemsTableBody({ items }: OrderItemsTableBodyProps) {

    if (items.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                    No items found for this order.
                </TableCell>
            </TableRow>
        );
    }

    return (
        <>
            {items.map((item) => (
                <TableRow
                    key={item.id}
                    className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                >
                    <TableCell>
                        <Image
                            src={item.menuItemImageurl}
                            alt={item.menuItemName}
                            width={64}
                            height={64}
                            className="rounded-md object-cover border bg-muted"
                            // Temporarily removed onError handler for diagnostics
                            // onError={(e) => {
                            //     console.error(`Failed to load image: ${item.menuItemImageurl}`);
                            //     e.currentTarget.style.display = 'none';
                            // }}
                        />
                    </TableCell>
                    <TableCell className="font-medium">{item.menuItemName}</TableCell>
                    <TableCell>{item.firstName || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.notes || '-'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                </TableRow>
            ))}
        </>
    );
}

export default OrderItemsTableBody;
