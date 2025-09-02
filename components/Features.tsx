import Image from 'next/image';

const features = [
  {
    name: 'Analytics Detalhados',
    description: 'Tome decisões mais inteligentes com acesso a dashboards e relatórios completos sobre seus gastos.',
    icon: '/images/icon-analytics.svg',
  },
  {
    name: 'Transações Simplificadas',
    description: 'Gerencie seus adiantamentos e despesas de forma rápida e intuitiva, sem complicações.',
    icon: '/images/icon-transactions.svg',
  },
  {
    name: 'Relatórios Automatizados',
    description: 'Gere relatórios de despesas automaticamente e economize tempo para focar no que realmente importa.',
    icon: '/images/icon-reports.svg',
  },
];

export default function Features() {
  return (
    <div className="bg-background-light dark:bg-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Tudo sob controle
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-4xl">
            Uma plataforma completa para sua gestão financeira
          </p>
          <p className="mt-6 text-lg leading-8 text-text-secondary-light dark:text-text-secondary-dark">
            Do adiantamento à prestação de contas, o Advance simplifica cada etapa do processo para você e sua equipe.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-text-light dark:text-text-dark">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Image src={feature.icon} alt={`${feature.name} icon`} width={24} height={24} />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-text-secondary-light dark:text-text-secondary-dark">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
