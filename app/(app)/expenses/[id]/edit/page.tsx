'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import ExpenseForm from '@/app/components/ExpenseForm';
import { Spinner } from '@/app/components/ui/Spinner';
import { useNotifications } from '@/app/components/NotificationSystem';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: string;
  advance_id: string | null;
  receipt_url: string | null;
  notes: string | null;
}

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: expense, isLoading, error } = useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const { data } = await api.get(`/expenses/${id}`);
      return data as Expense;
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/expenses/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expense', id] });
      if (expense?.advance_id) {
        queryClient.invalidateQueries({ queryKey: ['advance', expense.advance_id] });
      }
      addNotification({
        type: 'success',
        message: 'Despesa atualizada com sucesso!',
        duration: 5000,
      });
      router.push(`/expenses/${id}`);
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao atualizar despesa',
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    updateExpenseMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar dados da despesa
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se a despesa pode ser editada
  if (expense.status !== 'pending') {
    addNotification({
      type: 'error',
      message: 'Apenas despesas pendentes podem ser editadas',
      duration: 5000,
    });
    router.push(`/expenses/${id}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Editar Despesa</h1>
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
            initialData={{
              description: expense.description,
              amount: expense.amount,
              date: expense.date,
              category: expense.category,
              notes: expense.notes || '',
              advance_id: expense.advance_id || undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}
