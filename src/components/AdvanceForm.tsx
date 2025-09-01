'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils/format';

interface AdvanceFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    amount_requested: string;
    purpose: string;
    start_date: string;
    end_date: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  initialData?: {
    title: string;
    description: string;
    amount_requested: string;
    purpose: string;
    start_date: string;
    end_date: string;
  };
  submitButtonText?: string;
}

export function AdvanceForm({
  onSubmit,
  loading,
  error,
  initialData,
  submitButtonText = 'Solicitar Adiantamento',
}: AdvanceFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    amount_requested: initialData?.amount_requested || '',
    purpose: initialData?.purpose || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      amount_requested: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const displayAmount = formData.amount_requested
    ? formatCurrency(Number(formData.amount_requested) / 100)
    : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título do Adiantamento
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            required
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Viagem para conferência em São Paulo"
          />
        </div>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Finalidade
        </label>
        <div className="mt-1">
          <select
            name="purpose"
            id="purpose"
            required
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.purpose}
            onChange={handleChange}
          >
            <option value="">Selecione uma finalidade</option>
            <option value="travel">Viagem</option>
            <option value="training">Treinamento</option>
            <option value="conference">Conferência/Evento</option>
            <option value="equipment">Equipamentos</option>
            <option value="supplies">Materiais</option>
            <option value="other">Outro</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="amount_requested" className="block text-sm font-medium text-gray-700">
          Valor Solicitado
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">R$</span>
          </div>
          <input
            type="text"
            name="amount_requested"
            id="amount_requested"
            required
            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
            value={displayAmount}
            onChange={handleAmountChange}
            onFocus={(e) => e.target.select()}
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="start_date"
              id="start_date"
              required
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={formData.start_date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
            Data de Fim
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="end_date"
              id="end_date"
              required
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={formData.end_date}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição Detalhada
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={4}
            required
            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva detalhadamente o motivo do adiantamento, itens necessários, etc."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Salvando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
