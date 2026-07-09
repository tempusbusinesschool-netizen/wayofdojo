/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - NAGE WAZA (TECHNIQUES DE PROJECTION)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Bibliothèque complète des projections en Aïkido
 */

import type { Mouvement } from '../types';

// =============================================================================
// SHIHO NAGE - PROJECTION DANS LES 4 DIRECTIONS
// =============================================================================

export const SHIHO_NAGE: Mouvement[] = [
  {
    id: 'shiho_nage_omote',
    nom: 'Shiho Nage Omote',
    nom_japonais: '四方投げ表',
    traduction: 'Projection 4 directions - côté ouvert',
    description: 'Projection par rotation du bras de Uke dans 4 directions. Version omote : Tori entre directement devant Uke.',
    niveau: '6e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Saisir le poignet en coupant vers le bas',
      'Amener la main de Uke vers son épaule opposée',
      'Couper vers le bas en gardant le centre',
      'Rotation des hanches pour la projection',
      'Garder les coudes près du corps'
    ],
    erreurs_communes: [
      'Lever la main de Uke trop haut (douleur épaule)',
      'Projection avec les bras au lieu des hanches',
      'Perdre le contact avec le centre de Uke',
      'Pas assez de déséquilibre initial'
    ],
    applications: ['Défense sur saisie de poignet', 'Contrôle d\'un agresseur'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/shiho_nage_omote.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/shiho_nage/' }
  },
  {
    id: 'shiho_nage_ura',
    nom: 'Shiho Nage Ura',
    nom_japonais: '四方投げ裏',
    traduction: 'Projection 4 directions - côté fermé',
    description: 'Version ura : Tori pivote (tenkan) pour se placer derrière Uke avant la projection.',
    niveau: '6e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Tenkan fluide pour passer derrière Uke',
      'Maintenir la connexion pendant le pivot',
      'Amener Uke en déséquilibre arrière',
      'Couper vers le bas dans la direction du déséquilibre',
      'Contrôler la chute de Uke'
    ],
    erreurs_communes: [
      'Pivot trop large perdant la connexion',
      'Forcer la technique au lieu de guider',
      'Projection dans la mauvaise direction',
      'Lâcher le contrôle trop tôt'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/shiho_nage_ura.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/shiho_nage/' }
  }
];

// =============================================================================
// IRIMI NAGE - PROJECTION D'ENTRÉE
// =============================================================================

export const IRIMI_NAGE: Mouvement[] = [
  {
    id: 'irimi_nage',
    nom: 'Irimi Nage',
    nom_japonais: '入身投げ',
    traduction: 'Projection d\'entrée',
    description: 'Projection emblématique de l\'Aïkido. Tori entre dans l\'espace de Uke et projette en utilisant un mouvement circulaire du bras sur le cou/menton.',
    niveau: '6e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Irimi décisif dans l\'espace de Uke',
      'Contrôle de la tête/nuque de Uke',
      'Déséquilibre arrière puis avant',
      'Projection circulaire, pas linéaire',
      'Accompagner Uke jusqu\'au sol'
    ],
    erreurs_communes: [
      'Frapper la gorge au lieu de guider',
      'Entrée hésitante ou incomplète',
      'Utiliser la force des bras',
      'Projection trop verticale (dangereuse)'
    ],
    applications: ['Défense contre coup de poing', 'Contrôle d\'un agresseur'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/irimi_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/irimi_nage/' }
  },
  {
    id: 'irimi_nage_kokyu',
    nom: 'Irimi Nage Kokyu',
    nom_japonais: '入身投げ呼吸',
    traduction: 'Projection d\'entrée avec respiration',
    description: 'Version avancée avec utilisation du kokyu (respiration/énergie) pour une projection plus fluide.',
    niveau: '3e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Synchroniser la respiration avec le mouvement',
      'Extension du ki vers l\'avant',
      'Fluidité totale sans à-coup',
      'Connexion énergétique avec Uke'
    ],
    erreurs_communes: [
      'Forcer au lieu de respirer',
      'Mouvement saccadé',
      'Perdre la connexion énergétique'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/irimi_nage_kokyu.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/irimi_nage/' }
  }
];

// =============================================================================
// KOTE GAESHI - RETOURNEMENT DE POIGNET
// =============================================================================

export const KOTE_GAESHI: Mouvement[] = [
  {
    id: 'kote_gaeshi',
    nom: 'Kote Gaeshi',
    nom_japonais: '小手返し',
    traduction: 'Retournement du poignet',
    description: 'Projection par torsion externe du poignet de Uke. Technique très efficace en self-défense.',
    niveau: '5e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Saisie correcte du poignet (pouce sur dos de la main)',
      'Rotation externe, pas vers le bas',
      'Utiliser le corps, pas seulement les mains',
      'Projection spiralée vers le sol',
      'Contrôle au sol possible (immobilisation)'
    ],
    erreurs_communes: [
      'Tordre vers le bas (blessure possible)',
      'Saisie incorrecte du poignet',
      'Utiliser uniquement la force des mains',
      'Projection trop brutale'
    ],
    applications: ['Défense contre saisie', 'Désarmement', 'Contrôle au sol'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/kote_gaeshi.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/kote_gaeshi/' }
  }
];

