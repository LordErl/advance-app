'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import Image from 'next/image';
import Link from 'next/link';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

export default function MobileHeader({
  title = 'AdvanceApp',
  showBack = false,
  showMenu = true,
  showNotifications = true,
  showSearch = true,
  onMenuClick,
  onSearchClick,
}: MobileHeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [notificationCount] = useState(3); // Example notification count

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 right-0 z-40
        ${isLight 
          ? 'bg-white/90 border-light-accentBlue/20' 
          : 'bg-black/90 border-dark-accentBlue/20'
        }
        backdrop-blur-xl border-b-2
        px-4 py-3 md:hidden
      `}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Menu or Back */}
        <div className="flex items-center">
          {showBack ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isLight 
                  ? 'hover:bg-light-accentBlue/10' 
                  : 'hover:bg-dark-accentBlue/10'
                }
              `}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke={isLight ? '#1976D2' : '#00CFFF'} 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          ) : showMenu ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClick}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isLight 
                  ? 'hover:bg-light-accentBlue/10' 
                  : 'hover:bg-dark-accentBlue/10'
                }
              `}
            >
              <Image
                src="/images/icons/menu-icon.svg"
                alt="Menu"
                width={24}
                height={24}
              />
            </motion.button>
          ) : null}
        </div>

        {/* Center - Title and Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2"
        >
          <Image
            src="/images/icons/advance-icon.svg"
            alt="AdvanceApp"
            width={32}
            height={32}
            className="drop-shadow-lg"
          />
          <h1 className={`
            text-lg font-bold tracking-tight
            ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
          `}>
            {title}
          </h1>
        </motion.div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSearchClick}
              className={`
                p-2 rounded-xl transition-all duration-300
                ${isLight 
                  ? 'hover:bg-light-accentBlue/10' 
                  : 'hover:bg-dark-accentBlue/10'
                }
              `}
            >
              <Image
                src="/images/icons/search-icon.svg"
                alt="Buscar"
                width={24}
                height={24}
              />
            </motion.button>
          )}

          {showNotifications && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`
                relative p-2 rounded-xl transition-all duration-300
                ${isLight 
                  ? 'hover:bg-light-accentBlue/10' 
                  : 'hover:bg-dark-accentBlue/10'
                }
              `}
            >
              <Image
                src="/images/icons/notification-icon.svg"
                alt="Notificações"
                width={24}
                height={24}
              />
              
              {/* Notification badge */}
              <AnimatePresence>
                {notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center"
                  >
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-xs font-bold text-white px-1"
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>

      {/* Progress bar for loading states */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className={`
          absolute bottom-0 left-0 h-0.5 w-full origin-left
          ${isLight 
            ? 'bg-gradient-to-r from-light-accentBlue to-light-accentPink' 
            : 'bg-gradient-to-r from-dark-accentBlue to-dark-accentPurple'
          }
          opacity-20
        `}
      />
    </motion.header>
  );
}
