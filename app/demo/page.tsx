'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import DashboardStats from '@/components/ui/DashboardStats';
import GlassCard from '@/components/ui/GlassCard';
import NeonButton from '@/components/ui/NeonButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ToastContainer } from '@/components/ui/Toast';
import { useToastHelpers } from '@/hooks/useToast';
import NeonInput from '@/components/ui/NeonInput';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useState } from 'react';
import { 
  SparklesIcon, 
  EyeIcon, 
  CogIcon,
  BellIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function DemoPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { toasts, showSuccess, showError, showWarning, showInfo } = useToastHelpers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleToastDemo = (type: string) => {
    switch (type) {
      case 'success':
        showSuccess('Sucesso!', 'Operação realizada com sucesso.');
        break;
      case 'error':
        showError('Erro!', 'Algo deu errado. Tente novamente.');
        break;
      case 'warning':
        showWarning('Atenção!', 'Verifique os dados antes de continuar.');
        break;
      case 'info':
        showInfo('Informação', 'Nova atualização disponível.');
        break;
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} position="top-right" />

      {/* Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Demonstração de Modal"
        size="md"
      >
        <ModalBody>
          <p className={`mb-4 ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
            Este é um exemplo de modal com glassmorphism e efeitos neon. 
            Você pode usar este componente para exibir formulários, confirmações ou qualquer conteúdo.
          </p>
          
          <NeonInput
            label="Campo de exemplo"
            placeholder="Digite algo aqui..."
            variant="neon"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </ModalBody>
        
        <ModalFooter>
          <NeonButton 
            variant="ghost" 
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </NeonButton>
          <NeonButton 
            variant="primary" 
            onClick={() => {
              showSuccess('Modal', 'Ação confirmada!');
              setIsModalOpen(false);
            }}
          >
            Confirmar
          </NeonButton>
        </ModalFooter>
      </Modal>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`
            text-4xl font-bold mb-4
            ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}
          `}>
            <SparklesIcon className="w-10 h-10 inline mr-3" />
            Demonstração de Componentes
          </h1>
          <p className={`
            text-lg
            ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
          `}>
            Explore os novos componentes modernos com glassmorphism e efeitos neon
          </p>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <DashboardStats />
        </motion.div>

        {/* Components Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Buttons Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard variant="glass" className="p-6">
              <h3 className={`
                text-xl font-semibold mb-4
                ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
              `}>
                Botões Neon
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <NeonButton variant="primary" size="sm">
                    Primário
                  </NeonButton>
                  <NeonButton variant="secondary" size="sm">
                    Secundário
                  </NeonButton>
                  <NeonButton variant="success" size="sm">
                    Sucesso
                  </NeonButton>
                  <NeonButton variant="warning" size="sm">
                    Aviso
                  </NeonButton>
                  <NeonButton variant="danger" size="sm">
                    Perigo
                  </NeonButton>
                  <NeonButton variant="ghost" size="sm">
                    Ghost
                  </NeonButton>
                </div>
                
                <div className="flex gap-3">
                  <NeonButton variant="primary" size="md" loading>
                    Carregando...
                  </NeonButton>
                  <NeonButton variant="primary" size="md" disabled>
                    Desabilitado
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Inputs Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard variant="glass" className="p-6">
              <h3 className={`
                text-xl font-semibold mb-4
                ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
              `}>
                Inputs Modernos
              </h3>
              
              <div className="space-y-4">
                <NeonInput
                  label="Input Padrão"
                  placeholder="Digite aqui..."
                  variant="default"
                />
                
                <NeonInput
                  label="Input Glass"
                  placeholder="Efeito glassmorphism..."
                  variant="glass"
                  leftIcon={<UserIcon className="w-5 h-5" />}
                />
                
                <NeonInput
                  label="Input Neon"
                  placeholder="Com efeitos neon..."
                  variant="neon"
                  rightIcon={<EyeIcon className="w-5 h-5" />}
                />
                
                <NeonInput
                  label="Senha"
                  type="password"
                  placeholder="Sua senha..."
                  variant="neon"
                />
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard variant="gradient" className="p-8">
            <h3 className={`
              text-2xl font-semibold mb-6 text-center
              ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
            `}>
              Demonstração Interativa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Loading Spinners */}
              <div className="text-center">
                <h4 className={`
                  font-medium mb-3
                  ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
                `}>
                  Loading Spinners
                </h4>
                <div className="flex justify-center space-x-3">
                  <LoadingSpinner variant="default" size="sm" />
                  <LoadingSpinner variant="neon" size="md" />
                  <LoadingSpinner variant="dots" size="lg" />
                  <LoadingSpinner variant="pulse" size="md" />
                </div>
              </div>

              {/* Toast Demos */}
              <div className="text-center">
                <h4 className={`
                  font-medium mb-3
                  ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
                `}>
                  Notificações
                </h4>
                <div className="space-y-2">
                  <NeonButton 
                    variant="success" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleToastDemo('success')}
                  >
                    Sucesso
                  </NeonButton>
                  <NeonButton 
                    variant="danger" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleToastDemo('error')}
                  >
                    Erro
                  </NeonButton>
                </div>
              </div>

              {/* Modal Demo */}
              <div className="text-center">
                <h4 className={`
                  font-medium mb-3
                  ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
                `}>
                  Modal
                </h4>
                <NeonButton 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => setIsModalOpen(true)}
                >
                  Abrir Modal
                </NeonButton>
              </div>

              {/* More Toasts */}
              <div className="text-center">
                <h4 className={`
                  font-medium mb-3
                  ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary'}
                `}>
                  Mais Toasts
                </h4>
                <div className="space-y-2">
                  <NeonButton 
                    variant="warning" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleToastDemo('warning')}
                  >
                    Aviso
                  </NeonButton>
                  <NeonButton 
                    variant="secondary" 
                    size="sm" 
                    fullWidth
                    onClick={() => handleToastDemo('info')}
                  >
                    Info
                  </NeonButton>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className={`
                ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}
              `}>
                Experimente os componentes acima para ver os efeitos em ação!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
