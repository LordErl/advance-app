'use client';

import { Zap, Twitter, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = {
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

const social = [
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
  },
  {
    name: 'GitHub',
    href: '#',
    icon: Github,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-light-accentBlue/20 dark:border-dark-accentBlue/20 bg-light-cardBg/30 dark:bg-dark-cardBg/30 backdrop-blur-xl" aria-labelledby="footer-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-light-accentBlue/5 dark:bg-dark-accentBlue/5 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-light-accentMagenta/5 dark:bg-dark-accentMagenta/5 rounded-full blur-2xl animate-float-delayed" />
      </div>

      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-light-accentBlue/20 dark:bg-dark-accentBlue/20 neon-border-cyan dark:neon-border-blue-soft">
                <Zap className="h-6 w-6 text-glow-cyan dark:text-dark-accentBlue" />
              </div>
              <span className="text-xl font-bold text-readable-light dark:text-readable-dark">
                Advance<span className="text-glow-cyan dark:text-dark-accentBlue">App</span>
              </span>
            </div>
            
            <p className="text-sm leading-6 text-readable-light dark:text-readable-dark opacity-80">
              <span className="text-glow-cyan dark:text-dark-accentBlue">Inteligência</span> para sua gestão de 
              <span className="text-glow-magenta dark:text-dark-accentMagenta"> adiantamentos</span>.
            </p>
            
            <div className="flex space-x-6">
              {social.map((item) => (
                <motion.a 
                  key={item.name} 
                  href={item.href} 
                  className="p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1
                    text-readable-light dark:text-readable-dark opacity-70 hover:opacity-100
                    hover:bg-light-accentBlue/20 dark:hover:bg-dark-accentBlue/20
                    hover:neon-border-cyan dark:hover:neon-border-blue-soft"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold leading-6 text-readable-light dark:text-readable-dark mb-2">
                  <span className="text-glow-cyan dark:text-dark-accentBlue">Soluções</span>
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href} 
                        className="text-sm leading-6 text-readable-light dark:text-readable-dark opacity-70 hover:opacity-100 transition-all duration-300 hover:text-glow-cyan dark:hover:text-dark-accentBlue hover:translate-x-1 transform"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="mt-10 md:mt-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold leading-6 text-readable-light dark:text-readable-dark mb-2">
                  <span className="text-glow-magenta dark:text-dark-accentMagenta">Empresa</span>
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href} 
                        className="text-sm leading-6 text-readable-light dark:text-readable-dark opacity-70 hover:opacity-100 transition-all duration-300 hover:text-glow-magenta dark:hover:text-dark-accentMagenta hover:translate-x-1 transform"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              className="md:grid md:grid-cols-1 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-sm font-semibold leading-6 text-readable-light dark:text-readable-dark mb-2">
                  <span className="text-glow-lime dark:text-dark-accentLime">Legal</span>
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href} 
                        className="text-sm leading-6 text-readable-light dark:text-readable-dark opacity-70 hover:opacity-100 transition-all duration-300 hover:text-glow-lime dark:hover:text-dark-accentLime hover:translate-x-1 transform"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="mt-16 border-t border-light-accentBlue/20 dark:border-dark-accentBlue/20 pt-8 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-xs leading-5 text-readable-light dark:text-readable-dark opacity-60 text-center">
            &copy; {new Date().getFullYear()} <span className="text-glow-cyan dark:text-dark-accentBlue">Advance App</span>. 
            Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}