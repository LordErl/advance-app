import React from 'react';

const HeroScreenshot = () => {
  return (
    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
      <div className="aspect-[3/2] w-full rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10">
        {/* Header da janela */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200">
          <span className="w-3 h-3 rounded-full bg-gray-200"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200"></span>
          <span className="w-3 h-3 rounded-full bg-gray-200"></span>
        </div>

        {/* Conteúdo do App */}
        <div className="p-4 sm:p-6 bg-gray-50/50 h-full">
          {/* Header do Dashboard */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <div className="w-8 h-8 rounded-full bg-indigo-200"></div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Adiantamentos Aprovados</p>
              <p className="text-lg font-semibold text-indigo-600">R$ 7.850</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Despesas Registradas</p>
              <p className="text-lg font-semibold text-pink-600">R$ 3.120</p>
            </div>
          </div>

          {/* Lista de Transações */}
          <div>
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Atividade Recente</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">✈️</div>
                  <div>
                    <p className="font-medium text-gray-700">Adiant. Viagem SP</p>
                    <p className="text-xs text-gray-400">#1023 - Aprovado</p>
                  </div>
                </div>
                <p className="font-medium text-gray-800">-R$ 1.500</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">💼</div>
                  <div>
                    <p className="font-medium text-gray-700">Adiant. Funcionário</p>
                    <p className="text-xs text-gray-400">#1022 - Aprovado</p>
                  </div>
                </div>
                <p className="font-medium text-gray-800">-R$ 850</p>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">🏨</div>
                  <div>
                    <p className="font-medium text-gray-700">Diárias Hotel</p>
                    <p className="text-xs text-gray-400">#1021 - Reembolsado</p>
                  </div>
                </div>
                <p className="font-medium text-green-600">+R$ 450</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScreenshot;
