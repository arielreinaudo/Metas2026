import React, { useState, useEffect } from 'react';
import { getInitialData, PILLARS } from './constants';
import { UserPillarData, AppState, ProcessedPillar, PriorityLevel } from './types';
import { StepLanding } from './components/StepLanding';
import { StepEvaluation } from './components/StepEvaluation';
import { StepGoals } from './components/StepGoals';
import { StepImportance } from './components/StepImportance';
import { StepPractices } from './components/StepPractices';
import { StepResults } from './components/StepResults';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'mapa2026_state_v1';

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, UserPillarData>>(getInitialData());

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data);
        setStep(parsed.step);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
  }, [step, data]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleUpdate = (id: string, value: number, field: 'score2025' | 'score2026' | 'importance') => {
    setData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleTogglePractice = (id: string, practice: string) => {
    setData(prev => {
      const current = prev[id].selectedPractices;
      const updated = current.includes(practice)
        ? current.filter(p => p !== practice)
        : [...current, practice];
      
      return {
        ...prev,
        [id]: { ...prev[id], selectedPractices: updated }
      };
    });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar todo tu progreso?")) {
      setData(getInitialData());
      setStep(0);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const calculatePriorities = (): ProcessedPillar[] => {
    const processed = PILLARS.map(def => {
      const userData = data[def.id];
      const gap = Math.max(0, userData.score2026 - userData.score2025);
      const priorityScore = gap * userData.importance;
      
      return {
        ...def,
        ...userData,
        gap,
        priorityScore,
        level: PriorityLevel.MAINTENANCE // Default, updated below
      };
    });

    // Sort by priority score desc
    processed.sort((a, b) => b.priorityScore - a.priorityScore);

    // Assign levels (Simple heuristic: Top 3 High, Next 4 Medium, Rest Maintenance)
    // Or based on score thresholds if preferred. Using Top N for guaranteed distribution.
    processed.forEach((p, index) => {
      if (p.gap === 0) {
        p.level = PriorityLevel.MAINTENANCE;
      } else if (index < 3) {
        p.level = PriorityLevel.HIGH;
      } else if (index < 7) {
        p.level = PriorityLevel.MEDIUM;
      } else {
        p.level = PriorityLevel.MAINTENANCE;
      }
    });

    return processed;
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepLanding onStart={() => setStep(1)} />;
      case 1: return <StepEvaluation data={data} onUpdate={(id, val) => handleUpdate(id, val, 'score2025')} />;
      case 2: return <StepGoals data={data} onUpdate={(id, val) => handleUpdate(id, val, 'score2026')} />;
      case 3: return <StepImportance data={data} onUpdate={(id, val) => handleUpdate(id, val, 'importance')} />;
      case 4: return <StepPractices data={data} onTogglePractice={handleTogglePractice} />;
      case 5: return <StepResults processedData={calculatePriorities()} />;
      default: return null;
    }
  };

  const getProgress = () => {
    if (step === 0) return 0;
    return ((step - 1) / 4) * 100; // Steps 1 to 5 mapping to 0-100%
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
      {/* Sticky Nav */}
      {step > 0 && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold text-indigo-600">Mapa 2026</h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:block w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors" title="Reiniciar">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {renderStep()}
      </main>

      {/* Floating Navigation Footer (Wizard controls) */}
      {step > 0 && step < 5 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium px-4 py-2"
            >
              <ChevronLeft size={20} />
              Atrás
            </button>
            <button 
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all"
            >
              {step === 4 ? 'Ver Resultados' : 'Siguiente'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;