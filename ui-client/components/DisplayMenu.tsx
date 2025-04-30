// ui-client/components/DisplayMenu.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

// Import required components
import { MenuItemCard } from '@/components/MenuItemCard';
import { OrderSummary } from '@/components/OrderSummary';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Import icons and types
import { ShoppingCart, Search, FilterX } from 'lucide-react';

// Define the MenuItem type
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  imageurl: string;
  available: boolean;
};

// Define the type for items in the order cart
export type OrderItem = MenuItem & {
  quantity: number;
  notes?: string;
  firstName?: string;
};

// --- Animation Variants ---
const categoryContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

// Component Props
interface DisplayMenuProps {
  initialItems?: MenuItem[];
  fetchError?: string;
}

// Helper to capitalize category names for display
const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Uncategorized';

// --- DisplayMenu Component (Client Component) ---
export function DisplayMenu({ initialItems = [], fetchError }: DisplayMenuProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  // Ensure state and setter are correctly defined
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories from initial items for filter buttons (sorted)
  const categories = useMemo(() => { /* ... categories logic ... */ const allCategories = initialItems.map(item => item.category?.toLowerCase() || 'uncategorized'); const uniqueCategories = [...new Set(allCategories)]; return uniqueCategories.sort((a, b) => { if (a === 'desserts') return 1; if (b === 'desserts') return -1; return a.localeCompare(b); }); }, [initialItems]);

  // Filtered and Grouped items based on search term
  const filteredGroupedItems = useMemo(() => { /* ... filtering logic ... */ const lowerCaseSearchTerm = searchTerm.toLowerCase(); const searchedItems = !searchTerm ? initialItems : initialItems.filter(item => item.name.toLowerCase().includes(lowerCaseSearchTerm) || item.description.toLowerCase().includes(lowerCaseSearchTerm) ); return searchedItems.reduce((acc, item) => { const category = item.category?.toLowerCase() || 'uncategorized'; if (!acc[category]) { acc[category] = []; } acc[category].push(item); return acc; }, {} as Record<string, MenuItem[]>); }, [initialItems, searchTerm]);

  // Determine which categories to display based on the selected filter
  const categoriesToDisplay = useMemo(() => { /* ... category display logic ... */ if (selectedCategory === null) { return categories.filter(cat => filteredGroupedItems[cat]?.length > 0); } else { return filteredGroupedItems[selectedCategory]?.length > 0 ? [selectedCategory] : []; } }, [selectedCategory, categories, filteredGroupedItems]);

  // --- State management functions (unchanged) ---
  const addToOrder = (itemToAdd: MenuItem) => { setOrderItems(prevItems => { const existingItem = prevItems.find(item => item.id === itemToAdd.id); if (existingItem) { return prevItems.map(item => item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item ); } else { return [...prevItems, { ...itemToAdd, quantity: 1, notes: '', firstName: '' }]; } }); toast.success(`${itemToAdd.name} added to order!`); };
  const removeFromOrder = (itemId: number) => { setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId)); toast.info(`Item removed from order.`); };
  const updateQuantity = (itemId: number, newQuantity: number) => { if (newQuantity <= 0) { removeFromOrder(itemId); } else { setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item )); } };
  const updateItemFirstName = (itemId: number, firstName: string) => { setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, firstName: firstName } : item )); };
  const updateItemNotes = (itemId: number, notes: string) => { setOrderItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, notes: notes } : item )); };

  // Calculate totals
  const calculateTotal = (items: OrderItem[]) => { const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0); const taxRate = 0.06; const tax = subtotal * taxRate; return { subtotal, tax }; };
  const { subtotal, tax } = calculateTotal(orderItems);
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  // --- Render Logic ---
  if (fetchError) { return ( <div className="mt-6 w-full max-w-6xl"><h2 className="text-2xl font-semibold mb-4 text-center text-red-600">Error Fetching Menu</h2><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl mx-auto" role="alert"><p className="text-center">{fetchError}</p></div></div> ); }
  if (!initialItems) { return <p className="mt-10 text-center text-muted-foreground">Loading menu items...</p>; }

  return (
    <div className="w-full max-w-7xl">
      {/* Cart Button */}
      <Button variant="outline" size="icon" className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 rounded-full shadow-lg z-50 h-12 w-12" onClick={() => setIsSheetOpen(true)} aria-label="Open Order Summary">
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && ( <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{totalItems}</span> )}
      </Button>

      {/* Filter Controls */}
      <div className="mb-8 space-y-4 sticky top-[calc(theme(height.14)+1px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 z-40">
         <div className="relative w-full max-w-sm mx-auto"> <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /> <Input type="text" placeholder="Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-full" /> </div>
         <div className="flex flex-wrap justify-center gap-2"> <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)} className="rounded-full"> All </Button> {categories.map(category => ( <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)} className="rounded-full"> {capitalize(category)} </Button> ))} </div>
      </div>

      {/* Render Filtered & Grouped Items */}
      {categoriesToDisplay.length === 0 && ( <div className="text-center text-muted-foreground mt-10"> <FilterX className="mx-auto h-12 w-12 mb-4" /> <p>No menu items match your current filter.</p> {(searchTerm || selectedCategory) && ( <Button variant="link" onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}> Clear Filters </Button> )} </div> )}
       {categoriesToDisplay.map((category, index) => (
            <motion.section key={category} className="mb-12" variants={categoryContainerVariants} initial="hidden" animate="visible" transition={{ delay: index * 0.05 }} >
              <h2 className="text-2xl font-semibold tracking-tight mb-4 border-b pb-2"> {capitalize(category)} </h2>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" variants={gridContainerVariants} >
                 <AnimatePresence> {filteredGroupedItems[category]?.map(item => ( <MenuItemCard key={item.id} item={item} addToOrder={addToOrder} /> ))} </AnimatePresence>
              </motion.div>
            </motion.section>
       ))}

      {/* Order Summary Sheet - Ensure setIsOpen prop is passed correctly */}
      <OrderSummary
        items={orderItems}
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen} // Explicitly passing the state setter
        removeFromOrder={removeFromOrder}
        updateQuantity={updateQuantity}
        updateItemFirstName={updateItemFirstName}
        updateItemNotes={updateItemNotes}
        setOrderItems={setOrderItems}
        subtotal={subtotal}
        tax={tax}
      />
    </div>
  );
}

export default DisplayMenu;
