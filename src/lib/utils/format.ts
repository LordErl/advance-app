export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending_approval: 'Aguardando Aprovação',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    ongoing: 'Em Andamento',
    closing: 'Em Fechamento',
    closed: 'Finalizado',
  };

  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending_approval: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    ongoing: 'bg-blue-100 text-blue-800',
    closing: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
