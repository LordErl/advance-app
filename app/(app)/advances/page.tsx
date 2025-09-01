'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Button } from '@/app/components/ui/Button';
import { Spinner } from '@/app/components/ui/Spinner';
import StatusBadge from '@/app/components/StatusBadge';
import { formatCurrency, formatDate } from '@/app/lib/utils/format';

interface Advance {
  id: string;
  title: string;
  amount_requested: number;
  status: string;
  created_at: string;
}

export default function AdvancesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: advances, isLoading, error } = useQuery({
    queryKey: ['advances'],
    queryFn: async () => {
      const { data } = await api.get('/advances');
      return data as Advance[];
    },
  });

  const filteredAdvances = advances?.filter((advance) =>
    advance.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Adiantamentos</h1>
        <Button onClick={() => router.push('/advances/new')}>Novo Adiantamento</Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar adiantamentos..."
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">Erro ao carregar adiantamentos.</div>
          ) : filteredAdvances?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum adiantamento encontrado.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredAdvances?.map((advance) => (
                <li key={advance.id}>
                  <button
                    onClick={() => router.push(`/advances/${advance.id}`)}
                    className="block hover:bg-gray-50 w-full text-left py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {advance.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Criado em {formatDate(advance.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={advance.status} />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(advance.amount_requested)}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
