/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - OSAE WAZA (TECHNIQUES D'IMMOBILISATION)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Les 5 principes fondamentaux (Gokyo) + variations
 */

import type { Mouvement } from '../types';

// =============================================================================
// IKKYO - PREMIER PRINCIPE (BRAS TENDU)
// =============================================================================

export const IKKYO: Mouvement[] = [
  {
    id: 'ikkyo_omote',
    nom: 'Ikkyo Omote',
    nom_japonais: '一教表',
    traduction: 'Premier principe - côté ouvert',
    description: 'Première technique fondamentale. Contrôle du bras tendu de Uke, entrée directe (omote). Immobilisation au sol par pression sur le coude et le poignet.',
    niveau: '6e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Couper vers le bas sur le bras de Uke',
      'Contrôler le coude ET le poignet',
      'Entrer directement (irimi)',
      'Amener Uke au sol en spirale',
      'Immobilisation : genou près de l\'aisselle, contrôle du poignet',
      'Pression perpendiculaire au sol sur le coude'
    ],
    erreurs_communes: [
      'Tirer le bras au lieu de couper',
      'Perdre le contrôle du coude',
      'Immobilisation avec le bras de Uke plié',
      'Genou trop loin de l\'aisselle',
      'Pression dans le mauvais angle'
    ],
    applications: ['Immobilisation de base', 'Contrôle au sol', 'Self-défense'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ikkyo_omote.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/ikkyo/' }
  },
  {
    id: 'ikkyo_ura',
    nom: 'Ikkyo Ura',
    nom_japonais: '一教裏',
    traduction: 'Premier principe - côté fermé',
    description: 'Version ura : pivot (tenkan) pour passer derrière Uke avant l\'immobilisation.',
    niveau: '6e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Tenkan fluide autour du bras de Uke',
      'Maintenir le contrôle pendant le pivot',
      'Amener Uke en déséquilibre arrière puis au sol',
      'Même immobilisation finale que omote',
      'Le pivot crée le déséquilibre'
    ],
    erreurs_communes: [
      'Pivot trop large',
      'Perdre le contrôle pendant le tenkan',
      'Forcer au lieu de guider',
      'Immobilisation dans le mauvais sens'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ikkyo_ura.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/ikkyo/' }
  }
];

// =============================================================================
// NIKKYO - DEUXIÈME PRINCIPE (TORSION DU POIGNET)
// =============================================================================

export const NIKKYO: Mouvement[] = [
  {
    id: 'nikkyo_omote',
    nom: 'Nikkyo Omote',
    nom_japonais: '二教表',
    traduction: 'Deuxième principe - côté ouvert',
    description: 'Contrôle par torsion du poignet vers l\'intérieur. Technique douloureuse mais contrôlable. Version omote avec entrée directe.',
    niveau: '5e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Saisie correcte du poignet de Uke',
      'Rotation du poignet vers l\'intérieur (vers Uke)',
      'Coude de Uke maintenu vers le haut',
      'Utiliser le corps, pas seulement les mains',
      'Pression progressive, pas brutale',
      'Immobilisation avec contrôle du poignet et du coude'
    ],
    erreurs_communes: [
      'Torsion trop brutale (risque de blessure)',
      'Mauvais angle de torsion',
      'Utiliser uniquement les mains',
      'Perdre le contrôle du coude',
      'Immobilisation instable'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/nikkyo_omote.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/nikkyo/' }
  },
  {
    id: 'nikkyo_ura',
    nom: 'Nikkyo Ura',
    nom_japonais: '二教裏',
    traduction: 'Deuxième principe - côté fermé',
    description: 'Version ura avec pivot. La torsion est appliquée après le tenkan.',
    niveau: '5e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Tenkan puis application de nikkyo',
      'Le pivot aide à créer l\'angle de torsion',
      'Maintenir Uke en déséquilibre constant',
      'Descente au sol en spirale'
    ],
    erreurs_communes: [
      'Appliquer nikkyo avant le pivot',
      'Perdre la connexion pendant le tenkan',
      'Angle de torsion incorrect après pivot'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/nikkyo_ura.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/nikkyo/' }
  }
];

// =============================================================================
// SANKYO - TROISIÈME PRINCIPE (TORSION VERS L'EXTÉRIEUR)
// =============================================================================

export const SANKYO: Mouvement[] = [
  {
    id: 'sankyo_omote',
    nom: 'Sankyo Omote',
    nom_japonais: '三教表',
    traduction: 'Troisième principe - côté ouvert',
    description: 'Contrôle par torsion du poignet vers l\'extérieur et vers le haut. Technique qui permet un excellent contrôle.',
    niveau: '4e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Saisie spécifique : pouce sur le dos de la main',
      'Rotation vers l\'extérieur et vers le haut',
      'Coude de Uke pointe vers le bas',
      'Spirale descendante pour amener au sol',
      'Immobilisation avec contrôle de l\'épaule'
    ],
    erreurs_communes: [
      'Mauvaise saisie de la main',
      'Torsion dans le mauvais sens',
      'Forcer sur le poignet sans le corps',
      'Perdre le contrôle de l\'épaule'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/sankyo_omote.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/sankyo/' }
  },
  {
    id: 'sankyo_ura',
    nom: 'Sankyo Ura',
    nom_japonais: '三教裏',
    traduction: 'Troisième principe - côté fermé',
    description: 'Version ura avec pivot et torsion. Particulièrement efficace sur ushiro waza.',
    niveau: '4e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Pivot fluide avant l\'application',
      'Utiliser le mouvement de tenkan pour la torsion',
      'Contrôle constant de l\'épaule de Uke',
      'Descente contrôlée au sol'
    ],
    erreurs_communes: [
      'Appliquer la torsion trop tôt',
      'Perdre le contrôle pendant le pivot',
      'Descente trop rapide'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/sankyo_ura.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/sankyo/' }
  }
];

// =============================================================================
// YONKYO - QUATRIÈME PRINCIPE (POINT DE PRESSION)
// =============================================================================

export const YONKYO: Mouvement[] = [
  {
    id: 'yonkyo_omote',
    nom: 'Yonkyo Omote',
    nom_japonais: '四教表',
    traduction: 'Quatrième principe - côté ouvert',
    description: 'Contrôle par pression sur un point sensible de l\'avant-bras (nerf radial). Technique qui demande précision.',
    niveau: '3e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Localiser le point de pression (face interne avant-bras)',
      'Pression avec la base de l\'index (knuckle)',
      'Combiner avec contrôle du coude',
      'Utiliser le poids du corps, pas la force',
      'Descente au sol par la douleur contrôlée'
    ],
    erreurs_communes: [
      'Mauvais emplacement du point de pression',
      'Utiliser le bout du doigt au lieu de la base',
      'Pression trop forte ou trop faible',
      'Négliger le contrôle du coude',
      'Technique inefficace sur certaines personnes'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/yonkyo_omote.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/yonkyo/' }
  },
  {
    id: 'yonkyo_ura',
    nom: 'Yonkyo Ura',
    nom_japonais: '四教裏',
    traduction: 'Quatrième principe - côté fermé',
    description: 'Version ura avec pivot. La pression est maintenue pendant le tenkan.',
    niveau: '3e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Maintenir la pression pendant le pivot',
      'Le mouvement aide à intensifier la pression',
      'Contrôle continu jusqu\'à l\'immobilisation'
    ],
    erreurs_communes: [
      'Perdre le point de pression pendant le pivot',
      'Relâcher la pression trop tôt'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/yonkyo_ura.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/yonkyo/' }
  }
];

// =============================================================================
// GOKYO - CINQUIÈME PRINCIPE (CONTRE COUTEAU)
// =============================================================================

export const GOKYO: Mouvement[] = [
  {
    id: 'gokyo_omote',
    nom: 'Gokyo Omote',
    nom_japonais: '五教表',
    traduction: 'Cinquième principe - côté ouvert',
    description: 'Technique spécifique pour le désarmement. Contrôle du poignet permettant d\'ouvrir la main de Uke pour lui faire lâcher une arme.',
    niveau: '2e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Saisie inversée par rapport à ikkyo',
      'Pression sur le dos du poignet vers l\'extérieur',
      'Force l\'ouverture de la main (lâcher l\'arme)',
      'Contrôle de l\'arme après désarmement',
      'Immobilisation adaptée (arme éloignée)'
    ],
    erreurs_communes: [
      'Saisie identique à ikkyo (inefficace)',
      'Ne pas sécuriser l\'arme après désarmement',
      'Oublier que l\'arme peut être récupérée'
    ],
    applications: ['Désarmement de tanto', 'Contrôle d\'arme blanche'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/gokyo_omote.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/gokyo/' }
  },
  {
    id: 'gokyo_ura',
    nom: 'Gokyo Ura',
    nom_japonais: '五教裏',
    traduction: 'Cinquième principe - côté fermé',
    description: 'Version ura de gokyo, avec pivot. Utilisé notamment sur yokomen uchi avec arme.',
    niveau: '2e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Pivot en maintenant le contrôle de l\'arme',
      'Désarmement pendant ou après le tenkan',
      'Sécuriser l\'arme immédiatement'
    ],
    erreurs_communes: [
      'Laisser l\'arme accessible à Uke',
      'Pivot trop large exposant au danger'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/gokyo_ura.mp4' },
    animation: { phases: 5, images: [null, null, null, null, null], placeholder: '/animations/gokyo/' }
  }
];

// =============================================================================
// ROKKYO - SIXIÈME PRINCIPE (HIJI KIME OSAE)
// =============================================================================

export const ROKKYO: Mouvement[] = [
  {
    id: 'rokkyo',
    nom: 'Rokkyo / Hiji Kime Osae',
    nom_japonais: '六教 / 肘極め押さえ',
    traduction: 'Sixième principe / Immobilisation du coude',
    description: 'Technique avancée de contrôle par hyperextension contrôlée du coude. Très efficace mais demande du contrôle.',
    niveau: '1er_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Contrôle du poignet ET du coude',
      'Extension du bras de Uke',
      'Pression sur le coude vers l\'hyperextension',
      'Contrôle total - technique dangereuse',
      'Relâcher immédiatement si Uke tape'
    ],
    erreurs_communes: [
      'Aller trop vite en hyperextension',
      'Ne pas écouter le signal de soumission',
      'Perdre le contrôle du poignet'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/rokkyo.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/rokkyo/' }
  }
];

// =============================================================================
// HIJI KIME OSAE - CONTRÔLE DU COUDE
// =============================================================================

export const HIJI_KIME: Mouvement[] = [
  {
    id: 'hiji_kime_osae',
    nom: 'Hiji Kime Osae',
    nom_japonais: '肘極め押さえ',
    traduction: 'Immobilisation par clé de coude',
    description: 'Immobilisation debout par contrôle du coude en extension. Permet de guider ou immobiliser sans aller au sol.',
    niveau: '2e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Contrôle du poignet, bras tendu',
      'Pression sur le coude de Uke',
      'Garder Uke en déséquilibre avant',
      'Peut mener à une projection ou immobilisation au sol'
    ],
    erreurs_communes: [
      'Laisser Uke plier le bras',
      'Pression dans le mauvais angle',
      'Perdre le contrôle du centre de Uke'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/hiji_kime.mp4' },
    animation: { phases: 3, images: [null, null, null], placeholder: '/animations/hiji_kime/' }
  }
];

// =============================================================================
// UDE GARAMI - CLÉ DE BRAS
// =============================================================================

export const UDE_GARAMI: Mouvement[] = [
  {
    id: 'ude_garami',
    nom: 'Ude Garami',
    nom_japonais: '腕絡み',
    traduction: 'Enchevêtrement du bras',
    description: 'Technique de contrôle où le bras de Uke est enroulé/enchevêtré. Plusieurs variantes possibles.',
    niveau: '2e_kyu',
    categorie: 'osae_waza',
    points_cles: [
      'Enrouler le bras de Uke correctement',
      'Maintenir une pression constante',
      'Contrôler l\'épaule pour éviter l\'évasion',
      'Immobilisation stable au sol'
    ],
    erreurs_communes: [
      'Enroulement incorrect',
      'Pression insuffisante',
      'Laisser l\'épaule libre'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/ude_garami.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/ude_garami/' }
  }
];

// =============================================================================
// EXPORT GLOBAL
// =============================================================================

export const ALL_OSAE_WAZA: Mouvement[] = [
  ...IKKYO,
  ...NIKKYO,
  ...SANKYO,
  ...YONKYO,
  ...GOKYO,
  ...ROKKYO,
  ...HIJI_KIME,
  ...UDE_GARAMI,
];

export default ALL_OSAE_WAZA;
