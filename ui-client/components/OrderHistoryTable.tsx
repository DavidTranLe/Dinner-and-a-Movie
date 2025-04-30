// ui-client/components/OrderHistoryTable.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
// import { format } from 'date-fns'; // format is handled in FormattedDate
import { motion, AnimatePresence } from 'framer-motion';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, ArrowUpDown, Search } from 'lucide-react';

import FormattedDate from './FormattedDate';

// --- Types ---
type Order = {
    id: number; userid: number; ordertime: string; pickuptime: string; area: string | null; location: string | null;
    tax: number; tip: number; pan: string; expiryMonth: number; expiryYear: number; status: string | null;
};

// --- Helper Functions ---
// Removed formatCurrency as total is removed
// const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => { switch (status?.toLowerCase()) { case 'completed': return 'default'; case 'pending': return 'secondary'; case 'cancelled': return 'destructive'; default: return 'outline'; } };
// Removed calculateApproxTotal
// const calculateApproxTotal = (order: Order) => order.tax + order.tip;

// --- Animation Variants ---
const tableContainerVariants = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const tableRowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }, exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } } };

// --- Component Props ---
interface OrderHistoryTableProps { initialOrders: Order[]; }

// --- OrderHistoryTable Component (Client Component) ---
export function OrderHistoryTable({ initialOrders }: OrderHistoryTableProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filterText, setFilterText] = useState('');
    // Removed 'total' from sort key options
    const [sortKey, setSortKey] = useState<'ordertime' | 'pickuptime' | 'status'>('ordertime');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    useEffect(() => { console.log("OrderHistoryTable received initialOrders:", initialOrders); }, [initialOrders]);

    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;
        if (filterText.trim()) {
            const lowerCaseFilter = filterText.toLowerCase().trim();
            filtered = orders.filter(order => {
                const idMatch = order.id.toString().includes(lowerCaseFilter);
                const statusMatch = (order.status ?? '').toLowerCase().includes(lowerCaseFilter);
                const areaMatch = (order.area ?? '').toLowerCase().includes(lowerCaseFilter);
                const locationMatch = (order.location ?? '').toLowerCase().includes(lowerCaseFilter);
                return idMatch || statusMatch || areaMatch || locationMatch;
            });
        }
        // Apply sorting
        const sorted = [...filtered].sort((a, b) => {
            let valA: string | number | Date; let valB: string | number | Date;
            switch (sortKey) {
                case 'pickuptime': valA = new Date(a.pickuptime); valB = new Date(b.pickuptime); break;
                case 'status': valA = a.status ?? ''; valB = b.status ?? ''; break;
                // Removed 'total' case
                // case 'total': valA = calculateApproxTotal(a); valB = calculateApproxTotal(b); break;
                default: valA = new Date(a.ordertime); valB = new Date(b.ordertime); break;
            }
            if (valA instanceof Date && isNaN(valA.getTime())) valA = sortDirection === 'asc' ? Infinity : -Infinity;
            if (valB instanceof Date && isNaN(valB.getTime())) valB = sortDirection === 'asc' ? Infinity : -Infinity;
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1; if (valA > valB) return sortDirection === 'asc' ? 1 : -1; return 0;
        });
        return sorted;
    }, [orders, filterText, sortKey, sortDirection]);

    // Update handleSort type to remove 'total'
    const handleSort = (key: typeof sortKey) => {
        if (key === sortKey) { setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }
        else { setSortKey(key); setSortDirection('desc'); }
    };

    return (
        <div>
            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-auto sm:flex-grow max-w-xs"> <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> <Input type="text" placeholder="Filter by ID, status, location..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="pl-8 w-full" /> </div>
                 <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
                    <span className="text-sm text-muted-foreground mr-2">Sort by:</span>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('ordertime')} className={sortKey === 'ordertime' ? 'font-bold' : ''}> Order Time <ArrowUpDown className={`ml-1 h-3 w-3 ${sortKey === 'ordertime' ? '' : 'opacity-0'}`} /> </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className={sortKey === 'status' ? 'font-bold' : ''}> Status <ArrowUpDown className={`ml-1 h-3 w-3 ${sortKey === 'status' ? '' : 'opacity-0'}`} /> </Button>
                    {/* Removed Total sort button */}
                 </div>
            </div>

            {/* Orders Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableCaption>{filteredAndSortedOrders.length > 0 ? 'A list of your orders.' : 'No orders match the current filter.'}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('ordertime')}>Order Time {sortKey === 'ordertime' && <ArrowUpDown className="inline-block ml-1 h-3 w-3" />}</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('pickuptime')}>Pickup Time {sortKey === 'pickuptime' && <ArrowUpDown className="inline-block ml-1 h-3 w-3" />}</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('status')}>Status {sortKey === 'status' && <ArrowUpDown className="inline-block ml-1 h-3 w-3" />}</TableHead>
                            {/* Removed Approx. Total Header */}
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <motion.tbody variants={tableContainerVariants} initial="hidden" animate="visible">
                        <AnimatePresence>
                            {filteredAndSortedOrders.length === 0 ? (
                                // Updated colSpan
                                <TableRow> <TableCell colSpan={5} className="h-24 text-center"> {filterText ? 'No orders match your filter.' : 'No orders placed yet.'} </TableCell> </TableRow>
                            ) : (
                                filteredAndSortedOrders.map((order, index) => (
                                     <motion.tr key={order.id} variants={tableRowVariants} exit="exit" layout className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                        ><TableCell className="font-medium">#{order.id}</TableCell
                                        ><TableCell suppressHydrationWarning={true}><FormattedDate dateString={order.ordertime} /></TableCell
                                        ><TableCell suppressHydrationWarning={true}><FormattedDate dateString={order.pickuptime} /></TableCell
                                        ><TableCell><Badge variant={getStatusVariant(order.status)}>{order.status || 'N/A'}</Badge></TableCell
                                        /* Removed Approx. Total Cell */
                                        ><TableCell className="text-center"><Button variant="outline" size="sm"> <Link href={`/orders/${order.id}`} className="flex items-center"> <Eye className="h-4 w-4 mr-1" /> View </Link> </Button></TableCell
                                    ></motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.tbody>
                </Table>
            </div>
        </div>
    );
}

export default OrderHistoryTable;
