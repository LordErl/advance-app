'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function NeonButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}: NeonButtonProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return isLight
          ? 'bg-gradient-to-r from-light-accent-primary to-light-accent-secondary text-white shadow-lg'
          : 'bg-gradient-to-r from-dark-accent-primary to-dark-accent-secondary text-white shadow-neon-glow-primary';
      case 'secondary':
        return isLight
          ? 'bg-white/10 border border-light-accent-primary text-light-accent-primary backdrop-blur-sm'
          : 'bg-white/5 border border-dark-accent-primary text-dark-accent-primary backdrop-blur-sm';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-5 py-2.5 text-sm rounded-lg';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95';

  return (
    <motion.button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`
        relative font-semibold transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
        ${getSizeStyles()}
        ${getVariantStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabledStyles}
        ${className}
      `}
      whileHover={!disabled && !loading ? { y: -2, transition: { duration: 0.2 } } : {}}
      whileTap={!disabled && !loading ? { y: 1, scale: 0.98, transition: { duration: 0.1 } } : {}}
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        <span>{children}</span>
      </span>
      {!isLight && variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-inherit opacity-0 transition-opacity duration-300 group-hover:opacity-20 animate-pulse" />
      )}
    </motion.button>
  );
}
