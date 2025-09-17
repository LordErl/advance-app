'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';

const HeroScreenshot = () => {
  return (
    <motion.div 
      className="perspective-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <GlassCard variant="3d" className="relative overflow-hidden group hover:scale-105 transition-all duration-700">
        {/* Enhanced 3D browser frame */}
        <div className="aspect-[3/2] w-full rounded-xl overflow-hidden bg-light-cardBg dark:bg-dark-cardBg">
          {/* Browser header with neon accents */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-light-accentBlue/20 dark:border-dark-accentBlue/20 bg-light-cardBg-secondary/50 dark:bg-dark-cardBg-secondary/50">
            <motion.span 
              className="w-3 h-3 rounded-full bg-red-400 shadow-neon-gold animate-pulse-neon"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.span 
              className="w-3 h-3 rounded-full bg-yellow-400 shadow-neon-gold animate-pulse-neon"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span 
              className="w-3 h-3 rounded-full bg-green-400 shadow-neon-lime animate-pulse-neon"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
            <div className="ml-4 flex-1 bg-light-bg/20 dark:bg-dark-bg/20 rounded px-3 py-1 text-xs text-readable-light dark:text-readable-dark opacity-60">
              advance-app.com/dashboard
            </div>
          </div>

          {/* App Content with enhanced 3D effects */}
          <div className="p-6 h-full overflow-y-auto bg-gradient-to-br from-light-cardBg to-light-cardBg-secondary dark:from-dark-cardBg to-dark-cardBg-secondary">
            {/* Dashboard Header */}
            <motion.div 
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-xl font-bold text-readable-light dark:text-readable-dark">
                Dashboard <span className="text-glow-cyan dark:text-dark-accentBlue">Executivo</span>
              </h1>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-accentBlue to-light-accentMagenta dark:from-dark-accentBlue to-dark-accentMagenta shadow-neon-cyan dark:shadow-neon-blue-soft animate-pulse-neon" />
            </motion.div>

            {/* Enhanced Stats Cards with 3D effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div 
                className="card-3d-light dark:card-3d-dark p-4 rounded-xl border border-light-accentBlue/20 dark:border-dark-accentBlue/20 group hover:scale-105 transition-all duration-300"
                whileHover={{ y: -4, rotateX: 5 }}
              >
                <p className="text-sm text-readable-light dark:text-readable-dark opacity-70">Adiantamentos Aprovados</p>
                <p className="text-2xl font-semibold text-glow-cyan dark:text-dark-accentBlue mt-1 group-hover:text-glow-strong">R$ 120.450,75</p>
                <div className="absolute top-2 right-2 w-2 h-2 bg-light-accentBlue dark:bg-dark-accentBlue rounded-full animate-pulse-neon" />
              </motion.div>
              
              <motion.div 
                className="card-3d-light dark:card-3d-dark p-4 rounded-xl border border-light-accentMagenta/20 dark:border-dark-accentMagenta/20 group hover:scale-105 transition-all duration-300"
                whileHover={{ y: -4, rotateX: 5 }}
              >
                <p className="text-sm text-readable-light dark:text-readable-dark opacity-70">Despesas Registradas</p>
                <p className="text-2xl font-semibold text-glow-magenta dark:text-dark-accentMagenta mt-1 group-hover:text-glow-strong">R$ 35.890,10</p>
                <div className="absolute top-2 right-2 w-2 h-2 bg-light-accentMagenta dark:bg-dark-accentMagenta rounded-full animate-pulse-neon" />
              </motion.div>
            </div>

            {/* Enhanced Activity List */}
            <div>
              <h2 className="text-base font-semibold text-readable-light dark:text-readable-dark mb-4 flex items-center">
                Atividade <span className="text-glow-lime dark:text-dark-accentLime ml-1">Recente</span>
                <div className="ml-2 w-2 h-2 bg-light-accentLime dark:bg-dark-accentLime rounded-full animate-pulse-neon" />
              </h2>
              
              <div className="space-y-3 text-sm">
                {[
                  { emoji: '✈️', title: 'Adiant. Viagem SP', id: '#AD00234 - Aprovado', amount: '-R$ 1.500', color: 'blue' },
                  { emoji: '💼', title: 'Adiant. Funcionário', id: '#AD00233 - Aprovado', amount: '-R$ 850', color: 'magenta' },
                  { emoji: '🏨', title: 'Diárias Hotel', id: '#DE00541 - Reembolsado', amount: '+R$ 450', color: 'lime', positive: true }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 card-3d-light dark:card-3d-dark rounded-lg border border-light-accentBlue/10 dark:border-dark-accentBlue/10 group hover:scale-102 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110 ${
                        item.color === 'blue' ? 'bg-light-accentBlue/20 dark:bg-dark-accentBlue/20 shadow-neon-cyan dark:shadow-neon-blue-soft' :
                        item.color === 'magenta' ? 'bg-light-accentMagenta/20 dark:bg-dark-accentMagenta/20 shadow-neon-magenta dark:shadow-neon-magenta-soft' :
                        'bg-light-accentLime/20 dark:bg-dark-accentLime/20 shadow-neon-lime dark:shadow-neon-lime-soft'
                      }`}>
                        {item.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-readable-light dark:text-readable-dark group-hover:text-glow-cyan dark:group-hover:text-dark-accentBlue transition-all duration-300">
                          {item.title}
                        </p>
                        <p className="text-xs text-readable-light dark:text-readable-dark opacity-60">
                          {item.id}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium transition-all duration-300 ${
                      item.positive 
                        ? 'text-glow-lime dark:text-dark-accentLime group-hover:text-glow-strong' 
                        : 'text-readable-light dark:text-readable-dark group-hover:text-glow-cyan dark:group-hover:text-dark-accentBlue'
                    }`}>
                      {item.amount}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-light-accentBlue/10 dark:bg-dark-accentBlue/10 rounded-full blur-xl animate-float opacity-60" />
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-light-accentMagenta/10 dark:bg-dark-accentMagenta/10 rounded-full blur-xl animate-float-delayed opacity-60" />
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default HeroScreenshot;