import React from 'react';

interface TableauShowcaseProps {
  onClose: () => void;
}

export default function TableauShowcase({ onClose }: TableauShowcaseProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4 sm:p-6 font-sans overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
          &times;
        </button>
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Portafolio de Tableau
        </h1>
        <p className="text-gray-300 text-lg mb-8">Aquí se mostrarán los proyectos y ejemplos de Tableau.</p>
        {/* Contenido específico de Tableau */}
        <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
          <h3 className="text-xl font-bold mb-4">Próximamente...</h3>
          <p className="text-gray-400">Esta sección está en desarrollo. Vuelve pronto para ver mis visualizaciones interactivas de Tableau.</p>
        </div>
      </div>
    </div>
  );
}
