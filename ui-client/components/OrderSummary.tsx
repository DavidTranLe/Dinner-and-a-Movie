// ui-client/components/OrderSummary.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner"; // Import toast

// Import UI components
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from "@/components/ui/textarea"; // For notes
// Added ShoppingCart to the import
import { Trash2, MinusCircle, PlusCircle, CreditCard, CalendarIcon, Lock, ShoppingCart } from 'lucide-react';

// Import validation functions from utils
import { isValidLuhn, isExpiryDateValid, isValidCVV, cn } from '@/lib/utils';

// Import types
export type MenuItem = { id: number; name: string; description: string; category: string; price: number; imageurl: string; available: boolean; };
export type OrderItem = MenuItem & { quantity: number; notes?: string; firstName?: string; };

interface OrderSummaryProps {
  items: OrderItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  removeFromOrder: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  updateItemFirstName: (itemId: number, firstName: string) => void;
  updateItemNotes: (itemId: number, notes: string) => void; // Added prop
  placeOrder: (customerFirstName: string, tipAmount: number, paymentDetails: { pan: string; expiryMonth: number; expiryYear: number; }) => Promise<void>;
  subtotal: number;
  tax: number;
}

export function OrderSummary({
  items, isOpen, setIsOpen, removeFromOrder, updateQuantity, updateItemFirstName, updateItemNotes, placeOrder, subtotal, tax,
}: OrderSummaryProps) {
  // State for payment details
  const [tip, setTip] = useState<number>(0);
  const [customerFirstName, setCustomerFirstName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  // State for validation status
  const [isCardNumberValid, setIsCardNumberValid] = useState<boolean | null>(null); // null = unchecked
  const [isExpiryValid, setIsExpiryValid] = useState<boolean | null>(null);
  const [isCvvValid, setIsCvvValid] = useState<boolean | null>(null);
  const [isFirstNameValid, setIsFirstNameValid] = useState<boolean | null>(null);

  // Derived state: is the overall form valid for submission?
  const isFormValid = isCardNumberValid === true && isExpiryValid === true && isCvvValid === true && isFirstNameValid === true && items.length > 0;

  // --- Input Handlers with Validation ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setCardNumber(value);
    setIsCardNumberValid(isValidLuhn(value)); // Validate on change
  };

  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2); // Allow only 2 digits
    setExpiryMonth(value);
    // Validate expiry when both month and year have potential values
    if (value.length > 0 && expiryYear.length > 0) {
       // Use full year for validation if year is 2 digits
       const fullYear = expiryYear.length === 2 ? `${new Date().getFullYear().toString().slice(0,2)}${expiryYear}` : expiryYear;
       setIsExpiryValid(isExpiryDateValid(value, fullYear));
    } else {
       setIsExpiryValid(null); // Reset if incomplete
    }
  };

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Allow 2 or 4 digits, normalize to 4 for validation
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    let fullYear = value;
    if (value.length === 2) {
        const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
        fullYear = (currentCentury + parseInt(value, 10)).toString();
    }
    setExpiryYear(value); // Store user input as is (2 or 4 digits)
    // Validate expiry when both month and year have potential values
    if (expiryMonth.length > 0 && value.length > 0) {
       setIsExpiryValid(isExpiryDateValid(expiryMonth, fullYear)); // Use full year for validation
    } else {
       setIsExpiryValid(null); // Reset if incomplete
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3); // Allow only 3 digits
    setCvv(value);
    setIsCvvValid(isValidCVV(value)); // Validate on change
  };

   const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomerFirstName(value);
      setIsFirstNameValid(value.trim().length > 0); // Simple check: not empty
   }

  // --- Place Order Handler ---
  const handlePlaceOrderClick = async () => {
      // Perform final validation checks (redundant but safe)
      const finalCardValid = isValidLuhn(cardNumber);
      // Ensure full year is used for final expiry validation
      const finalExpiryValid = isExpiryDateValid(expiryMonth, expiryYear.length === 2 ? `${new Date().getFullYear().toString().slice(0,2)}${expiryYear}` : expiryYear);
      const finalCvvValid = isValidCVV(cvv);
      const finalNameValid = customerFirstName.trim().length > 0;

      setIsCardNumberValid(finalCardValid);
      setIsExpiryValid(finalExpiryValid);
      setIsCvvValid(finalCvvValid);
      setIsFirstNameValid(finalNameValid);

      if (!finalCardValid || !finalExpiryValid || !finalCvvValid || !finalNameValid || items.length === 0) {
          toast.error("Please fix the errors in your order details.");
          return;
      }

      // Prepare payment details for API (ensure year is 4 digits if needed by API)
      let fullYear = expiryYear;
      if (expiryYear.length === 2) {
           const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
           fullYear = (currentCentury + parseInt(expiryYear, 10)).toString();
      }
      const paymentDetails = {
          pan: cardNumber.replace(/\s+/g, ''), // Remove spaces if any
          expiryMonth: parseInt(expiryMonth, 10),
          expiryYear: parseInt(fullYear, 10),
      };

      await placeOrder(customerFirstName, tip, paymentDetails);
  };

  const total = subtotal + tax + tip;

  // Clear validation state when sheet closes
  useEffect(() => {
      if (!isOpen) {
          setIsCardNumberValid(null);
          setIsExpiryValid(null);
          setIsCvvValid(null);
          setIsFirstNameValid(null);
      }
  }, [isOpen]);


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col sm:max-w-lg w-full"> {/* Ensure width */}
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-2xl font-bold">Your Order</SheetTitle>
          <SheetDescription>Review items, add details, and provide payment.</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />

        {/* Scrollable Area for Items and Payment */}
        <ScrollArea className="flex-grow px-6 pr-4 mb-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              {/* Use the imported ShoppingCart icon */}
              <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your order cart is empty.</p>
              <SheetClose asChild><Button variant="outline" className="mt-4">Continue Shopping</Button></SheetClose>
            </div>
          ) : (
             // --- Item List with Notes/Name ---
             <div className="space-y-6 mb-6">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <div className="flex items-start space-x-3 mb-2">
                        <Image src={item.imageurl} alt={item.name} width={64} height={64} className="rounded-md object-cover border flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                           <div className="flex items-center space-x-1.5">
                             <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity"><MinusCircle className="h-3 w-3" /></Button>
                             <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                             <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity"><PlusCircle className="h-3 w-3" /></Button>
                           </div>
                           <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                           <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromOrder(item.id)} aria-label="Remove item"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      {/* Inputs for First Name and Notes */}
                      <div className="grid grid-cols-2 gap-2 pl-[76px]"> {/* Indent inputs */}
                         <Input
                            type="text"
                            placeholder="First Name"
                            aria-label={`First name for ${item.name}`}
                            value={item.firstName || ''}
                            onChange={(e) => updateItemFirstName(item.id, e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Textarea
                            placeholder="Add notes (optional)"
                            aria-label={`Notes for ${item.name}`}
                            value={item.notes || ''}
                            onChange={(e) => updateItemNotes(item.id, e.target.value)}
                            className="h-8 text-xs resize-none" // Prevent resizing
                            rows={1}
                          />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
          )}

          {/* --- Payment Details Section --- */}
          {items.length > 0 && (
             <>
                <Separator className="my-4" />
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                     {/* Customer Name */}
                     <div className="space-y-1.5">
                        <Label htmlFor="firstName">First Name (for order)</Label>
                        <Input id="firstName" type="text" placeholder="Enter your first name" value={customerFirstName} onChange={handleFirstNameChange} required className={cn(isFirstNameValid === false && "border-red-500 focus-visible:ring-red-500")} />
                        {isFirstNameValid === false && <p className="text-xs text-red-500">First name is required.</p>}
                    </div>
                    {/* Card Number */}
                    <div className="space-y-1.5">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                            <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="cardNumber" type="text" placeholder="•••• •••• •••• ••••" value={cardNumber} onChange={handleCardNumberChange} required inputMode="numeric" pattern="[0-9\s]{13,19}" maxLength={19} className={cn("pl-8", isCardNumberValid === false && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                         {isCardNumberValid === false && <p className="text-xs text-red-500">Invalid card number (Luhn check failed).</p>}
                    </div>
                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="expiryMonth">Expiry Month</Label>
                            <Input id="expiryMonth" type="text" placeholder="MM" value={expiryMonth} onChange={handleExpiryMonthChange} required inputMode="numeric" maxLength={2} className={cn(isExpiryValid === false && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="expiryYear">Expiry Year</Label>
                            <Input id="expiryYear" type="text" placeholder="YY or<y_bin_46>" value={expiryYear} onChange={handleExpiryYearChange} required inputMode="numeric" maxLength={4} className={cn(isExpiryValid === false && "border-red-500 focus-visible:ring-red-500")} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cvv">CVV</Label>
                             <div className="relative">
                                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input id="cvv" type="password" placeholder="•••" value={cvv} onChange={handleCvvChange} required inputMode="numeric" maxLength={3} className={cn("pl-8", isCvvValid === false && "border-red-500 focus-visible:ring-red-500")} />
                             </div>
                        </div>
                    </div>
                     {isExpiryValid === false && <p className="text-xs text-red-500 col-span-3">Invalid or past expiry date.</p>}
                     {isCvvValid === false && <p className="text-xs text-red-500 col-span-3">CVV must be 3 digits.</p>}
                </div>
                <Separator className="my-4" />
                 {/* Tip Section */}
                <div className="space-y-1.5">
                     <Label htmlFor="tip">Add Tip</Label>
                     <div className="flex items-center space-x-2">
                        <span>$</span>
                        <Input id="tip" type="number" min="0" step="0.01" value={tip.toFixed(2)} onChange={(e) => setTip(Math.max(0, parseFloat(e.target.value) || 0))} className="h-8 w-24" />
                     </div>
                 </div>
             </>
          )}
        </ScrollArea>

        {/* Footer with Totals and Place Order Button */}
        {items.length > 0 && (
            <SheetFooter className="px-6 pb-6 pt-4 border-t bg-background"> {/* Added padding/border */}
              <div className="w-full space-y-4">
                  {/* Totals */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tax (6%)</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Tip</span><span>${tip.toFixed(2)}</span></div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>${(subtotal + tax + tip).toFixed(2)}</span></div>
                  {/* Place Order Button */}
                  <Button type="button" className="w-full" size="lg" onClick={handlePlaceOrderClick} disabled={!isFormValid}>
                    Place Order
                  </Button>
              </div>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
