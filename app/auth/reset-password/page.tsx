'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Sua senha foi redefinida com sucesso! Você será redirecionado para o login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl font-bold text-center mb-2 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}`}>
              Redefinir Senha
            </h2>
            <p className={`text-center mb-8 ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
              Digite sua nova senha.
            </p>

            {message ? (
              <div className="text-green-500 text-sm text-center p-3 bg-green-500/10 rounded-md mb-6">
                {message}
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <NeonInput
                  label="Nova Senha"
                  type="password"
                  placeholder="Sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<LockClosedIcon className="w-5 h-5" />}
                  variant="neon"
                  required
                />
                <NeonInput
                  label="Confirmar Nova Senha"
                  type="password"
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  leftIcon={<LockClosedIcon className="w-5 h-5" />}
                  variant="neon"
                  required
                />

                {error && (
                  <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
                    {error}
                  </div>
                )}

                <NeonButton type="submit" fullWidth variant="primary" size="lg" disabled={isLoading}>
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </NeonButton>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className={`text-sm ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'} hover:underline`}>
                Voltar para o Login
              </Link>
            </div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
