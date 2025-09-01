'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';

type TravelAdvance = {
  id: number;
  amount_requested: number;
  amount_approved: number | null;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [advance, setAdvance] = useState<TravelAdvance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentAdvance = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('travel_advances')
          .select('*')
          .eq('employee_id', user.id)
          .in('status', ['approved', 'ongoing'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        setAdvance(data);
      } catch (err: any) {
        console.error('Error fetching advance:', err);
        setError('Erro ao carregar adiantamento');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAdvance();
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Meu Adiantamento Atual</h3>
          
          {advance ? (
            <div className="mt-5">
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Valor Solicitado</p>
                    <p className="text-2xl font-semibold text-blue-900">
                      {formatCurrency(advance.amount_requested)}
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {advance.status === 'approved' ? 'Aprovado' : 'Em Andamento'}
                  </div>
                </div>
                
                {advance.amount_approved && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-blue-800">Valor Aprovado</p>
                    <p className="text-xl font-semibold text-blue-900">
                      {formatCurrency(advance.amount_approved)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <a
                  href="/dashboard/expenses/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Adicionar Despesa
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5 text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum adiantamento em andamento</p>
              <a
                href="/dashboard/advances/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Solicitar Adiantamento
              </a>
            </div>
          )}
        </div>
      </div>

      {advance && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Últimas Despesas</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-center text-gray-500">Nenhuma despesa registrada ainda.</p>
            <div className="mt-4 text-center">
              <a
                href="/dashboard/expenses"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Ver histórico completo de despesas
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
