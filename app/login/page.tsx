'use client';

import { useTheme } from '@/providers/ThemeProvider';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isLight ? 'bg-light-bg' : 'bg-dark-bg'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}
