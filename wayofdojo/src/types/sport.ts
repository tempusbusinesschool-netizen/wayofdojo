/**
 * 🎯 SPORT TYPES
 * Types pour la configuration multi-sports
 */

export interface Grade {
  id: string;
  name: string;
  displayName: string;
  color: string;
  belt: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
}

export interface Virtue {
  id: string;
  name: string;
  translation: string;
  icon: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Federation {
  id: string;
  name: string;
  country: string;
  fullName: string;
}

export interface GamificationConfig {
  xpPerTechnique: number;
  xpPerTraining: number;
  xpPerStage: number;
  xpPerGradePass: number;
  virtues: Virtue[];
}

export interface SportConfig {
  id: string;
  name: string;
  slug: string;
  theme: Theme;
  grades: {
    kyu: Grade[];
    dan: Grade[];
  };
  categories: Category[];
  weapons?: Weapon[];
  glossary: Record<string, string>;
  gamification: GamificationConfig;
  federations: Federation[];
}

export type SupportedSport = 'aikido' | 'judo' | 'karate' | 'yoga';

export interface SportRoute {
  locale: string;
  sport: SupportedSport;
}
