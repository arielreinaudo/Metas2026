import React from 'react';
import { CompassLogo } from './CompassLogo';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const StepLanding: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in-up">
      <div className="mb-8 text-indigo-600 p-6 bg-white rounded-full shadow-xl">
        <CompassLogo className="w-32 h-32" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        Mapa 2026
      </h1>
      <h2 className="text-xl text-indigo-600 font-medium mb-6">
        Dra. Adriana Ortiz Emyti.com
      </h2>
      
      <p className="max-w-xl text-lg text-gray-600 mb-10 leading-relaxed">
        Una herramienta visual simple para cerrar tu 2025 con gratitud 
        y diseñar un 2026 con propósito claro.
      </p>

      <button
        onClick={onStart}
        className="group flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1"
      >
        Empezar aquí
        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};