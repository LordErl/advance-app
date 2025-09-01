import { formatCurrency } from '@/lib/utils/format';

interface BalanceCardProps {
  title: string;
  amount: number;
  isPositive?: boolean;
  className?: string;
}

export function BalanceCard({ title, amount, isPositive = true, className = '' }: BalanceCardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd 
          className={`mt-1 text-3xl font-semibold ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatCurrency(amount)}
        </dd>
      </div>
    </div>
  );
}
