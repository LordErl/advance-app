import React from 'react';

const HeroScreenshot = () => {
  return (
    <div className="-m-2 rounded-xl p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
      <div className="aspect-[3/2] w-full rounded-md bg-light-bg dark:bg-fintech-dark-bg shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
        {/* Header da janela */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
          <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-600"></span>
        </div>

        {/* Conteúdo do App */}
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          {/* Header do Dashboard */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary">Dashboard Executivo</h1>
            <div className="w-9 h-9 rounded-full bg-indigo-200 dark:bg-indigo-800/50"></div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-fintech-dark-card p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Adiantamentos Aprovados</p>
              <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mt-1">R$ 120.450,75</p>
            </div>
            <div className="bg-white dark:bg-fintech-dark-card p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Despesas Registradas</p>
              <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mt-1">R$ 35.890,10</p>
            </div>
          </div>

          {/* Lista de Atividades */}
          <div>
            <h2 className="text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">Atividade Recente</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-fintech-dark-card/70 rounded-md border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-lg">✈️</div>
                  <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">Adiant. Viagem SP</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">#AD00234 - Aprovado</p>
                  </div>
                </div>
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">-R$ 1.500</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-fintech-dark-card/70 rounded-md border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-lg">💼</div>
                  <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">Adiant. Funcionário</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">#AD00233 - Aprovado</p>
                  </div>
                </div>
                <p className="font-medium text-light-text-primary dark:text-dark-text-primary">-R$ 850</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-fintech-dark-card/70 rounded-md border border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-lg">🏨</div>
                  <div>
                    <p className="font-medium text-light-text-primary dark:text-dark-text-primary">Diárias Hotel</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">#DE00541 - Reembolsado</p>
                  </div>
                </div>
                <p className="font-medium text-green-600 dark:text-green-400">+R$ 450</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScreenshot;
