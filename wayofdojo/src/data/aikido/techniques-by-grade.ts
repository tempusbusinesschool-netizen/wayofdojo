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
import { ALL_TECHNIQUES_DAN } from './mouvements/dan-techniques';
import { ALL_NAGE_WAZA } from './mouvements/nage-waza';
import { ALL_OSAE_WAZA } from './mouvements/osae-waza';
import { ALL_ARMES_MOUVEMENTS } from './mouvements/armes-mouvements';

// Tous les mouvements combinés (Kyu + Dan + Projections + Immobilisations + Armes)
const ALL_MOUVEMENTS: Mouvement[] = [
  ...UKEMI,
  ...TAI_SABAKI,
  ...KANSETSU_WAZA,
  ...(KAMAE as unknown as Mouvement[]),
  ...SUWARIWAZA,
  ...ATEMI,
  ...HANMI_HANDACHI,
  ...KOKYU_WAZA,
  ...ALL_TECHNIQUES_DAN,
  ...ALL_NAGE_WAZA,
  ...ALL_OSAE_WAZA,
  ...ALL_ARMES_MOUVEMENTS,
];

// Catégories de mouvements avec labels
export const CATEGORIES_MOUVEMENTS: Record<string, { label: string; emoji: string; color: string }> = {
  // Ukemi (Chutes)
  'ukemi_base': { label: 'Chutes de base', emoji: '🌀', color: 'from-blue-500 to-cyan-500' },
  'ukemi_avance': { label: 'Chutes avancées', emoji: '🌊', color: 'from-blue-600 to-blue-500' },
  'ukemi_special': { label: 'Chutes spéciales', emoji: '🎯', color: 'from-indigo-500 to-blue-500' },
  
  // Déplacements
  'tai_sabaki': { label: 'Déplacements', emoji: '👣', color: 'from-emerald-500 to-green-500' },
  'deplacement_base': { label: 'Déplacements de base', emoji: '👣', color: 'from-emerald-500 to-green-500' },
  'deplacement_avance': { label: 'Déplacements avancés', emoji: '🦶', color: 'from-emerald-600 to-teal-500' },
  
  // Postures (Kamae)
  'kamae': { label: 'Postures', emoji: '🧘', color: 'from-purple-500 to-violet-500' },
  'kamae_base': { label: 'Postures de base', emoji: '🧘', color: 'from-purple-500 to-violet-500' },
  'kamae_debout': { label: 'Postures debout', emoji: '🧍', color: 'from-purple-500 to-violet-500' },
  'kamae_sol': { label: 'Postures au sol', emoji: '🧎', color: 'from-purple-600 to-indigo-500' },
  'kamae_special': { label: 'Postures spéciales', emoji: '🧘‍♂️', color: 'from-violet-500 to-purple-600' },
  
  // Techniques de base
  'osae_waza': { label: 'Immobilisations', emoji: '🔒', color: 'from-amber-500 to-orange-500' },
  'nage_waza': { label: 'Projections', emoji: '🌪️', color: 'from-rose-500 to-pink-500' },
  
  // Kokyu Waza
  'kokyu_waza': { label: 'Kokyu Waza', emoji: '💨', color: 'from-cyan-500 to-teal-500' },
  'kokyu_base': { label: 'Kokyu de base', emoji: '💨', color: 'from-cyan-500 to-teal-500' },
  'kokyu_exercice': { label: 'Exercices Kokyu', emoji: '🌬️', color: 'from-cyan-400 to-sky-500' },
  'kokyu_projection': { label: 'Projections Kokyu', emoji: '🌊', color: 'from-cyan-600 to-blue-500' },
  
  // Atemi (Frappes)
  'atemi': { label: 'Atemi', emoji: '👊', color: 'from-red-500 to-rose-500' },
  'atemi_base': { label: 'Frappes de base', emoji: '👊', color: 'from-red-500 to-rose-500' },
  'atemi_main': { label: 'Frappes main ouverte', emoji: '🖐️', color: 'from-red-400 to-orange-500' },
  'atemi_poing': { label: 'Frappes poing', emoji: '👊', color: 'from-red-600 to-rose-600' },
  'atemi_coude': { label: 'Frappes coude', emoji: '💪', color: 'from-red-700 to-rose-700' },
  'atemi_pied': { label: 'Frappes pied', emoji: '🦵', color: 'from-orange-500 to-red-500' },
  
  // Suwari Waza (Travail au sol)
  'suwariwaza': { label: 'Suwari Waza', emoji: '🧎', color: 'from-indigo-500 to-purple-500' },
  'suwariwaza_base': { label: 'Travail au sol', emoji: '🧎', color: 'from-indigo-500 to-purple-500' },
  'sw_immobilisation': { label: 'Immobilisations au sol', emoji: '🔒', color: 'from-indigo-600 to-purple-600' },
  'sw_projection': { label: 'Projections au sol', emoji: '🌀', color: 'from-indigo-500 to-violet-500' },
  'sw_kokyu': { label: 'Kokyu au sol', emoji: '💨', color: 'from-indigo-400 to-cyan-500' },
  
  // Hanmi Handachi
  'hanmi_handachi': { label: 'Hanmi Handachi', emoji: '⬆️', color: 'from-violet-500 to-purple-500' },
  'hanmi_handachi_base': { label: 'Hanmi Handachi', emoji: '⬆️', color: 'from-violet-500 to-purple-500' },
  'hh_immobilisation': { label: 'HH Immobilisations', emoji: '🔒', color: 'from-violet-600 to-purple-600' },
  'hh_projection': { label: 'HH Projections', emoji: '🌀', color: 'from-violet-500 to-indigo-500' },
  'hh_kokyu': { label: 'HH Kokyu', emoji: '💨', color: 'from-violet-400 to-cyan-500' },
  
  // Exercices
  'exercice_base': { label: 'Exercices de base', emoji: '📚', color: 'from-slate-500 to-gray-500' },
  
  // Armes - Base
  'jo': { label: 'Jo (Bâton)', emoji: '🪵', color: 'from-amber-600 to-yellow-500' },
  'tanto': { label: 'Tanto (Couteau)', emoji: '🗡️', color: 'from-slate-500 to-zinc-500' },
  'bokken': { label: 'Bokken (Sabre)', emoji: '⚔️', color: 'from-slate-600 to-gray-500' },
  
  // Jo - Catégories détaillées
  'jo_suburi': { label: 'Jo Suburi (Mouvements solo)', emoji: '🪵', color: 'from-amber-500 to-yellow-500' },
  'jo_kata': { label: 'Jo Kata (Formes)', emoji: '📜', color: 'from-amber-600 to-orange-500' },
  'jo_kumijo': { label: 'Kumi Jo (Travail à deux)', emoji: '🤝', color: 'from-amber-700 to-red-500' },
  'jo_techniques': { label: 'Techniques au Jo', emoji: '🪵', color: 'from-amber-600 to-yellow-600' },
  
  // Bokken - Catégories détaillées  
  'bokken_suburi': { label: 'Ken Suburi (Coupes solo)', emoji: '⚔️', color: 'from-slate-500 to-gray-500' },
  'bokken_kata': { label: 'Ken Kata (Formes)', emoji: '📜', color: 'from-slate-600 to-zinc-600' },
  'bokken_kumitachi': { label: 'Kumi Tachi (Travail à deux)', emoji: '🤝', color: 'from-slate-700 to-gray-700' },
  'bokken_techniques': { label: 'Techniques au Bokken', emoji: '⚔️', color: 'from-slate-600 to-gray-600' },
  
  // Catégories Dan
  'ushiro_waza': { label: 'Ushiro Waza (Techniques arrière)', emoji: '🔄', color: 'from-indigo-600 to-purple-600' },
  'kaeshi_waza': { label: 'Kaeshi Waza (Contre-techniques)', emoji: '↩️', color: 'from-rose-600 to-pink-600' },
  'henka_waza': { label: 'Henka Waza (Variations)', emoji: '🔀', color: 'from-violet-600 to-purple-600' },
  'randori': { label: 'Randori (Combat libre)', emoji: '⚡', color: 'from-amber-600 to-red-600' },
  'tanto_dori': { label: 'Tanto Dori (Défense couteau)', emoji: '🗡️', color: 'from-red-700 to-rose-700' },
  'tachi_dori': { label: 'Tachi Dori (Défense sabre)', emoji: '⚔️', color: 'from-slate-700 to-zinc-700' },
  'jo_dori': { label: 'Jo Dori (Défense bâton)', emoji: '🪵', color: 'from-amber-700 to-orange-700' },
  'armes_avancees': { label: 'Armes avancées', emoji: '🎯', color: 'from-slate-600 to-slate-700' },
  'nage_waza_avance': { label: 'Projections avancées', emoji: '🌪️', color: 'from-rose-600 to-red-600' },
  'oyo_waza': { label: 'Oyo Waza (Applications)', emoji: '✨', color: 'from-amber-500 to-yellow-500' },
  'aiki_jutsu': { label: 'Aiki no Jutsu', emoji: '🌀', color: 'from-cyan-600 to-blue-600' },
  'pedagogie': { label: 'Pédagogie', emoji: '📖', color: 'from-emerald-600 to-green-600' },
  'programme_complet': { label: 'Programme complet', emoji: '📋', color: 'from-slate-600 to-slate-700' },
  'buki_waza': { label: 'Buki Waza (Armes)', emoji: '⚔️', color: 'from-amber-600 to-orange-600' },
  'ken_tai_jo': { label: 'Ken Tai Jo', emoji: '🗡️', color: 'from-slate-600 to-amber-600' },
  'attaques_combinees': { label: 'Attaques combinées', emoji: '💥', color: 'from-red-600 to-orange-600' },
  'takemusu': { label: 'Takemusu Aiki', emoji: '🌟', color: 'from-amber-500 to-yellow-400' },
  'ki_no_nagare': { label: 'Ki no Nagare', emoji: '🌊', color: 'from-cyan-500 to-blue-500' },
  'kuden': { label: 'Kuden (Enseignement oral)', emoji: '📜', color: 'from-purple-600 to-indigo-600' },
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
 * Récupère TOUS les mouvements de la bibliothèque
 */
export function getAllMouvements(): Mouvement[] {
  return ALL_MOUVEMENTS;
}

/**
 * Récupère TOUS les mouvements groupés par catégorie
 */
export function getAllMouvementsGrouped(): Record<string, Mouvement[]> {
  const grouped: Record<string, Mouvement[]> = {};
  
  ALL_MOUVEMENTS.forEach(m => {
    const cat = m.categorie || 'autre';
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(m);
  });
  
  return grouped;
}

/**
 * Compte total des mouvements
 */
export function getTotalMouvements(): number {
  return ALL_MOUVEMENTS.length;
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
