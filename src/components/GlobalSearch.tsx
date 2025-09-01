'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, CreditCard, Users } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type SearchResult = {
  type: 'advance' | 'expense';
  id: number;
  title: string;
  description?: string;
  amount: number;
  status: string;
  date: string;
  advance_title?: string;
};

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { user } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  const searchItems = async (searchQuery: string) => {
    if (!user || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const searchTerm = `%${searchQuery}%`;

      // Search advances
      const { data: advances } = await supabase
        .from('travel_advances')
        .select('*')
        .eq('employee_id', user.id)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      // Search expenses
      const { data: expenses } = await supabase
        .from('expenses')
        .select(`
          *,
          travel_advances!inner (
            title
          )
        `)
        .eq('travel_advances.employee_id', user.id)
        .or(`description.ilike.${searchTerm}`)
        .limit(5);

      const advanceResults: SearchResult[] = (advances || []).map(advance => ({
        type: 'advance',
        id: advance.id,
        title: advance.title,
        description: advance.description,
        amount: advance.amount_requested,
        status: advance.status,
        date: advance.created_at,
      }));

      const expenseResults: SearchResult[] = (expenses || []).map((expense: any) => ({
        type: 'expense',
        id: expense.id,
        title: expense.description,
        amount: expense.amount,
        status: expense.status,
        date: expense.created_at,
        advance_title: expense.travel_advances.title,
      }));

      setResults([...advanceResults, ...expenseResults].slice(0, 8));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchItems(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'advance') {
      router.push(`/dashboard/advances/${result.id}`);
    } else {
      router.push(`/dashboard/expenses/${result.id}`);
    }
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      case 'refunded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      case 'pending':
        return 'Pendente';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar adiantamentos, despesas..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-96 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {loading && (
            <div className="px-4 py-2 text-gray-500">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                Buscando...
              </div>
            </div>
          )}

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-2 text-gray-500">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}

          {!loading && results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {result.type === 'advance' ? (
                      <CreditCard className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 ml-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(result.status)} bg-opacity-10`}>
                          {getStatusLabel(result.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {result.type === 'advance' ? 'Adiantamento' : `Despesa • ${result.advance_title}`}
                      </p>
                      <p className="text-sm font-medium text-gray-900 ml-2">
                        {formatCurrency(result.amount)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(result.date)}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {results.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Use ↑↓ para navegar, Enter para selecionar</span>
                <span>Esc para fechar</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
