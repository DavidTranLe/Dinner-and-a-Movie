// ui-client/components/FormattedDate.tsx
'use client';

import { format } from 'date-fns';

interface FormattedDateProps {
  dateString: string | null | undefined;
}

// Helper function (can be kept here or imported)
const formatDateInternal = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return "N/A";
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
             console.error(`FormattedDate failed to parse: "${dateString}"`);
             return "Invalid Date";
        }
        // Use a consistent format string
        return format(date, 'MMM d, yyyy h:mm a');
    } catch (e) {
        console.error(`FormattedDate error for input "${dateString}":`, e);
        return "Invalid Date";
    }
};


export function FormattedDate({ dateString }: FormattedDateProps) {
  // Formatting happens during client render
  return <>{formatDateInternal(dateString)}</>;
}

export default FormattedDate;
