import React, { useRef, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ProcessedPillar, PriorityLevel } from '../types';
import { CompassLogo } from './CompassLogo';
import { Download, Loader2, Info } from 'lucide-react';

interface Props {
  processedData: ProcessedPillar[];
}

// Custom Tick Component to handle multi-line labels and offset distance
const CustomTick = ({ payload, x, y, cx, cy, textAnchor, stroke, radius }: any) => {
  // Replace " y " with non-breaking space + y + non-breaking space to keep it glued
  const formattedValue = payload.value.replace(/ y /g, '\u00A0y\u00A0');
  
  // Custom wrapping logic to ensure lines aren't too long
  // We split by space, but we check line length to force wraps
  const words = formattedValue.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    // If adding the next word makes the line longer than 15 chars, break it
    if ((currentLine + " " + word).length > 15) {
        lines.push(currentLine);
        currentLine = word;
    } else {
        currentLine += " " + word;
    }
  }
  lines.push(currentLine);

  const lineHeight = 14; 
  
  // Calculate offset to push labels away from the chart (separate from network)
  // We use the vector from center (cx, cy) to the tick point (x, y)
  let newX = x;
  let newY = y;
  
  if (cx && cy) {
    const dx = x - cx;
    const dy = y - cy;
    const length = Math.sqrt(dx * dx + dy * dy);
    // Push out by 40px to ensure separation
    const offset = 40; 
    
    if (length > 0) {
      newX = x + (dx / length) * offset;
      newY = y + (dy / length) * offset;
    }
  }

  return (
    <g transform={`translate(${newX},${newY})`}>
      <text
        x={0}
        y={0}
        dy={0}
        textAnchor={textAnchor}
        fill="#1F2937" // Dark gray for labels
        fontSize={11} 
        fontWeight={600}
      >
        {lines.map((line: string, index: number) => (
          <tspan x={0} dy={index === 0 ? 0 : lineHeight} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export const StepResults: React.FC<Props> = ({ processedData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  // Separate refs for pagination
  const pageOneRef = useRef<HTMLDivElement>(null);
  const pageTwoRef = useRef<HTMLDivElement>(null);

  const chartData = processedData.map(p => ({
    subject: p.name, 
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
    if (!pageOneRef.current || !pageTwoRef.current) return;
    setIsGenerating(true);

    try {
      // PDF Configuration
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // --- PAGE 1: Header + Chart ---
      const canvas1 = await html2canvas(pageOneRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData1 = canvas1.toDataURL('image/png');
      const imgWidth1 = canvas1.width;
      const imgHeight1 = canvas1.height;
      
      // Calculate ratio to fit width
      const ratio1 = pdfWidth / imgWidth1;
      // We don't force fit height for page 1, we let it flow, but usually it fits.
      pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, imgHeight1 * ratio1);

      // --- PAGE 2: Priorities + Commitment ---
      pdf.addPage();
      
      const canvas2 = await html2canvas(pageTwoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData2 = canvas2.toDataURL('image/png');
      const imgWidth2 = canvas2.width;
      const imgHeight2 = canvas2.height;
      const ratio2 = pdfWidth / imgWidth2;

      pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, imgHeight2 * ratio2);

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
          <p className="text-indigo-200 text-sm">Guárdalo en PDF (2 Páginas) como recordatorio.</p>
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

      {/* --- PAGE 1 CONTAINER --- */}
      <div ref={pageOneRef} className="bg-white p-8 md:p-12 rounded-t-xl shadow-none md:shadow-xl max-w-4xl mx-auto border-b border-gray-100">
        {/* Header PDF */}
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mapa 2026</h1>
            <p className="text-indigo-600 font-medium">Dra. Adriana Ortiz www.emyti.com</p>
          </div>
          <CompassLogo className="w-16 h-16 text-indigo-600" />
        </div>

        {/* Chart Explainer */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-gray-900">Cómo leer este gráfico:</span>
              El centro representa 0 (insatisfacción) y el borde exterior 10 (plenitud).
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-2 sm:mt-0 ml-7 sm:ml-0">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-indigo-500 opacity-50"></span>
               <span><strong>Zona Azul (2025):</strong> Tu realidad actual.</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-50"></span>
               <span><strong>Zona Verde (2026):</strong> Tu expansión deseada.</span>
             </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-8 flex flex-col items-center relative">
          <div className="h-[700px] w-full max-w-[800px]">
            <ResponsiveContainer width="100%" height="100%">
              {/* Reduced outerRadius to 60% and added margins to ensure labels fit */}
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                <PolarGrid gridType="polygon" stroke="#E5E7EB" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={(props) => <CustomTick {...props} />} 
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]} 
                  tickCount={6}
                  tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 'bold' }}
                  axisLine={false}
                />
                <Radar 
                  name="2025 (Actual)" 
                  dataKey="A" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  fill="#4F46E5" 
                  fillOpacity={0.5} 
                  dot={{ r: 4, fill: '#4F46E5', fillOpacity: 1 }}
                />
                <Radar 
                  name="2026 (Meta)" 
                  dataKey="B" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fill="#10B981" 
                  fillOpacity={0.4} 
                  dot={{ r: 4, fill: '#10B981', fillOpacity: 1 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value, entry: any) => <span className="text-gray-900 font-bold ml-1 text-lg">{value}</span>}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- PAGE 2 CONTAINER (Priorities & Commitment) --- */}
      <div ref={pageTwoRef} className="bg-white p-8 md:p-12 rounded-b-xl shadow-none md:shadow-xl max-w-4xl mx-auto pt-8">
        
        {/* Header PDF Repeat for 2nd page */}
        <div className="flex justify-between items-center mb-8 border-b pb-6 opacity-50">
           <h2 className="text-xl font-bold text-gray-400">Plan de Acción & Compromiso</h2>
           <span className="text-sm text-gray-400">Página 2/2</span>
        </div>

        {/* Priorities Section */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* High Priority */}
          {highPriority.length > 0 && (
            <div className="border-l-4 border-indigo-600 pl-4">
              <h4 className="text-xl font-bold text-indigo-900 mb-3">🔥 Alta Prioridad (Enfoque Inmediato)</h4>
              <p className="text-sm text-gray-500 mb-4">Estas áreas tienen la mayor brecha de crecimiento y son las más importantes para ti.</p>
              <div className="grid grid-cols-1 gap-4">
                {highPriority.map(p => (
                  <div key={p.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 text-lg">{p.name}</span>
                      <div className="text-xs bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-700 font-medium">
                        Meta: {p.score2026}/10
                      </div>
                    </div>
                    {p.selectedPractices.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Acciones clave:</span>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                          {p.selectedPractices.map(pr => <li key={pr}>{pr}</li>)}
                        </ul>
                      </div>
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
                  <div key={p.id} className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    {p.selectedPractices.length > 0 && (
                      <div className="text-xs text-gray-600 mt-2 flex flex-col gap-1">
                         {p.selectedPractices.map(pr => (
                           <span key={pr} className="flex items-center gap-1">
                             <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                             {pr}
                           </span>
                         ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Commitment Card */}
        <div className="mt-12 bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-xl text-center break-inside-avoid">
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