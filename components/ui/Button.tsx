// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-md font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyle = {
    primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-400",
  };

  return (
    <button className={`${baseStyle} ${variantStyle[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
