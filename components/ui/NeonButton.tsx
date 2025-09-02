'use client';

import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import LoadingSpinner from './LoadingSpinner';
import { motion, MotionProps } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

// Combine MotionProps with standard HTML button props for type safety
type NeonButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> & MotionProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
};

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>((
  {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    className = '',
    disabled,
    ...props
  },
  ref
) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const finalDisabled = disabled || loading;

  const darkVariantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-dark-primary text-white hover:bg-dark-primary/90',
    secondary: 'border-dark-accentBlue text-dark-accentBlue hover:bg-dark-accentBlue/10',
    success: 'border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20',
    danger: 'border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20',
    ghost: 'border-transparent text-gray-400 hover:bg-gray-700/50',
  };

  const lightVariantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-light-primary text-white hover:bg-light-primary/90',
    secondary: 'border-light-primary text-light-primary hover:bg-light-primary/10',
    success: 'border-green-600 bg-green-100 text-green-700 hover:bg-green-200/80',
    danger: 'border-red-600 bg-red-100 text-red-700 hover:bg-red-200/80',
    ghost: 'border-transparent text-gray-500 hover:bg-gray-200',
  };
  
  const darkNeonClasses: Record<ButtonVariant, string> = {
    primary: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    secondary: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    success: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    danger: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    ghost: '',
  };

  const lightNeonClasses: Record<ButtonVariant, string> = {
    primary: 'shadow-[0_0_15px_rgba(0,119,255,0.6)]',
    secondary: 'shadow-[0_0_15px_rgba(0,119,255,0.5)]',
    success: 'shadow-[0_0_15px_rgba(22,163,74,0.5)]',
    danger: 'shadow-[0_0_15px_rgba(220,38,38,0.5)]',
    ghost: '',
  };

  const baseClasses = 'relative inline-flex items-center justify-center rounded-lg border font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = isLight ? lightVariantClasses[variant] : darkVariantClasses[variant];
  const neonClasses = !finalDisabled ? (isLight ? lightNeonClasses[variant] : darkNeonClasses[variant]) : '';

  const buttonClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses,
    fullWidth && 'w-full',
    finalDisabled && 'opacity-50 cursor-not-allowed',
    loading && 'animate-pulse',
    neonClasses,
    className
  );

  return (
    <motion.button
      ref={ref}
      {...props}
      whileHover={{ scale: finalDisabled ? 1 : 1.03 }}
      whileTap={{ scale: finalDisabled ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={finalDisabled}
    >
      {loading && <LoadingSpinner variant="dots" size="sm" className="mr-2" />}
      {children}
    </motion.button>
  );
});

NeonButton.displayName = 'NeonButton';

export default NeonButton;