// =============================================================================
// KAITEN NAGE - PROJECTION ROTATIVE
// =============================================================================

export const KAITEN_NAGE: Mouvement[] = [
  {
    id: 'kaiten_nage_uchi',
    nom: 'Kaiten Nage Uchi',
    nom_japonais: '回転投げ内',
    traduction: 'Projection rotative intérieure',
    description: 'Projection par rotation. Version uchi : le bras de Uke passe à l\'intérieur.',
    niveau: '4e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Guider le bras de Uke vers le bas en spirale',
      'Rotation du corps pour créer l\'élan',
      'Projeter vers l\'avant-bas',
      'Maintenir le déséquilibre pendant la rotation'
    ],
    erreurs_communes: [
      'Tirer le bras au lieu de guider',
      'Rotation sans déséquilibre préalable',
      'Projection trop haute'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/kaiten_nage_uchi.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/kaiten_nage/' }
  },
  {
    id: 'kaiten_nage_soto',
    nom: 'Kaiten Nage Soto',
    nom_japonais: '回転投げ外',
    traduction: 'Projection rotative extérieure',
    description: 'Version soto : le bras de Uke passe à l\'extérieur, projection vers l\'extérieur.',
    niveau: '4e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Contrôler le coude et le poignet',
      'Spirale vers l\'extérieur',
      'Utiliser la rotation des hanches',
      'Accompagner jusqu\'au sol'
    ],
    erreurs_communes: [
      'Perdre le contrôle du coude',
      'Projection dans la mauvaise direction',
      'Manque de fluidité'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/kaiten_nage_soto.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/kaiten_nage/' }
  }
];

// =============================================================================
// TENCHI NAGE - PROJECTION CIEL-TERRE
// =============================================================================

export const TENCHI_NAGE: Mouvement[] = [
  {
    id: 'tenchi_nage',
    nom: 'Tenchi Nage',
    nom_japonais: '天地投げ',
    traduction: 'Projection ciel-terre',
    description: 'Projection où une main monte vers le ciel (ten) et l\'autre descend vers la terre (chi). Symbolise l\'harmonie entre les forces opposées.',
    niveau: '5e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Une main monte, une main descend simultanément',
      'Irimi au centre de Uke',
      'Extension dans les deux directions',
      'Projection par le déséquilibre créé',
      'Garder le centre stable'
    ],
    erreurs_communes: [
      'Mains pas synchronisées',
      'Entrée insuffisante',
      'Pousser au lieu d\'étendre',
      'Perdre son propre équilibre'
    ],
    applications: ['Défense sur saisie des deux mains'],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/tenchi_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/tenchi_nage/' }
  }
];

// =============================================================================
// KOKYU NAGE - PROJECTION PAR LA RESPIRATION
// =============================================================================

export const KOKYU_NAGE: Mouvement[] = [
  {
    id: 'kokyu_nage',
    nom: 'Kokyu Nage',
    nom_japonais: '呼吸投げ',
    traduction: 'Projection par la respiration',
    description: 'Famille de projections utilisant le kokyu (respiration/énergie) plutôt que des clés articulaires. Très fluide et adaptable.',
    niveau: '5e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Utiliser la respiration pour générer la puissance',
      'Guider plutôt que forcer',
      'Mouvement continu sans rupture',
      'Adapter au mouvement de Uke',
      'Extension du ki'
    ],
    erreurs_communes: [
      'Utiliser la force musculaire',
      'Bloquer sa respiration',
      'Mouvements saccadés',
      'Perdre la connexion avec Uke'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/kokyu_nage.mp4' },
    animation: { phases: 3, images: [null, null, null], placeholder: '/animations/kokyu_nage/' }
  }
];

// =============================================================================
// KOSHI NAGE - PROJECTION DE HANCHE
// =============================================================================

export const KOSHI_NAGE: Mouvement[] = [
  {
    id: 'koshi_nage',
    nom: 'Koshi Nage',
    nom_japonais: '腰投げ',
    traduction: 'Projection de hanche',
    description: 'Projection où Tori charge Uke sur sa hanche avant de le projeter. Technique puissante nécessitant un bon placement.',
    niveau: '2e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Entrer profondément sous le centre de Uke',
      'Charger Uke sur la hanche, pas le dos',
      'Rotation fluide des hanches',
      'Contrôler la descente de Uke',
      'Garder les genoux fléchis'
    ],
    erreurs_communes: [
      'Charger sur le dos (danger pour les lombaires)',
      'Entrée insuffisante',
      'Projection sans contrôle',
      'Relâcher Uke en l\'air'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/koshi_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/koshi_nage/' }
  }
];

