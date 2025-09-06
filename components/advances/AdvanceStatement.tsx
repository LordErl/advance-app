'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { formatCurrency } from '@/app/lib/utils/format';
import { 
  BanknotesIcon, 
  ReceiptRefundIcon, 
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

interface Expense {
  id: number;
  expense_date: string;
  description: string;
  amount: number;
  receipt_filename: string;
  created_at: string;
}

interface AdvanceStatementProps {
  advanceId: number;
  advanceAmount: number;
  advancePurpose: string;
  status: string;
  onClose: () => void;
}

export default function AdvanceStatement({ 
  advanceId, 
  advanceAmount, 
  advancePurpose, 
  status,
  onClose 
}: AdvanceStatementProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [advanceId]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('advance_id', advanceId)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const balance = advanceAmount - totalExpenses;
  const isOverspent = balance < 0;
  const canClose = status === 'approved' && expenses.length > 0;

  const handleCloseAdvance = async () => {
    if (!canClose) return;
    
    setClosing(true);
    try {
      const { error } = await supabase
        .from('travel_advances')
        .update({ 
          status: 'closed',
          closing_balance: balance,
          closed_at: new Date().toISOString()
        })
        .eq('id', advanceId);

      if (error) throw error;
      
      // Atualizar status local e fechar modal
      onClose();
    } catch (error) {
      console.error('Erro ao fechar adiantamento:', error);
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Adiantamento */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white text-stroke-sm mb-2">
              Conta-Corrente do Adiantamento
            </h3>
            <p className="text-gray-300 text-stroke-sm">{advancePurpose}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {formatCurrency(advanceAmount)}
            </div>
            <div className="text-sm text-gray-300 text-stroke-sm">Valor Aprovado</div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <BanknotesIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300 text-stroke-sm">Valor Solicitado</span>
            </div>
            <div className="text-xl font-bold text-blue-400">
              {formatCurrency(advanceAmount)}
            </div>
          </div>

          <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <ReceiptRefundIcon className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-gray-300 text-stroke-sm">Total Gasto</span>
            </div>
            <div className="text-xl font-bold text-orange-400">
              {formatCurrency(totalExpenses)}
            </div>
          </div>

          <div className={`rounded-lg p-4 border ${
            isOverspent 
              ? 'bg-red-500/10 border-red-500/20' 
              : balance === 0 
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className={`w-5 h-5 ${
                isOverspent ? 'text-red-400' : balance === 0 ? 'text-green-400' : 'text-yellow-400'
              }`} />
              <span className="text-sm text-gray-300 text-stroke-sm">
                {isOverspent ? 'A Devolver' : balance === 0 ? 'Quitado' : 'Saldo Restante'}
              </span>
            </div>
            <div className={`text-xl font-bold ${
              isOverspent ? 'text-red-400' : balance === 0 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {formatCurrency(Math.abs(balance))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Lista de Despesas */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-dark-textPrimary mb-4 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          Despesas Lançadas ({expenses.length})
        </h4>

        {loading ? (
          <div className="text-center py-8 text-dark-textSecondary">
            Carregando despesas...
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8 text-dark-textSecondary">
            Nenhuma despesa lançada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-dark-cardBg/30 rounded-lg border border-dark-accentBlue/10">
                <div>
                  <div className="font-medium text-dark-textPrimary">
                    {expense.description}
                  </div>
                  <div className="text-sm text-dark-textSecondary flex items-center gap-4">
                    <span>📅 {new Date(expense.expense_date).toLocaleDateString('pt-BR')}</span>
                    {expense.receipt_filename && (
                      <span>📎 {expense.receipt_filename}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-400">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <NeonButton variant="secondary" onClick={onClose}>
          Voltar
        </NeonButton>
        
        {canClose && (
          <NeonButton 
            variant={isOverspent ? "danger" : "success"}
            loading={closing}
            onClick={handleCloseAdvance}
          >
            {closing ? 'Fechando...' : isOverspent ? 'Fechar (Devolver)' : 'Fechar Prestação'}
          </NeonButton>
        )}
      </div>
    </div>
  );
}
