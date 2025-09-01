import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800 border-green-200' },
    rejected: { label: 'Recusado', color: 'bg-red-100 text-red-800 border-red-200' },
    refunded: { label: 'Reembolsado', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  };

  const config = statusMap[status as keyof typeof statusMap] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium border',
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
}
