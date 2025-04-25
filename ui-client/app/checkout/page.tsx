'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { Order } from '@/types';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
        setSubmitError("Your cart is empty.");
        return;
    }
    setIsSubmitting(true);
    setSubmitError(null);

    const orderData = {
      items: items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        notes: item.notes || null,
      })),
      paymentInfo: {
          cardNumber: "REDACTED",
          expiryMonth,
          expiryYear,
          cvv: "REDACTED"
      },
    };

    console.log("Submitting order data:", JSON.stringify(orderData, null, 2));

    try {
      const res = await fetch('http://backend-service:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Order submission failed! status: ${res.status}, message: ${errorText || res.statusText}`);
      }

      const createdOrder = await res.json() as Order;

      clearCart();

      router.push(`/order/${createdOrder.id}`);

    } catch (error: any) {
      console.error("Order submission error:", error);
      setSubmitError(error.message || "Failed to submit order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-semibold">{item.name} (x{item.quantity})</p>
                      {item.notes && <p className="text-xs text-gray-500">Notes: {item.notes}</p>}
                      {item.partyMember && <p className="text-xs text-gray-500">For: {item.partyMember}</p>}
                    </div>
                    <p className="text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          {items.length > 0 && (
            <CardFooter className="flex justify-between items-center font-bold text-lg pt-4 border-t">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmitOrder}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="expiryMonth">Expiry Month</Label>
                  <Input
                    id="expiryMonth"
                    type="text"
                    placeholder="MM"
                    maxLength={2}
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryYear">Expiry Year</Label>
                  <Input
                    id="expiryYear"
                    type="text"
                    placeholder="YY"
                    maxLength={2}
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="•••"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
               {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={items.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Order'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
