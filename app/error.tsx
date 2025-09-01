'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar o erro em um serviço de monitoramento
    console.error('Erro na aplicação:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-red-600">Oops!</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Algo deu errado</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 rounded-md text-left">
              <p className="text-sm font-medium text-red-800">Detalhes do erro (apenas em desenvolvimento):</p>
              <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-40">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={reset} variant="default">
            Tentar novamente
          </Button>
          <Link href="/" passHref>
            <Button variant="outline">Voltar para o início</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
