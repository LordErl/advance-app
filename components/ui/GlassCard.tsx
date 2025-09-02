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
    ? 'bg-light-card border border-white/20 shadow-glass hover:border-white/60 hover:shadow-lg'
    : 'bg-dark-card border border-dark-accent-primary/30 shadow-neon-glow-primary hover:border-dark-accent-primary/70';

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
