'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase/client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/app/components/NotificationSystem';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const router = useRouter();
  const { addNotification } = useNotifications();

  // Verificar se o token de redefinição é válido
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setIsTokenValid(false);
        addNotification({
          type: 'error',
          message: 'Link de redefinição inválido ou expirado.',
        });
      } else {
        setIsTokenValid(true);
      }
    };
    
    checkSession();
  }, [addNotification]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      addNotification({
        type: 'success',
        message: 'Senha redefinida com sucesso!',
      });
      
      // Redirecionar para a página de login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao redefinir senha. Tente novamente.',
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
            href="/login" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Voltar para o login
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-light tracking-tight text-gray-900">Advance<span className="font-bold text-blue-600">App</span></h1>
              <h2 className="mt-3 text-xl font-medium text-gray-700">Redefinir senha</h2>
            </div>
            
            {isTokenValid === null && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Verificando link de redefinição...</p>
              </div>
            )}
            
            {isTokenValid === false && (
              <div className="space-y-5">
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-800 text-center">
                    O link de redefinição de senha é inválido ou expirou.
                  </p>
                </div>
                
                <div className="text-center mt-4">
                  <Link 
                    href="/forgot-password" 
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Solicitar novo link
                  </Link>
                </div>
              </div>
            )}
            
            {isTokenValid === true && (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
                    required
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
                    required
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors mt-4"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redefinindo...
                    </>
                  ) : 'Redefinir senha'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} AdvanceApp. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