// =============================================================================
// JUJI NAGE / JUJI GARAMI - PROJECTION EN CROIX
// =============================================================================

export const JUJI_NAGE: Mouvement[] = [
  {
    id: 'juji_nage',
    nom: 'Juji Nage',
    nom_japonais: '十字投げ',
    traduction: 'Projection en croix',
    description: 'Projection où les bras de Uke sont croisés en forme de croix (十 = jū = dix). Très efficace sur ryote dori.',
    niveau: '3e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Croiser les bras de Uke correctement',
      'Maintenir la pression sur les deux bras',
      'Utiliser la rotation du corps',
      'Projeter vers l\'avant-bas'
    ],
    erreurs_communes: [
      'Croisement incorrect des bras',
      'Perdre le contrôle d\'un bras',
      'Projection sans déséquilibre'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/juji_nage.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/juji_nage/' }
  }
];

// =============================================================================
// AIKI OTOSHI - CHUTE AIKI
// =============================================================================

export const AIKI_OTOSHI: Mouvement[] = [
  {
    id: 'aiki_otoshi',
    nom: 'Aiki Otoshi',
    nom_japonais: '合気落とし',
    traduction: 'Chute par l\'Aiki',
    description: 'Technique de sacrifice où Tori s\'abaisse pour faire chuter Uke par-dessus. Utilise le principe de l\'aiki pur.',
    niveau: '1er_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Timing parfait de l\'abaissement',
      'Guider Uke par-dessus',
      'Ne pas forcer la chute',
      'Rester connecté jusqu\'au bout'
    ],
    erreurs_communes: [
      'S\'abaisser trop tôt ou trop tard',
      'Tirer Uke au lieu de guider',
      'Perdre la connexion',
      'Chute dangereuse pour Uke'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/aiki_otoshi.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/aiki_otoshi/' }
  }
];

// =============================================================================
// SUMI OTOSHI - CHUTE DANS L'ANGLE
// =============================================================================

export const SUMI_OTOSHI: Mouvement[] = [
  {
    id: 'sumi_otoshi',
    nom: 'Sumi Otoshi',
    nom_japonais: '隅落とし',
    traduction: 'Chute dans l\'angle',
    description: 'Projection où Uke est projeté dans un angle mort, en utilisant un déséquilibre diagonal.',
    niveau: '2e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Trouver l\'angle mort de Uke',
      'Déséquilibre diagonal',
      'Guider vers le sol dans l\'angle',
      'Utiliser le poids du corps'
    ],
    erreurs_communes: [
      'Mauvais angle de projection',
      'Forcer au lieu de déséquilibrer',
      'Perdre son propre équilibre'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/sumi_otoshi.mp4' },
    animation: { phases: 3, images: [null, null, null], placeholder: '/animations/sumi_otoshi/' }
  }
];

// =============================================================================
// UCHI KAITEN NAGE / SOTO KAITEN NAGE
// =============================================================================

export const UCHI_KAITEN: Mouvement[] = [
  {
    id: 'uchi_kaiten_sanyo',
    nom: 'Uchi Kaiten Sankyo',
    nom_japonais: '内回転三教',
    traduction: 'Rotation intérieure avec 3e principe',
    description: 'Combinaison de rotation intérieure avec application de sankyo. Technique avancée.',
    niveau: '2e_kyu',
    categorie: 'nage_waza',
    points_cles: [
      'Rotation fluide vers l\'intérieur',
      'Application progressive de sankyo',
      'Maintenir le déséquilibre',
      'Contrôle jusqu\'à l\'immobilisation'
    ],
    erreurs_communes: [
      'Sankyo trop brutal',
      'Rotation sans contrôle',
      'Perdre la connexion'
    ],
    video: { url: null, thumbnail: null, duree: null, format: 'mp4', placeholder: '/videos/techniques/uchi_kaiten.mp4' },
    animation: { phases: 4, images: [null, null, null, null], placeholder: '/animations/uchi_kaiten/' }
  }
];

// =============================================================================
// EXPORT GLOBAL
// =============================================================================

export const ALL_NAGE_WAZA: Mouvement[] = [
  ...SHIHO_NAGE,
  ...IRIMI_NAGE,
  ...KOTE_GAESHI,
  ...KAITEN_NAGE,
  ...TENCHI_NAGE,
  ...KOKYU_NAGE,
  ...KOSHI_NAGE,
  ...JUJI_NAGE,
  ...AIKI_OTOSHI,
  ...SUMI_OTOSHI,
  ...UCHI_KAITEN,
];

export default ALL_NAGE_WAZA;
