'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { AdvanceForm } from '@/components/AdvanceForm';
import { DashboardNav } from '@/components/DashboardNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Advance = {
  id: number;
  title: string;
  description: string;
  amount_requested: number;
  purpose: string;
  start_date: string;
  end_date: string;
  status: string;
};

export default function EditAdvancePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [advance, setAdvance] = useState<Advance | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvance = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const { data, error: fetchError } = await supabase
          .from('travel_advances')
          .select('*')
          .eq('id', id)
          .eq('employee_id', user.id)
          .single();

        if (fetchError) throw fetchError;

        if (data.status !== 'pending') {
          throw new Error('Este adiantamento não pode mais ser editado');
        }

        setAdvance(data);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar adiantamento');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvance();
  }, [id, user]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    amount_requested: string;
    purpose: string;
    start_date: string;
    end_date: string;
  }) => {
    if (!advance || !user) {
      setError('Dados inválidos');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const amountRequested = parseFloat(data.amount_requested) / 100; // Convert from cents

      const { error: updateError } = await supabase
        .from('travel_advances')
        .update({
          title: data.title,
          description: data.description,
          amount_requested: amountRequested,
          remaining_amount: amountRequested, // Reset remaining amount when updating
          purpose: data.purpose,
          start_date: data.start_date,
          end_date: data.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', advance.id);

      if (updateError) throw updateError;

      // Redirect to advance details
      router.push(`/dashboard/advances/${advance.id}`);
    } catch (err: any) {
      console.error('Error updating advance:', err);
      setError(err.message || 'Erro ao atualizar adiantamento');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error && !advance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/dashboard/advances"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para Adiantamentos
            </Link>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!advance) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              href="/dashboard/advances"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para Adiantamentos
            </Link>
          </div>
          <div className="text-center">Adiantamento não encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/dashboard/advances/${advance.id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Detalhes
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Editar Adiantamento</h1>
          <p className="mt-1 text-sm text-gray-500">
            Atualize as informações do seu pedido de adiantamento
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <AdvanceForm
            onSubmit={handleSubmit}
            loading={updating}
            error={null}
            initialData={{
              title: advance.title,
              description: advance.description,
              amount_requested: (advance.amount_requested * 100).toString(), // Convert to cents for form
              purpose: advance.purpose,
              start_date: advance.start_date.split('T')[0],
              end_date: advance.end_date.split('T')[0],
            }}
            submitButtonText={updating ? 'Atualizando...' : 'Atualizar Adiantamento'}
          />
        </div>
      </div>
    </div>
  );
}
