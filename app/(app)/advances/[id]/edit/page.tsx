'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import AdvanceForm from '@/app/components/AdvanceForm';
import { Spinner } from '@/app/components/ui/Spinner';
import { useNotifications } from '@/app/components/NotificationSystem';

interface Advance {
  id: string;
  title: string;
  description: string;
  amount_requested: number;
  purpose: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function EditAdvancePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: advance, isLoading, error } = useQuery({
    queryKey: ['advance', id],
    queryFn: async () => {
      const { data } = await api.get(`/advances/${id}`);
      return data as Advance;
    },
  });

  const updateAdvanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.put(`/advances/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances'] });
      queryClient.invalidateQueries({ queryKey: ['advance', id] });
      addNotification({
        type: 'success',
        message: 'Adiantamento atualizado com sucesso!',
        duration: 5000,
      });
      router.push(`/advances/${id}`);
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao atualizar adiantamento',
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    updateAdvanceMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error || !advance) {
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
              Erro ao carregar dados do adiantamento
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se o adiantamento pode ser editado
  if (advance.status !== 'pending') {
    addNotification({
      type: 'error',
      message: 'Apenas adiantamentos pendentes podem ser editados',
      duration: 5000,
    });
    router.push(`/advances/${id}`);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Editar Adiantamento</h1>
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
          <AdvanceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialData={{
              title: advance.title,
              description: advance.description,
              amount_requested: advance.amount_requested,
              purpose: advance.purpose,
              start_date: advance.start_date,
              end_date: advance.end_date,
            }}
          />
        </div>
      </div>
    </div>
  );
}
