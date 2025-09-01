'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useNotifications } from '@/app/components/NotificationSystem';
import { Button } from '@/app/components/ui/Button';

interface NotificationSettings {
  emailNotifications: boolean;
  advanceUpdates: boolean;
  expenseReminders: boolean;
  monthlyReports: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  // Recuperar configurações do localStorage ou usar padrões
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Erro ao carregar configurações de notificação:', e);
        }
      }
    }
    return {
      emailNotifications: true,
      advanceUpdates: true,
      expenseReminders: true,
      monthlyReports: false,
    };
  });

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appearanceSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Erro ao carregar configurações de aparência:', e);
        }
      }
    }
    return {
      theme: 'system',
      compactMode: false,
    };
  });

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => {
      const updated = { ...prev, [name]: checked };
      localStorage.setItem('notificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAppearanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setAppearanceSettings((prev) => {
      const updated = {
        ...prev,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      };
      localStorage.setItem('appearanceSettings', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simular uma chamada de API
    setTimeout(() => {
      setIsLoading(false);
      addNotification({
        type: 'success',
        message: 'Configurações salvas com sucesso!',
        duration: 3000,
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Notificações
          </h3>
          <div className="mt-5 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Notificações por email
                </label>
                <p className="text-gray-500">
                  Receba atualizações importantes por email.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="advanceUpdates"
                  name="advanceUpdates"
                  type="checkbox"
                  checked={notificationSettings.advanceUpdates}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="advanceUpdates" className="font-medium text-gray-700">
                  Atualizações de adiantamentos
                </label>
                <p className="text-gray-500">
                  Seja notificado quando houver mudanças nos seus adiantamentos.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="expenseReminders"
                  name="expenseReminders"
                  type="checkbox"
                  checked={notificationSettings.expenseReminders}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="expenseReminders" className="font-medium text-gray-700">
                  Lembretes de despesas
                </label>
                <p className="text-gray-500">
                  Receba lembretes para registrar suas despesas.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="monthlyReports"
                  name="monthlyReports"
                  type="checkbox"
                  checked={notificationSettings.monthlyReports}
                  onChange={handleNotificationChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="monthlyReports" className="font-medium text-gray-700">
                  Relatórios mensais
                </label>
                <p className="text-gray-500">
                  Receba um resumo mensal das suas atividades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Aparência
          </h3>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Tema
              </label>
              <select
                id="theme"
                name="theme"
                value={appearanceSettings.theme}
                onChange={handleAppearanceChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="compactMode"
                  name="compactMode"
                  type="checkbox"
                  checked={appearanceSettings.compactMode}
                  onChange={handleAppearanceChange}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="compactMode" className="font-medium text-gray-700">
                  Modo compacto
                </label>
                <p className="text-gray-500">
                  Reduz o espaçamento entre elementos para mostrar mais conteúdo.
                </p>
              </div>
            </div>
          </div>
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
        <Button onClick={handleSaveSettings} isLoading={isLoading}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
