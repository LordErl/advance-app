'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import DashboardStats from '@/components/ui/DashboardStats';

export default function DashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`
          text-4xl font-bold mb-2
          ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}
        `}>
          Dashboard
        </h1>
        <p className={`
          text-lg
          ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
        `}>
          Bem-vindo de volta! Aqui está um resumo da sua conta.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <DashboardStats />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-8">
          <h2 className={`
            text-2xl font-semibold mb-6
            ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
          `}>
            Próximas Ações
          </h2>
          <p className={`${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
            Esta área será usada para ações rápidas, como solicitar um novo adiantamento ou visualizar o extrato.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
