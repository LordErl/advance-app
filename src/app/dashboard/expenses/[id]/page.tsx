'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Trash2, Edit } from 'lucide-react';

type Expense = {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  receipt_url: string | null;
  receipt_filename: string | null;
  status: string;
  advance_id: number;
  created_at: string;
  updated_at: string;
};

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('expenses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Verify user permission
        const { data: advance } = await supabase
          .from('travel_advances')
          .select('employee_id')
          .eq('id', data.advance_id)
          .single();
          
        if (!advance || advance.employee_id !== user.id) {
          throw new Error('Acesso não autorizado');
        }
        
        if (data.receipt_filename) {
          const { data: urlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(data.receipt_filename);
          setReceiptUrl(urlData.publicUrl);
        }
        
        setExpense(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar despesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id, user]);

  const handleDelete = async () => {
    if (!expense || !confirm('Excluir despesa?')) return;
    
    try {
      setDeleting(true);
      
      if (expense.receipt_filename) {
        await supabase.storage.from('receipts').remove([expense.receipt_filename]);
      }
      
      const { error } = await supabase.from('expenses').delete().eq('id', expense.id);
      if (error) throw error;
      
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
      
      router.push(`/dashboard/advances/${expense.advance_id}`);
    } catch (err: any) {
      setError('Erro ao excluir');
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Recusado', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Reembolsado', color: 'bg-blue-100 text-blue-800' },
    };
    const config = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
          </Button>
        </div>
        <div className="text-center">Despesa não encontrada</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold ml-4">Detalhes da Despesa</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/expenses/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="h-4 w-4 mr-2" /> {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações da Despesa</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-gray-900">{expense.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">{formatCurrency(expense.amount)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <p className="mt-1 text-gray-900">{formatDate(expense.expense_date)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(expense.status)}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Recibo</h3>
            {receiptUrl ? (
              <div className="space-y-3">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Recibo anexado</p>
                  <Button variant="outline" onClick={() => window.open(receiptUrl, '_blank')}>
                    <Download className="h-4 w-4 mr-2" /> Visualizar/Download
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhum recibo anexado</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-500 space-y-1">
            <p>Criado em: {formatDate(expense.created_at)}</p>
            <p>Última atualização: {formatDate(expense.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
