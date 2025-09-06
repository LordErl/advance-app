'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  clickable = false,
  onClick,
}: GlassCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const baseClasses = 'relative rounded-2xl backdrop-blur-lg transition-all duration-300 ease-out p-6';

  const themeClasses = isLight
    ? 'light-royal-card hover:shadow-lg'
    : 'royal-card royal-glow hover:shadow-xl';

  const Component = clickable ? motion.button : motion.div;

  return (
    <Component
      whileHover={{ y: -4 }}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${themeClasses}
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
