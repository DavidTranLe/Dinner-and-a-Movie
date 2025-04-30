// ui-client/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Luhn Algorithm Check ---
// Source: (Based on common implementations, e.g., https://gist.github.com/ShirtlessKirk/2134376)
export function isValidLuhn(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  // Remove non-digit characters
  const cardNumber = value.replace(/\D/g, '');
  if (cardNumber.length === 0) {
      return false;
  }

  let sum = 0;
  let shouldDouble = false;
  // Loop through digits from right to left
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return (sum % 10) === 0;
}

// --- Expiry Date Check ---
export function isExpiryDateValid(month: string | number, year: string | number): boolean {
    const numericMonth = Number(month);
    const numericYear = Number(year);

    if (isNaN(numericMonth) || isNaN(numericYear) || numericMonth < 1 || numericMonth > 12) {
        return false; // Invalid month/year format
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed

    // Ensure year is not in the past
    if (numericYear < currentYear) {
        return false;
    }

    // If year is current year, ensure month is not in the past
    if (numericYear === currentYear && numericMonth < currentMonth) {
        return false;
    }

    // Consider adding a check for unreasonably far future dates if needed
    // e.g., if (numericYear > currentYear + 20) return false;

    return true;
}

// --- CVV Check ---
export function isValidCVV(cvv: string): boolean {
    if (!cvv || typeof cvv !== 'string') {
        return false;
    }
    // Check if it's exactly 3 digits
    return /^\d{3}$/.test(cvv.trim());
}

