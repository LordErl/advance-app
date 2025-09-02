'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { useToastHelpers } from '@/hooks/useToast';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import LoadingSpinner from '../ui/LoadingSpinner';
import Modal from '../ui/Modal';
import ExpenseForm from '../expenses/ExpenseForm';
import { TagIcon, CalendarIcon, BanknotesIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';

interface Advance {
  id: number;
  purpose: string;
  amount: number;
  status: 'pending_approval' | 'approved' | 'rejected' | 'completed';
  type: 'travel_expense' | 'daily_allowance';
  created_at: string;
}

const MyAdvancesList = () => {
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedAdvanceId, setSelectedAdvanceId] = useState<number | null>(null);
  const { showError } = useToastHelpers();

  const fetchAdvances = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError('Erro', 'Usuário não autenticado.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('travel_advances')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar adiantamentos:', error);
      showError('Erro', 'Não foi possível carregar seus adiantamentos.');
    } else {
      setAdvances(data as Advance[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvances();
  }, []);

  const handleOpenExpenseModal = (advanceId: number) => {
    setSelectedAdvanceId(advanceId);
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSuccess = () => {
    setIsExpenseModalOpen(false);
    setSelectedAdvanceId(null);
    // Optionally, refetch advances to update status, though not strictly necessary
    // fetchAdvances(); 
  };

  const statusStyles: Record<Advance['status'], string> = {
    pending_approval: 'bg-yellow-500/20 text-yellow-400',
    approved: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    completed: 'bg-blue-500/20 text-blue-400',
  };

  const typeLabels: Record<Advance['type'], string> = {
    travel_expense: 'Despesa de Viagem',
    daily_allowance: 'Ajuda de Custo',
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8"><LoadingSpinner /></div>;
  }

  return (
    <GlassCard className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-dark-textPrimary">Meus Adiantamentos</h2>
      {advances.length === 0 ? (
        <p className="text-dark-textSecondary">Você ainda não solicitou nenhum adiantamento.</p>
      ) : (
        <div className="space-y-4">
          {advances.map((advance) => (
            <div key={advance.id} className="bg-dark-bg/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-grow">
                <p className="font-bold text-lg text-dark-textPrimary">{advance.purpose}</p>
                <div className="flex items-center gap-4 text-sm text-dark-textSecondary mt-1">
                  <span className="flex items-center gap-1"><BanknotesIcon className="w-4 h-4" /> R$ {advance.amount.toFixed(2)}</span>
                  <span className="flex items-center gap-1"><TagIcon className="w-4 h-4" /> {typeLabels[advance.type]}</span>
                  <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> {new Date(advance.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full text-center ${statusStyles[advance.status]}`}>
                  {advance.status.replace('_', ' ').toUpperCase()}
                </span>
                {advance.type === 'travel_expense' && advance.status === 'approved' && (
                  <NeonButton size="sm" variant="secondary" onClick={() => handleOpenExpenseModal(advance.id)}>
                    <DocumentPlusIcon className="w-4 h-4 mr-1" />
                    Lançar Despesas
                  </NeonButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAdvanceId && (
        <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title="Registrar Nova Despesa">
          <ExpenseForm 
            advanceId={selectedAdvanceId} 
            onSuccess={handleExpenseSuccess} 
          />
        </Modal>
      )}
    </GlassCard>
  );
};

export default MyAdvancesList;
