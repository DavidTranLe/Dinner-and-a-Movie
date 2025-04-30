// ui-client/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PackageOpen } from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo/Brand Link - Updated Name */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
           {/* Simple SVG logo */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
             <path d="M12 2 L2 7 L12 12 L22 7 Z" /> <path d="M2 17 L12 22 L22 17" /> <path d="M2 12 L12 17 L22 12" />
           </svg>
           {/* Updated App Name */}
           <span className="font-bold inline-block">Fork and Film</span>
        </Link>

        {/* Main Navigation Menu */}
        <NavigationMenu className="hidden md:flex flex-grow">
          <NavigationMenuList>
            {/* Menu Link */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior={false}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  Menu
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* Orders Link */}
            <NavigationMenuItem>
              <Link href="/orders" legacyBehavior={false}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                   <span> <PackageOpen className="h-4 w-4 mr-1 inline-block align-middle" /> <span className="align-middle">Orders</span> </span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Right-aligned items (Theme Toggle) */}
        <div className="flex flex-1 items-center justify-end space-x-4">
           <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
