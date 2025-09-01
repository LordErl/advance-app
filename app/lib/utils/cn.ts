import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para composição de classes CSS com suporte a condicionais e merge inteligente de classes Tailwind
 * @param inputs Classes CSS a serem combinadas
 * @returns String com as classes CSS combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
