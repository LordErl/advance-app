'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';
import { CurrencyDollarIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: 'Controle financeiro completo',
    description: 'Gerencie adiantamentos e despesas em um só lugar com facilidade',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'Fluxo de aprovação inteligente',
    description: 'Automatize processos e reduza erros com fluxos personalizáveis',
    icon: ClockIcon,
  },
  {
    title: 'Relatórios detalhados',
    description: 'Visualize dados e tome decisões informadas com dashboards avançados',
    icon: ChartBarIcon,
  },
];

export default function Hero() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <section className={`relative overflow-hidden ${isLight ? 'hero-light' : 'hero-dark'} min-h-[90vh] flex items-center`}>
      {/* Background decorative elements */}
      {isLight ? (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-light-gradientStart rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-light-gradientEnd rounded-full opacity-20 blur-3xl"></div>
        </div>
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-dark-gradientBlue rounded-full opacity-10 blur-3xl animate-pulse-glow"></div>
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-dark-gradientPurple rounded-full opacity-10 blur-3xl animate-pulse-glow"></div>
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center">
        <motion.div 
          className="lg:w-1/2 lg:pr-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-4xl font-light tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl ${isLight ? '' : 'text-glow'}`}>
            <span className="block">Advance App —</span>
            <span className={`block font-bold mt-2 ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue text-glow-strong'}`}>
              Inteligência para sua gestão de adiantamentos
            </span>
          </h1>
          <p className="mt-6 text-lg max-w-md">
            Gestão moderna, análise inteligente e praticidade em um só lugar.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className={`flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-medium ${isLight ? 'btn-primary-light' : 'btn-primary-dark'}`}
              >
                Começar Agora
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#funcionalidades"
                className={`flex items-center justify-center px-8 py-3.5 rounded-lg text-base font-medium ${isLight ? 'btn-secondary-light' : 'btn-secondary-dark'}`}
              >
                Saiba Mais
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 lg:mt-0 lg:w-1/2 lg:pl-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative mx-auto w-full max-w-md lg:max-w-xl">
            <div className={`rounded-2xl overflow-hidden ${isLight ? 'card-light' : 'card-dark'}`}>
              <div className={`p-1 ${isLight ? 'bg-gradient-to-r from-light-accentBlue to-light-accentPink' : 'bg-gradient-to-r from-dark-accentBlue to-dark-accentPurple'}`}></div>
              <div className="p-6 sm:p-10">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isLight ? 'bg-light-accentBlue bg-opacity-10' : 'bg-dark-accentBlue bg-opacity-20'}`}>
                        <feature.icon className={`h-6 w-6 ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{feature.title}</h3>
                        <p className="mt-1 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
