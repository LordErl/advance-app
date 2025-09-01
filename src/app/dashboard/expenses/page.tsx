'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

type Expense = {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  advance_id: number;
  advance_title: string;
  created_at: string;
};

export default function ExpensesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advanceId, setAdvanceId] = useState<string | null>(null);

  useEffect(() => {
    const advanceParam = searchParams.get('advance_id');
    setAdvanceId(advanceParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        let query = supabase
          .from('expenses')
          .select(`
            *,
            travel_advances!inner (
              id,
              title,
              employee_id
            )
          `)
          .eq('travel_advances.employee_id', user.id)
          .order('created_at', { ascending: false });
          
        if (advanceId) {
          query = query.eq('advance_id', advanceId);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        const formattedData = data.map((expense: any) => ({
          ...expense,
          advance_title: expense.travel_advances.title,
        }));
        
        setExpenses(formattedData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar despesas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user, advanceId]);

  const handleDelete = async (expenseId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;
    
    try {
      const expense = expenses.find(e => e.id === expenseId);
      if (!expense) return;
      
      // Delete receipt if exists
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('receipt_filename')
        .eq('id', expenseId)
        .single();
        
      if (expenseData?.receipt_filename) {
        await supabase.storage
          .from('receipts')
          .remove([expenseData.receipt_filename]);
      }
      
      // Delete expense
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);
        
      if (error) throw error;
      
      // Update advance remaining amount
      const { data: advance } = await supabase
        .from('travel_advances')
        .select('remaining_amount')
        .eq('id', expense.advance_id)
        .single();
        
      if (advance) {
        await supabase
          .from('travel_advances')
          .update({
            remaining_amount: advance.remaining_amount + expense.amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', expense.advance_id);
      }
      
      // Refresh list
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err: any) {
      setError('Erro ao excluir despesa');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {advanceId ? 'Despesas do Adiantamento' : 'Todas as Despesas'}
          </h1>
          {advanceId && (
            <p className="text-gray-600 mt-1">
              Visualizando despesas de um adiantamento específico
            </p>
          )}
        </div>
        <Button onClick={() => router.push('/dashboard/expenses/new')}>
          <Plus className="h-4 w-4 mr-2" /> Nova Despesa
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma despesa encontrada</h3>
          <p className="text-gray-500 mb-4">
            {advanceId 
              ? 'Este adiantamento ainda não possui despesas registradas.'
              : 'Você ainda não registrou nenhuma despesa.'
            }
          </p>
          <Button onClick={() => router.push('/dashboard/expenses/new')}>
            <Plus className="h-4 w-4 mr-2" /> Registrar Primeira Despesa
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {!advanceId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adiantamento
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(expense.expense_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={expense.status} />
                    </td>
                    {!advanceId && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {expense.advance_title}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/expenses/${expense.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/expenses/${expense.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
