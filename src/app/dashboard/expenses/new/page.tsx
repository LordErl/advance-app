'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { ExpenseForm } from '@/components/ExpenseForm';

interface FormData {
  description: string;
  amount: string;
  expense_date: string;
  receipt: File | null;
}

export default function NewExpensePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Get the current advance for the user
      const { data: advance, error: advanceError } = await supabase
        .from('travel_advances')
        .select('id, status, remaining_amount')
        .eq('employee_id', user.id)
        .eq('status', 'active')
        .single();

      if (advanceError || !advance) {
        throw new Error('Nenhum adiantamento ativo encontrado');
      }

      // 2. Upload receipt if exists
      let receiptUrl = null;
      let receiptFilename = null;

      if (data.receipt) {
        const fileExt = data.receipt.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(filePath, data.receipt);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(filePath);

        receiptUrl = urlData.publicUrl;
        receiptFilename = fileName;
      }

      // 3. Create expense record
      const amountInCents = Math.round(parseFloat(data.amount) * 100);
      
      const { error: expenseError } = await supabase
        .from('expenses')
        .insert([
          {
            description: data.description,
            amount: amountInCents,
            expense_date: data.expense_date,
            receipt_url: receiptUrl,
            receipt_filename: receiptFilename,
            advance_id: advance.id,
            status: 'pending',
          },
        ]);

      if (expenseError) throw expenseError;

      // 4. Update remaining amount in advance
      const newRemainingAmount = advance.remaining_amount - amountInCents;
      const { error: updateError } = await supabase
        .from('travel_advances')
        .update({ remaining_amount: newRemainingAmount })
        .eq('id', advance.id);

      if (updateError) throw updateError;

      // 5. Redirect to the advance details
      router.push(`/dashboard/advances/${advance.id}`);
    } catch (err: any) {
      console.error('Error creating expense:', err);
      setError(err.message || 'Erro ao criar despesa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Adicionar Nova Despesa
            </h2>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ExpenseForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              error={error}
              submitButtonText="Adicionar Despesa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
