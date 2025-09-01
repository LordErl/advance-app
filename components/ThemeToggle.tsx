'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10"></div>; // Placeholder to avoid layout shift
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all-300 ${
        theme === 'light' 
          ? 'bg-light-accentBlue text-white' 
          : 'bg-gradient-to-r from-dark-accentBlue to-dark-accentPurple text-white neon-border'
      }`}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        {theme === 'light' ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
}
