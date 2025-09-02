'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';
import NeonButton from './ui/NeonButton';
import Link from 'next/link';

export default function FinalCTA() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <section className="relative py-20 overflow-hidden">
       {/* Background decorative elements */}
      {isLight ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-light-accent-primary rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-light-accent-secondary rounded-full opacity-20 blur-3xl"></div>
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-dark-accent-primary rounded-full opacity-10 blur-3xl animate-pulse-glow"></div>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-dark-accent-secondary rounded-full opacity-10 blur-3xl animate-pulse-glow"></div>
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${isLight ? 'text-light-text-primary' : 'text-dark-text-primary text-glow'}`}>
            Pronto para transformar sua gestão financeira?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg">
            Junte-se a centenas de empresas que já estão otimizando seus processos de adiantamento com a Advance App.
          </p>
          <div className="mt-8">
            <Link href="/auth/register" passHref>
              <NeonButton variant="primary" size="lg">
                Comece a usar gratuitamente
              </NeonButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
