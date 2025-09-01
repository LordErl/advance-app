'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { StatusBadge } from '@/components/StatusBadge';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText, Plus, TrendingDown, TrendingUp } from 'lucide-react';

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

type Expense = {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  created_at: string;
};

export default function AdvanceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [advance, setAdvance] = useState<Advance | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvanceDetails = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch advance details
        const { data: advanceData, error: advanceError } = await supabase
          .from('travel_advances')
          .select('*')
          .eq('id', id)
          .eq('employee_id', user.id)
          .single();

        if (advanceError) throw advanceError;

        // Fetch related expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('id, description, amount, expense_date, status, created_at')
          .eq('advance_id', id)
          .order('created_at', { ascending: false });

        if (expensesError) throw expensesError;

        setAdvance(advanceData);
        setExpenses(expensesData || []);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes do adiantamento');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvanceDetails();
  }, [id, user]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
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

  if (error || !advance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
            </Button>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || 'Adiantamento não encontrado'}
          </div>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const utilizationPercentage = advance.amount_approved
    ? Math.round((totalExpenses / advance.amount_approved) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
            </Button>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{advance.title}</h1>
              <div className="flex items-center mt-1">
                <StatusBadge status={advance.status} />
                <span className="ml-2 text-sm text-gray-500">
                  {getPurposeLabel(advance.purpose)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            {advance.status === 'pending' && (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/advances/${advance.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
            )}
            <Button
              onClick={() => router.push(`/dashboard/expenses/new?advance_id=${advance.id}`)}
            >
              <Plus className="h-4 w-4 mr-2" /> Nova Despesa
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Advance Overview Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">R$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Valor Solicitado
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(advance.amount_requested)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {advance.amount_approved && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(advance.status)}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Valor Aprovado
                      </dt>
                      <dd className={`text-lg font-medium ${getStatusColor(advance.status)}`}>
                        {formatCurrency(advance.amount_approved)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">$</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Saldo Disponível
                    </dt>
                    <dd className="text-lg font-medium text-green-600">
                      {formatCurrency(advance.remaining_amount)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">%</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Utilização
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {utilizationPercentage}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advance Details */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Detalhes do Adiantamento
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(advance.start_date)} - {formatDate(advance.end_date)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Finalidade
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {getPurposeLabel(advance.purpose)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </h4>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {advance.description}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(advance.created_at)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Última Atualização
                </h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(advance.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Despesas Relacionadas
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard/expenses?advance_id=${advance.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" /> Ver Todas
              </Button>
            </div>

            {expenses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-gray-900 font-medium mb-2">Nenhuma despesa registrada</h4>
                <p className="text-gray-500 mb-4">
                  Comece adicionando sua primeira despesa para este adiantamento.
                </p>
                <Button
                  onClick={() => router.push(`/dashboard/expenses/new?advance_id=${advance.id}`)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Despesa
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(expense.expense_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={expense.status} />
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/expenses/${expense.id}`)}
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}

                {expenses.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/dashboard/expenses?advance_id=${advance.id}`)}
                    >
                      Ver todas as {expenses.length} despesas
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
