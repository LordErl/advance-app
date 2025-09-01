'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { AdvanceForm } from '@/components/AdvanceForm';
import { DashboardNav } from '@/components/DashboardNav';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewAdvancePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    amount_requested: string;
    purpose: string;
    start_date: string;
    end_date: string;
  }) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const amountRequested = parseFloat(data.amount_requested) / 100; // Convert from cents

      const { error: insertError } = await supabase
        .from('travel_advances')
        .insert({
          employee_id: user.id,
          title: data.title,
          description: data.description,
          amount_requested: amountRequested,
          remaining_amount: amountRequested, // Initially, remaining equals requested
          status: 'pending',
          purpose: data.purpose,
          start_date: data.start_date,
          end_date: data.end_date,
        });

      if (insertError) throw insertError;

      // Redirect to advances list
      router.push('/dashboard/advances');
    } catch (err: any) {
      console.error('Error creating advance:', err);
      setError(err.message || 'Erro ao solicitar adiantamento');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard/advances"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Adiantamentos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Solicitar Novo Adiantamento</h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os detalhes do seu pedido de adiantamento
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AdvanceForm
            onSubmit={handleSubmit}
            loading={submitting}
            error={error}
            submitButtonText={submitting ? 'Enviando...' : 'Solicitar Adiantamento'}
          />
        </div>
      </div>
    </div>
  );
}
