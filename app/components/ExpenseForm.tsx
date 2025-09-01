'use client';

import { useState } from 'react';
import { formatCurrency } from '@/app/lib/utils/format';

interface ExpenseFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    amount: string;
    category: string;
    date: string;
    receipt_url?: string;
  }) => void;
  initialData?: {
    title?: string;
    description?: string;
    amount?: number;
    category?: string;
    date?: string;
    receipt_url?: string;
  };
  isSubmitting?: boolean;
}

export default function ExpenseForm({ onSubmit, initialData = {}, isSubmitting = false }: ExpenseFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [amount, setAmount] = useState(
    initialData.amount ? formatCurrency(initialData.amount, false) : ''
  );
  const [category, setCategory] = useState(initialData.category || '');
  const [date, setDate] = useState(initialData.date || '');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState(initialData.receipt_url || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!amount.trim()) newErrors.amount = 'Valor é obrigatório';
    if (!category.trim()) newErrors.category = 'Categoria é obrigatória';
    if (!date) newErrors.date = 'Data é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converte o valor para número removendo formatação
      const numericAmount = amount.replace(/\D/g, '');
      const amountAsNumber = parseFloat(numericAmount) / 100;
      
      const finalReceiptUrl = receiptUrl;
      
      // Se tiver um novo arquivo de recibo, faria o upload aqui
      // e atualizaria a URL do recibo
      if (receiptFile) {
        // Simulação de upload - em um caso real, você faria o upload para um serviço como S3 ou Supabase Storage
        // finalReceiptUrl = await uploadReceipt(receiptFile);
        // Upload logic would go here
      }
      
      onSubmit({
        title,
        description,
        amount: amountAsNumber.toString(),
        category,
        date,
        receipt_url: finalReceiptUrl,
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove tudo que não for número
    const value = e.target.value.replace(/\D/g, '');
    
    // Converte para centavos e formata
    if (value) {
      const cents = parseInt(value, 10);
      setAmount(formatCurrency(cents / 100, false));
    } else {
      setAmount('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`mt-1 block w-full rounded-md border ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Valor
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className={`block w-full rounded-md border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
            placeholder="0,00"
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoria
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
        >
          <option value="">Selecione uma categoria</option>
          <option value="food">Alimentação</option>
          <option value="transport">Transporte</option>
          <option value="accommodation">Hospedagem</option>
          <option value="fuel">Combustível</option>
          <option value="other">Outro</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
        />
        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="receipt" className="block text-sm font-medium text-gray-700">
          Comprovante (opcional)
        </label>
        <input
          type="file"
          id="receipt"
          onChange={handleFileChange}
          accept="image/*,.pdf"
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {receiptUrl && !receiptFile && (
          <div className="mt-2">
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Ver comprovante atual
            </a>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </form>
  );
}
