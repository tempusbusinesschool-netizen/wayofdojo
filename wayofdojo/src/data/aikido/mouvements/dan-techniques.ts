/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🥋 WAYOFDOJO - TECHNIQUES AVANCÉES POUR GRADES DAN
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Techniques spécifiques aux grades Dan (ceinture noire)
 * Ces techniques représentent un niveau avancé de pratique
 */

import type { Mouvement, NiveauGrade } from '../types';

/**
 * Techniques avancées pour Shodan (1er Dan)
 */
export const TECHNIQUES_SHODAN: Mouvement[] = [
  // ═══════════════════════════════════════════════════════════════
  // USHIRO WAZA - TECHNIQUES ARRIÈRE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ushiro_ryote_dori_ikkyo',
    nom: 'Ushiro Ryote Dori Ikkyo',
    nom_japonais: '後ろ両手取り一教',
    traduction: 'Premier principe sur saisie arrière des deux poignets',
    description: 'Technique d\'immobilisation sur une saisie par derrière des deux poignets. Nécessite une entrée dynamique et un contrôle du centre.',
    niveau: 'shodan',
    categorie: 'ushiro_waza',
    points_cles: [
      'Réagir avant la saisie complète (tai sabaki anticipé)',
      'Maintenir le centre bas et stable',
      'Utiliser le pivot du corps (tenkan) pour créer l\'ouverture',
      'Contrôler le coude puis le poignet'
    ],
    erreurs_communes: [
      'Attendre que la saisie soit établie',
      'Lever les épaules sous la pression',
      'Utiliser la force des bras plutôt que le corps'
    ],
    applications: ['Self-défense contre saisie arrière'],
    video: { url: null, placeholder: '/videos/shodan/ushiro_ryote_ikkyo.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },
  {
    id: 'ushiro_ryokata_dori_sankyo',
    nom: 'Ushiro Ryokata Dori Sankyo',
    nom_japonais: '後ろ両肩取り三教',
    traduction: 'Troisième principe sur saisie arrière des épaules',
    description: 'Technique de torsion du poignet sur une saisie par derrière des deux épaules.',
    niveau: 'shodan',
    categorie: 'ushiro_waza',
    points_cles: [
      'Baisser le centre pour déséquilibrer Uke',
      'Sortir du côté le plus faible de la saisie',
      'Appliquer sankyo avec précision sur le poignet',
      'Garder Uke en déséquilibre constant'
    ],
    erreurs_communes: [
      'Tirer avec les bras',
      'Perdre le contrôle du centre de Uke',
      'Appliquer sankyo trop brutalement'
    ],
    video: { url: null, placeholder: '/videos/shodan/ushiro_ryokata_sankyo.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // KAESHI WAZA - CONTRE-TECHNIQUES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'kaeshi_waza_ikkyo',
    nom: 'Kaeshi Waza sur Ikkyo',
    nom_japonais: '返し技 一教',
    traduction: 'Contre-technique sur premier principe',
    description: 'Capacité à renverser une technique Ikkyo en cours d\'application. Requiert une grande sensibilité et un timing précis.',
    niveau: 'shodan',
    categorie: 'kaeshi_waza',
    points_cles: [
      'Sentir le moment où Tori perd le contrôle',
      'Ne pas résister frontalement',
      'Utiliser l\'énergie de Tori pour le retournement',
      'Reprendre le centre immédiatement'
    ],
    erreurs_communes: [
      'Forcer contre la technique',
      'Retard dans la réaction',
      'Perdre sa propre stabilité'
    ],
    video: { url: null, placeholder: '/videos/shodan/kaeshi_ikkyo.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },
  {
    id: 'kaeshi_waza_shiho_nage',
    nom: 'Kaeshi Waza sur Shiho Nage',
    nom_japonais: '返し技 四方投げ',
    traduction: 'Contre-technique sur projection dans les quatre directions',
    description: 'Retournement d\'une projection Shiho Nage en cours. Nécessite de sentir le déséquilibre de Tori.',
    niveau: 'shodan',
    categorie: 'kaeshi_waza',
    points_cles: [
      'Baisser le centre au moment de la projection',
      'Tourner dans la direction de la projection',
      'Reprendre le contrôle du bras de Tori',
      'Enchaîner immédiatement avec sa propre technique'
    ],
    erreurs_communes: [
      'Rigidité du corps',
      'Résistance au lieu de redirection',
      'Manque de décision dans l\'action'
    ],
    video: { url: null, placeholder: '/videos/shodan/kaeshi_shiho_nage.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },

  // ═══════════════════════════════════════════════════════════════
  // HENKA WAZA - VARIATIONS ET ENCHAÎNEMENTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'henka_waza_ikkyo_nikkyo',
    nom: 'Henka Waza Ikkyo → Nikkyo',
    nom_japonais: '変化技 一教から二教',
    traduction: 'Variation du premier au deuxième principe',
    description: 'Enchaînement fluide d\'Ikkyo vers Nikkyo quand la première technique ne fonctionne pas.',
    niveau: 'shodan',
    categorie: 'henka_waza',
    points_cles: [
      'Sentir la résistance de Uke à Ikkyo',
      'Utiliser cette résistance pour changer de technique',
      'Transition fluide sans perte de contrôle',
      'Appliquer Nikkyo dans le mouvement'
    ],
    erreurs_communes: [
      'Forcer Ikkyo malgré la résistance',
      'Pause entre les deux techniques',
      'Perte du centre de Uke pendant la transition'
    ],
    video: { url: null, placeholder: '/videos/shodan/henka_ikkyo_nikkyo.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },

  // ═══════════════════════════════════════════════════════════════
  // FUTARI DORI - DÉFENSE CONTRE 2 ATTAQUANTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'futari_dori_randori',
    nom: 'Futari Dori / Randori',
    nom_japonais: '二人取り / 乱取り',
    traduction: 'Défense contre deux attaquants',
    description: 'Pratique libre contre deux partenaires attaquant simultanément ou en alternance. Développe la vision périphérique et la gestion de l\'espace.',
    niveau: 'shodan',
    categorie: 'randori',
    points_cles: [
      'Ne jamais faire face aux deux attaquants en même temps',
      'Utiliser un attaquant comme bouclier contre l\'autre',
      'Déplacements constants et fluides',
      'Techniques courtes et efficaces',
      'Garder la vision périphérique active'
    ],
    erreurs_communes: [
      'Se fixer sur un seul attaquant',
      'Techniques trop longues ou complexes',
      'Rester statique entre les techniques',
      'Panique et perte de centre'
    ],
    video: { url: null, placeholder: '/videos/shodan/futari_dori.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  },

  // ═══════════════════════════════════════════════════════════════
  // ARMES - TANTO DORI
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tanto_dori_tsuki_kote_gaeshi',
    nom: 'Tanto Dori Tsuki Kote Gaeshi',
    nom_japonais: '短刀取り突きー小手返し',
    traduction: 'Défense contre pique de couteau - retournement du poignet',
    description: 'Défense contre attaque au couteau avec une pique (tsuki) en utilisant kote gaeshi.',
    niveau: 'shodan',
    categorie: 'tanto_dori',
    points_cles: [
      'Tai sabaki décisif pour éviter la lame',
      'Contrôle du poignet armé immédiat',
      'Désarmement intégré à la technique',
      'Distance de sécurité constante'
    ],
    erreurs_communes: [
      'Entrer trop tôt (avant l\'attaque)',
      'Négliger le contrôle de la main armée',
      'Projeter sans désarmer'
    ],
    video: { url: null, placeholder: '/videos/shodan/tanto_dori_tsuki.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/shodan/' }
  }
];

/**
 * Techniques avancées pour Nidan (2e Dan)
 */
export const TECHNIQUES_NIDAN: Mouvement[] = [
  {
    id: 'jiyu_waza_sannin',
    nom: 'Jiyu Waza - 3 attaquants',
    nom_japonais: '自由技 三人',
    traduction: 'Techniques libres contre trois attaquants',
    description: 'Pratique libre contre trois partenaires. Exige une maîtrise totale de l\'espace et des déplacements.',
    niveau: 'nidan',
    categorie: 'randori',
    points_cles: [
      'Gestion de l\'espace triangulaire',
      'Techniques instantanées sans préparation visible',
      'Fluidité absolue entre les attaquants',
      'Zanshin permanent'
    ],
    erreurs_communes: [
      'Techniques incomplètes',
      'Perte de la vision globale',
      'Essoufflement par manque d\'efficience'
    ],
    video: { url: null, placeholder: '/videos/nidan/jiyu_waza_3.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/nidan/' }
  },
  {
    id: 'tachi_dori_shomen',
    nom: 'Tachi Dori Shomen Uchi',
    nom_japonais: '太刀取り正面打ち',
    traduction: 'Défense contre coupe verticale au sabre',
    description: 'Défense à mains nues contre une attaque au sabre (bokken). Requiert un timing parfait.',
    niveau: 'nidan',
    categorie: 'tachi_dori',
    points_cles: [
      'Irimi au moment précis de la coupe',
      'Contrôle des deux mains de l\'attaquant',
      'Désarmement fluide',
      'Rester hors de la ligne de coupe'
    ],
    erreurs_communes: [
      'Entrer trop tard (dans la coupe)',
      'Saisir le sabre au lieu des mains',
      'Négliger le zanshin après désarmement'
    ],
    video: { url: null, placeholder: '/videos/nidan/tachi_dori.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/nidan/' }
  },
  {
    id: 'jo_dori_tsuki',
    nom: 'Jo Dori Tsuki',
    nom_japonais: '杖取り突き',
    traduction: 'Défense contre pique au bâton',
    description: 'Défense à mains nues contre une attaque directe au jo (bâton). Contrôle et désarmement.',
    niveau: 'nidan',
    categorie: 'jo_dori',
    points_cles: [
      'Esquive latérale précise',
      'Saisie du jo dans le mouvement',
      'Utiliser le jo comme levier contre Uke',
      'Désarmement par rotation'
    ],
    erreurs_communes: [
      'Esquive insuffisante',
      'Tirer sur le jo au lieu de rediriger',
      'Perdre le contrôle du centre'
    ],
    video: { url: null, placeholder: '/videos/nidan/jo_dori.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/nidan/' }
  },
  {
    id: 'ken_tai_jo',
    nom: 'Ken Tai Jo',
    nom_japonais: '剣対杖',
    traduction: 'Sabre contre bâton',
    description: 'Travail d\'opposition sabre/bâton. Développe la compréhension des distances et du timing avec armes.',
    niveau: 'nidan',
    categorie: 'armes_avancees',
    points_cles: [
      'Comprendre les avantages de chaque arme',
      'Exploiter la portée du jo',
      'Timing d\'entrée contre le sabre',
      'Variations omote et ura'
    ],
    erreurs_communes: [
      'Ignorer la distance de sécurité',
      'Mouvements prévisibles',
      'Blocages au lieu de redirections'
    ],
    video: { url: null, placeholder: '/videos/nidan/ken_tai_jo.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/nidan/' }
  }
];

/**
 * Techniques avancées pour Sandan (3e Dan)
 */
export const TECHNIQUES_SANDAN: Mouvement[] = [
  {
    id: 'jiyu_waza_yonin',
    nom: 'Jiyu Waza - 4+ attaquants',
    nom_japonais: '自由技 四人以上',
    traduction: 'Techniques libres contre quatre attaquants ou plus',
    description: 'Démonstration de maîtrise contre de multiples attaquants. Le summum du randori.',
    niveau: 'sandan',
    categorie: 'randori',
    points_cles: [
      'Déplacements circulaires constants',
      'Aucune technique ne dure plus de 2 secondes',
      'Utilisation de tout l\'espace',
      'Calme intérieur malgré la pression'
    ],
    erreurs_communes: [
      'Se laisser encercler',
      'Techniques trop élaborées',
      'Fatigue mentale avant physique'
    ],
    video: { url: null, placeholder: '/videos/sandan/jiyu_waza_4.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/sandan/' }
  },
  {
    id: 'oyo_waza',
    nom: 'Oyo Waza',
    nom_japonais: '応用技',
    traduction: 'Techniques d\'application avancée',
    description: 'Applications libres et créatives des principes de l\'Aïkido. Expression personnelle de l\'art.',
    niveau: 'sandan',
    categorie: 'oyo_waza',
    points_cles: [
      'Intégration de tous les principes',
      'Créativité dans l\'application',
      'Adaptation instantanée',
      'Expression du Ki'
    ],
    erreurs_communes: [
      'Copier au lieu de créer',
      'Techniques trop acrobatiques',
      'Perdre l\'efficacité martiale'
    ],
    video: { url: null, placeholder: '/videos/sandan/oyo_waza.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/sandan/' }
  },
  {
    id: 'koshi_nage_variations',
    nom: 'Koshi Nage Variations',
    nom_japonais: '腰投げ 変化',
    traduction: 'Projections de hanche - toutes variations',
    description: 'Maîtrise complète des projections de hanche depuis toutes les attaques et positions.',
    niveau: 'sandan',
    categorie: 'nage_waza_avance',
    points_cles: [
      'Chargement fluide de Uke sur la hanche',
      'Contrôle total pendant la projection',
      'Adaptabilité à la morphologie de Uke',
      'Chute contrôlée pour Uke'
    ],
    erreurs_communes: [
      'Forcer le chargement',
      'Perdre Uke pendant la rotation',
      'Projection dangereuse pour Uke'
    ],
    video: { url: null, placeholder: '/videos/sandan/koshi_nage.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/sandan/' }
  }
];

/**
 * Techniques avancées pour Yondan (4e Dan)
 */
export const TECHNIQUES_YONDAN: Mouvement[] = [
  {
    id: 'aiki_no_jutsu',
    nom: 'Aiki no Jutsu',
    nom_japonais: '合気の術',
    traduction: 'L\'art de l\'Aiki',
    description: 'Application des principes subtils de l\'Aiki. Techniques avec un minimum de contact physique.',
    niveau: 'yondan',
    categorie: 'aiki_jutsu',
    points_cles: [
      'Connexion énergétique avec Uke',
      'Minimum d\'effort physique',
      'Contrôle par l\'intention',
      'Harmonie parfaite du mouvement'
    ],
    erreurs_communes: [
      'Revenir à la force physique',
      'Perdre la connexion',
      'Techniques mystiques sans fondement martial'
    ],
    video: { url: null, placeholder: '/videos/yondan/aiki_jutsu.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/yondan/' }
  },
  {
    id: 'enseignement_pedagogie',
    nom: 'Pédagogie Avancée',
    nom_japonais: '教授法',
    traduction: 'Méthodes d\'enseignement',
    description: 'Capacité à transmettre l\'art avec clarté et adapter son enseignement à chaque élève.',
    niveau: 'yondan',
    categorie: 'pedagogie',
    points_cles: [
      'Diagnostic des difficultés de l\'élève',
      'Progression adaptée',
      'Démonstration claire des principes',
      'Encouragement et correction équilibrés'
    ],
    erreurs_communes: [
      'Enseigner trop vite',
      'Négliger les fondamentaux',
      'Manque de patience'
    ],
    video: { url: null, placeholder: '/videos/yondan/pedagogie.mp4' },
    animation: { type: 'video', frames: [null], placeholder: '/animations/yondan/' }
  }
];

// Toutes les techniques Dan combinées
export const ALL_TECHNIQUES_DAN: Mouvement[] = [
  ...TECHNIQUES_SHODAN,
  ...TECHNIQUES_NIDAN,
  ...TECHNIQUES_SANDAN,
  ...TECHNIQUES_YONDAN,
];

// Export par niveau
export function getTechniquesDan(niveau: NiveauGrade): Mouvement[] {
  switch(niveau) {
    case 'shodan': return TECHNIQUES_SHODAN;
    case 'nidan': return TECHNIQUES_NIDAN;
    case 'sandan': return TECHNIQUES_SANDAN;
    case 'yondan': return TECHNIQUES_YONDAN;
    default: return [];
  }
}

export default ALL_TECHNIQUES_DAN;
