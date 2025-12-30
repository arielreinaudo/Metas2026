import React from 'react';
import { PILLARS } from '../constants';
import { UserPillarData } from '../types';
import { Star } from 'lucide-react';

interface Props {
  data: Record<string, UserPillarData>;
  onUpdate: (id: string, value: number) => void;
}

export const StepImportance: React.FC<Props> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Factor de Importancia</h2>
        <p className="text-gray-600 mt-2">Del 1 al 5, ¿qué tan crucial es este pilar para ti ESTE año?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PILLARS.map((pillar) => {
          const importance = data[pillar.id].importance;
          return (
            <div key={pillar.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">{pillar.name}</h3>
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={star <= importance ? "currentColor" : "none"} 
                      className={star <= importance ? "text-amber-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={importance}
                onChange={(e) => onUpdate(pillar.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#F59E0B' }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Poco</span>
                <span>Crucial</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};