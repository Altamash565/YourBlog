import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Disable all CSS transitions for an instant, crisp theme switch
    // (same technique used by shadcn/ui)
    const root = document.documentElement;
    root.classList.add('disable-transitions');

    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });

    // Re-enable transitions after the browser has painted the new colors
    requestAnimationFrame(() => {
      // Double rAF ensures the paint has occurred before re-enabling
      requestAnimationFrame(() => {
        root.classList.remove('disable-transitions');
      });
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
