/**
 * 🥋 WAYOFDOJO - Types de données pour l'Aïkido
 * 
 * Interfaces TypeScript pour toutes les données techniques
 * migrées depuis AIKIDO@GAME
 */

// =============================================================================
// TYPES DE BASE
// =============================================================================

export type NiveauGrade = 
  | "6e_kyu" | "5e_kyu" | "4e_kyu" | "3e_kyu" | "2e_kyu" | "1er_kyu"
  | "shodan" | "nidan" | "sandan" | "yondan" | "godan" | "rokudan" | "nanadan";

export type TypeTechnique = "immobilisation" | "projection" | "chute" | "suburi" | "kata" | "kumijo" | "kumitachi" | "ken_tai_jo" | "libre";

export type DirectionTechnique = "omote" | "ura" | "uchi" | "soto" | null;

// =============================================================================
// INTERFACE COMBINAISON TECHNIQUE
// =============================================================================

export interface Phase1 {
  attaque: string;
  deplacement: string;
}

export interface Phase2 {
  technique: string;
  direction: DirectionTechnique;
  variant?: string;
}

export interface Phase3 {
  final: string;
  type: TypeTechnique;
}

export interface CombinaisonTechnique {
  id: string;
  phase1: Phase1;
  phase2: Phase2;
  phase3: Phase3;
  kyu: NiveauGrade;
  nom?: string;
  description?: string;
  points_cles?: string[];
}

// =============================================================================
// INTERFACE MOUVEMENT
// =============================================================================

export interface VideoInfo {
  url: string | null;
  thumbnail: string | null;
  duree: string | null;
  format: string;
  placeholder: string;
}

export interface AnimationInfo {
  phases: number;
  images: (string | null)[];
  placeholder: string;
}

export interface Mouvement {
  id: string;
  nom: string;
  nom_japonais: string;
  traduction: string;
  description: string;
  niveau: NiveauGrade;
  categorie: string;
  points_cles?: string[];
  erreurs_communes?: string[];
  applications?: string[];
  video: VideoInfo;
  animation: AnimationInfo;
  // Champs spécifiques selon le type
  cible?: string;
  forme_main?: string;
  articulations?: string[];
  principe?: string;
  variantes?: string[];
  precautions?: string;
  anatomie?: string;
  attaque?: string;
  importance?: string;
}

// =============================================================================
// INTERFACE TECHNIQUE ARME
// =============================================================================

export interface TechniqueArme {
  id: string;
  nom: string;
  description: string;
  phase1: Phase1;
  phase2: Phase2;
  phase3: Phase3;
  niveau: NiveauGrade;
  ordre?: number;
  points_cles?: string[];
}

// =============================================================================
// INTERFACE STATISTIQUES
// =============================================================================

export interface StatistiquesMouvements {
  total: number;
  par_niveau?: Record<NiveauGrade, number>;
  par_categorie?: Record<string, number>;
  videos_disponibles: number;
}

// =============================================================================
// INTERFACE GRADE
// =============================================================================

export interface GradeInfo {
  id: NiveauGrade;
  nom: string;
  nom_japonais: string;
  couleur_ceinture: string;
  description: string;
  duree_minimale?: string;
  techniques_requises: string[];
  competences_evaluees: string[];
}

// =============================================================================
// INTERFACE PROGRAMME DE GRADE
// =============================================================================

export interface ProgrammeGrade {
  grade: NiveauGrade;
  nom: string;
  prerequis?: NiveauGrade;
  duree_pratique_minimum: string;
  categories: {
    nom: string;
    techniques: string[];
  }[];
  competences_attendues: string[];
}
