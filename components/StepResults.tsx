import React, { useRef, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ProcessedPillar, PriorityLevel } from '../types';
import { CompassLogo } from './CompassLogo';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  processedData: ProcessedPillar[];
}

export const StepResults: React.FC<Props> = ({ processedData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const chartData = processedData.map(p => ({
    subject: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    fullSubject: p.name,
    A: p.score2025,
    B: p.score2026,
    fullMark: 10,
  }));

  // Group by priority
  const highPriority = processedData.filter(p => p.level === PriorityLevel.HIGH);
  const mediumPriority = processedData.filter(p => p.level === PriorityLevel.MEDIUM);
  const maintenance = processedData.filter(p => p.level === PriorityLevel.MAINTENANCE);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('Mapa-2026-Plan.pdf');
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tu Mapa 2026</h2>
        <p className="text-gray-600 mt-2">Aquí está tu plan estratégico visualizado.</p>
      </div>

      {/* Action Bar */}
      <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">Descarga tu Plan</h3>
          <p className="text-indigo-200 text-sm">Guárdalo como recordatorio de tus compromisos.</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={20} />}
          {isGenerating ? 'Generando...' : 'Descargar PDF'}
        </button>
      </div>

      {/* CONTENT TO PRINT */}
      <div ref={printRef} className="bg-white p-8 md:p-12 rounded-none md:rounded-xl shadow-none md:shadow-xl max-w-4xl mx-auto">
        {/* Header PDF */}
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa 2026</h1>
            <p className="text-indigo-600 font-medium">Dra. Adriana Ortiz Emyti.com</p>
          </div>
          <CompassLogo className="w-16 h-16 text-indigo-600" />
        </div>

        {/* Chart Section */}
        <div className="mb-12 flex flex-col items-center">
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Visualización de la Brecha</h3>
          <div className="h-[400px] w-full max-w-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="2025 (Actual)" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                <Radar name="2026 (Meta)" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priorities Section */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* High Priority */}
          {highPriority.length > 0 && (
            <div className="border-l-4 border-indigo-600 pl-4">
              <h4 className="text-xl font-bold text-indigo-900 mb-3">🔥 Alta Prioridad (Enfoque Inmediato)</h4>
              <div className="grid grid-cols-1 gap-4">
                {highPriority.map(p => (
                  <div key={p.id} className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex justify-between font-bold text-gray-900 mb-2">
                      <span>{p.name}</span>
                      <span className="text-indigo-600">Meta: {p.score2026}/10</span>
                    </div>
                    {p.selectedPractices.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {p.selectedPractices.map(pr => <li key={pr}>{pr}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {mediumPriority.length > 0 && (
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="text-xl font-bold text-emerald-800 mb-3">🌱 Prioridad Media (Crecimiento Sostenido)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediumPriority.map(p => (
                  <div key={p.id} className="bg-emerald-50 p-3 rounded-lg">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    {p.selectedPractices.length > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                         Habito: {p.selectedPractices[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Commitment Card */}
        <div className="mt-12 bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-xl text-center">
          <h4 className="text-2xl font-serif text-gray-800 mb-4">Mi Compromiso Personal</h4>
          <p className="text-gray-600 italic mb-8 max-w-xl mx-auto">
            "Me comprometo a trabajar en estos pilares con amor y disciplina, entendiendo que el progreso es mejor que la perfección. Este 2026 diseño mi vida con propósito."
          </p>
          <div className="w-64 border-b-2 border-gray-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-400 uppercase tracking-widest">Firma</p>
        </div>
      </div>
    </div>
  );
};