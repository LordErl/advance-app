'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from './ThemeSwitcher';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { theme } = useTheme();
  
  return (
    <header className="fixed w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <h1 className="text-2xl font-light tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Advance<span className="font-bold text-primary dark:text-primary-dark">App</span>
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
                className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark transition-colors hover:text-primary dark:hover:text-primary-dark"
              >
                {item}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/dashboard"
              className="text-sm font-medium px-5 py-2.5 rounded-md transition-colors bg-light-accent-primary text-white hover:bg-blue-700 dark:bg-dark-accent-primary dark:text-dark-text dark:hover:bg-cyan-400"
            >
              Dashboard
            </Link>
          </motion.div>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <button className="md:hidden text-text-primary-light dark:text-text-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
