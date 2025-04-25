// ui-client/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define the MenuItem type based on the OpenAPI spec
type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageurl: string;
  available: boolean;
};

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenuItems() {
      setLoading(true);
      setError(null);
      try {
        // Fetch menu items from the backend service
        // Ensure your backend service is running and accessible at this URL
        // Note: Using NEXT_PUBLIC_DAAM_API_URL environment variable if set, otherwise defaulting to localhost:8080
        const apiUrl = process.env.NEXT_PUBLIC_DAAM_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/menuitems`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (e: any) {
        console.error("Failed to fetch menu items:", e);
        setError(`Failed to load menu items. Please ensure the backend service is running and accessible. Error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-8">Dinner and a Movie - Menu</h1>

      {loading && <p className="text-lg">Loading menu...</p>}

      {error && <p className="text-lg text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Menu Items Fetched:</h2>
          {menuItems.length > 0 ? (
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              {/* Displaying raw JSON for verification */}
              {JSON.stringify(menuItems, null, 2)}
            </pre>
          ) : (
            <p>No menu items found.</p>
          )}
        </div>
      )}
    </main>
  );
}
