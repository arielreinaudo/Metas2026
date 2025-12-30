import { PillarDefinition, UserPillarData } from './types';

export const PILLARS: PillarDefinition[] = [
  {
    id: 'health_phys',
    name: 'Salud física y energía',
    description: 'Vitalidad, sueño, alimentación y movimiento.',
    practices: ['Caminar al sol', 'Horario sueño fijo', 'Comida real']
  },
  {
    id: 'health_ment',
    name: 'Salud mental y emocional',
    description: 'Gestión de emociones, paz mental y claridad.',
    practices: ['Journaling', 'Meditación', 'Terapia']
  },
  {
    id: 'relationships',
    name: 'Relaciones y red de apoyo',
    description: 'Calidad de vínculos con familia y amigos.',
    practices: ['Cena sin pantallas', 'Llamar amigos', 'Actividad social']
  },
  {
    id: 'purpose',
    name: 'Propósito y sentido',
    description: 'Conexión espiritual y razón de ser.',
    practices: ['Lectura espiritual', 'Visualización', 'Gratitud']
  },
  {
    id: 'work',
    name: 'Trabajo y contribución',
    description: 'Impacto profesional y cumplimiento de metas.',
    practices: ['Definir objetivos', 'Trabajo concentrado', 'Mentoría']
  },
  {
    id: 'economy',
    name: 'Economía personal',
    description: 'Salud financiera, ahorro e inversión.',
    practices: ['Revisar gastos', 'Automatizar ahorro', 'Fondo emergencia']
  },
  {
    id: 'growth',
    name: 'Crecimiento y aprendizaje',
    description: 'Desarrollo intelectual y nuevas habilidades.',
    practices: ['Leer libro', 'Curso online', 'Aprender idioma']
  },
  {
    id: 'environment',
    name: 'Entorno y estilo de vida',
    description: 'El espacio físico y atmósfera que te rodea.',
    practices: ['Decluttering', 'Ordenar escritorio', 'Naturaleza']
  },
  {
    id: 'values',
    name: 'Valores y carácter',
    description: 'Integridad y coherencia con quien eres.',
    practices: ['Revisar valores', 'Honestidad radical', 'Cumplir promesas']
  },
  {
    id: 'play',
    name: 'Juego y descanso',
    description: 'Ocio, hobbies y desconexión.',
    practices: ['Hobby creativo', 'Digital Detox', 'Jugar activamente']
  }
];

export const INITIAL_PILLAR_DATA: UserPillarData = {
  score2025: 5,
  score2026: 8,
  importance: 3,
  selectedPractices: []
};

// Generate initial state map
export const getInitialData = (): Record<string, UserPillarData> => {
  const data: Record<string, UserPillarData> = {};
  PILLARS.forEach(p => {
    data[p.id] = { ...INITIAL_PILLAR_DATA };
  });
  return data;
};