'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { useToastHelpers } from '@/hooks/useToast';
import GlassCard from '@/components/ui/GlassCard';
import DashboardStats from '@/components/ui/DashboardStats';
import CreateAdvanceModal from '@/components/advances/CreateAdvanceModal';
import NeonButton from '@/components/ui/NeonButton';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import MyAdvancesList from '@/components/dashboard/MyAdvancesList';

interface Profile {
  is_manager: boolean;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { showSuccess } = useToastHelpers();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('is_manager')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erro ao buscar perfil:', error);
        } else {
          setProfile(profileData);
        }
      }
    };

    fetchProfile();
  }, []);

  // Função para ser chamada quando um adiantamento é criado com sucesso
  // No futuro, isso também irá acionar a atualização da lista de adiantamentos.
  const handleAdvanceCreated = () => {
    showSuccess('Sucesso', 'Adiantamento solicitado com sucesso!');
    // Lógica para recarregar os dados do dashboard viria aqui
  };

  return (
    <>
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
        {/* Seção de aprovações para gestores */}
        {profile?.is_manager && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PendingApprovals />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={`text-3xl font-bold mb-6 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}`}>
            Visão Geral
          </h1>

          <DashboardStats />
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <GlassCard className="p-6">
            <h2 className={`text-2xl font-semibold mb-4 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
              Próximas Ações
            </h2>
            <div className="flex items-center justify-center">
                <NeonButton 
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full md:w-auto"
                >
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Solicitar Novo Adiantamento
                </NeonButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* My Advances List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <MyAdvancesList />
        </motion.div>

      </div>

      {/* Modal para criar adiantamento */}
      <CreateAdvanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleAdvanceCreated}
      />
    </>
  );
}
