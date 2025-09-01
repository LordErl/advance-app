// app/(app)/page.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner'; // Supondo que você criou este componente

// Função para buscar os dados do adiantamento
const fetchCurrentAdvance = async () => {
  // Este endpoint precisa ser criado na sua API Python
  const { data } = await api.get('/advances/current'); 
  return data;
};

export default function DashboardPage() {
  const { data: advance, isLoading, error } = useQuery({
    queryKey: ['currentAdvance'],
    queryFn: fetchCurrentAdvance,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar dados do adiantamento.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meu Dashboard</h1>
      {advance ? (
        // Supondo que você criou o componente AdvanceStatusCard
        // <AdvanceStatusCard advance={advance} />
        <div>Dados do adiantamento aqui</div>
      ) : (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="mb-4">Você não possui nenhum adiantamento ativo.</p>
          {/* <Button onClick={() => router.push('/advances/new')}>
            Solicitar Novo Adiantamento
          </Button> */}
        </div>
      )}
    </div>
  );
}
