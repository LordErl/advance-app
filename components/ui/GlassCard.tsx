'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'default' | '3d' | 'neon';
}

export default function GlassCard({
  children,
  className = '',
  clickable = false,
  onClick,
  variant = 'default',
}: GlassCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const baseClasses = 'relative rounded-2xl backdrop-blur-lg transition-all duration-300 ease-out p-6 perspective-container';

  const getVariantClasses = () => {
    switch (variant) {
      case '3d':
        return isLight 
          ? 'card-3d-light card-3d depth-light' 
          : 'card-3d-dark card-3d depth-dark';
      
      case 'neon':
        return isLight
          ? 'glassmorphism neon-border-cyan animate-pulse-neon'
          : 'glassmorphism neon-border-blue-soft animate-pulse-neon';
      
      default:
        return isLight
          ? 'glassmorphism hover:shadow-3d-light'
          : 'glassmorphism hover:shadow-3d-dark';
    }
  };

  const textClasses = isLight ? 'text-readable-light' : 'text-readable-dark';

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      whileHover={{ 
        y: variant === '3d' ? -8 : -4,
        rotateX: variant === '3d' ? 5 : 0,
        rotateY: variant === '3d' ? 2 : 0,
      }}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${getVariantClasses()}
        ${clickable ? 'cursor-pointer interactive-glow' : ''}
        ${textClasses}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}