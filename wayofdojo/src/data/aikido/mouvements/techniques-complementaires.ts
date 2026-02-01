/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - TECHNIQUES COMPLÉMENTAIRES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Techniques supplémentaires pour compléter la bibliothèque
 */

import type { Mouvement } from '../types';

// =============================================================================
// TECHNIQUES COMPLÉMENTAIRES
// =============================================================================

export const TECHNIQUES_COMPLEMENTAIRES: Mouvement[] = [
  // Variantes Nikkyo
  {
    id: 'nikkyo_ude_osae',
    nom: 'Nikkyo Ude Osae',
    nom_japonais: '二教腕押さえ',
    traduction: 'Deuxième principe - contrôle du bras',
    description: 'Variante de nikkyo avec contrôle étendu du bras, utilisée notamment en situation debout.',
    niveau: '4e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Contrôle simultané du poignet et du coude',
      'Pression progressive sur le poignet',
      'Maintenir Uke en déséquilibre'
    ],
    erreurs_communes: [
      'Appliquer trop de pression trop vite',
      'Perdre le contrôle du coude'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/nikkyo_ude_osae.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/nikkyo/' }
  },

  // Udekime Nage
  {
    id: 'udekime_nage',
    nom: 'Udekime Nage',
    nom_japonais: '腕極め投げ',
    traduction: 'Projection par clé de bras',
    description: 'Projection utilisant une clé de bras (coude) pour projeter Uke.',
    niveau: '3e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Contrôle du coude de Uke',
      'Utiliser le déséquilibre pour projeter',
      'Accompagner la chute'
    ],
    erreurs_communes: [
      'Forcer sur le coude (risque de blessure)',
      'Projection sans déséquilibre préalable'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/udekime_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/udekime_nage/' }
  },

  // Sokumen Irimi Nage
  {
    id: 'sokumen_irimi_nage',
    nom: 'Sokumen Irimi Nage',
    nom_japonais: '側面入身投げ',
    traduction: 'Projection d\'entrée latérale',
    description: 'Variante d\'Irimi Nage avec entrée sur le côté de Uke.',
    niveau: '2e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Entrer sur le côté de Uke',
      'Contrôle de la nuque depuis le côté',
      'Rotation pour projeter'
    ],
    erreurs_communes: [
      'Entrée frontale au lieu de latérale',
      'Perdre le contrôle pendant la rotation'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/sokumen_irimi_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/sokumen_irimi_nage/' }
  },

  // Ushiro Kiri Otoshi
  {
    id: 'ushiro_kiri_otoshi',
    nom: 'Ushiro Kiri Otoshi',
    nom_japonais: '後ろ切り落とし',
    traduction: 'Coupe tombante arrière',
    description: 'Technique de projection par coupe descendante sur attaque arrière.',
    niveau: '1er_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Réaction immédiate à la saisie arrière',
      'Coupe descendante puissante',
      'Utiliser le poids du corps'
    ],
    erreurs_communes: [
      'Réaction tardive',
      'Coupe avec les bras seulement'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ushiro_kiri_otoshi.mp4' },
    animation: { phases: 3, images: [null, null, null], placeholder: '/animations/ushiro_kiri_otoshi/' }
  },

  // Kata Dori Nikyo
  {
    id: 'kata_dori_nikkyo',
    nom: 'Kata Dori Nikkyo',
    nom_japonais: '肩取り二教',
    traduction: 'Deuxième principe sur saisie d\'épaule',
    description: 'Application de Nikkyo depuis une saisie de l\'épaule ou du revers.',
    niveau: '4e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Contrôler le bras qui saisit',
      'Appliquer nikkyo sur le poignet',
      'Amener au sol en spirale'
    ],
    erreurs_communes: [
      'Négliger la saisie de l\'épaule',
      'Appliquer nikkyo sans contrôle du bras'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/kata_dori_nikkyo.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/kata_dori_nikkyo/' }
  },

  // Morote Dori Kokyu Nage
  {
    id: 'morote_dori_kokyu_nage',
    nom: 'Morote Dori Kokyu Nage',
    nom_japonais: '諸手取り呼吸投げ',
    traduction: 'Projection respiratoire sur saisie à deux mains',
    description: 'Kokyu Nage appliqué quand les deux mains de Uke saisissent un poignet de Tori.',
    niveau: '5e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Utiliser le kokyu pour lever les bras de Uke',
      'Ne pas forcer contre la saisie',
      'Projeter avec le mouvement du corps'
    ],
    erreurs_communes: [
      'Tirer contre la saisie',
      'Utiliser la force musculaire'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/morote_dori_kokyu_nage.mp4' },
    animation: { phases: 3, images: [null, null, null], placeholder: '/animations/morote_dori_kokyu_nage/' }
  },

  // Ushiro Ryote Dori Shiho Nage
  {
    id: 'ushiro_ryote_dori_shiho_nage',
    nom: 'Ushiro Ryote Dori Shiho Nage',
    nom_japonais: '後ろ両手取り四方投げ',
    traduction: 'Shiho Nage sur saisie arrière des deux poignets',
    description: 'Application de Shiho Nage depuis une saisie par derrière des deux poignets.',
    niveau: 'shodan',
    categorie: 'ushiro_waza',
    points_cles: [
      'Réagir avant que la saisie soit établie',
      'Pivoter pour créer l\'ouverture',
      'Appliquer shiho nage sur un bras'
    ],
    erreurs_communes: [
      'Attendre que les deux mains soient saisies',
      'Essayer de dégager les deux mains en même temps'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ushiro_ryote_shiho_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/ushiro_ryote_shiho_nage/' }
  },

  // Ushiro Ryokata Dori Kote Gaeshi
  {
    id: 'ushiro_ryokata_dori_kote_gaeshi',
    nom: 'Ushiro Ryokata Dori Kote Gaeshi',
    nom_japonais: '後ろ両肩取り小手返し',
    traduction: 'Kote Gaeshi sur saisie arrière des épaules',
    description: 'Application de Kote Gaeshi depuis une saisie par derrière des deux épaules.',
    niveau: 'shodan',
    categorie: 'ushiro_waza',
    points_cles: [
      'Baisser le centre pour déséquilibrer',
      'Saisir une main de Uke',
      'Appliquer kote gaeshi en pivotant'
    ],
    erreurs_communes: [
      'Rester haut (facilite la saisie)',
      'Forcer pour se dégager'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ushiro_ryokata_kote_gaeshi.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/ushiro_ryokata_kote_gaeshi/' }
  }
];

export default TECHNIQUES_COMPLEMENTAIRES;
