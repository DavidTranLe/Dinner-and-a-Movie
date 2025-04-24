// app/page.tsx
import React from 'react';

// Define an interface for the expected MenuItem structure (adjust if needed based on your actual API response)
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string; // Assuming there's an image URL field
  // Add other fields as necessary
}

// Define the props for our component displaying the data or error
interface DisplayDataProps {
  data?: MenuItem[];
  error?: string;
}

// A simple component to display the fetched data or an error message
function DisplayData({ data, error }: DisplayDataProps) {
  if (error) {
    return (
      <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error Fetching Data:</h2>
        <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        <p className="mt-2 text-xs">
          Ensure the backend service backend_service is running correctly within Docker and accessible at http://backend-service:8080 from the ui_client container. Also, check backend logs (`docker compose logs backend_service`).
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p className="mt-4 text-gray-500">No menu items found or data is empty.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Fetched Menu Items:</h2>
      <pre className="p-4 bg-gray-100 border border-gray-300 rounded-md text-sm overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      {/* Or display it more nicely: */}
      {/*
      <ul className="list-disc pl-5 space-y-1">
        {data.map(item => (
          <li key={item.id}>{item.name} - ${item.price.toFixed(2)}</li>
        ))}
      </ul>
      */}
    </div>
  );
}

// The main Page component (Server Component by default in App Router)
export default async function HomePage() {
  let menuItems: MenuItem[] | undefined;
  let errorMessage: string | undefined;

  try {
    // Fetch data from the backend service using its Docker service name.
    // Use { cache: 'no-store' } to ensure it fetches fresh data for testing.
    const res = await fetch('http://backend-service:8080/api/menuitems', {
      cache: 'no-store',
    });

    // Check if the response status is OK (e.g., 200)
    if (!res.ok) {
      // If not OK, read the response text and throw an error
      const errorText = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorText || res.statusText}`);
    }

    // Parse the JSON response
    menuItems = await res.json() as MenuItem[];

  } catch (error: any) {
    // Catch any errors during fetch or parsing
    console.error("Fetch error:", error); // Log the full error server-side
    errorMessage = error.message || 'Failed to fetch menu items.';
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12 bg-gray-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Homepage API Test</h1>
      </div>

      <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">
          Attempting to fetch data from{' '}
          <code className="bg-gray-200 p-1 rounded text-xs">http://backend-service:8080/api/menuitems</code>...
        </p>
        {/* Display the data or error */}
        <DisplayData data={menuItems} error={errorMessage} />
      </div>
    </main>
  );
}
