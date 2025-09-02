// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import { Providers } from './providers';


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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
              {children}
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
