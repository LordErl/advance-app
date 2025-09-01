'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, Calendar, DollarSign } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

type FilterType = 'status' | 'date' | 'amount' | 'purpose' | 'search';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  type: 'advances' | 'expenses';
  className?: string;
}

export function AdvancedFilters({ onFiltersChange, type, className }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    purpose: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      purpose: '',
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  const statusOptions = type === 'advances'
    ? [
        { value: 'pending', label: 'Pendente' },
        { value: 'approved', label: 'Aprovado' },
        { value: 'rejected', label: 'Rejeitado' },
      ]
    : [
        { value: 'pending', label: 'Pendente' },
        { value: 'approved', label: 'Aprovado' },
        { value: 'rejected', label: 'Rejeitado' },
        { value: 'refunded', label: 'Reembolsado' },
      ];

  const purposeOptions = type === 'advances'
    ? [
        { value: 'travel', label: 'Viagem' },
        { value: 'training', label: 'Treinamento' },
        { value: 'conference', label: 'Conferência/Evento' },
        { value: 'equipment', label: 'Equipamentos' },
        { value: 'supplies', label: 'Materiais' },
        { value: 'other', label: 'Outro' },
      ]
    : [];

  return (
    <div className={className}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Search className="h-4 w-4 inline mr-1" />
                Buscar
              </label>
              <input
                type="text"
                placeholder={type === 'advances' ? 'Buscar adiantamentos...' : 'Buscar despesas...'}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Todos os status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Data Final
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Amount Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Valor Mínimo
              </label>
              <input
                type="number"
                placeholder="0,00"
                value={filters.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Amount Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Valor Máximo
              </label>
              <input
                type="number"
                placeholder="0,00"
                value={filters.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Purpose (only for advances) */}
            {type === 'advances' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Finalidade
                </label>
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Todas as finalidades</option>
                  {purposeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {activeFiltersCount > 0 && `${activeFiltersCount} filtro(s) ativo(s)`}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
