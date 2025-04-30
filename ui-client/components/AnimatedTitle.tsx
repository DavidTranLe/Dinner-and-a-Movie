// ui-client/components/AnimatedTitle.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedTitle() {
    return (
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          // Updated Gradient and Text
          // Using a simpler gradient from primary color to a slightly lighter/darker shade
          // Adjust 'from-primary' and 'to-primary/80' or 'to-stone-600' etc. based on your theme's specifics
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 lg:mb-10 tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/70 dark:to-primary/60"
        >
          Fork and Film {/* Removed "Menu" */}
        </motion.h1>
    );
}
