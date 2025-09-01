/**
 * Utilitários para formatação de valores
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns String formatada como moeda
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
}

/**
 * Formata uma data para o formato brasileiro (DD/MM/YYYY)
 * @param dateString String de data no formato ISO ou objeto Date
 * @returns String formatada como data
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Formata uma data e hora para o formato brasileiro (DD/MM/YYYY HH:MM)
 * @param dateString String de data no formato ISO ou objeto Date
 * @returns String formatada como data e hora
 */
export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formata um status para exibição
 * @param status String de status
 * @returns String formatada do status
 */
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    in_progress: 'Em Andamento',
    under_review: 'Em Análise',
  };
  
  return statusMap[status.toLowerCase()] || status;
}

/**
 * Obtém a cor associada a um status
 * @param status String de status
 * @returns String com a classe de cor do Tailwind
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    completed: 'text-blue-600 bg-blue-100',
    cancelled: 'text-gray-600 bg-gray-100',
    in_progress: 'text-purple-600 bg-purple-100',
    under_review: 'text-orange-600 bg-orange-100',
  };
  
  return colorMap[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
}
