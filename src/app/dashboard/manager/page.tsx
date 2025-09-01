'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { DashboardNav } from '@/components/DashboardNav';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle, Users, FileText } from 'lucide-react';

type PendingAdvance = {
  id: number;
  title: string;
  description: string;
  amount_requested: number;
  purpose: string;
  start_date: string;
  end_date: string;
  created_at: string;
  employee_name: string;
  employee_email: string;
};

type PendingExpense = {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  created_at: string;
  advance_title: string;
  employee_name: string;
  employee_email: string;
  receipt_url: string | null;
};

type ApprovalStats = {
  pendingAdvances: number;
  pendingExpenses: number;
  totalPendingAmount: number;
};

export default function ManagerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [pendingAdvances, setPendingAdvances] = useState<PendingAdvance[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<PendingExpense[]>([]);
  const [stats, setStats] = useState<ApprovalStats>({
    pendingAdvances: 0,
    pendingExpenses: 0,
    totalPendingAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingItems();
  }, [user]);

  const fetchPendingItems = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch pending advances
      const { data: advances, error: advancesError } = await supabase
        .from('travel_advances')
        .select(`
          *,
          profiles!travel_advances_employee_id_fkey (
            full_name,
            email
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (advancesError) throw advancesError;

      // Fetch pending expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          *,
          travel_advances!inner (
            title,
            profiles!travel_advances_employee_id_fkey (
              full_name,
              email
            )
          )
        `)
        .eq('expenses.status', 'pending')
        .order('expenses.created_at', { ascending: false });

      if (expensesError) throw expensesError;

      // Format data
      const formattedAdvances = advances.map((advance: any) => ({
        id: advance.id,
        title: advance.title,
        description: advance.description,
        amount_requested: advance.amount_requested,
        purpose: advance.purpose,
        start_date: advance.start_date,
        end_date: advance.end_date,
        created_at: advance.created_at,
        employee_name: advance.profiles?.full_name || 'N/A',
        employee_email: advance.profiles?.email || 'N/A',
      }));

      const formattedExpenses = expenses.map((expense: any) => ({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        expense_date: expense.expense_date,
        created_at: expense.created_at,
        advance_title: expense.travel_advances.title,
        employee_name: expense.travel_advances.profiles?.full_name || 'N/A',
        employee_email: expense.travel_advances.profiles?.email || 'N/A',
        receipt_url: expense.receipt_url,
      }));

      const totalPendingAmount = formattedAdvances.reduce((sum, a) => sum + a.amount_requested, 0) +
                               formattedExpenses.reduce((sum, e) => sum + e.amount, 0);

      setPendingAdvances(formattedAdvances);
      setPendingExpenses(formattedExpenses);
      setStats({
        pendingAdvances: formattedAdvances.length,
        pendingExpenses: formattedExpenses.length,
        totalPendingAmount,
      });

    } catch (err: any) {
      setError(err.message || 'Erro ao carregar itens pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAdvance = async (advanceId: number, approvedAmount: number) => {
    try {
      setApproving(`advance-${advanceId}`);

      const { error } = await supabase
        .from('travel_advances')
        .update({
          status: 'approved',
          amount_approved: approvedAmount,
          remaining_amount: approvedAmount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', advanceId);

      if (error) throw error;

      await fetchPendingItems();
    } catch (err: any) {
      setError('Erro ao aprovar adiantamento');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectAdvance = async (advanceId: number) => {
    try {
      setApproving(`advance-${advanceId}`);

      const { error } = await supabase
        .from('travel_advances')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', advanceId);

      if (error) throw error;

      await fetchPendingItems();
    } catch (err: any) {
      setError('Erro ao rejeitar adiantamento');
    } finally {
      setApproving(null);
    }
  };

  const handleApproveExpense = async (expenseId: number) => {
    try {
      setApproving(`expense-${expenseId}`);

      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', expenseId);

      if (error) throw error;

      await fetchPendingItems();
    } catch (err: any) {
      setError('Erro ao aprovar despesa');
    } finally {
      setApproving(null);
    }
  };

  const handleRejectExpense = async (expenseId: number) => {
    try {
      setApproving(`expense-${expenseId}`);

      const { error } = await supabase
        .from('expenses')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
        })
        .eq('id', expenseId);

      if (error) throw error;

      await fetchPendingItems();
    } catch (err: any) {
      setError('Erro ao rejeitar despesa');
    } finally {
      setApproving(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Gestor</h1>
          <p className="mt-1 text-sm text-gray-500">
            Aprove solicitações de adiantamentos e despesas
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Adiantamentos Pendentes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingAdvances}
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
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Despesas Pendentes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendingExpenses}
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
                  <AlertTriangle className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Valor Total Pendente
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.totalPendingAmount)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Advances */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Adiantamentos Pendentes de Aprovação
            </h3>

            {pendingAdvances.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum adiantamento pendente de aprovação
              </p>
            ) : (
              <div className="space-y-4">
                {pendingAdvances.map((advance) => (
                  <div key={advance.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {advance.title}
                          </h4>
                          <StatusBadge status="pending" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Solicitante</p>
                            <p className="text-sm font-medium">{advance.employee_name}</p>
                            <p className="text-xs text-gray-400">{advance.employee_email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Período</p>
                            <p className="text-sm font-medium">
                              {formatDate(advance.start_date)} - {formatDate(advance.end_date)}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {advance.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency(advance.amount_requested)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Solicitado em {formatDate(advance.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/advances/${advance.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                      </Button>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectAdvance(advance.id)}
                          disabled={approving === `advance-${advance.id}`}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {approving === `advance-${advance.id}` ? 'Rejeitando...' : 'Rejeitar'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveAdvance(advance.id, advance.amount_requested)}
                          disabled={approving === `advance-${advance.id}`}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {approving === `advance-${advance.id}` ? 'Aprovando...' : 'Aprovar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Expenses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Despesas Pendentes de Aprovação
            </h3>

            {pendingExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma despesa pendente de aprovação
              </p>
            ) : (
              <div className="space-y-4">
                {pendingExpenses.map((expense) => (
                  <div key={expense.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">
                            {expense.description}
                          </h4>
                          <StatusBadge status="pending" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Funcionário</p>
                            <p className="text-sm font-medium">{expense.employee_name}</p>
                            <p className="text-xs text-gray-400">{expense.employee_email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Adiantamento</p>
                            <p className="text-sm font-medium">{expense.advance_title}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(expense.expense_date)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/expenses/${expense.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                        </Button>
                        {expense.receipt_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(expense.receipt_url!, '_blank')}
                          >
                            <FileText className="h-4 w-4 mr-2" /> Ver Recibo
                          </Button>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectExpense(expense.id)}
                          disabled={approving === `expense-${expense.id}`}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {approving === `expense-${expense.id}` ? 'Rejeitando...' : 'Rejeitar'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveExpense(expense.id)}
                          disabled={approving === `expense-${expense.id}`}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {approving === `expense-${expense.id}` ? 'Aprovando...' : 'Aprovar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
