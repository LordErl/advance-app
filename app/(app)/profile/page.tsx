'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { supabase } from '@/app/lib/supabase';
import { useNotifications } from '@/app/components/NotificationSystem';
import { Button } from '@/app/components/ui/Button';
import { Spinner } from '@/app/components/ui/Spinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: user?.user_metadata?.phone || '',
    department: user?.user_metadata?.department || '',
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
        },
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        addNotification({
          type: 'success',
          message: 'Perfil atualizado com sucesso!',
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      addNotification({
        type: 'error',
        message: error.message || 'Erro ao atualizar perfil',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  disabled
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                O email não pode ser alterado.
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Departamento
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-3"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Alterar Senha
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Para alterar sua senha, clique no botão abaixo e siga as instruções enviadas por email.
            </p>
          </div>
          <div className="mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const { error } = await supabase.auth.resetPasswordForEmail(user.email || '');
                  if (error) throw error;
                  addNotification({
                    type: 'success',
                    message: 'Email para redefinição de senha enviado com sucesso!',
                    duration: 5000,
                  });
                } catch (error: any) {
                  addNotification({
                    type: 'error',
                    message: error.message || 'Erro ao enviar email de redefinição de senha',
                    duration: 5000,
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              isLoading={isLoading}
            >
              Enviar Email de Redefinição de Senha
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
