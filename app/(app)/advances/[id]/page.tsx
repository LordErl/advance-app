'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Button } from '@/app/components/ui/Button';
import { Spinner } from '@/app/components/ui/Spinner';
import StatusBadge from '@/app/components/StatusBadge';
import { formatCurrency, formatDate } from '@/app/lib/utils/format';

interface Advance {
  id: string;
  title: string;
  description: string;
  amount_requested: number;
  purpose: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdvanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: advance, isLoading, error } = useQuery({
    queryKey: ['advance', id],
    queryFn: async () => {
      const { data } = await api.get(`/advances/${id}`);
      return data as Advance;
    },
  });

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
              Erro ao carregar detalhes do adiantamento
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{advance.title}</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Voltar
          </button>
          {advance.status === 'pending' && (
            <Button onClick={() => router.push(`/advances/${id}/edit`)}>Editar</Button>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Detalhes do Adiantamento
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criado em {formatDate(advance.created_at)}
            </p>
          </div>
          <StatusBadge status={advance.status} />
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Valor solicitado</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(advance.amount_requested)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Finalidade</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {advance.purpose}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {advance.description}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Período</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(advance.start_date)} até {formatDate(advance.end_date)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Seção de despesas relacionadas poderia ser adicionada aqui */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Despesas Relacionadas</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Despesas registradas para este adiantamento
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {/* Aqui poderia ser implementada uma lista de despesas */}
          <div className="text-center py-4 text-gray-500">
            Nenhuma despesa registrada para este adiantamento.
          </div>
          {advance.status === 'approved' && (
            <div className="mt-4">
              <Button onClick={() => router.push(`/expenses/new?advanceId=${id}`)}>
                Registrar Despesa
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}