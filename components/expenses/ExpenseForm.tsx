'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/app/lib/supabase/client';
import { useToastHelpers } from '@/hooks/useToast';
import NeonButton from '../ui/NeonButton';
import NeonInput from '../ui/NeonInput';
import { PaperClipIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Zod schema for form validation
// Zod schema for form validation
// Zod schema for form validation
// Zod schema for form validation
const expenseSchema = z.object({
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  amount: z.coerce.number().positive('O valor deve ser positivo.'),
  receipt: z.any().refine((file: FileList) => file?.[0], 'O comprovante é obrigatório.'),
});

type ExpenseFormInputs = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  advanceId: number;
  onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ advanceId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastHelpers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormInputs>({
    resolver: zodResolver(expenseSchema),
  });

  const onSubmit: SubmitHandler<ExpenseFormInputs> = async (data) => {
    setLoading(true);
    try {
      const receiptFile = data.receipt[0];
      if (!receiptFile) {
        throw new Error('Arquivo de comprovante não encontrado.');
      }

      // 1. Upload receipt to Supabase Storage
      const filePath = `${advanceId}-${Date.now()}-${receiptFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, receiptFile);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      if (!urlData) throw new Error('Não foi possível obter a URL do comprovante.');

      const finalReceiptUrl = urlData.publicUrl;

      // 3. Insert expense record into the database
      const { error: insertError } = await supabase.from('expenses').insert({
        advance_id: advanceId,
        description: data.description,
        amount: data.amount,
        receipt_url: finalReceiptUrl,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (insertError) throw insertError;

      showSuccess('Sucesso!', 'Sua despesa foi registrada.');
      reset();
      onSuccess();

    } catch (error: any) {
      console.error('Erro ao registrar despesa:', error);
      showError('Erro', error.message || 'Não foi possível registrar a despesa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <NeonInput
        label="Descrição da Despesa"
        icon={ChatBubbleLeftRightIcon}
        {...register('description')}
        error={errors.description?.message}
        placeholder="Ex: Almoço com cliente"
      />
      <NeonInput
        label="Valor (R$)"
        type="number"
        icon={CurrencyDollarIcon}
        {...register('amount')}
        error={errors.amount?.message}
        placeholder="50,00"
        step="0.01"
      />
      <NeonInput
        label="Comprovante"
        type="file"
        icon={PaperClipIcon}
        {...register('receipt')}
        error={errors.receipt?.message}
        accept="image/*,application/pdf"
      />
      <NeonButton type="submit" fullWidth loading={loading} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Despesa'}
      </NeonButton>
    </form>
  );
};

export default ExpenseForm;
