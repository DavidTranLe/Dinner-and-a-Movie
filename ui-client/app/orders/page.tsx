// ui-client/app/orders/page.tsx
// Server Component to fetch initial orders and render the interactive table

import React from 'react';

// Import the Client Component that handles filtering/sorting/display
import OrderHistoryTable from '@/components/OrderHistoryTable';

// Define the Order type (can be shared)
type Order = {
    id: number;
    userid: number;
    ordertime: string;
    pickuptime: string;
    area: string;
    location: string;
    tax: number;
    tip: number;
    pan: string;
    expiryMonth: number;
    expiryYear: number;
    status: string;
};

// --- Fetching Function (Server-Side) ---
async function fetchOrders(): Promise<{ orders: Order[] | null; error?: string }> {
    const backendApiUrl = 'http://backend-service:8080/api/orders';
    console.log(`Fetching orders from (server-side): ${backendApiUrl}`);

    try {
        const res = await fetch(backendApiUrl, { cache: 'no-store' });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`HTTP error fetching orders! status: ${res.status}, body: ${errorBody}`);
            return { orders: null, error: `HTTP error! status: ${res.status}. Response: ${errorBody || '(empty response body)'}` };
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const orders: Order[] = await res.json();
            console.log("Orders fetched successfully (server-side):", orders.length);
            // Initial sort can happen here or be handled entirely client-side
            // orders.sort((a, b) => new Date(b.ordertime).getTime() - new Date(a.ordertime).getTime());
            return { orders };
        } else {
            const textResponse = await res.text();
            console.error("Received non-JSON response for orders:", textResponse);
            return { orders: null, error: `Expected JSON response but received content type: ${contentType}. Response body: ${textResponse}` };
        }

    } catch (error: any) {
        console.error("Server-side fetch error (orders):", error);
        let errorMessage = error.message || 'An unknown error occurred while fetching orders.';
        if (error.cause) { errorMessage += ` Cause: ${error.cause}`; }
        return { orders: null, error: errorMessage };
    }
}

// --- OrdersPage Component (Server Component) ---
export default async function OrdersPage() {
    // Fetch initial data on the server
    const { orders, error } = await fetchOrders();

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                    <p><strong className="font-bold">Error:</strong> {error}</p>
                </div>
            )}

            {/* Render the Client Component, passing initial data */}
            {/* Only render the table component if there's no fetch error */}
            {!error && (
                 <OrderHistoryTable initialOrders={orders || []} />
            )}
             {/* If there was an error, initialOrders will be null, so the table won't render */}

        </main>
    );
}
