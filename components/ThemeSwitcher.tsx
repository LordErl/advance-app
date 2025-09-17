"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-3 rounded-xl transition-all duration-300 transform perspective-container ${
        isLight 
          ? 'bg-light-cardBg neon-border-cyan text-glow-cyan btn-3d-light hover:shadow-neon-cyan' 
          : 'bg-dark-cardBg neon-border-blue-soft text-dark-accentBlue btn-3d-dark hover:shadow-neon-blue-soft'
      }`}
      whileHover={{ 
        scale: 1.1, 
        y: -2,
        rotateY: 10 
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
          isLight 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
        <Moon className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
          isLight 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100 ${
        isLight ? 'shadow-neon-cyan' : 'shadow-neon-blue-soft'
      }`} />
      
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}