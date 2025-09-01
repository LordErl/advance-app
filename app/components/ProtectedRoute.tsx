'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/app/stores/authStore';
import Spinner from '@/app/components/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simple check to verify authentication state is loaded from storage
    setIsChecking(false);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      // Armazenar a URL atual para redirecionar de volta após o login
      if (pathname !== '/login' && pathname !== '/register') {
        sessionStorage.setItem('redirectAfterLogin', pathname);
      }
      router.push('/login');
    }
  }, [isAuthenticated, isChecking, router, pathname]);

  // Mostrar spinner enquanto verifica autenticação
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se estiver autenticado, renderiza o conteúdo
  return isAuthenticated ? <>{children}</> : null;
}
