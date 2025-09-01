'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { ExpenseForm } from '@/components/ExpenseForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Expense = {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  receipt_url: string | null;
  receipt_filename: string | null;
  status: string;
  advance_id: number;
};

export default function EditExpensePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        
        setExpense(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar despesa');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpense();
  }, [id, user]);

  const handleSubmit = async (data: FormData) => {
    if (!expense || !user) {
      setError('Dados inválidos');
      return;
    }
    
    try {
      setUpdating(true);
      setError(null);
      
      const description = data.get('description') as string;
      const amount = parseFloat(data.get('amount') as string);
      const expenseDate = data.get('expense_date') as string;
      const receiptFile = data.get('receipt') as File;
      
      let receiptFilename = expense.receipt_filename;
      let receiptUrl = expense.receipt_url;
      
      // Handle receipt upload if new file provided
      if (receiptFile && receiptFile.size > 0) {
        // Delete old receipt if exists
        if (receiptFilename) {
          await supabase.storage.from('receipts').remove([receiptFilename]);
        }
        
        // Upload new receipt
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${user.id}/${expense.advance_id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile);
          
        if (uploadError) throw uploadError;
        
        receiptFilename = fileName;
        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
        receiptUrl = urlData.publicUrl;
      }
      
      // Update expense in database
      const { error: updateError } = await supabase
        .from('expenses')
        .update({
          description,
          amount,
          expense_date: expenseDate,
          receipt_filename: receiptFilename,
          receipt_url: receiptUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', expense.id);
        
      if (updateError) throw updateError;
      
      // Redirect to expense details
      router.push(`/dashboard/expenses/${id}`);
    } catch (err: any) {
      console.error('Error updating expense:', err);
      setError(err.message || 'Erro ao atualizar despesa');
    } finally {
      setUpdating(false);
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

  if (error && !expense) {
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
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold ml-4">Editar Despesa</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <ExpenseForm
          onSubmit={handleSubmit}
          isSubmitting={updating}
          initialData={{
            description: expense.description,
            amount: expense.amount.toString(),
            expense_date: expense.expense_date.split('T')[0],
            receipt_url: expense.receipt_url,
          }}
          submitButtonText={updating ? 'Atualizando...' : 'Atualizar Despesa'}
        />
      </div>
    </div>
  );
}
