import React from 'react';

const HeroScreenshot = () => {
  return (
    <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
      <div className="aspect-[3/2] rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10">
        {/* Header da janela do app */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
        </div>
        {/* Conteúdo simulado do app */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">Dashboard de Adiantamentos</h3>
          <p className="mt-2 text-sm text-gray-500">Seu fluxo de caixa, simplificado.</p>
          <div className="mt-4 p-6 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-600">[Conteúdo interativo do dashboard aqui]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScreenshot;
