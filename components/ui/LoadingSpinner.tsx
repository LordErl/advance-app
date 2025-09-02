'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'neon' | 'dots' | 'pulse';
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className = '',
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-8 h-8';
      case 'lg':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    return isLight
      ? 'border-light-accentBlue'
      : 'border-dark-accentBlue';
  };

  if (variant === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`rounded-full ${
              size === 'sm' ? 'w-2 h-2' : 
              size === 'md' ? 'w-3 h-3' : 
              size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
            } ${isLight ? 'bg-light-accentBlue' : 'bg-dark-accentBlue'}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={`rounded-full ${getSizeClasses()} ${
          isLight 
            ? 'bg-gradient-to-r from-light-accentBlue to-light-accentPink' 
            : 'bg-gradient-to-r from-dark-accentBlue to-dark-accentPurple'
        } ${className}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === 'neon') {
    return (
      <div className={`relative ${getSizeClasses()} ${className}`}>
        <motion.div
          className={`absolute inset-0 rounded-full border-2 ${getColorClasses()}`}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }}
        />
        <motion.div
          className={`absolute inset-1 rounded-full border ${getColorClasses()} opacity-50`}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
          }}
        />
        {!isLight && (
          <div className={`absolute inset-0 rounded-full bg-dark-accentBlue opacity-20 blur-sm animate-neon-pulse`} />
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <motion.div
      className={`${getSizeClasses()} border-2 border-gray-300 border-t-transparent rounded-full ${getColorClasses()} ${className}`}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        borderTopColor: 'transparent',
      }}
    />
  );
}
