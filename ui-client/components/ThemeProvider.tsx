// ui-client/components/ThemeProvider.tsx
'use client' // This component needs to be a client component

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // attribute="class": Applies theme changes by adding/removing a class ('dark') on the <html> element.
    // defaultTheme="system": Uses the user's operating system preference initially.
    // enableSystem: Allows switching between light, dark, and system preference.
    // disableTransitionOnChange: Prevents potential flickering during theme transitions.
    <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
