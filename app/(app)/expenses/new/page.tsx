'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import ExpenseForm from '@/app/components/ExpenseForm';
import { useNotifications } from '@/app/components/NotificationSystem';

export default function NewExpensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const advanceId = searchParams.get('advanceId');
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createExpenseMutation = useMutation({
    mutationFn: async (data: any) => {
      // Se tiver um advanceId, associa a despesa ao adiantamento
      const expenseData = advanceId ? { ...data, advance_id: advanceId } : data;
      const response = await api.post('/expenses', expenseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      if (advanceId) {
        queryClient.invalidateQueries({ queryKey: ['advance', advanceId] });
      }
      addNotification({
        type: 'success',
        message: 'Despesa criada com sucesso!',
        duration: 5000,
      });
      router.push('/expenses');
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao criar despesa',
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    createExpenseMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Nova Despesa</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ExpenseForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            initialData={advanceId ? { advance_id: advanceId } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
