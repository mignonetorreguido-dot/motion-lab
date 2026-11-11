'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  isSunlight: false,
  toggleSunlight: () => {},
});

export function ThemeProvider({ children }) {
  const [isSunlight, setIsSunlight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Recuperar preferencia previa del usuario o por defecto modo estándar
    const savedTheme = localStorage.getItem('motion_lab_theme');
    if (savedTheme === 'sunlight') {
      setIsSunlight(true);
      document.documentElement.classList.add('sunlight-mode');
      document.body.classList.add('sunlight-mode');
    }
  }, []);

  const toggleSunlight = () => {
    setIsSunlight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('sunlight-mode');
        document.body.classList.add('sunlight-mode');
        localStorage.setItem('motion_lab_theme', 'sunlight');
      } else {
        document.documentElement.classList.remove('sunlight-mode');
        document.body.classList.remove('sunlight-mode');
        localStorage.setItem('motion_lab_theme', 'dark');
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isSunlight: mounted ? isSunlight : false, toggleSunlight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
