'use client';

import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import LoadingSpinner from './LoadingSpinner';
import { motion, MotionProps } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'neon-cyan' | 'neon-magenta' | 'neon-lime' | 'neon-gold';

type NeonButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> & MotionProps & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  effect3d?: boolean;
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
    effect3d = true,
    ...props
  },
  ref
) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const finalDisabled = disabled || loading;

  const lightVariantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-light-primary text-light-textPrimary hover:bg-light-accentBlue shadow-neon-cyan',
    secondary: 'border-light-accentGold text-light-accentGold hover:bg-light-accentGold/20 shadow-neon-gold',
    success: 'border-light-accentLime text-light-accentLime hover:bg-light-accentLime/20 shadow-neon-lime',
    danger: 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30',
    ghost: 'border-light-accentBlue/30 text-light-textSecondary hover:bg-light-accentBlue/20',
    'neon-cyan': 'bg-transparent border-light-accentBlue text-light-accentBlue hover:bg-light-accentBlue/10 shadow-neon-cyan text-glow-cyan',
    'neon-magenta': 'bg-transparent border-light-accentMagenta text-light-accentMagenta hover:bg-light-accentMagenta/10 shadow-neon-magenta text-glow-magenta',
    'neon-lime': 'bg-transparent border-light-accentLime text-light-accentLime hover:bg-light-accentLime/10 shadow-neon-lime text-glow-lime',
    'neon-gold': 'bg-transparent border-light-accentGold text-light-accentGold hover:bg-light-accentGold/10 shadow-neon-gold text-glow-gold',
  };

  const darkVariantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-dark-primary text-dark-textPrimary hover:bg-dark-accentBlue shadow-neon-blue-soft',
    secondary: 'border-dark-accentGold text-dark-accentGold hover:bg-dark-accentGold/20 shadow-neon-gold-soft',
    success: 'border-dark-accentLime text-dark-accentLime hover:bg-dark-accentLime/20 shadow-neon-lime-soft',
    danger: 'border-red-600 bg-red-100 text-red-700 hover:bg-red-200/80',
    ghost: 'border-dark-accentBlue/30 text-dark-textSecondary hover:bg-dark-accentBlue/20',
    'neon-cyan': 'bg-transparent border-dark-accentBlue text-dark-accentBlue hover:bg-dark-accentBlue/10 shadow-neon-blue-soft',
    'neon-magenta': 'bg-transparent border-dark-accentMagenta text-dark-accentMagenta hover:bg-dark-accentMagenta/10 shadow-neon-magenta-soft',
    'neon-lime': 'bg-transparent border-dark-accentLime text-dark-accentLime hover:bg-dark-accentLime/10 shadow-neon-lime-soft',
    'neon-gold': 'bg-transparent border-dark-accentGold text-dark-accentGold hover:bg-dark-accentGold/10 shadow-neon-gold-soft',
  };

  const baseClasses = 'relative inline-flex items-center justify-center rounded-lg border font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transform perspective-container';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const effect3dClasses = effect3d 
    ? (isLight ? 'btn-3d-light' : 'btn-3d-dark')
    : '';

  const variantClasses = isLight ? lightVariantClasses[variant] : darkVariantClasses[variant];
  const textReadabilityClass = isLight ? 'text-readable-light' : 'text-readable-dark';

  const buttonClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses,
    effect3dClasses,
    fullWidth && 'w-full',
    finalDisabled && 'opacity-50 cursor-not-allowed',
    loading && 'animate-pulse',
    // High contrast text for readability
    (variant.includes('neon') || variant === 'primary') ? '' : textReadabilityClass,
    className
  );

  return (
    <motion.button
      ref={ref}
      {...props}
      whileHover={{ 
        scale: finalDisabled ? 1 : 1.03,
        y: finalDisabled ? 0 : (effect3d ? -2 : -1),
      }}
      whileTap={{ 
        scale: finalDisabled ? 1 : 0.98,
        y: finalDisabled ? 0 : 0,
      }}
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