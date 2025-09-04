'use client';

import { forwardRef, useState, ReactNode, ChangeEvent, FocusEvent } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Suporta tanto input quanto textarea
type InputElement = HTMLInputElement | HTMLTextAreaElement;
type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type InputFocusEvent = FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

export interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  error?: string;
  inputClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'neon';
}

const NeonInput = forwardRef<InputElement, NeonInputProps>((
  {
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  error,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  as: Component = 'input',
  rows = 3,
  ...rest
}, ref) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-base';
      case 'lg':
        return 'px-5 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = `
      w-full rounded-xl border transition-all duration-300 
      focus:outline-none focus:ring-2 focus:ring-opacity-50
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `;

    switch (variant) {
      case 'glass':
        return `${baseClasses} ${
          isLight
            ? 'bg-white/70 border-light-accentBlue/20 backdrop-blur-sm focus:bg-white/90 focus:border-light-accentBlue focus:ring-light-accentBlue'
            : 'bg-dark-cardBg/70 border-dark-accentBlue/30 backdrop-blur-sm focus:bg-dark-cardBg/90 focus:border-dark-accentBlue focus:ring-dark-accentBlue'
        }`;
      
      case 'neon':
        return `${baseClasses} ${
          isLight
            ? 'bg-white/80 border-light-accentBlue/30 focus:border-light-accentBlue focus:ring-light-accentBlue focus:shadow-lg'
            : 'bg-dark-cardBg/80 border-dark-accentBlue/40 focus:border-dark-accentBlue focus:ring-dark-accentBlue focus:shadow-neon'
        }`;
      
      default:
        return `${baseClasses} ${
          isLight
            ? 'bg-white border-gray-300 focus:border-light-accentBlue focus:ring-light-accentBlue'
            : 'bg-dark-cardBg border-dark-accentBlue/20 focus:border-dark-accentBlue focus:ring-dark-accentBlue'
        }`;
    }
  };

  const handleFocus = (e: InputFocusEvent) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: InputFocusEvent) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            color: isFocused 
              ? isLight ? '#3b82f6' : '#60a5fa'
              : isLight ? '#374151' : '#9ca3af'
          }}
          className={`
            block text-sm font-medium mb-2 transition-colors
            ${error ? 'text-red-500' : ''}
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 
            ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
          `}>
            {leftIcon}
          </div>
        )}

        {/* Renderização condicional para Input ou Textarea */}
        {Component === 'textarea' ? (
          <motion.textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange as any}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={`
              ${getVariantClasses()}
              ${getSizeClasses()}
              min-h-[80px] // Altura mínima para textareas
              ${isLight ? 'text-light-textPrimary placeholder-light-textSecondary' : 'text-dark-textPrimary placeholder-dark-textSecondary'}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${inputClassName}
            `}
            whileFocus={variant === 'neon' ? { scale: 1.02 } : undefined}
          />
        ) : (
                    <motion.input
            ref={ref as React.Ref<HTMLInputElement>}
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
            className={`
              ${getVariantClasses()}
              ${getSizeClasses()}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || type === 'password' ? 'pr-10' : ''}
              ${isLight ? 'text-light-textPrimary placeholder-light-textSecondary' : 'text-dark-textPrimary placeholder-dark-textSecondary'}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${inputClassName}
            `}
            whileFocus={variant === 'neon' ? { scale: 1.02 } : undefined}
          />
        )}

        {/* Right Icon or Password Toggle */}
        {(rightIcon || type === 'password') && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {type === 'password' ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                  p-1 rounded transition-colors
                  ${isLight 
                    ? 'text-light-textSecondary hover:text-light-textPrimary' 
                    : 'text-dark-textSecondary hover:text-dark-textPrimary'
                  }
                `}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            ) : (
              <div className={`
                ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
              `}>
                {rightIcon}
              </div>
            )}
          </div>
        )}

        {/* Focus Ring for Neon Variant */}
        {variant === 'neon' && isFocused && !isLight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl bg-dark-accentBlue/10 blur-sm pointer-events-none"
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}

      {/* Focus indicator line */}
      {variant === 'neon' && (
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className={`
            absolute bottom-0 left-0 h-0.5 w-full origin-left
            ${isLight ? 'bg-light-accentBlue' : 'bg-dark-accentBlue'}
            ${error ? 'bg-red-500' : ''}
          `}
        />
      )}
    </div>
  );
});

NeonInput.displayName = 'NeonInput';

export default NeonInput;
