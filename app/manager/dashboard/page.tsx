'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/app/components/NotificationSystem';
import Modal from '@/components/ui/Modal';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import StatsCard from '@/components/ui/StatsCard';
import { formatCurrency } from '@/utils/format';
import { ClockIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Define a type for the advance data for better type safety
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

  // Derived stats for the dashboard cards
  const totalPendingCount = pendingApprovals.length;
  const totalPendingAmount = pendingApprovals.reduce((sum, advance) => sum + advance.amount, 0);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);

  const openRejectModal = (advance: Advance) => {
    setSelectedAdvance(advance);
    setIsRejectModalOpen(true);
    setRejectionReason(''); // Reset reason on open
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

      // Remove the approved advance from the list
      setPendingApprovals(current => current.filter(a => a.id !== advanceId));
      addNotification({ type: 'success', message: 'Adiantamento aprovado com sucesso!' });

    } catch (err: any) {
      addNotification({ type: 'error', message: err.message });
    }
  };

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/approvals/pending');
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

    fetchPendingApprovals();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard do Gestor</h1>
        <p className="text-gray-500 mt-1">Acompanhe e gerencie as solicitações do seu time.</p>
      </header>

      {/* Stats Cards Section */}
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
          value="--" // Placeholder for future implementation
          icon={<CheckCircleIcon className="w-8 h-8 text-blue-500" />}
          description="Recurso em desenvolvimento"
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Aprovações Pendentes</h2>
        
        {isLoading && <p className="text-gray-500">Carregando solicitações...</p>}
        {error && <p className="text-red-500">Erro: {error}</p>}
        
        {!isLoading && !error && (
          <div className="space-y-4">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((advance) => (
                <div key={advance.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{advance.profiles?.full_name || 'Usuário Desconhecido'}</p>
                    <p className="text-sm text-gray-600">{advance.purpose}</p>
                    <p className="text-lg font-bold text-blue-600">R$ {advance.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                                        <button 
                      onClick={() => handleApprove(advance.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Aprovar
                    </button>
                                        <button 
                      onClick={() => openRejectModal(advance)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma solicitação pendente no momento.</p>
            )}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {isRejectModalOpen && selectedAdvance && (
        <Modal 
          isOpen={isRejectModalOpen} 
          onClose={() => setIsRejectModalOpen(false)} 
          title="Rejeitar Solicitação"
        >
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
              <NeonButton variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
                Cancelar
              </NeonButton>
              <NeonButton variant="danger" onClick={handleReject}>
                Confirmar Rejeição
              </NeonButton>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
