'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { useToastHelpers } from '@/hooks/useToast';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Updated interfaces for clarity and correctness
interface Profile {
  id: string;
  full_name: string;
  role: 'user' | 'approver' | 'admin';
  approval_limit: number | null;
}

interface AdvanceWithProfile {
  id: number;
  created_at: string;
  amount: number; // Standardized column name
  purpose: string;
  type: 'travel_expense' | 'daily_allowance';
  profiles: Profile | null; // To-one relationship
}

export default function PendingApprovals() {
  const [advances, setAdvances] = useState<AdvanceWithProfile[]>([]);
  const [approver, setApprover] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToastHelpers();

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Fetch user profile to check role and get approval limit
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'approver') {
        // Not an approver or profile not found, so don't show the component
        setApprover(null);
        setIsLoading(false);
        return;
      }

      setApprover(profileData as Profile);

      // Fetch advances assigned to this approver
      const { data: advancesData, error: advancesError } = await supabase
        .from('travel_advances')
        .select('*, profiles:user_id (*)') // Correctly join with profiles table
        .eq('status', 'pending_approval')
        .eq('assigned_approver_id', user.id)
        .order('created_at', { ascending: true });

      if (advancesError) {
        console.error('Error fetching assigned advances:', advancesError);
        showError('Erro', 'Não foi possível carregar as aprovações pendentes.');
      } else {
        setAdvances(advancesData as AdvanceWithProfile[]);
      }
      setIsLoading(false);
    };

    initialize();
  }, [showError]);

  const handleDecision = async (advance: AdvanceWithProfile, newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'approved' && approver?.approval_limit) {
      if (advance.amount > approver.approval_limit) {
        showError('Limite Excedido', `O valor (R$ ${advance.amount.toFixed(2)}) ultrapassa seu limite de aprovação (R$ ${approver.approval_limit.toFixed(2)}).`);
        return;
      }
    }

    const originalAdvances = [...advances];
    setAdvances(advances.filter(ad => ad.id !== advance.id));

    const { error } = await supabase
      .from('travel_advances')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', advance.id);

    if (error) {
      showError('Erro', `Não foi possível ${newStatus === 'approved' ? 'aprovar' : 'rejeitar'} a solicitação.`);
      setAdvances(originalAdvances);
    } else {
      showSuccess('Sucesso', `A solicitação foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'}.`);
    }
  };

  // Don't render anything if the user is not an approver or still loading
  if (isLoading || !approver) {
    return null;
  }

  if (advances.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-dark-textPrimary mb-2">Minhas Aprovações Pendentes</h3>
        <p className="text-dark-textSecondary">Você não tem nenhuma solicitação para aprovar no momento.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-semibold text-dark-textPrimary mb-4">Minhas Aprovações Pendentes</h3>
      <div className="space-y-4">
        {advances.map((advance) => (
          <div key={advance.id} className="bg-dark-cardBg/50 p-4 rounded-lg border border-dark-accentBlue/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-grow">
              <p className="font-bold text-white">{advance.profiles?.full_name || 'Solicitante desconhecido'}</p>
              <p className="text-lg text-sky-400 font-mono">R$ {advance.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">{advance.purpose}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block ${advance.type === 'daily_allowance' ? 'bg-yellow-800 text-yellow-200' : 'bg-purple-800 text-purple-200'}`}>
                {advance.type === 'daily_allowance' ? 'Diárias' : 'Despesas de Viagem'}
              </span>
            </div>
            <div className="flex gap-2 self-end md:self-center">
              <NeonButton variant="danger" size="sm" onClick={() => handleDecision(advance, 'rejected')}>
                <XMarkIcon className="w-5 h-5" />
              </NeonButton>
              <NeonButton variant="success" size="sm" onClick={() => handleDecision(advance, 'approved')}>
                <CheckIcon className="w-5 h-5" />
              </NeonButton>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
