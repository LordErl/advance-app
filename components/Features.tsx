'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { motion } from 'framer-motion';
import { ChartBarIcon, ClockIcon, CurrencyDollarIcon, DocumentTextIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

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
  {
    title: 'Segurança em primeiro lugar',
    description: 'Seus dados protegidos com as mais avançadas tecnologias de segurança',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Documentação digital',
    description: 'Armazene e organize todos os comprovantes e documentos fiscais',
    icon: DocumentTextIcon,
  },
  {
    title: 'Análise preditiva',
    description: 'Antecipe tendências e otimize seu fluxo de caixa com IA',
    icon: LightBulbIcon,
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Features() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  
  return (
    <section id="funcionalidades" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className={`text-3xl font-bold ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Funcionalidades Poderosas
          </motion.h2>
          <motion.p 
            className="mt-4 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Tudo o que você precisa para uma gestão eficiente de adiantamentos
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`${isLight ? 'feature-card-light' : 'feature-card-dark'}`}
              variants={fadeIn}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${isLight ? 'bg-light-accentBlue bg-opacity-10' : 'bg-dark-accentBlue bg-opacity-20'}`}>
                <feature.icon className={`h-7 w-7 ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
