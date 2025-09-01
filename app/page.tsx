'use client';

import { useTheme } from '@/providers/ThemeProvider';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <div className={`flex min-h-screen flex-col ${isLight ? 'light-theme' : 'dark-theme'}`}>
      <Navbar />

      <main className="flex-grow pt-20">
        <Hero />
        <Features />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
