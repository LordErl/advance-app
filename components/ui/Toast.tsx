'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { ReactNode, useEffect } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  isVisible: boolean;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  isVisible,
  onClose,
  action,
}: ToastProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />;
      case 'info':
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getTypeStyles = () => {
    const baseStyles = isLight
      ? 'bg-white/90 backdrop-blur-xl border shadow-lg'
      : 'bg-dark-cardBg/90 backdrop-blur-xl border shadow-neon';

    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500/30`;
      case 'error':
        return `${baseStyles} border-red-500/30`;
      case 'warning':
        return `${baseStyles} border-orange-500/30`;
      case 'info':
        return `${baseStyles} border-blue-500/30`;
      default:
        return baseStyles;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`
            relative max-w-sm w-full rounded-xl p-4 pointer-events-auto
            ${getTypeStyles()}
          `}
        >
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 rounded-b-xl ${
                type === 'success' ? 'bg-green-500' :
                type === 'error' ? 'bg-red-500' :
                type === 'warning' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}
            />
          )}

          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            
            <div className="ml-3 w-0 flex-1">
              <p className={`text-sm font-semibold ${
                isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'
              }`}>
                {title}
              </p>
              {message && (
                <p className={`mt-1 text-sm ${
                  isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'
                }`}>
                  {message}
                </p>
              )}
              
              {action && (
                <div className="mt-3">
                  <button
                    onClick={action.onClick}
                    className={`text-sm font-medium transition-colors ${
                      type === 'success' ? 'text-green-600 hover:text-green-700' :
                      type === 'error' ? 'text-red-600 hover:text-red-700' :
                      type === 'warning' ? 'text-orange-600 hover:text-orange-700' :
                      'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => onClose(id)}
                className={`rounded-md inline-flex transition-colors ${
                  isLight 
                    ? 'text-light-textSecondary hover:text-light-textPrimary' 
                    : 'text-dark-textSecondary hover:text-dark-textPrimary'
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ 
  toasts, 
  position = 'top-right' 
}: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 pointer-events-none ${getPositionClasses()}`}>
      <div className="flex flex-col space-y-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
}
