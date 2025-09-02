'use client';

import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';

// Mock data
const expenses = [
  { id: 1, description: 'Almoço Corporativo', date: '2024-09-28', amount: 75.50 },
  { id: 2, description: 'Transporte (Uber)', date: '2024-09-27', amount: 32.80 },
  { id: 3, description: 'Material de Escritório', date: '2024-09-26', amount: 120.00 },
  { id: 4, description: 'Café com Cliente', date: '2024-09-25', amount: 45.90 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function RecentExpensesList() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <GlassCard className="p-6 h-full">
      <h3 className={`text-xl font-semibold mb-4 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
        Despesas Recentes
      </h3>
      <div className="space-y-4">
        {expenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
                <ReceiptPercentIcon className={`w-6 h-6 ${isLight ? 'text-light-accentBlue' : 'text-dark-accentBlue'}`} />
              </div>
              <div>
                <p className={`font-medium ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{expense.description}</p>
                <p className={`text-sm ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
                  {new Date(expense.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <p className={`font-semibold ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
              {formatCurrency(expense.amount)}
            </p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
