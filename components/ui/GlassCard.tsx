'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'neon' | 'minimal';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  clickable = false,
  onClick,
}: GlassCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return isLight
          ? 'bg-gradient-to-br from-white/70 to-light-gradientEnd/30 border-light-accentBlue/30 shadow-glass'
          : 'bg-gradient-to-br from-dark-cardBg/70 to-dark-accentPurple/20 border-dark-accentBlue/30 shadow-neon';
      
      case 'neon':
        return isLight
          ? 'bg-white/60 border-light-accentPink/40 shadow-glass-hover'
          : 'bg-dark-cardBg/60 border-dark-accentBlue/60 shadow-neon-hover';
      
      case 'minimal':
        return isLight
          ? 'bg-white/50 border-gray-200/50 shadow-soft'
          : 'bg-dark-cardBg/40 border-gray-700/50 shadow-subtle';
      
      default:
        return isLight
          ? 'bg-white/80 border-light-accentBlue/20 shadow-glass'
          : 'bg-dark-cardBg/80 border-dark-accentBlue/20 shadow-neon';
    }
  };

  const hoverStyles = hover
    ? isLight
      ? 'hover:bg-white/90 hover:border-light-accentBlue/40 hover:shadow-glass-hover hover:-translate-y-1'
      : 'hover:bg-dark-cardBg/90 hover:border-dark-accentBlue/40 hover:shadow-neon-hover hover:-translate-y-1'
    : '';

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border-2 backdrop-blur-xl
        transition-all duration-300 ease-out
        ${getVariantStyles()}
        ${hoverStyles}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-2 h-2 bg-current rounded-full opacity-20" />
          <div className="absolute top-8 right-6 w-1 h-1 bg-current rounded-full opacity-30" />
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-current rounded-full opacity-25" />
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-current rounded-full opacity-20" />
        </div>
      </div>

      {/* Gradient border effect */}
      {variant === 'neon' && (
        <div className={`
          absolute inset-0 rounded-2xl opacity-30
          ${isLight
            ? 'bg-gradient-to-r from-light-accentBlue via-light-accentPink to-light-accentBlue'
            : 'bg-gradient-to-r from-dark-accentBlue via-dark-accentPurple to-dark-accentBlue'
          }
          animate-pulse
        `} style={{ padding: '1px' }}>
          <div className={`
            w-full h-full rounded-2xl
            ${isLight ? 'bg-white/90' : 'bg-dark-cardBg/90'}
          `} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Floating particles effect */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 10, 0],
              y: [0, -5, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`
              absolute top-4 right-4 w-1 h-1 rounded-full
              ${isLight ? 'bg-light-accentBlue' : 'bg-dark-accentBlue'}
            `}
          />
          <motion.div
            animate={{
              x: [0, -8, 0],
              y: [0, 8, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className={`
              absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full
              ${isLight ? 'bg-light-accentPink' : 'bg-dark-accentPurple'}
            `}
          />
        </div>
      )}
    </Component>
  );
}
