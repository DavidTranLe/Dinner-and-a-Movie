import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderSummary {
  id: number;
  orderDate: string | null;
  status?: string;
}

async function getOrders(): Promise<OrderSummary[] | null> {
  let ordersData: OrderSummary[] = [];
  let errorMessage: string | undefined;
   try {
      const res = await fetch('http://backend-service:8080/api/orders', {
          cache: 'no-store',
      });

      if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText || res.statusText}`);
      }

      ordersData = await res.json() as OrderSummary[];
      return ordersData;

  } catch (error: any) {
      console.error("Fetch orders error:", error);
      errorMessage = error.message || `Failed to fetch orders.`;
      return null;
  }
}

const formatOrderDate = (dateString: string | null | undefined): string => {
    if (dateString) {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
        }
    }
    return 'Date N/A';
};


export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Your Past Orders</h1>

      {orders === null && (
         <p className="text-center text-red-500">Failed to load orders. Please check server logs or try again later.</p>
      )}

      {orders && orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {orders && orders.map(order => (
            <Link href={`/order/${order.id}`} key={order.id} legacyBehavior>
              <a className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
                <Card>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        Date: {formatOrderDate(order.orderDate)}
                      </p>
                      {order.status && <p className="text-sm text-gray-500 capitalize">Status: {order.status}</p>}
                    </div>
                     <span className="text-gray-500 text-sm">View Details &rarr;</span>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
