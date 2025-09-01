'use client';

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';

export default function CallToAction() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className={`max-w-5xl mx-auto text-center ${isLight ? 'cta-light' : 'cta-dark'}`}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-3xl font-bold mb-6 ${!isLight && 'text-glow'}`}>
          Seu negócio mais inteligente começa aqui.
        </h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/register"
            className={`inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-medium ${isLight ? 'btn-primary-light' : 'btn-primary-dark'}`}
          >
            Quero usar o Advance App
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
