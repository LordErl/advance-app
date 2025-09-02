'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';

interface CreateAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para atualizar a lista de adiantamentos no dashboard
}

export default function CreateAdvanceModal({ isOpen, onClose, onSuccess }: CreateAdvanceModalProps) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obter o usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado.');
      }

      // 2. Preparar os dados para inserção
      const newAdvance = {
        employee_id: user.id,
        amount_requested: parseFloat(amount),
        purpose: purpose,
        status: 'pending_approval',
      };

      // 3. Inserir no banco de dados
      const { error: insertError } = await supabase.from('travel_advances').insert(newAdvance);

      if (insertError) {
        throw insertError;
      }

      // 4. Sucesso
      onSuccess(); // Avisa o componente pai para atualizar os dados
      onClose();   // Fecha o modal
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar o adiantamento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Solicitar Novo Adiantamento">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <NeonInput
              label="Valor Solicitado (R$)"
              type="number"
              placeholder="Ex: 500.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <NeonInput
              label="Motivo do Adiantamento"
              as="textarea"
              placeholder="Descreva o motivo da viagem ou da solicitação"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="mt-4 text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
              {error}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <NeonButton type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </NeonButton>
          <NeonButton type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Solicitar'}
          </NeonButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}
