/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - TECHNIQUES D'ARMES CONVERTIES EN FORMAT MOUVEMENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Ce fichier convertit les techniques d'armes (Jo, Bokken, Tanto) 
 * au format Mouvement pour les intégrer dans la bibliothèque.
 */

import type { Mouvement, NiveauGrade } from '../types';
import { TECHNIQUES_JO } from '../armes/jo';
import { TECHNIQUES_BOKKEN } from '../armes/bokken';
import { TECHNIQUES_TANTO } from '../armes/tanto';

// =============================================================================
// JO (BÂTON) - 28 techniques
// =============================================================================

export const JO_MOUVEMENTS: Mouvement[] = TECHNIQUES_JO.map(tech => ({
  id: tech.id,
  nom: tech.nom,
  nom_japonais: tech.nom.includes('(') ? tech.nom.split('(')[0].trim() : tech.nom,
  traduction: tech.description,
  description: `Technique au Jo (bâton) : ${tech.description}`,
  niveau: tech.niveau as NiveauGrade,
  categorie: tech.phase3?.type === 'suburi' ? 'jo_suburi' : 
             tech.phase3?.type === 'kata' ? 'jo_kata' :
             tech.phase3?.type === 'kumijo' ? 'jo_kumijo' : 'jo_techniques',
  points_cles: [
    'Maintenir la posture correcte (kamae)',
    'Coordination corps-arme (ken tai icchi)',
    'Respiration synchronisée avec le mouvement',
    'Zanshin (vigilance) après chaque mouvement'
  ],
  erreurs_communes: [
    'Utiliser les bras au lieu du corps',
    'Mauvaise distance (maai)',
    'Rythme haché ou précipité'
  ],
  video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: `/videos/armes/jo/${tech.id}.mp4` },
  animation: { phases: 3, images: [null, null, null], placeholder: `/animations/jo/${tech.id}/` }
}));

// =============================================================================
// BOKKEN (SABRE EN BOIS) - 29 techniques
// =============================================================================

export const BOKKEN_MOUVEMENTS: Mouvement[] = TECHNIQUES_BOKKEN.map(tech => ({
  id: tech.id,
  nom: tech.nom,
  nom_japonais: tech.nom.includes('(') ? tech.nom.split('(')[0].trim() : tech.nom,
  traduction: tech.description,
  description: `Technique au Bokken (sabre) : ${tech.description}`,
  niveau: tech.niveau as NiveauGrade,
  categorie: tech.phase3?.type === 'suburi' ? 'bokken_suburi' : 
             tech.phase3?.type === 'kata' ? 'bokken_kata' :
             tech.phase3?.type === 'kumitachi' ? 'bokken_kumitachi' : 'bokken_techniques',
  points_cles: [
    'Saisie correcte du bokken (tenouchi)',
    'Coupe avec le tranchant (hasuji)',
    'Extension complète à chaque coupe',
    'Zanshin après chaque technique'
  ],
  erreurs_communes: [
    'Saisir trop fort le bokken',
    'Couper avec les bras au lieu du corps',
    'Mauvais angle de coupe (hasuji)'
  ],
  video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: `/videos/armes/bokken/${tech.id}.mp4` },
  animation: { phases: 3, images: [null, null, null], placeholder: `/animations/bokken/${tech.id}/` }
}));

// =============================================================================
// TANTO (COUTEAU) - 19 techniques
// =============================================================================

export const TANTO_MOUVEMENTS: Mouvement[] = TECHNIQUES_TANTO.map(tech => ({
  id: tech.id,
  nom: tech.nom,
  nom_japonais: tech.nom.includes('(') ? tech.nom.split('(')[0].trim() : tech.nom,
  traduction: tech.description,
  description: `Technique de Tanto Dori (défense contre couteau) : ${tech.description}`,
  niveau: tech.niveau as NiveauGrade,
  categorie: 'tanto_dori',
  points_cles: [
    'Éviter la lame en priorité (tai sabaki)',
    'Contrôler la main armée immédiatement',
    'Désarmer avant de projeter',
    'Sécuriser l\'arme après désarmement'
  ],
  erreurs_communes: [
    'Se focaliser sur l\'arme au lieu de la main',
    'Entrer trop tôt ou trop tard',
    'Oublier de désarmer'
  ],
  video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: `/videos/armes/tanto/${tech.id}.mp4` },
  animation: { phases: 3, images: [null, null, null], placeholder: `/animations/tanto/${tech.id}/` }
}));

// =============================================================================
// EXPORT GLOBAL - TOUTES LES ARMES
// =============================================================================

export const ALL_ARMES_MOUVEMENTS: Mouvement[] = [
  ...JO_MOUVEMENTS,
  ...BOKKEN_MOUVEMENTS,
  ...TANTO_MOUVEMENTS,
];

// Statistiques
export const ARMES_STATS = {
  jo: JO_MOUVEMENTS.length,
  bokken: BOKKEN_MOUVEMENTS.length,
  tanto: TANTO_MOUVEMENTS.length,
  total: ALL_ARMES_MOUVEMENTS.length
};

export default ALL_ARMES_MOUVEMENTS;
