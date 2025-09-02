'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
}: ModalProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-[95vw] max-h-[95vh]';
      default:
        return 'max-w-lg';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              relative w-full ${getSizeClasses()} 
              ${isLight 
                ? 'bg-white/90 border-white/20' 
                : 'bg-dark-cardBg/90 border-dark-accentBlue/20'
              }
              backdrop-blur-xl border rounded-2xl shadow-2xl
              ${!isLight ? 'shadow-neon' : ''}
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`
                flex items-center justify-between p-6 pb-4
                ${title ? '' : 'pb-0'}
              `}>
                {title && (
                  <h2 className={`
                    text-xl font-semibold
                    ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
                  `}>
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${isLight 
                        ? 'text-light-textSecondary hover:text-light-textPrimary hover:bg-light-accentBlue/10' 
                        : 'text-dark-textSecondary hover:text-dark-textPrimary hover:bg-dark-accentBlue/20'
                      }
                    `}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={`
              px-6 pb-6
              ${title || showCloseButton ? '' : 'pt-6'}
            `}>
              {children}
            </div>

            {/* Decorative elements for dark theme */}
            {!isLight && (
              <>
                <div className="absolute -top-1 -left-1 w-20 h-20 bg-dark-accentBlue/20 rounded-full blur-xl" />
                <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-dark-accentPurple/20 rounded-full blur-xl" />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Modal Footer Component
interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`
      flex items-center justify-end space-x-3 pt-4 mt-6
      border-t ${isLight ? 'border-gray-200' : 'border-dark-accentBlue/20'}
      ${className}
    `}>
      {children}
    </div>
  );
}

// Modal Body Component
interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}
