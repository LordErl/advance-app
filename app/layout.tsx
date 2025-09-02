// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import MobileNavigation from '@/components/ui/MobileNavigation';
import MobileHeader from '@/components/ui/MobileHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Advance App - Inteligência para sua gestão de adiantamentos',
  description: 'Gestão moderna, análise inteligente e praticidade em um só lugar. Simplifique o gerenciamento de adiantamentos e despesas da sua empresa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen">
            <MobileHeader />
            <main className="pb-20 pt-16 md:pb-0 md:pt-0">
              {children}
            </main>
            <MobileNavigation />
          </div>
        </Providers>
      </body>
    </html>
  );
}
