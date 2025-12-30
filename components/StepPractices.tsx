import React from 'react';
import { PILLARS } from '../constants';
import { UserPillarData } from '../types';
import { Check } from 'lucide-react';

interface Props {
  data: Record<string, UserPillarData>;
  onTogglePractice: (id: string, practice: string) => void;
}

export const StepPractices: React.FC<Props> = ({ data, onTogglePractice }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Prácticas Clave</h2>
        <p className="text-gray-600 mt-2">Elige los hábitos que te ayudarán a cerrar la brecha.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {PILLARS.map((pillar) => (
          <div key={pillar.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-500 rounded-full block"></span>
              {pillar.name}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pillar.practices.map((practice) => {
                const isSelected = data[pillar.id].selectedPractices.includes(practice);
                return (
                  <div 
                    key={practice}
                    onClick={() => onTogglePractice(pillar.id, practice)}
                    className={`
                      cursor-pointer rounded-lg p-4 border transition-all duration-200 flex items-center gap-3 select-none
                      ${isSelected 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' 
                        : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded flex items-center justify-center border transition-colors
                      ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}
                    `}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium">{practice}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};