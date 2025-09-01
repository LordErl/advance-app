import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils/format';

interface Expense {
  id: number;
  description: string;
  amount: number;
  expense_date: string;
  receipt_url: string | null;
}

interface ExpenseListProps {
  expenses: Expense[];
  showAddButton?: boolean;
  advanceId?: number;
}

export function ExpenseList({ expenses, showAddButton = false, advanceId }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma despesa encontrada.</p>
        {showAddButton && advanceId && (
          <div className="mt-4">
            <Link
              href={`/dashboard/expenses/new?advanceId=${advanceId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Adicionar Despesa
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Data
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Descrição
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              Valor
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDate(expense.expense_date)}
              </td>
              <td className="px-3 py-4 text-sm text-gray-900">
                <Link
                  href={`/dashboard/expenses/${expense.id}`}
                  className="text-primary-600 hover:text-primary-900"
                >
                  {expense.description}
                </Link>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                <span className="text-gray-900">{formatCurrency(expense.amount)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
