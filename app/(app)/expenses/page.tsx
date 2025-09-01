'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { Button } from '@/app/components/ui/Button';
import { Spinner } from '@/app/components/ui/Spinner';
import StatusBadge from '@/app/components/StatusBadge';
import { formatCurrency, formatDate } from '@/app/lib/utils/format';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  status: string;
  advance_id: string;
  created_at: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data } = await api.get('/expenses');
      return data as Expense[];
    },
  });

  const filteredExpenses = expenses?.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Despesas</h1>
        <Button onClick={() => router.push('/expenses/new')}>Nova Despesa</Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar despesas..."
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
            <div className="text-red-500 py-4">Erro ao carregar despesas.</div>
          ) : filteredExpenses?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma despesa encontrada.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredExpenses?.map((expense) => (
                <li key={expense.id}>
                  <button
                    onClick={() => router.push(`/expenses/${expense.id}`)}
                    className="block hover:bg-gray-50 w-full text-left py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {expense.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {expense.category} • {formatDate(expense.date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={expense.status} />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
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
