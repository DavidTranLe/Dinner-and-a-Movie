import React from 'react';
import { MenuItemCard } from '@/components/ui/menu-item-card';
import { MenuItem } from '@/types';

interface DisplayMenuProps {
  items?: MenuItem[];
  error?: string;
}

function DisplayMenu({ items, error }: DisplayMenuProps) {
  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error Fetching Menu:</h2>
        <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        <p className="mt-2 text-xs">
          Ensure the backend service ('backend_service') is running correctly within Docker and accessible at http://backend-service:8080 from the 'ui_client' container. Also, check backend logs (`docker compose logs backend_service`).
        </p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return <p className="mt-4 text-gray-500">No menu items available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {items.map(item => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  let menuItems: MenuItem[] | undefined;
  let errorMessage: string | undefined;

  try {
    const res = await fetch('http://backend-service:8080/api/menuitems', {
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText || res.statusText}`);
    }

    menuItems = await res.json() as MenuItem[];

  } catch (error: any) {
    console.error("Fetch error:", error);
    errorMessage = error.message || 'Failed to fetch menu items.';
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Menu</h1>
      <DisplayMenu items={menuItems} error={errorMessage} />
    </main>
  );
}
