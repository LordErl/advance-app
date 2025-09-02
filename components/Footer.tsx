'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

const footerLinks = {
  solutions: [
    { name: 'Adiantamentos', href: '#' },
    { name: 'Controle de Gastos', href: '#' },
    { name: 'Relatórios', href: '#' },
  ],
  company: [
    { name: 'Sobre Nós', href: '#' },
    { name: 'Carreiras', href: '#' },
    { name: 'Contato', href: '#' },
  ],
  legal: [
    { name: 'Privacidade', href: '#' },
    { name: 'Termos', href: '#' },
  ],
};

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-gray-400 hover:text-gray-500">
    <span className="sr-only">{children}</span>
    {children}
  </a>
);

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <footer className={`${isLight ? 'bg-gray-50' : 'bg-dark-card'} border-t ${isLight ? 'border-gray-200' : 'border-dark-accent-primary/20'}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
                <img className="h-8 w-auto" src="/logo.svg" alt="Advance App" />
                <span className={`text-xl font-bold ${isLight ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>Advance</span>
            </Link>
            <p className={`text-sm ${isLight ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
              Inteligência para sua gestão de adiantamentos.
            </p>
            <div className="flex space-x-6">
              {/* Add Social Icons Here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Soluções</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerLinks.solutions.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={`text-base ${isLight ? 'text-light-text-secondary hover:text-light-text-primary' : 'text-dark-text-secondary hover:text-white'}`}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Empresa</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={`text-base ${isLight ? 'text-light-text-secondary hover:text-light-text-primary' : 'text-dark-text-secondary hover:text-white'}`}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className={`text-sm font-semibold tracking-wider uppercase ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {footerLinks.legal.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className={`text-base ${isLight ? 'text-light-text-secondary hover:text-light-text-primary' : 'text-dark-text-secondary hover:text-white'}`}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-12 border-t pt-8 ${isLight ? 'border-gray-200' : 'border-dark-accent-primary/20'}`}>
          <p className={`text-base text-center ${isLight ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
            &copy; {new Date().getFullYear()} Advance App. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
