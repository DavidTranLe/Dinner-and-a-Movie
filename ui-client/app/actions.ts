// ui-client/app/actions.ts
'use server'; // Mark this module as containing Server Actions

import { revalidatePath } from 'next/cache'; // To potentially refresh order history page

// Re-define types here or import from a shared types file
type OrderItemData = {
    itemid: number;
    price: number;
    notes: string;
    firstName: string;
};

type PaymentDetails = {
    pan: string;
    expiryMonth: number;
    expiryYear: number;
};

type PlaceOrderResult = {
    success: boolean;
    orderId?: number;
    error?: string;
};

// Server Action to place the order
export async function placeOrderAction(
    orderItems: OrderItemData[],
    customerFirstName: string, // Note: customerFirstName is not used in the API payload directly but could be
    tipAmount: number,
    paymentDetails: PaymentDetails,
    tax: number
): Promise<PlaceOrderResult> {

    if (!orderItems || orderItems.length === 0) {
        return { success: false, error: "Order cart is empty." };
    }

    // Use the internal Docker service name and port for server-side fetch
    const apiUrl = 'http://backend-service:8080';
    const orderApiUrl = `${apiUrl}/api/orders`;

    // Prepare the main order payload (including payment details)
    const orderPayload = {
        // --- FIX STARTS HERE ---
        // Hardcode the userid for now. In a real application with logins,
        // this would be retrieved from the user's session.
        userid: 3,
        // --- FIX ENDS HERE ---

        ...paymentDetails, // Spread PAN, expiryMonth, expiryYear
        ordertime: new Date().toISOString(),
        pickuptime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins later
        area: "Main Lobby", // Example value
        location: "Pickup Counter", // Example value
        tax: tax,
        tip: tipAmount,
        status: "pending"
    };

    let createdOrderId: number | null = null;

    try {
        // --- Create Order ---
        console.log("Server Action: Placing order:", orderPayload);
        const orderRes = await fetch(orderApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload),
            cache: 'no-store', // Ensure fresh request
        });

        if (!orderRes.ok) {
            const errorText = await orderRes.text();
            console.error("Server Action: Failed to create order:", orderRes.status, errorText);
            throw new Error(`Failed to create order: ${orderRes.status} ${errorText || '(No error details)'}`);
        }

        const createdOrder = await orderRes.json();
        createdOrderId = createdOrder.id; // Store the ID
        if (!createdOrderId) {
            console.error("Server Action: Order created, but ID was not returned.");
            throw new Error("Order created, but ID was not returned from the backend.");
        }
        console.log("Server Action: Order created successfully:", createdOrder);

        // --- Add Items to Order ---
        const itemsPayload = orderItems.map(item => ({
            itemid: item.itemid,
            price: item.price,
            notes: item.notes || "",
            // Use customerFirstName for each item's firstName field if needed by API
            // Otherwise, if firstName was per-item, it should be in OrderItemData
            firstName: customerFirstName || "",
        }));

        const itemsApiUrl = `${apiUrl}/api/items/order/${createdOrderId}`;
        console.log("Server Action: Adding items to order:", itemsPayload);

        const itemsRes = await fetch(itemsApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemsPayload),
            cache: 'no-store',
        });

        if (!itemsRes.ok) {
            const errorText = await itemsRes.text();
            console.error(`Server Action: Failed to add items to order ${createdOrderId}:`, itemsRes.status, errorText);
            // Consider attempting to delete the order here if items fail (rollback logic)
            throw new Error(`Order #${createdOrderId} created, but failed to add items: ${itemsRes.status} ${errorText || '(No error details)'}`);
        }

        const addedItems = await itemsRes.json();
        console.log("Server Action: Items added successfully:", addedItems);

        // Revalidate the orders page cache so the new order appears immediately
        revalidatePath('/orders');

        return { success: true, orderId: createdOrderId };

    } catch (error: any) {
        console.error("Server Action: Failed to place order:", error);
        // Return error message to the client
        return { success: false, error: error.message || "An unknown server error occurred." };
    }
}
