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
// Zod schema for form validation
const expenseSchema = z.object({
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  amount: z.number().positive('O valor deve ser positivo.'),
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
      // Verificar autenticação primeiro
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }
      console.log('Usuário autenticado:', user.email);

      const receiptFile = data.receipt[0];
      if (!receiptFile) {
        throw new Error('Arquivo de comprovante não encontrado.');
      }

      // Validar arquivo
      console.log('=== INFORMAÇÕES DO ARQUIVO ===');
      console.log('Nome:', receiptFile.name);
      console.log('Tamanho:', receiptFile.size, 'bytes');
      console.log('Tipo:', receiptFile.type);
      
      // Verificar tamanho (máximo 10MB)
      if (receiptFile.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo permitido: 10MB');
      }

      // Verificar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(receiptFile.type)) {
        throw new Error('Tipo de arquivo não permitido. Use: JPG, PNG ou PDF');
      }
      
      const filePath = `${user.id}/${advanceId}-${Date.now()}-${receiptFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      console.log('Caminho do arquivo:', filePath);
      
      console.log('=== CONVERTENDO ARQUIVO PARA BASE64 ===');
      
      // Converter arquivo para base64
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remover o prefixo data:type;base64,
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsDataURL(receiptFile);
      });
      
      console.log('Arquivo convertido para base64. Tamanho:', fileBase64.length, 'caracteres');
      
      // Preparar dados do arquivo para salvar no banco
      const receiptData = {
        filename: receiptFile.name,
        content_type: receiptFile.type,
        size: receiptFile.size,
        data: fileBase64
      };

      console.log('=== SALVANDO NO BANCO DE DADOS ===');
      
      // Inserir despesa com todos os campos obrigatórios
      const { error: insertError } = await supabase.from('expenses').insert({
        advance_id: advanceId,
        expense_date: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
        description: data.description,
        amount: data.amount,
        receipt_filename: receiptData.filename,
        receipt_content_type: receiptData.content_type,
        receipt_size: receiptData.size,
        receipt_data: receiptData.data,
        user_id: user.id,
      });
      
      if (!insertError) {
        console.log('✅ Despesa salva com sucesso!');
      }

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
        leftIcon={<ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />}
        {...register('description')}
        error={errors.description?.message}
        placeholder="Ex: Almoço com cliente"
      />
            <NeonInput
        label="Valor (R$)"
        type="number"
        leftIcon={<CurrencyDollarIcon className="w-5 h-5 text-gray-400" />}
        {...register('amount', { valueAsNumber: true })}
        error={errors.amount?.message}
        placeholder="50,00"
        step="0.01"
      />
            <NeonInput
        label="Comprovante"
        type="file"
        leftIcon={<PaperClipIcon className="w-5 h-5 text-gray-400" />}
        {...register('receipt')}
        error={errors.receipt?.message as string}
        accept="image/*,application/pdf"
      />
      <NeonButton type="submit" fullWidth loading={loading} disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Despesa'}
      </NeonButton>
    </form>
  );
};

export default ExpenseForm;
