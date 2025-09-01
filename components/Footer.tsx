'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <footer className={isLight ? 'footer-light' : 'footer-dark'}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link 
            href="#" 
            className={`text-sm transition-all-300 ${isLight ? 'text-light-textSecondary hover:text-light-accentBlue' : 'text-dark-textSecondary hover:text-dark-accentBlue'}`}
          >
            Contato
          </Link>
          <Link 
            href="#" 
            className={`text-sm transition-all-300 ${isLight ? 'text-light-textSecondary hover:text-light-accentBlue' : 'text-dark-textSecondary hover:text-dark-accentBlue'}`}
          >
            Política de Privacidade
          </Link>
          <Link 
            href="#" 
            className={`text-sm transition-all-300 ${isLight ? 'text-light-textSecondary hover:text-light-accentBlue' : 'text-dark-textSecondary hover:text-dark-accentBlue'}`}
          >
            Termos de Uso
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className={`text-sm ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
            © {new Date().getFullYear()} Advance App. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
