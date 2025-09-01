// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/app/stores/authStore';
import { apiRequest } from '@/app/lib/api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/app/components/NotificationSystem';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Autenticação com Supabase
      const { data, error } = await apiRequest<{token: string; user: any}>('post', '/auth/login', { email, password });
      
      if (error) throw error;
      
      if (data) {
        const { token, user } = data;
        setToken(token);
        setUser(user);
        
        addNotification({
          type: 'success',
          message: 'Login realizado com sucesso!'
        });
      }
      
      // Verifica se há uma URL de redirecionamento salva
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('E-mail ou senha inválidos. Tente novamente.');
      addNotification({
        type: 'error',
        message: 'Falha ao fazer login. Verifique suas credenciais.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar para a página inicial
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-light tracking-tight text-gray-900">Advance<span className="font-bold text-blue-600">App</span></h1>
              <h2 className="mt-3 text-xl font-medium text-gray-700">Acessar sua conta</h2>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
                  required
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
              
              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                  Esqueceu sua senha?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors mt-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : 'Entrar'}
              </button>
              
              <div className="text-center text-sm mt-6">
                <span className="text-gray-500">Não tem uma conta?</span>{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                  Registre-se
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} AdvanceApp. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
