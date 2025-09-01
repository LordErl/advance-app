'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { StatusBadge } from '@/components/StatusBadge';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, FileText } from 'lucide-react';

type Advance = {
  id: number;
  title: string;
  description: string;
  amount_requested: number;
  amount_approved: number | null;
  remaining_amount: number;
  status: string;
  purpose: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export default function AdvancesListPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [advances, setAdvances] = useState<Advance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvances = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('travel_advances')
          .select('*')
          .eq('employee_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setAdvances(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar adiantamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvances();
  }, [user]);

  const getPurposeLabel = (purpose: string) => {
    const purposeMap = {
      travel: 'Viagem',
      training: 'Treinamento',
      conference: 'Conferência/Evento',
      equipment: 'Equipamentos',
      supplies: 'Materiais',
      other: 'Outro',
    };
    return purposeMap[purpose as keyof typeof purposeMap] || purpose;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Adiantamentos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas solicitações de adiantamento
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/advances/new')}>
            <Plus className="h-4 w-4 mr-2" /> Novo Adiantamento
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {advances.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum adiantamento encontrado</h3>
            <p className="text-gray-500 mb-4">
              Você ainda não solicitou nenhum adiantamento.
            </p>
            <Button onClick={() => router.push('/dashboard/advances/new')}>
              <Plus className="h-4 w-4 mr-2" /> Solicitar Primeiro Adiantamento
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {advances.map((advance) => (
                <li key={advance.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {advance.title}
                            </h3>
                            <StatusBadge status={advance.status} />
                          </div>

                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className="truncate">{getPurposeLabel(advance.purpose)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatDate(advance.start_date)} - {formatDate(advance.end_date)}</span>
                          </div>

                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {advance.description}
                          </p>
                        </div>

                        <div className="flex-shrink-0 ml-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(advance.amount_requested)}
                            </div>
                            {advance.amount_approved && (
                              <div className="text-sm text-green-600">
                                Aprovado: {formatCurrency(advance.amount_approved)}
                              </div>
                            )}
                            <div className="text-sm text-blue-600">
                              Disponível: {formatCurrency(advance.remaining_amount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/advances/${advance.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {advance.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/advances/${advance.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/expenses?advance_id=${advance.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
