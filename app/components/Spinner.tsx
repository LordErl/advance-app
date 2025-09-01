'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/app/lib/utils/cn';

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-[3px]',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        primary: 'text-blue-600',
        secondary: 'text-gray-600',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export default function Spinner({ size, variant, className }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant }), className)}
      role="status"
      aria-label="Carregando"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
