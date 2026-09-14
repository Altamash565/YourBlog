'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const context = useNextTheme();
  const isDark = (context.resolvedTheme ?? context.theme) === 'dark';
  const toggleTheme = () => {
    context.setTheme(isDark ? 'light' : 'dark');
  };
  return {
    ...context,
    isDark,
    toggleTheme,
  };
}

export default ThemeProvider;
