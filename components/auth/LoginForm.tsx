'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import GlassCard from '@/components/ui/GlassCard';
import NeonInput from '@/components/ui/NeonInput';
import NeonButton from '@/components/ui/NeonButton';
import { AtSymbolIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log({ email, password });
  };

  return (
    <GlassCard className="p-8 md:p-12 w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`text-3xl font-bold text-center mb-2 ${isLight ? 'text-light-textPrimary' : 'text-dark-textPrimary text-glow'}`}>
          Bem-vindo de Volta
        </h2>
        <p className={`text-center mb-8 ${isLight ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>
          Acesse sua conta para continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
          <NeonInput
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<LockClosedIcon className="w-5 h-5" />}
            variant="neon"
            required
          />
          <NeonButton type="submit" fullWidth variant="primary" size="lg">
            Entrar
          </NeonButton>
        </form>
      </motion.div>
    </GlassCard>
  );
}
