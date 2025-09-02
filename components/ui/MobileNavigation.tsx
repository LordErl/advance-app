'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import Image from 'next/image';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  activeIcon?: string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: '/images/icons/home-icon.svg',
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: '/images/icons/dashboard-icon.svg',
  },
  {
    href: '/expenses',
    label: 'Despesas',
    icon: '/images/icons/expense-icon.svg',
  },
  {
    href: '/analytics',
    label: 'Análises',
    icon: '/images/icons/analytics-icon.svg',
  },
  {
    href: '/profile',
    label: 'Perfil',
    icon: '/images/icons/profile-icon.svg',
  },
];

export default function MobileNavigation() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        ${isLight 
          ? 'bg-white/80 border-light-accentBlue/20' 
          : 'bg-black/80 border-dark-accentBlue/20'
        }
        backdrop-blur-xl border-t-2
        px-2 py-3 md:hidden
      `}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-2 rounded-2xl transition-all duration-300
                  ${isActive 
                    ? isLight 
                      ? 'bg-light-accentBlue/20 shadow-lg' 
                      : 'bg-dark-accentBlue/20 shadow-neon'
                    : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                {/* Active indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`
                        absolute inset-0 rounded-2xl
                        ${isLight 
                          ? 'bg-gradient-to-br from-light-accentBlue/30 to-light-accentPink/30' 
                          : 'bg-gradient-to-br from-dark-accentBlue/30 to-dark-accentPurple/30'
                        }
                      `}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className="relative z-10 w-6 h-6">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    className={`
                      transition-all duration-300
                      ${isActive 
                        ? 'brightness-110 drop-shadow-lg' 
                        : 'opacity-70 group-hover:opacity-100'
                      }
                    `}
                  />
                </div>

                {/* Notification badge (example for some items) */}
                {(item.href === '/expenses' || item.href === '/dashboard') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-red-400 rounded-full"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Label */}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.7, 
                  y: 0,
                  scale: isActive ? 1.05 : 1 
                }}
                className={`
                  text-xs font-medium mt-1 transition-all duration-300
                  ${isActive 
                    ? isLight 
                      ? 'text-light-accentBlue' 
                      : 'text-dark-accentBlue'
                    : isLight 
                      ? 'text-light-textSecondary' 
                      : 'text-dark-textSecondary'
                  }
                `}
              >
                {item.label}
              </motion.span>

              {/* Active dot indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`
                      absolute -bottom-1 w-1 h-1 rounded-full
                      ${isLight ? 'bg-light-accentBlue' : 'bg-dark-accentBlue'}
                    `}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Floating action button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="absolute -top-6 right-4"
      >
        <Link href="/expenses/new">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              shadow-lg transition-all duration-300
              ${isLight 
                ? 'bg-gradient-to-br from-light-accentBlue to-light-accentPink shadow-light-accentBlue/30' 
                : 'bg-gradient-to-br from-dark-accentBlue to-dark-accentPurple shadow-dark-accentBlue/50'
              }
            `}
          >
            <Image
              src="/images/icons/add-icon.svg"
              alt="Adicionar"
              width={20}
              height={20}
              className="brightness-0 invert"
            />
          </motion.button>
        </Link>
      </motion.div>
    </motion.nav>
  );
}
