'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  description?: string;
  variant?: 'default' | 'glass' | 'neon' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
}: StatsCardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      default:
        return 'p-6';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'rounded-2xl border transition-all duration-300';
    
    switch (variant) {
      case 'glass':
        return `${baseClasses} ${
          isLight
            ? 'bg-white/70 border-white/20 backdrop-blur-xl shadow-glass hover:bg-white/80'
            : 'bg-dark-cardBg/70 border-dark-accentBlue/20 backdrop-blur-xl shadow-neon hover:bg-dark-cardBg/80'
        }`;
      
      case 'neon':
        return `${baseClasses} ${
          isLight
            ? 'bg-white/80 border-light-accentBlue/30 shadow-lg hover:shadow-xl hover:border-light-accentBlue/50'
            : 'bg-dark-cardBg/80 border-dark-accentBlue/40 shadow-neon hover:shadow-neon-hover hover:border-dark-accentBlue/60'
        }`;
      
      case 'gradient':
        return `${baseClasses} ${
          isLight
            ? 'bg-gradient-to-br from-white/90 to-light-accentBlue/10 border-light-accentBlue/20 shadow-lg hover:shadow-xl'
            : 'bg-gradient-to-br from-dark-cardBg/90 to-dark-accentBlue/20 border-dark-accentBlue/30 shadow-neon hover:shadow-neon-hover'
        }`;
      
      default:
        return `${baseClasses} ${
          isLight
            ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
            : 'bg-dark-cardBg border-dark-accentBlue/20 shadow-sm hover:shadow-lg'
        }`;
    }
  };

  const getValueSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xl';
      case 'md':
        return 'text-2xl';
      case 'lg':
        return 'text-3xl';
      default:
        return 'text-2xl';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    if (trend.isPositive === undefined) {
      return isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary';
    }
    
    return trend.isPositive ? 'text-green-500' : 'text-red-500';
  };

  const cardContent = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`
            text-sm font-medium
            ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
          `}>
            {title}
          </h3>
        </div>
        
        {icon && (
          <div className={`
            p-2 rounded-lg
            ${variant === 'neon' 
              ? isLight 
                ? 'bg-light-accentBlue/10 text-light-accentBlue' 
                : 'bg-dark-accentBlue/20 text-dark-accentBlue'
              : isLight
                ? 'bg-gray-100 text-gray-600'
                : 'bg-dark-accentBlue/10 text-dark-textSecondary'
            }
          `}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`
            ${getValueSize()} font-bold
            ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
          `}
        >
          {value}
        </motion.p>
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center space-x-1 mb-2">
          {trend.isPositive !== undefined && (
            <div className={`flex items-center ${getTrendColor()}`}>
              {trend.isPositive ? (
                <ArrowUpIcon className="w-4 h-4" />
              ) : (
                <ArrowDownIcon className="w-4 h-4" />
              )}
            </div>
          )}
          
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {trend.value > 0 && trend.isPositive !== false ? '+' : ''}{trend.value}%
          </span>
          
          {trend.label && (
            <span className={`
              text-sm
              ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
            `}>
              {trend.label}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <p className={`
          text-sm
          ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
        `}>
          {description}
        </p>
      )}

      {/* Decorative elements for neon variant */}
      {variant === 'neon' && !isLight && (
        <>
          <div className="absolute top-2 right-2 w-8 h-8 bg-dark-accentBlue/10 rounded-full blur-sm" />
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-dark-accentPurple/10 rounded-full blur-sm" />
        </>
      )}

      {/* Animated background for gradient variant */}
      {variant === 'gradient' && (
        <motion.div
          animate={{
            background: isLight
              ? ['linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.05))', 'linear-gradient(45deg, rgba(59, 130, 246, 0.05), transparent)']
              : ['linear-gradient(45deg, transparent, rgba(96, 165, 250, 0.1))', 'linear-gradient(45deg, rgba(96, 165, 250, 0.1), transparent)']
          }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          relative w-full text-left
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
      className={`
        relative
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {cardContent}
    </motion.div>
  );
}
