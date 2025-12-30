import React from 'react';
import { PILLARS } from '../constants';
import { UserPillarData } from '../types';

interface Props {
  data: Record<string, UserPillarData>;
  onUpdate: (id: string, value: number) => void;
}

export const StepGoals: React.FC<Props> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Objetivo 2026</h2>
        <p className="text-gray-600 mt-2">¿A dónde quieres llegar el próximo año?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PILLARS.map((pillar) => {
          const current = data[pillar.id].score2025;
          const goal = data[pillar.id].score2026;
          
          return (
            <div key={pillar.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">{pillar.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">Actual: {current}</span>
                  <span className="text-2xl font-bold text-emerald-600 bg-emerald-50 w-10 h-10 flex items-center justify-center rounded-full">
                    {goal}
                  </span>
                </div>
              </div>
              
              <div className="relative pt-6 pb-2">
                {/* 2025 Reference Marker */}
                <div 
                  className="absolute top-2 w-4 h-4 bg-gray-300 rounded-full border-2 border-white shadow text-[10px] flex items-center justify-center font-bold text-gray-600 z-10 pointer-events-none"
                  style={{ left: `calc(${((current - 1) / 9) * 100}% - 8px)` }}
                >
                  
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={goal}
                  onChange={(e) => onUpdate(pillar.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  style={{ accentColor: '#10B981' }} 
                />
              </div>
              <p className="text-xs text-center text-emerald-600 mt-2 font-medium">
                {goal > current ? `+${goal - current} puntos de mejora` : 'Mantenimiento'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};