'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Se um usuário com este e-mail existir, um link para redefinir a senha será enviado.');
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
              Recuperar Senha
            </h2>
            <p className={`text-center mb-8 ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
              Digite seu e-mail para receber o link de recuperação.
            </p>

            {message ? (
              <div className="text-green-500 text-sm text-center p-3 bg-green-500/10 rounded-md mb-6">
                {message}
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <NeonInput
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<AtSymbolIcon className="w-5 h-5" />}
                  variant="neon"
                  required
                />

                {error && (
                  <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-md">
                    {error}
                  </div>
                )}

                <NeonButton type="submit" fullWidth variant="primary" size="lg" disabled={isLoading}>
                  {isLoading ? 'Enviando...' : 'Enviar Link'}
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
