'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
          ? 'bg-gradient-to-r from-light-accentBlue to-light-accentPink text-white shadow-lg hover:shadow-xl border-light-accentBlue/30'
          : 'bg-gradient-to-r from-dark-accentBlue to-dark-accentPurple text-white shadow-neon hover:shadow-neon-hover border-dark-accentBlue/50';
      
      case 'secondary':
        return isLight
          ? 'bg-white/80 text-light-textPrimary border-light-accentBlue/40 hover:bg-white/90 shadow-glass'
          : 'bg-dark-cardBg/80 text-dark-textPrimary border-dark-accentBlue/40 hover:bg-dark-cardBg/90 shadow-neon';
      
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl border-green-400/30';
      
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl border-orange-400/30';
      
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl border-red-400/30';
      
      case 'ghost':
        return isLight
          ? 'bg-transparent text-light-accentBlue border-light-accentBlue/50 hover:bg-light-accentBlue/10'
          : 'bg-transparent text-dark-accentBlue border-dark-accentBlue/50 hover:bg-dark-accentBlue/10';
      
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-lg';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      case 'xl':
        return 'px-10 py-5 text-xl rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:-translate-y-0.5 active:translate-y-0';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden font-semibold transition-all duration-300
        backdrop-blur-xl border-2 focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabledStyles}
        ${className}
      `}
    >
      {/* Animated background effect */}
      {variant === 'primary' && !disabled && (
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      )}

      {/* Glow effect for neon variant */}
      {!isLight && variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-dark-accentBlue/20 to-dark-accentPurple/20 blur-xl" />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        <span>{children}</span>
      </span>

      {/* Ripple effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-white/20 rounded-full"
        style={{ transformOrigin: 'center' }}
      />
    </motion.button>
  );
}
