import React from 'react';
import { getStatusColor, formatStatus } from '@/app/lib/utils/format';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusColor = getStatusColor(status);
  const formattedStatus = formatStatus(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor} ${className}`}
    >
      {formattedStatus}
    </span>
  );
}
