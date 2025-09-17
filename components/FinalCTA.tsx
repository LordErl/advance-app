'use client';

import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import NeonButton from './ui/NeonButton';

export default function FinalCTA() {
  return (
    <div className="relative py-24 sm:py-32 perspective-container">
      {/* Enhanced background with 3D elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-light-accentBlue/10 dark:bg-dark-accentBlue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-light-accentMagenta/10 dark:bg-dark-accentMagenta/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-light-accentLime/5 dark:bg-dark-accentLime/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <GlassCard variant="3d" className="relative isolate overflow-hidden text-center py-16 px-8 sm:px-16">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255, 16, 240, 0.1) 0%, transparent 50%)
                `,
              }} />
            </div>

            {/* Floating icons */}
            <motion.div
              className="absolute top-8 left-8"
              animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-8 w-8 text-glow-cyan dark:text-dark-accentBlue opacity-60" />
            </motion.div>
            
            <motion.div
              className="absolute top-8 right-8"
              animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <Zap className="h-8 w-8 text-glow-magenta dark:text-dark-accentMagenta opacity-60" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              <motion.h2 
                className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl text-readable-light dark:text-readable-dark mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Pronto para <span className="text-glow-cyan dark:text-dark-accentBlue">otimizar</span> suas finanças?
              </motion.h2>
              
              <motion.p 
                className="mx-auto mt-6 max-w-xl text-lg leading-8 text-readable-light dark:text-readable-dark opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Comece a usar o Advance hoje mesmo e descubra uma nova forma de gerenciar 
                <span className="text-glow-magenta dark:text-dark-accentMagenta"> adiantamentos salariais</span> com 
                <span className="text-glow-lime dark:text-dark-accentLime"> eficiência e transparência</span>.
              </motion.p>
              
              <motion.div 
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <NeonButton
                  variant="neon-cyan"
                  size="lg"
                  effect3d={true}
                  className="group"
                >
                  <span className="flex items-center">
                    Começar Agora
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </NeonButton>
                
                <NeonButton
                  variant="ghost"
                  size="lg"
                  effect3d={false}
                  className="group"
                >
                  <span className="flex items-center">
                    Saber mais
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </NeonButton>
              </motion.div>
            </div>

            {/* Enhanced SVG background with 3D effect */}
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 opacity-30"
              aria-hidden="true"
            >
              <defs>
                <radialGradient id="enhanced-gradient">
                  <stop stopColor="rgba(0, 245, 255, 0.8)" />
                  <stop offset="0.5" stopColor="rgba(255, 16, 240, 0.6)" />
                  <stop offset="1" stopColor="rgba(50, 255, 50, 0.4)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle 
                cx={512} 
                cy={512} 
                r={512} 
                fill="url(#enhanced-gradient)" 
                filter="url(#glow)"
                className="animate-glow-rotate"
              />
            </svg>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}