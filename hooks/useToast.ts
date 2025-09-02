'use client';

import { useState, useCallback } from 'react';
import { ToastProps } from '@/components/ui/Toast';

export interface UseToastReturn {
  toasts: ToastProps[];
  showToast: (toast: Omit<ToastProps, 'id' | 'isVisible' | 'onClose'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((
    toastData: Omit<ToastProps, 'id' | 'isVisible' | 'onClose'>
  ): string => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const newToast: ToastProps = {
      ...toastData,
      id,
      isVisible: true,
      onClose: hideToast,
    };

    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, [hideToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearAllToasts,
  };
}

// Convenience functions for different toast types
export function useToastHelpers() {
  const { showToast, ...rest } = useToast();

  const showSuccess = useCallback((title: string, message?: string, options?: Partial<ToastProps>) => {
    return showToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, options?: Partial<ToastProps>) => {
    return showToast({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, options?: Partial<ToastProps>) => {
    return showToast({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, options?: Partial<ToastProps>) => {
    return showToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  }, [showToast]);

  return {
    ...rest,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
