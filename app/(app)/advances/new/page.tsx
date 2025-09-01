'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import AdvanceForm from '@/app/components/AdvanceForm';
import { useNotifications } from '@/app/components/NotificationSystem';

export default function NewAdvancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAdvanceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/advances', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advances'] });
      addNotification({
        type: 'success',
        message: 'Adiantamento criado com sucesso!',
        duration: 5000,
      });
      router.push('/advances');
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao criar adiantamento',
        duration: 5000,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    createAdvanceMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Novo Adiantamento</h1>
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
          <AdvanceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}