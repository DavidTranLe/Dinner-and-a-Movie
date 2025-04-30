// ui-client/app/orders/[orderId]/page.tsx
// Server Component to display details of a specific order

import React from 'react';
import Link from 'next/link';
// import { format } from 'date-fns'; // Formatting handled by FormattedDate

// Import UI components
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    Table, TableBody, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Calendar, Clock, MapPin, Hash, User, DollarSign } from 'lucide-react';

// Import the Client Component for the table body and formatted date
import OrderItemsTableBody from '@/components/OrderItemsTableBody';
import FormattedDate from '@/components/FormattedDate'; // Import FormattedDate

// --- Types ---
type Order = { id: number; userid: number; ordertime: string; pickuptime: string; area: string; location: string; tax: number; tip: number; pan: string; expiryMonth: number; expiryYear: number; status: string; };
type Item = { id: number; orderid: number; itemid: number; price: number; notes: string; firstName: string; };
type MenuItem = { id: number; name: string; description: string; category: string; price: number; imageurl: string; available: boolean; };
export type OrderDetailItem = Item & { menuItemName: string; menuItemImageurl: string; };

// --- Helper Functions ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => { switch (status?.toLowerCase()) { case 'completed': return 'default'; case 'pending': return 'secondary'; case 'cancelled': return 'destructive'; default: return 'outline'; } };

// --- Fetching Function ---
async function fetchOrderDetails(orderId: string): Promise<{ order: Order; items: OrderDetailItem[] }> { const backendBaseUrl = 'http://backend-service:8080'; const orderUrl = `${backendBaseUrl}/api/orders/${orderId}`; const itemsUrl = `${backendBaseUrl}/api/items/order/${orderId}`; const menuItemsUrl = `${backendBaseUrl}/api/menuitems`; const placeholderImageUrl = 'https://placehold.co/64x64/e2e8f0/a0aec0?text=N/A'; try { const [orderRes, itemsRes, menuItemsRes] = await Promise.all([ fetch(orderUrl, { cache: 'no-store' }), fetch(itemsUrl, { cache: 'no-store' }), fetch(menuItemsUrl, { cache: 'no-store' }) ]); if (!orderRes.ok) throw new Error(`Failed to fetch order: ${orderRes.status} ${await orderRes.text()}`); if (!itemsRes.ok) throw new Error(`Failed to fetch items: ${itemsRes.status} ${await itemsRes.text()}`); if (!menuItemsRes.ok) throw new Error(`Failed to fetch menu items: ${menuItemsRes.status} ${await menuItemsRes.text()}`); const order: Order = await orderRes.json(); const items: Item[] = await itemsRes.json(); const menuItems: MenuItem[] = await menuItemsRes.json(); const menuItemMap = new Map<number, MenuItem>(menuItems.map(item => [item.id, item])); const detailedItems: OrderDetailItem[] = items.map(item => { const menuItem = menuItemMap.get(item.itemid); return { ...item, menuItemName: menuItem?.name || 'Unknown Item', menuItemImageurl: menuItem?.imageurl || placeholderImageUrl, }; }); return { order, items: detailedItems }; } catch (error: any) { console.error(`Error fetching details for order ${orderId}:`, error); throw new Error(error.message || 'Failed to fetch order details.'); } }

// --- Page Component ---
interface OrderDetailPageProps { params: { orderId: string }; }

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { orderId } = params;
    let orderData: { order: Order; items: OrderDetailItem[] } | null = null;
    let errorMessage: string | undefined;

    try {
        orderData = await fetchOrderDetails(orderId);
        console.log(`OrderDetailPage - Fetched order data for ID ${orderId}:`, orderData?.order);
    } catch (error: any) {
        errorMessage = error.message;
    }

    if (errorMessage) { return ( <main className="container mx-auto px-4 py-8"> <Button variant="outline" size="sm" asChild className="mb-4"> <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link> </Button> <h1 className="text-2xl font-bold mb-6 text-destructive">Error Loading Order</h1> <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert"> <p>{errorMessage}</p> </div> </main> ); }
    if (!orderData) { return ( <main className="container mx-auto px-4 py-8"> <Button variant="outline" size="sm" asChild className="mb-4"> <Link href="/orders"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link> </Button> <p>Order not found or failed to load.</p> </main> ); }

    const { order, items } = orderData;
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal + order.tax + order.tip;

    console.log(`OrderDetailPage - Rendering order ID ${order.id}`);
    console.log(`  Raw ordertime: "${order.ordertime}" (Type: ${typeof order.ordertime})`);
    console.log(`  Raw pickuptime: "${order.pickuptime}" (Type: ${typeof order.pickuptime})`);

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Back Button - Updated structure */}
            <Button variant="outline" size="sm" asChild className="mb-4">
                <Link href="/orders">
                    {/* Wrap content in a single element (span) */}
                    <span className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
                    </span>
                </Link>
            </Button>

            {/* Order Summary Card */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between"> <span>Order #{order.id}</span> <Badge variant={getStatusVariant(order.status)} className="text-sm">{order.status || 'N/A'}</Badge> </CardTitle>
                    <CardDescription suppressHydrationWarning={true}>Details for your order placed on <FormattedDate dateString={order.ordertime} />.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div suppressHydrationWarning={true}> <p className="flex items-center mb-1"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Order Time:</strong></p> <p className="ml-6"><FormattedDate dateString={order.ordertime} /></p> </div>
                    <div suppressHydrationWarning={true}> <p className="flex items-center mb-1"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Pickup Time:</strong></p> <p className="ml-6"><FormattedDate dateString={order.pickuptime} /></p> </div>
                    <div> <p className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Pickup Area:</strong></p> <p className="ml-6">{order.area || 'N/A'}</p> </div>
                    <div> <p className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> <strong>Pickup Location:</strong></p> <p className="ml-6">{order.location || 'N/A'}</p> </div>
                </CardContent>
                 <Separator className="my-4" />
                 <CardFooter className="flex justify-end"> <div className="text-right"> <p>Subtotal: {formatCurrency(subtotal)}</p> <p>Tax: {formatCurrency(order.tax)}</p> <p>Tip: {formatCurrency(order.tip)}</p> <p className="font-semibold text-lg mt-1">Total: {formatCurrency(total)}</p> </div> </CardFooter>
            </Card>

            {/* Items Table */}
            <h2 className="text-2xl font-bold mb-4">Items in this Order</h2>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow
                            ><TableHead className="w-[80px]">Image</TableHead
                            ><TableHead>Item Name</TableHead
                            ><TableHead>Name on Item</TableHead
                            ><TableHead>Notes</TableHead
                            ><TableHead className="text-right">Price Paid</TableHead
                        ></TableRow>
                    </TableHeader>
                    <TableBody>
                        <OrderItemsTableBody items={items} />
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
