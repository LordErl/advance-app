import Image from 'next/image';
import { BarChart3, Zap, FileSpreadsheet, Sparkles } from 'lucide-react';
import GlassCard from './ui/GlassCard';

const features = [
  {
    name: 'Analytics Detalhados',
    description: 'Tome decisões mais inteligentes com acesso a dashboards e relatórios completos sobre seus gastos.',
    icon: BarChart3,
    color: 'cyan',
  },
  {
    name: 'Transações Simplificadas',
    description: 'Gerencie seus adiantamentas e despesas de forma rápida e intuitiva, sem complicações.',
    icon: Zap,
    color: 'magenta',
  },
  {
    name: 'Relatórios Automatizados',
    description: 'Gere relatórios de despesas automaticamente e economize tempo para focar no que realmente importa.',
    icon: FileSpreadsheet,
    color: 'lime',
  },
];

export default function Features() {
  return (
    <div className="relative py-24 sm:py-32 perspective-container">
      {/* Section background with 3D elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-light-accentBlue dark:bg-dark-accentBlue rounded-full opacity-10 blur-2xl animate-float" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-light-accentMagenta dark:bg-dark-accentMagenta rounded-full opacity-10 blur-3xl animate-float-delayed" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-glow-cyan dark:text-dark-accentBlue mr-3" />
            <h2 className="text-base font-semibold leading-7 text-glow-cyan dark:text-dark-accentBlue tracking-wide uppercase">
              Tudo sob controle
            </h2>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-readable-light dark:text-readable-dark">
            Uma plataforma completa para sua 
            <span className="text-glow-magenta dark:text-dark-accentMagenta"> gestão financeira</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-readable-light dark:text-readable-dark opacity-90">
            Do adiantamento à prestação de contas, o Advance simplifica cada etapa do processo para você e sua equipe.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <GlassCard 
                key={feature.name} 
                variant="3d"
                className="group hover:scale-105 transition-all duration-500"
              >
                <dt className="text-base font-semibold leading-7 text-readable-light dark:text-readable-dark">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 ${
                    feature.color === 'cyan' ? 'bg-light-accentBlue/20 dark:bg-dark-accentBlue/20 neon-border-cyan dark:neon-border-blue-soft' :
                    feature.color === 'magenta' ? 'bg-light-accentMagenta/20 dark:bg-dark-accentMagenta/20 neon-border-magenta dark:neon-border-magenta-soft' :
                    'bg-light-accentLime/20 dark:bg-dark-accentLime/20 neon-border-lime dark:neon-border-lime-soft'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      feature.color === 'cyan' ? 'text-glow-cyan dark:text-dark-accentBlue' :
                      feature.color === 'magenta' ? 'text-glow-magenta dark:text-dark-accentMagenta' :
                      'text-glow-lime dark:text-dark-accentLime'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-glow-cyan dark:group-hover:text-dark-accentBlue transition-all duration-300">
                    {feature.name}
                  </h3>
                </dt>
                <dd className="text-base leading-7 text-readable-light dark:text-readable-dark opacity-90 group-hover:opacity-100 transition-all duration-300">
                  {feature.description}
                </dd>
              </GlassCard>
            ))}
          </dl>
        </div>

        {/* Additional 3D decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-gradient-to-r from-light-accentBlue/5 to-light-accentMagenta/5 dark:from-dark-accentBlue/5 dark:to-dark-accentMagenta/5 rounded-full blur-3xl animate-pulse-glow" />
        </div>
      </div>
    </div>
  );
}