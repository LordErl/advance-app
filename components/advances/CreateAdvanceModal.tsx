'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, CurrencyDollarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const advanceTypes = [
  {
    name: 'Despesas de Viagem',
    value: 'travel_expense',
    description: 'Reembolsável mediante prestação de contas.',
    icon: BriefcaseIcon,
  },
  {
    name: 'Diárias',
    value: 'daily_allowance',
    description: 'Valor para custeio, não exige prestação de contas.',
    icon: CurrencyDollarIcon,
  },
];

interface CreateAdvanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Para atualizar a lista de adiantamentos no dashboard
}

export default function CreateAdvanceModal({ isOpen, onClose, onSuccess }: CreateAdvanceModalProps) {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [advanceType, setAdvanceType] = useState(advanceTypes[0].value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      // 2. Get user's profile to find their team. Fetch the first profile found.
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('team_id')
        .eq('id', user.id)
        .limit(1);

      const profile = profiles?.[0];

      if (profileError || !profile || !profile.team_id) {
        console.error('Profile error or not found:', profileError);
        throw new Error('Não foi possível encontrar o time do usuário. Contate o suporte.');
      }

      // 3. Find the approver for that team
      const { data: approverTeam, error: approverError } = await supabase
        .from('approver_teams')
        .select('approver_id')
        .eq('team_id', profile.team_id)
        .single(); // Assuming one approver per team for now

      if (approverError || !approverTeam) {
        throw new Error('Nenhum aprovador encontrado para o seu time. Contate o suporte.');
      }

      // 4. Prepare the new advance data with the assigned approver
      const newAdvance = {
        user_id: user.id, // Standardized column name
        amount: parseFloat(amount), // Standardized column name
        purpose: purpose,
        status: 'pending_approval',
        type: advanceType,
        assigned_approver_id: approverTeam.approver_id,
      };

      // 5. Insert into the database
      const { error: insertError } = await supabase.from('travel_advances').insert(newAdvance);

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw new Error('Falha ao registrar o adiantamento no banco de dados.');
      }

      // 6. Success
      onSuccess();
      onClose();
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
          <div className="space-y-6">
            <div>
              <RadioGroup value={advanceType} onChange={setAdvanceType}>
                <RadioGroup.Label className="text-sm font-medium text-gray-400 mb-2 block">Tipo de Adiantamento</RadioGroup.Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advanceTypes.map((type) => (
                    <RadioGroup.Option
                      key={type.name}
                      value={type.value}
                      className={({ active, checked }: { active: boolean; checked: boolean }) =>
                        `
                        ${checked ? 'bg-sky-900/70 border-sky-500 ring-2 ring-sky-500' : 'bg-gray-800/50 border-gray-700'}
                        relative flex cursor-pointer rounded-lg border p-4 shadow-md focus:outline-none transition-all duration-200 hover:bg-gray-700/50`
                      }
                    >
                      {({ active, checked }: { active: boolean; checked: boolean }) => (
                        <>
                          <div className="flex w-full items-start justify-between">
                            <div className="flex items-center">
                              <type.icon className={`w-8 h-8 mr-4 ${checked ? 'text-sky-400' : 'text-gray-400'}`} />
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${checked ? 'text-white' : 'text-gray-300'}`}
                                >
                                  {type.name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={`inline ${checked ? 'text-sky-100' : 'text-gray-400'}`}
                                >
                                  {type.description}
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked && (
                              <div className="shrink-0 text-white">
                                <CheckCircleIcon className="h-6 w-6 text-sky-400" />
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

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
              rows={4}
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
