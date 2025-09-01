// app/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '@/app/stores/authStore';

// Cria uma instância do axios com configurações padrão
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Limpa a autenticação e redireciona para login
      useAuthStore.getState().clearAuth();
      
      // Se estamos no navegador, redireciona para a página de login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };

// Função auxiliar para fazer requisições com tratamento de erro
export const apiRequest = async <T>(method: 'get' | 'post' | 'put' | 'delete' | 'patch', url: string, data?: any): Promise<{ data?: T; error?: Error }> => {
  try {
    let response;
    
    switch (method) {
      case 'get':
        response = await api.get<T>(url);
        break;
      case 'post':
        response = await api.post<T>(url, data);
        break;
      case 'put':
        response = await api.put<T>(url, data);
        break;
      case 'delete':
        response = await api.delete<T>(url);
        break;
      case 'patch':
        response = await api.patch<T>(url, data);
        break;
      default:
        throw new Error(`Método HTTP não suportado: ${method}`);
    }
    
    return { data: response.data };
  } catch (error) {
    console.error(`Erro na requisição ${method.toUpperCase()} ${url}:`, error);
    return { error: error as Error };
  }
};
