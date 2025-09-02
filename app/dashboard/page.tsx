'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import DashboardStats from '@/components/ui/DashboardStats';
import AdvanceStatusCard from '@/components/dashboard/AdvanceStatusCard';
import RecentExpensesList from '@/components/dashboard/RecentExpensesList';

export default function DashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`text-3xl font-bold mb-6 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}`}>
          Visão Geral
        </h1>

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
