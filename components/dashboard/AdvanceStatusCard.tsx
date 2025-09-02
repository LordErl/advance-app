'use client';

import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { motion } from 'framer-motion';
import { BanknotesIcon } from '@heroicons/react/24/outline';

// Mock data - replace with actual data fetching
const advanceStatus = {
  availableLimit: 2500.75,
  nextPaymentDate: '2024-10-05',
};

// Simple currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function AdvanceStatusCard() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <GlassCard className="p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
            Seu Limite Advance
          </h3>
          <BanknotesIcon className={`w-7 h-7 ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}`} />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-5xl font-bold mb-2 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow-strong'}`}
        >
          {formatCurrency(advanceStatus.availableLimit)}
        </motion.div>
        <p className={`text-sm ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
          Próximo vencimento em: {new Date(advanceStatus.nextPaymentDate).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <motion.div
        className="mt-6"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <NeonButton fullWidth size="lg" variant="primary">
          Solicitar Adiantamento
        </NeonButton>
      </motion.div>
    </GlassCard>
  );
}
