'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './ThemeSwitcher';
import { motion } from 'framer-motion';
import { Zap, Menu } from 'lucide-react';

export default function Navbar() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <header className={`fixed w-full z-50 backdrop-blur-xl border-b transition-all duration-300 ${
      isLight 
        ? 'bg-light-bg/90 border-light-accentBlue/20 shadow-3d-light' 
        : 'bg-dark-bg/90 border-dark-accentBlue/20 shadow-3d-dark'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              isLight 
                ? 'bg-light-accentBlue/20 neon-border-cyan' 
                : 'bg-dark-accentBlue/20 neon-border-blue-soft'
            }`}>
              <Zap className={`h-6 w-6 ${
                isLight ? 'text-light-accentBlue text-glow-cyan' : 'text-dark-accentBlue'
              }`} />
            </div>
            <h1 className={`text-2xl font-light tracking-tight ${
              isLight ? 'text-readable-light' : 'text-readable-dark'
            }`}>
              Advance<span className={`font-bold ${
                isLight ? 'text-glow-cyan' : 'text-dark-accentBlue'
              }`}>App</span>
            </h1>
          </Link>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {['Sobre', 'Funcionalidades', 'Planos'].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link 
                href={`#${item.toLowerCase()}`} 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isLight 
                    ? 'text-readable-light hover:text-glow-cyan' 
                    : 'text-readable-dark hover:text-dark-accentBlue'
                }`}
              >
                {item}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/dashboard"
              className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                isLight 
                  ? 'bg-light-primary text-readable-light shadow-neon-cyan btn-3d-light'
                  : 'bg-dark-primary text-readable-dark shadow-neon-blue-soft btn-3d-dark'
              }`}
            >
              Dashboard
            </Link>
          </motion.div>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <button className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
            isLight 
              ? 'text-readable-light hover:bg-light-accentBlue/20 neon-border-cyan' 
              : 'text-readable-dark hover:bg-dark-accentBlue/20 neon-border-blue-soft'
          }`}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}