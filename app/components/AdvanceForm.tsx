'use client';

import { useState } from 'react';
import { formatCurrency } from '@/app/lib/utils/format';

interface AdvanceFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    amount_requested: string;
    purpose: string;
    start_date: string;
    end_date: string;
  }) => void;
  initialData?: {
    title?: string;
    description?: string;
    amount_requested?: number;
    purpose?: string;
    start_date?: string;
    end_date?: string;
  };
  isSubmitting?: boolean;
}

export default function AdvanceForm({ onSubmit, initialData = {}, isSubmitting = false }: AdvanceFormProps) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [amount, setAmount] = useState(
    initialData.amount_requested ? formatCurrency(initialData.amount_requested, false) : ''
  );
  const [purpose, setPurpose] = useState(initialData.purpose || '');
  const [startDate, setStartDate] = useState(initialData.start_date || '');
  const [endDate, setEndDate] = useState(initialData.end_date || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!amount.trim()) newErrors.amount = 'Valor é obrigatório';
    if (!purpose.trim()) newErrors.purpose = 'Finalidade é obrigatória';
    if (!startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (!endDate) newErrors.endDate = 'Data de término é obrigatória';
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'Data de término deve ser posterior à data de início';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Converte o valor para número removendo formatação
      const numericAmount = amount.replace(/\D/g, '');
      const amountAsNumber = parseFloat(numericAmount) / 100;
      
      onSubmit({
        title,
        description,
        amount_requested: amountAsNumber.toString(),
        purpose,
        start_date: startDate,
        end_date: endDate,
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
          Valor Solicitado
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
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Finalidade
        </label>
        <select
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className={`mt-1 block w-full rounded-md border ${
            errors.purpose ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
        >
          <option value="">Selecione uma finalidade</option>
          <option value="business_trip">Viagem a Negócios</option>
          <option value="training">Treinamento</option>
          <option value="event">Evento</option>
          <option value="client_visit">Visita a Cliente</option>
          <option value="other">Outro</option>
        </select>
        {errors.purpose && <p className="mt-1 text-sm text-red-500">{errors.purpose}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <input
            type="date"
            id="start_date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            Data de Término
          </label>
          <input
            type="date"
            id="end_date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`mt-1 block w-full rounded-md border ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
        </div>
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
