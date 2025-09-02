'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import StatsCard from './StatsCard';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  className?: string;
}

export default function DashboardStats({ className = '' }: DashboardStatsProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Mock data - em uma aplicação real, estes dados viriam de uma API
  const statsData = [
    {
      title: 'Total em Adiantamentos',
      value: 'R$ 45.230,00',
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      trend: {
        value: 12.5,
        label: 'vs mês anterior',
        isPositive: true,
      },
      description: 'Valor total de adiantamentos ativos',
    },
    {
      title: 'Pendentes de Aprovação',
      value: '8',
      icon: <ClockIcon className="w-6 h-6" />,
      trend: {
        value: -5.2,
        label: 'vs semana anterior',
        isPositive: false,
      },
      description: 'Solicitações aguardando aprovação',
    },
    {
      title: 'Aprovados Este Mês',
      value: '24',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      trend: {
        value: 8.3,
        label: 'vs mês anterior',
        isPositive: true,
      },
      description: 'Adiantamentos aprovados em dezembro',
    },
    {
      title: 'Taxa de Aprovação',
      value: '94.2%',
      icon: <TrendingUpIcon className="w-6 h-6" />,
      trend: {
        value: 2.1,
        label: 'vs trimestre anterior',
        isPositive: true,
      },
      description: 'Percentual de aprovações',
    },
    {
      title: 'Tempo Médio Aprovação',
      value: '2.4 dias',
      icon: <ClockIcon className="w-6 h-6" />,
      trend: {
        value: -15.6,
        label: 'vs mês anterior',
        isPositive: true,
      },
      description: 'Tempo médio para aprovação',
    },
    {
      title: 'Alertas Ativos',
      value: '3',
      icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      trend: {
        value: 0,
        label: 'sem alteração',
      },
      description: 'Situações que requerem atenção',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            text-2xl font-bold mb-2
            ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
          `}
        >
          Dashboard Executivo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`
            ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
          `}
        >
          Visão geral dos adiantamentos e aprovações
        </motion.p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
              variant="neon"
              size="md"
              className="h-full"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            p-4 rounded-xl border-2 border-dashed transition-all duration-300
            ${isLight 
              ? 'border-light-accentBlue/30 hover:border-light-accentBlue/50 hover:bg-light-accentBlue/5' 
              : 'border-dark-accentBlue/30 hover:border-dark-accentBlue/50 hover:bg-dark-accentBlue/10'
            }
          `}
        >
          <div className="text-center">
            <CurrencyDollarIcon className={`
              w-8 h-8 mx-auto mb-2
              ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}
            `} />
            <h3 className={`
              font-semibold
              ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
            `}>
              Novo Adiantamento
            </h3>
            <p className={`
              text-sm mt-1
              ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
            `}>
              Solicitar novo adiantamento
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            p-4 rounded-xl border-2 border-dashed transition-all duration-300
            ${isLight 
              ? 'border-light-accentBlue/30 hover:border-light-accentBlue/50 hover:bg-light-accentBlue/5' 
              : 'border-dark-accentBlue/30 hover:border-dark-accentBlue/50 hover:bg-dark-accentBlue/10'
            }
          `}
        >
          <div className="text-center">
            <ClockIcon className={`
              w-8 h-8 mx-auto mb-2
              ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}
            `} />
            <h3 className={`
              font-semibold
              ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
            `}>
              Pendências
            </h3>
            <p className={`
              text-sm mt-1
              ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
            `}>
              Revisar aprovações pendentes
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            p-4 rounded-xl border-2 border-dashed transition-all duration-300
            ${isLight 
              ? 'border-light-accentBlue/30 hover:border-light-accentBlue/50 hover:bg-light-accentBlue/5' 
              : 'border-dark-accentBlue/30 hover:border-dark-accentBlue/50 hover:bg-dark-accentBlue/10'
            }
          `}
        >
          <div className="text-center">
            <TrendingUpIcon className={`
              w-8 h-8 mx-auto mb-2
              ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}
            `} />
            <h3 className={`
              font-semibold
              ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
            `}>
              Relatórios
            </h3>
            <p className={`
              text-sm mt-1
              ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
            `}>
              Ver relatórios detalhados
            </p>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
