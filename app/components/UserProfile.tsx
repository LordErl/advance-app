'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/app/stores/authStore';
import { supabase } from '@/app/lib/supabase';
import { useNotifications } from '@/app/components/NotificationSystem';

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      addNotification({
        type: 'success',
        message: 'Logout realizado com sucesso',
        duration: 3000,
      });
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      addNotification({
        type: 'error',
        message: 'Erro ao fazer logout',
        duration: 5000,
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-3 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">{user.email}</span>
          <span className="text-xs text-gray-500">Usuário</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.email || 'Avatar do usuário'}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-medium text-gray-700">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            <p className="text-xs text-gray-500">
              {user.user_metadata?.name || 'Usuário'}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/profile');
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Meu Perfil
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/settings');
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Configurações
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
