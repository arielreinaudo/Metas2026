import React from 'react';
import { PILLARS } from '../constants';
import { UserPillarData } from '../types';

interface Props {
  data: Record<string, UserPillarData>;
  onUpdate: (id: string, value: number) => void;
}

export const StepEvaluation: React.FC<Props> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Evaluación 2025</h2>
        <p className="text-gray-600 mt-2">¿Cómo sientes que estás hoy en estas áreas? (1 = Bajo, 10 = Excelente)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PILLARS.map((pillar) => (
          <div key={pillar.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{pillar.name}</h3>
              <span className="text-2xl font-bold text-indigo-600 bg-indigo-50 w-10 h-10 flex items-center justify-center rounded-full">
                {data[pillar.id].score2025}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 h-10">{pillar.description}</p>
            
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={data[pillar.id].score2025}
              onChange={(e) => onUpdate(pillar.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
              <span>1 (Bajo)</span>
              <span>10 (Pleno)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};