// ui-client/app/page.tsx
// NO 'use client' directive here - this remains a Server Component

import React from 'react';

// Import the separated client components
import { AnimatedTitle } from '@/components/AnimatedTitle';
// Import the new DisplayMenu client component
import DisplayMenu from '@/components/DisplayMenu'; // Use default import

// Define the MenuItem type (can be shared or defined here)
type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageurl: string;
  available: boolean;
};

// --- HomePage Component (Server Component) ---
// Fetches initial data and renders client components for display/interaction
export default async function HomePage() {
  let menuItems: MenuItem[] | undefined;
  let errorMessage: string | undefined;

  // Fetch URL uses service name for server-side fetch
  const backendApiUrl = 'http://backend-service:8080/api/menuitems';
  console.log(`Fetching menu items from (server-side): ${backendApiUrl}`);

  try {
    const res = await fetch(backendApiUrl, { cache: 'no-store' });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`HTTP error! status: ${res.status}, statusText: ${res.statusText}, body: ${errorBody}`);
      throw new Error(`HTTP error! status: ${res.status} ${res.statusText}. Response: ${errorBody || '(empty response body)'}`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        menuItems = await res.json() as MenuItem[];
        console.log("Menu items fetched successfully (server-side):", menuItems?.length);
    } else {
        const textResponse = await res.text();
        console.error("Received non-JSON response:", textResponse);
        throw new Error(`Expected JSON response but received content type: ${contentType}. Response body: ${textResponse}`);
    }

  } catch (error: any) {
    console.error("Server-side fetch error:", error);
    errorMessage = error.message || 'An unknown error occurred while fetching menu items.';
     if (error.cause) { errorMessage += ` Cause: ${error.cause}`; }
  }

  // Render the layout and pass server-fetched data to the Client Component
  return (
      <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8 lg:p-12 bg-gradient-to-b from-background to-muted/50 text-foreground">
        {/* AnimatedTitle is already a Client Component */}
        <AnimatedTitle />

        {/* Render DisplayMenu (Client Component) and pass initial props */}
        <DisplayMenu initialItems={menuItems} fetchError={errorMessage} />
      </main>
  );
}
