'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/app/components/NotificationSystem';
import Modal from '@/components/ui/Modal';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import StatsCard from '@/components/ui/StatsCard';
import GlassCard from '@/components/ui/GlassCard';
import { formatCurrency } from '@/app/lib/utils/format';
import { ClockIcon, BanknotesIcon, CheckCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface Advance {
  id: string;
  amount: number;
  purpose: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

export default function ManagerDashboard() {
  const [pendingApprovals, setPendingApprovals] = useState<Advance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);

  const totalPendingCount = pendingApprovals.length;
  const totalPendingAmount = pendingApprovals.reduce((sum, advance) => sum + advance.amount, 0);

  const fetchPendingApprovals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/approvals/pending', { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch pending approvals');
      }
      const data: Advance[] = await response.json();
      setPendingApprovals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const openRejectModal = (advance: Advance) => {
    setSelectedAdvance(advance);
    setIsRejectModalOpen(true);
    setRejectionReason('');
  };

  const handleReject = async () => {
    if (!selectedAdvance || !rejectionReason.trim()) {
      addNotification({ type: 'error', message: 'O motivo da rejeição é obrigatório.' });
      return;
    }

    try {
      const response = await fetch(`/api/approvals/${selectedAdvance.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao rejeitar a solicitação.');
      }

      setPendingApprovals(current => current.filter(a => a.id !== selectedAdvance.id));
      addNotification({ type: 'success', message: 'Adiantamento rejeitado com sucesso!' });

    } catch (err: any) {
      addNotification({ type: 'error', message: err.message });
    } finally {
      setIsRejectModalOpen(false);
      setSelectedAdvance(null);
      setRejectionReason('');
    }
  };

  const handleApprove = async (advanceId: string) => {
    try {
      const response = await fetch(`/api/approvals/${advanceId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao aprovar a solicitação.');
      }

      setPendingApprovals(current => current.filter(a => a.id !== advanceId));
      addNotification({ type: 'success', message: 'Adiantamento aprovado com sucesso!' });

    } catch (err: any) {
      addNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard do Gestor</h1>
        <p className="text-gray-500 mt-1">Acompanhe e gerencie as solicitações do seu time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="Solicitações Pendentes"
          value={totalPendingCount.toString()}
          icon={<ClockIcon className="w-8 h-8 text-yellow-500" />}
        />
        <StatsCard 
          title="Valor Total Pendente"
          value={formatCurrency(totalPendingAmount)}
          icon={<BanknotesIcon className="w-8 h-8 text-green-500" />}
        />
        <StatsCard 
          title="Aprovados este Mês"
          value="--"
          icon={<CheckCircleIcon className="w-8 h-8 text-blue-500" />}
          description="Recurso em desenvolvimento"
        />
      </div>

      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-dark-textPrimary text-glow mb-6">Aprovações Pendentes</h2>
        
        {isLoading && <p className="text-dark-textSecondary text-center py-8">Carregando solicitações...</p>}
        {error && <p className="text-red-400 text-center py-8">Erro: {error}</p>}
        
        {!isLoading && !error && (
          <div className="space-y-6">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((advance) => (
                <GlassCard key={advance.id} className="p-4 transition-all hover:scale-[1.02]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <UserCircleIcon className="w-10 h-10 text-dark-textSecondary" />
                      <div>
                        <p className="font-bold text-dark-textPrimary text-lg">{advance.profiles?.full_name || 'Usuário Desconhecido'}</p>
                        <p className="text-sm text-dark-textSecondary font-mono">{advance.purpose}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                      <div className="text-center sm:text-right font-bold text-xl text-glow-primary self-center pr-4">
                        {formatCurrency(advance.amount)}
                      </div>
                      <div className="flex justify-center items-center gap-2">
                        <NeonButton onClick={() => handleApprove(advance.id)} variant="success" size="sm">Aprovar</NeonButton>
                        <NeonButton onClick={() => openRejectModal(advance)} variant="danger" size="sm">Rejeitar</NeonButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-dark-textSecondary">Nenhuma solicitação pendente no momento.</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {isRejectModalOpen && selectedAdvance && (
        <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Rejeitar Solicitação">
          <div className="p-4">
            <p className="mb-4 text-gray-600">
              Você está prestes a rejeitar a solicitação de <strong className="text-gray-800">{selectedAdvance.profiles?.full_name}</strong>. Por favor, informe o motivo abaixo.
            </p>
            <NeonInput
              as="textarea"
              label="Motivo da Rejeição"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Valor acima do permitido, falta de justificativa, etc."
              required
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-3 mt-6">
              <NeonButton variant="ghost" onClick={() => setIsRejectModalOpen(false)}>Cancelar</NeonButton>
              <NeonButton variant="danger" onClick={handleReject}>Confirmar Rejeição</NeonButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
