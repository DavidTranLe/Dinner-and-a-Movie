// app/order/[orderId]/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Order } from '@/types';

async function getOrderDetails(orderId: string): Promise<Order | null> {
  console.log(`Fetching order details for ID: ${orderId}`);
  let orderData: Order | null = null;
  let errorMessage: string | undefined;

  try {
      const res = await fetch(`http://backend-service:8080/api/orders/${orderId}`, {
          cache: 'no-store',
      });

      if (!res.ok) {
          if (res.status === 404) {
              return null;
          }
          const errorText = await res.text();
          throw new Error(`HTTP error! status: ${res.status}, message: ${errorText || res.statusText}`);
      }

      orderData = await res.json() as Order;
      console.log('Fetched Order Details:', JSON.stringify(orderData, null, 2));
      return orderData;

  } catch (error: any) {
      console.error("Fetch order details error:", error);
      errorMessage = error.message || `Failed to fetch order ${orderId}.`;
      return null;
  }
}


export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const order = await getOrderDetails(orderId);

  if (!order) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
        <p className="text-gray-600 mt-2">Could not find details for order #{orderId}.</p>
      </main>
    );
  }

  const calculatedSubtotal = order.subtotal ?? (Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0);

  const orderItems = Array.isArray(order.items) ? order.items : [];

  // Function to safely format date, handling null or invalid dates
  const formatOrderDate = (dateString: string | null | undefined): string => {
    if (dateString) {
        const date = new Date(dateString);
        // Check if the date is valid after parsing
        if (!isNaN(date.getTime())) {
            return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
        }
    }
    return 'Date N/A';
  };


  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Order Receipt</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Order #{order.id}</span>
            <span className="text-sm font-normal text-gray-600">
              {/* Use the safe formatting function */}
              {formatOrderDate(order.orderDate)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2 text-lg">Items Ordered:</h3>
          {orderItems.length > 0 ? (
            <ul className="space-y-3 mb-6">
              {orderItems.map(item => (
                <li key={`${order.id}-${item.id || Math.random()}`} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name || 'Unknown Item'} (x{item.quantity || 1})</p>
                    {item.notes && <p className="text-xs text-gray-500">Notes: {item.notes}</p>}
                    {item.partyMember && <p className="text-xs text-gray-500">For: {item.partyMember}</p>}
                  </div>
                  <p className="text-gray-800">
                    ${(typeof item.price === 'number' && typeof item.quantity === 'number') ? (item.price * item.quantity).toFixed(2) : 'N/A'}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-6">No item details available for this order.</p>
          )}
          <div className="space-y-1 text-right border-t pt-4">
             <p>Subtotal: <span className="font-medium">${calculatedSubtotal.toFixed(2)}</span></p>
             <p>Tax: <span className="font-medium">${(typeof order.tax === 'number' ? order.tax : 0).toFixed(2)}</span></p>
             {(typeof order.tip === 'number' && order.tip > 0) && <p>Tip: <span className="font-medium">${order.tip.toFixed(2)}</span></p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center font-bold text-xl pt-4 border-t bg-gray-50 rounded-b-lg">
          <span>Total Paid:</span>
          <span>${(typeof order.total === 'number' ? order.total : 0).toFixed(2)}</span>
        </CardFooter>
      </Card>
    </main>
  );
}
