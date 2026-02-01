/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WAYOFDOJO - UTILITAIRES POUR RÉCUPÉRER LES TECHNIQUES PAR GRADE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Mouvement } from './types';
import { UKEMI } from './mouvements/ukemi';
import { TAI_SABAKI } from './mouvements/tai-sabaki';
import { KANSETSU_WAZA } from './mouvements/kansetsu-waza';
import { KAMAE } from './mouvements/kamae';
import { SUWARIWAZA } from './mouvements/suwariwaza';
import { ATEMI } from './mouvements/atemi';
import { HANMI_HANDACHI } from './mouvements/hanmi-handachi';
import { KOKYU_WAZA } from './mouvements/kokyu-waza';

// Tous les mouvements combinés (uniquement les types Mouvement)
const ALL_MOUVEMENTS: Mouvement[] = [
  ...UKEMI,
  ...TAI_SABAKI,
  ...KANSETSU_WAZA,
  ...(KAMAE as unknown as Mouvement[]),
  ...SUWARIWAZA,
  ...ATEMI,
  ...HANMI_HANDACHI,
  ...KOKYU_WAZA,
];

// Catégories de mouvements avec labels
export const CATEGORIES_MOUVEMENTS: Record<string, { label: string; emoji: string; color: string }> = {
  'ukemi_base': { label: 'Chutes de base', emoji: '🌀', color: 'from-blue-500 to-cyan-500' },
  'ukemi_avance': { label: 'Chutes avancées', emoji: '🌊', color: 'from-blue-600 to-blue-500' },
  'ukemi_special': { label: 'Chutes spéciales', emoji: '🎯', color: 'from-indigo-500 to-blue-500' },
  'tai_sabaki': { label: 'Déplacements', emoji: '👣', color: 'from-emerald-500 to-green-500' },
  'deplacement_base': { label: 'Déplacements de base', emoji: '👣', color: 'from-emerald-500 to-green-500' },
  'kamae': { label: 'Postures', emoji: '🧘', color: 'from-purple-500 to-violet-500' },
  'kamae_base': { label: 'Postures de base', emoji: '🧘', color: 'from-purple-500 to-violet-500' },
  'osae_waza': { label: 'Immobilisations', emoji: '🔒', color: 'from-amber-500 to-orange-500' },
  'nage_waza': { label: 'Projections', emoji: '🌪️', color: 'from-rose-500 to-pink-500' },
  'kokyu_waza': { label: 'Kokyu Waza', emoji: '💨', color: 'from-cyan-500 to-teal-500' },
  'atemi': { label: 'Atemi (Frappes)', emoji: '👊', color: 'from-red-500 to-rose-500' },
  'atemi_base': { label: 'Frappes de base', emoji: '👊', color: 'from-red-500 to-rose-500' },
  'suwariwaza': { label: 'Suwari Waza', emoji: '🧎', color: 'from-indigo-500 to-purple-500' },
  'suwariwaza_base': { label: 'Travail au sol', emoji: '🧎', color: 'from-indigo-500 to-purple-500' },
  'hanmi_handachi': { label: 'Hanmi Handachi', emoji: '⬆️', color: 'from-violet-500 to-purple-500' },
  'hanmi_handachi_base': { label: 'Hanmi Handachi', emoji: '⬆️', color: 'from-violet-500 to-purple-500' },
  'jo': { label: 'Jo (Bâton)', emoji: '🪵', color: 'from-amber-600 to-yellow-500' },
  'tanto': { label: 'Tanto (Couteau)', emoji: '🗡️', color: 'from-slate-500 to-zinc-500' },
  'bokken': { label: 'Bokken (Sabre)', emoji: '⚔️', color: 'from-slate-600 to-gray-500' },
};

/**
 * Récupère tous les mouvements pour un grade donné
 */
export function getMouvementsByGrade(gradeId: string): Mouvement[] {
  return ALL_MOUVEMENTS.filter(m => m.niveau === gradeId);
}

/**
 * Récupère les mouvements groupés par catégorie pour un grade
 */
export function getMouvementsByGradeGrouped(gradeId: string): Record<string, Mouvement[]> {
  const mouvements = getMouvementsByGrade(gradeId);
  const grouped: Record<string, Mouvement[]> = {};
  
  mouvements.forEach(m => {
    const cat = m.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(m);
  });
  
  return grouped;
}

/**
 * Récupère les mouvements jusqu'à un certain grade (inclus)
 * Utile pour afficher tout ce qu'un pratiquant devrait connaître
 */
export function getMouvementsUpToGrade(gradeId: string): Mouvement[] {
  const gradeOrder = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu', 'shodan', 'nidan', 'sandan', 'yondan'];
  const gradeIndex = gradeOrder.indexOf(gradeId);
  
  if (gradeIndex === -1) return [];
  
  const gradesUpTo = gradeOrder.slice(0, gradeIndex + 1);
  return ALL_MOUVEMENTS.filter(m => gradesUpTo.includes(m.niveau));
}

/**
 * Compte le nombre de mouvements par grade
 */
export function countMouvementsByGrade(): Record<string, number> {
  const counts: Record<string, number> = {};
  
  ALL_MOUVEMENTS.forEach(m => {
    if (!counts[m.niveau]) {
      counts[m.niveau] = 0;
    }
    counts[m.niveau]++;
  });
  
  return counts;
}

/**
 * Récupère un mouvement par son ID
 */
export function getMouvementById(id: string): Mouvement | undefined {
  return ALL_MOUVEMENTS.find(m => m.id === id);
}

/**
 * Recherche de mouvements par nom ou description
 */
export function searchMouvements(query: string): Mouvement[] {
  const q = query.toLowerCase();
  return ALL_MOUVEMENTS.filter(m => 
    m.nom.toLowerCase().includes(q) ||
    m.nom_japonais?.includes(q) ||
    m.traduction?.toLowerCase().includes(q) ||
    m.description?.toLowerCase().includes(q)
  );
}

export { ALL_MOUVEMENTS };
export default getMouvementsByGrade;
