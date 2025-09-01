'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { DashboardNav } from '@/components/DashboardNav';
import { Button } from '@/components/ui/button';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

type UserSettings = {
  notifications: {
    email_notifications: boolean;
    advance_approvals: boolean;
    expense_approvals: boolean;
    weekly_reports: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt-BR' | 'en-US';
    currency: 'BRL' | 'USD';
  };
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email_notifications: true,
      advance_approvals: true,
      expense_approvals: true,
      weekly_reports: false,
    },
    preferences: {
      theme: 'system',
      language: 'pt-BR',
      currency: 'BRL',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);

        // For now, we'll use default settings
        // In a real app, you'd fetch these from a settings table
        setSettings(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            // You could load user preferences from profile metadata
          }
        }));

      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados do usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      // In a real app, you'd save these to a settings table
      // For now, we'll just show success message
      setSuccess('Configurações salvas com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const handleNotificationChange = (field: keyof UserSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handlePreferenceChange = (field: keyof UserSettings['preferences'], value: string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seu perfil e preferências do sistema
          </p>
        </div>

        {(error || success) && (
          <div className={`mb-6 p-4 rounded-md ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {error || success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Perfil do Usuário
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={profile?.full_name || ''}
                    onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
                    value={profile?.email || ''}
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Email não pode ser alterado</p>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Perfil'}
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <Bell className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Notificações
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Notificações por Email
                    </label>
                    <p className="text-sm text-gray-500">Receber notificações por email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email_notifications}
                    onChange={(e) => handleNotificationChange('email_notifications', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Aprovações de Adiantamentos
                    </label>
                    <p className="text-sm text-gray-500">Notificar sobre aprovações de adiantamentos</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.advance_approvals}
                    onChange={(e) => handleNotificationChange('advance_approvals', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Aprovações de Despesas
                    </label>
                    <p className="text-sm text-gray-500">Notificar sobre aprovações de despesas</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.expense_approvals}
                    onChange={(e) => handleNotificationChange('expense_approvals', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Relatórios Semanais
                    </label>
                    <p className="text-sm text-gray-500">Receber relatórios semanais por email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.weekly_reports}
                    onChange={(e) => handleNotificationChange('weekly_reports', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Notificações'}
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <Palette className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Preferências
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tema
                  </label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Idioma
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Moeda
                  </label>
                  <select
                    value={settings.preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="BRL">Real (BRL)</option>
                    <option value="USD">Dólar (USD)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Segurança
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Último acesso</h4>
                  <p className="text-sm text-gray-500">
                    {profile ? new Date(profile.updated_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900">Conta criada em</h4>
                  <p className="text-sm text-gray-500">
                    {profile ? new Date(profile.created_at).toLocaleString('pt-BR') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  Alterar Senha
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
