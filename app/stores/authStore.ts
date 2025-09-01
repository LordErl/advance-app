import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // nome usado para armazenar no localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook para verificar se o usuário está autenticado
 * @returns Booleano indicando se o usuário está autenticado
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

/**
 * Hook para obter o token de autenticação
 * @returns Token de autenticação ou null se não estiver autenticado
 */
export function useAuthToken(): string | null {
  return useAuthStore((state) => state.token);
}

/**
 * Hook para obter o usuário atual
 * @returns Objeto do usuário ou null se não estiver autenticado
 */
export function useCurrentUser(): User | null {
  return useAuthStore((state) => state.user);
}
