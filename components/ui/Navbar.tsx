'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import NeonButton from './NeonButton';
import Image from 'next/image';

const navLinks = [
  { name: 'Funcionalidades', href: '#funcionalidades' },
  { name: 'Preços', href: '#precos' },
  { name: 'Contato', href: '#contato' },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLight = theme === 'light';

  const toggleTheme = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? (isLight ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-dark-background/80 backdrop-blur-lg shadow-lg') : 'bg-transparent'}`;

  return (
    <header className={navClasses}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Advance App Logo" width={32} height={32} />
              <span className={`text-xl font-bold ${isLight ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Advance</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className={`font-medium transition-colors ${isLight ? 'text-light-text-secondary hover:text-light-accent-primary' : 'text-dark-text-secondary hover:text-dark-accent-primary'}`}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLight ? <MoonIcon className="h-6 w-6 text-light-text-secondary" /> : <SunIcon className="h-6 w-6 text-dark-text-secondary" />}
            </motion.button>
            <NeonButton variant="secondary" size="md" onClick={() => { /* Navigate to login */ }}>
              Login
            </NeonButton>
          </div>

          <div className="md:hidden flex items-center">
            <motion.button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md">
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-20 left-0 w-full ${isLight ? 'bg-white/95' : 'bg-dark-background/95'} shadow-lg`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`block px-3 py-2 rounded-md text-base font-medium ${isLight ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
                  {link.name}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4 flex items-center justify-between px-3">
                <NeonButton variant="secondary" size="md" fullWidth onClick={() => { /* Navigate to login */ }}>
                  Login
                </NeonButton>
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isLight ? <MoonIcon className="h-6 w-6 text-light-text-secondary" /> : <SunIcon className="h-6 w-6 text-dark-text-secondary" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
