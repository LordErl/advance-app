'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency, formatDate } from '@/app/lib/utils/format';
import { Spinner } from '@/app/components/ui/Spinner';
import { Button } from '@/app/components/ui/Button';
import { supabase } from '@/app/lib/supabase';
import { useAuthStore } from '@/app/stores/authStore';

// Tipos
interface Advance {
  id: string;
  title: string;
  amount: number;
  status: string;
  created_at: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
  advance_id?: string;
}

interface DashboardStats {
  totalAdvances: number;
  totalExpenses: number;
  pendingAdvances: number;
  pendingExpenses: number;
  totalAdvanceAmount: number;
  totalExpenseAmount: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalAdvances: 0,
    totalExpenses: 0,
    pendingAdvances: 0,
    pendingExpenses: 0,
    totalAdvanceAmount: 0,
    totalExpenseAmount: 0,
  });

  // Buscar adiantamentos recentes
  const {
    data: recentAdvances,
    isLoading: isLoadingAdvances,
    error: advancesError,
  } = useQuery({
    queryKey: ['recentAdvances'],
    queryFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('advances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Advance[];
    },
    enabled: !!user,
  });

  // Buscar despesas recentes
  const {
    data: recentExpenses,
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery({
    queryKey: ['recentExpenses'],
    queryFn: async () => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });

  // Calcular estatísticas
  useEffect(() => {
    if (recentAdvances && recentExpenses) {
      // Buscar todas as entradas para calcular estatísticas
      const fetchStats = async () => {
        if (!user) return;
        
        // Buscar todos os adiantamentos
        const { data: allAdvances, error: advError } = await supabase
          .from('advances')
          .select('*')
          .eq('user_id', user.id);
        
        // Buscar todas as despesas
        const { data: allExpenses, error: expError } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id);
        
        if (advError || expError || !allAdvances || !allExpenses) return;
        
        // Calcular estatísticas
        const pendingAdvances = allAdvances.filter(a => a.status === 'pending').length;
        const pendingExpenses = allExpenses.filter(e => e.status === 'pending').length;
        const totalAdvanceAmount = allAdvances.reduce((sum, adv) => sum + adv.amount, 0);
        const totalExpenseAmount = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        setStats({
          totalAdvances: allAdvances.length,
          totalExpenses: allExpenses.length,
          pendingAdvances,
          pendingExpenses,
          totalAdvanceAmount,
          totalExpenseAmount,
        });
      };
      
      fetchStats();
    }
  }, [recentAdvances, recentExpenses, user]);

  const isLoading = isLoadingAdvances || isLoadingExpenses;
  const hasError = advancesError || expensesError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">Erro ao carregar dados do dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total de Adiantamentos
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalAdvances}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm">
              <Link
                href="/advances"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total de Despesas
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalExpenses}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm">
              <Link
                href="/expenses"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Ver todas
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Valor Total em Adiantamentos
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalAdvanceAmount)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm">
              <span className="text-gray-500">
                {stats.pendingAdvances} pendentes
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Valor Total em Despesas
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatCurrency(stats.totalExpenseAmount)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-2">
            <div className="text-sm">
              <span className="text-gray-500">
                {stats.pendingExpenses} pendentes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Adiantamentos recentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Adiantamentos Recentes
              </h3>
              <Link href="/advances/new">
                <Button size="sm">Novo Adiantamento</Button>
              </Link>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6">
            {recentAdvances && recentAdvances.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentAdvances.map((advance) => (
                  <li key={advance.id} className="py-3">
                    <Link href={`/advances/${advance.id}`} className="block hover:bg-gray-50">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{advance.title}</p>
                        <p className="text-sm text-gray-500">{formatDate(advance.created_at)}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              advance.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : advance.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {advance.status === 'approved'
                              ? 'Aprovado'
                              : advance.status === 'rejected'
                              ? 'Rejeitado'
                              : 'Pendente'}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(advance.amount)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-4">Nenhum adiantamento encontrado.</p>
            )}
          </div>
        </div>

        {/* Despesas recentes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Despesas Recentes
              </h3>
              <Link href="/expenses/new">
                <Button size="sm">Nova Despesa</Button>
              </Link>
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6">
            {recentExpenses && recentExpenses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentExpenses.map((expense) => (
                  <li key={expense.id} className="py-3">
                    <Link href={`/expenses/${expense.id}`} className="block hover:bg-gray-50">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(expense.created_at)}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              expense.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : expense.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {expense.status === 'approved'
                              ? 'Aprovado'
                              : expense.status === 'rejected'
                              ? 'Rejeitado'
                              : 'Pendente'}
                          </span>
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-4">Nenhuma despesa encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
