/**
 * 🥋 WAYOFDOJO — KANSETSU WAZA (TECHNIQUES ARTICULAIRES)
 * 
 * Les Kansetsu Waza sont les techniques de contrôle articulaire.
 * Elles permettent d'immobiliser ou de projeter en appliquant
 * une pression sur les articulations (poignet, coude, épaule).
 * 
 * ⚠️ Ces techniques requièrent une pratique prudente et progressive.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { Mouvement, StatistiquesMouvements, NiveauGrade } from '../types';

export const KANSETSU_WAZA: Mouvement[] = [
  {
    id: "ikkyo",
    nom: "Ikkyo",
    nom_japonais: "一教",
    traduction: "Premier principe / Premier enseignement",
    description: "Contrôle du bras par pression sur le coude et le poignet. Technique fondamentale d'immobilisation.",
    niveau: "6e_kyu",
    categorie: "osae_waza",
    articulations: ["Coude", "Poignet", "Épaule"],
    principe: "Contrôler le centre par le bras",
    variantes: ["Omote (extérieur)", "Ura (intérieur)"],
    points_cles: [
      "Main sur le coude, main sur le poignet",
      "Couper vers le bas",
      "Maintenir l'alignement du bras",
      "Contrôle jusqu'au sol"
    ],
    erreurs_communes: [
      "Saisir au lieu de contrôler",
      "Perdre le contact avec le coude",
      "Tirer au lieu de couper"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/ikkyo.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/ikkyo/"
    }
  },
  {
    id: "nikyo",
    nom: "Nikyo",
    nom_japonais: "二教",
    traduction: "Deuxième principe",
    description: "Torsion du poignet vers l'intérieur. Crée une douleur intense qui permet le contrôle.",
    niveau: "5e_kyu",
    categorie: "osae_waza",
    articulations: ["Poignet (torsion)", "Coude"],
    principe: "Torsion du poignet vers l'intérieur et le bas",
    variantes: ["Omote", "Ura"],
    points_cles: [
      "Prise en 'C' sur le poignet",
      "Rotation vers l'intérieur",
      "Coude de Uke vers le haut",
      "Pression constante et contrôlée"
    ],
    erreurs_communes: [
      "Torsion trop rapide",
      "Mauvais angle de rotation",
      "Perdre le contrôle du coude"
    ],
    precautions: "Appliquer progressivement - technique douloureuse",
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/nikyo.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/nikyo/"
    }
  },
  {
    id: "sankyo",
    nom: "Sankyo",
    nom_japonais: "三教",
    traduction: "Troisième principe",
    description: "Torsion du poignet vers l'extérieur avec rotation spirale. Contrôle en trois dimensions.",
    niveau: "4e_kyu",
    categorie: "osae_waza",
    articulations: ["Poignet (torsion externe)", "Coude", "Épaule"],
    principe: "Spirale ascendante puis descendante",
    variantes: ["Omote", "Ura"],
    points_cles: [
      "Rotation du poignet vers l'extérieur",
      "Spirale autour du centre",
      "Amener l'épaule vers le sol",
      "Immobilisation face contre terre"
    ],
    erreurs_communes: [
      "Mouvement linéaire au lieu de spirale",
      "Perdre la connexion pendant la rotation",
      "Forcer au lieu de guider"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/sankyo.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/sankyo/"
    }
  },
  {
    id: "yonkyo",
    nom: "Yonkyo",
    nom_japonais: "四教",
    traduction: "Quatrième principe",
    description: "Pression sur le point nerveux de l'avant-bras (nerf radial). Technique de contrôle par la douleur.",
    niveau: "3e_kyu",
    categorie: "osae_waza",
    articulations: ["Point nerveux avant-bras", "Poignet"],
    principe: "Pression sur le nerf radial",
    anatomie: "Le point se trouve sur la face externe de l'avant-bras, environ 3 doigts sous le coude",
    points_cles: [
      "Localiser le point nerveux",
      "Pression avec la base de l'index",
      "Maintenir le contrôle du poignet",
      "Couper vers le bas avec la pression"
    ],
    erreurs_communes: [
      "Mauvais placement du point de pression",
      "Pression trop faible ou mal dirigée",
      "Oublier le contrôle global du bras"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/yonkyo.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/yonkyo/"
    }
  },
  {
    id: "gokyo",
    nom: "Gokyo",
    nom_japonais: "五教",
    traduction: "Cinquième principe",
    description: "Technique spécifique pour le désarmement. Contrôle inversé du poignet pour sécuriser une arme.",
    niveau: "2e_kyu",
    categorie: "osae_waza",
    articulations: ["Poignet (prise inversée)", "Coude"],
    principe: "Contrôle avec prise inversée pour désarmement",
    applications: ["Tanto Dori (défense contre couteau)"],
    points_cles: [
      "Prise inversée du poignet",
      "Contrôle de la main armée",
      "Amener au sol face visible",
      "Désarmer en sécurité"
    ],
    erreurs_communes: [
      "Mauvaise prise initiale",
      "Laisser la main armée libre",
      "Ne pas sécuriser l'arme"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/gokyo.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/gokyo/"
    }
  },
  {
    id: "rokkyo",
    nom: "Rokkyo (Hiji Kime Osae)",
    nom_japonais: "六教 / 肘極め押さえ",
    traduction: "Sixième principe / Contrôle du coude",
    description: "Verrouillage du coude en extension. Immobilisation debout ou au sol.",
    niveau: "1er_kyu",
    categorie: "osae_waza",
    articulations: ["Coude (hyper-extension)"],
    principe: "Extension contrôlée du coude",
    points_cles: [
      "Bras de Uke en extension",
      "Pression sur le coude",
      "Contrôle de l'épaule",
      "Peut être debout ou au sol"
    ],
    erreurs_communes: [
      "Extension trop brutale",
      "Perdre le contrôle de l'épaule",
      "Position instable"
    ],
    precautions: "Extension progressive - risque de blessure au coude",
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/rokkyo.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kansetsu_waza/rokkyo/"
    }
  },
  {
    id: "kote_gaeshi",
    nom: "Kote Gaeshi",
    nom_japonais: "小手返し",
    traduction: "Retournement du poignet",
    description: "Projection par retournement du poignet vers l'extérieur. Technique emblématique de l'Aïkido.",
    niveau: "4e_kyu",
    categorie: "nage_waza",
    articulations: ["Poignet (torsion externe)"],
    principe: "Retourner le poignet pour projeter",
    points_cles: [
      "Saisie du poignet (pouce sur le dos de la main)",
      "Rotation vers l'extérieur et vers soi",
      "Couper vers le bas",
      "Accompagner la chute"
    ],
    erreurs_communes: [
      "Tordre au lieu de retourner",
      "Forcer sur le poignet",
      "Ne pas utiliser les hanches"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/kote_gaeshi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/kote_gaeshi/"
    }
  },
  {
    id: "shiho_nage",
    nom: "Shiho Nage",
    nom_japonais: "四方投げ",
    traduction: "Projection dans les 4 directions",
    description: "Projection en amenant le bras de Uke au-dessus de sa tête et en coupant vers le bas.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    articulations: ["Épaule", "Poignet"],
    principe: "Lever puis couper dans une des 4 directions",
    variantes: ["Omote", "Ura"],
    points_cles: [
      "Contrôle du poignet à deux mains",
      "Passer sous le bras",
      "Lever au-dessus de la tête de Uke",
      "Couper vers le bas en avançant"
    ],
    erreurs_communes: [
      "Ne pas passer assez près",
      "Forcer sur l'épaule",
      "Couper sans avancer"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/shiho_nage.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/shiho_nage/"
    }
  },
  {
    id: "irimi_nage",
    nom: "Irimi Nage",
    nom_japonais: "入身投げ",
    traduction: "Projection par entrée",
    description: "Projection réalisée en entrant profondément dans la garde de Uke et en le déséquilibrant vers l'arrière.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    principe: "Entrer et déséquilibrer vers l'arrière",
    points_cles: [
      "Entrée profonde (irimi)",
      "Contrôle de la nuque ou de l'épaule",
      "Déséquilibre vers l'arrière",
      "Projection en spirale"
    ],
    erreurs_communes: [
      "Entrée trop timide",
      "Forcer sur la nuque",
      "Perdre le contact"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/irimi_nage.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/irimi_nage/"
    }
  },
  {
    id: "kaiten_nage",
    nom: "Kaiten Nage",
    nom_japonais: "回転投げ",
    traduction: "Projection rotative",
    description: "Projection en faisant tourner Uke autour de son propre axe.",
    niveau: "4e_kyu",
    categorie: "nage_waza",
    principe: "Rotation de Uke sur lui-même",
    variantes: ["Uchi (intérieur)", "Soto (extérieur)"],
    points_cles: [
      "Guider la rotation",
      "Maintenir la connexion au centre",
      "Accompagner jusqu'à la projection",
      "Zanshin après la technique"
    ],
    erreurs_communes: [
      "Pousser au lieu de guider",
      "Perdre la spirale",
      "Technique saccadée"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/kaiten_nage.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/kansetsu_waza/kaiten_nage/"
    }
  },
  {
    id: "tenchi_nage",
    nom: "Tenchi Nage",
    nom_japonais: "天地投げ",
    traduction: "Projection ciel-terre",
    description: "Projection en séparant les mains de Uke vers le haut (ciel) et vers le bas (terre).",
    niveau: "4e_kyu",
    categorie: "nage_waza",
    principe: "Séparer les forces vers le ciel et la terre",
    attaque: "Ryote Dori (saisie des deux poignets)",
    points_cles: [
      "Une main vers le haut (ten)",
      "Une main vers le bas (chi)",
      "Avancer en séparant",
      "Déséquilibre par opposition"
    ],
    erreurs_communes: [
      "Mains qui ne se séparent pas assez",
      "Ne pas avancer",
      "Forcer avec les bras"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/tenchi_nage.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kansetsu_waza/tenchi_nage/"
    }
  },
  {
    id: "kokyu_nage",
    nom: "Kokyu Nage",
    nom_japonais: "呼吸投げ",
    traduction: "Projection par la respiration",
    description: "Famille de projections utilisant principalement le timing et la respiration plutôt que des clés articulaires.",
    niveau: "1er_kyu",
    categorie: "nage_waza",
    principe: "Projeter par le Ki et la respiration",
    points_cles: [
      "Synchronisation avec le partenaire",
      "Utiliser le mouvement de l'attaque",
      "Projeter par extension",
      "Pas de saisie prolongée"
    ],
    erreurs_communes: [
      "Chercher à saisir",
      "Forcer la projection",
      "Manquer le timing"
    ],
    importance: "Les Kokyu Nage représentent l'essence de l'Aïkido: utiliser l'énergie du partenaire sans la bloquer.",
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/kokyu_nage.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kansetsu_waza/kokyu_nage/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const KANSETSU_WAZA_STATS: StatistiquesMouvements = {
  total: KANSETSU_WAZA.length,
  par_categorie: {
    osae_waza: KANSETSU_WAZA.filter(k => k.categorie === "osae_waza").length,
    nage_waza: KANSETSU_WAZA.filter(k => k.categorie === "nage_waza").length,
  },
  videos_disponibles: KANSETSU_WAZA.filter(k => k.video.url !== null).length
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getKansetsuByNiveau = (niveau: NiveauGrade): Mouvement[] => {
  return KANSETSU_WAZA.filter(k => k.niveau === niveau);
};

export const getKansetsuByCategorie = (categorie: string): Mouvement[] => {
  return KANSETSU_WAZA.filter(k => k.categorie === categorie);
};

export default KANSETSU_WAZA;
