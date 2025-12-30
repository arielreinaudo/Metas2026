export interface PillarDefinition {
  id: string;
  name: string;
  description: string;
  practices: string[];
}

export interface UserPillarData {
  score2025: number;
  score2026: number;
  importance: number; // 1-5
  selectedPractices: string[];
}

export interface AppState {
  step: number;
  data: Record<string, UserPillarData>;
  userName: string;
}

export enum PriorityLevel {
  HIGH = 'Alta Prioridad',
  MEDIUM = 'Prioridad Media',
  MAINTENANCE = 'Mantenimiento'
}

export interface ProcessedPillar extends PillarDefinition, UserPillarData {
  priorityScore: number;
  gap: number;
  level: PriorityLevel;
}
