/**
 * AIKIDO@GAME — KANSETSU WAZA (TECHNIQUES ARTICULAIRES)
 * 
 * Les Kansetsu Waza sont les techniques de contrôle articulaire.
 * Elles permettent d'immobiliser ou de projeter en appliquant
 * une pression sur les articulations (poignet, coude, épaule).
 * 
 * ⚠️ Ces techniques requièrent une pratique prudente et progressive.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const KANSETSU_WAZA = [
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
      images: [
        null, // Phase 1: Contact initial
        null, // Phase 2: Prise du bras
        null, // Phase 3: Coupe vers le bas
        null, // Phase 4: Descente au sol
        null  // Phase 5: Immobilisation
      ],
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
    anatomie: "Le point se trouve sur la face externe de l'avant-bras, environ 3 doigts sous le coude",
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
    application_principale: "Tanto Dori (défense contre couteau)",
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
    description: "Projection par torsion externe du poignet. Technique emblématique de l'Aïkido.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    articulations: ["Poignet (torsion externe)"],
    principe: "Retourner le poignet vers l'extérieur",
    points_cles: [
      "Saisir le dos de la main",
      "Torsion vers l'extérieur et le bas",
      "Couper vers le centre de Uke",
      "Chute plongée (Tobi Ukemi) nécessaire"
    ],
    erreurs_communes: [
      "Forcer la torsion",
      "Perdre la connexion",
      "Mauvaise direction de la coupe"
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
    traduction: "Projection dans les quatre directions",
    description: "Projection en amenant le bras de Uke au-dessus de sa tête et en le faisant basculer.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    articulations: ["Épaule", "Poignet"],
    principe: "Rotation du bras au-dessus de la tête",
    variantes: ["Omote", "Ura"],
    points_cles: [
      "Saisir le poignet correctement",
      "Passer sous le bras",
      "Amener le bras au-dessus de la tête de Uke",
      "Couper vers le bas pour projeter"
    ],
    erreurs_communes: [
      "Ne pas passer assez sous le bras",
      "Forcer sur l'épaule",
      "Mauvais timing de la coupe"
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
    id: "hiji_garami",
    nom: "Hiji Garami",
    nom_japonais: "肘絡み",
    traduction: "Enroulement du coude",
    description: "Clé de bras avec enroulement autour du coude. Technique de contrôle puissante.",
    niveau: "1er_kyu",
    categorie: "osae_waza",
    articulations: ["Coude", "Épaule"],
    principe: "Enrouler le bras autour du coude de Uke",
    points_cles: [
      "Contrôle initial du poignet",
      "Enroulement autour du coude",
      "Pression vers le bas",
      "Immobilisation sécurisée"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/hiji_garami.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kansetsu_waza/hiji_garami/"
    }
  },
  {
    id: "ude_garami",
    nom: "Ude Garami",
    nom_japonais: "腕絡み",
    traduction: "Enroulement du bras",
    description: "Clé de bras avec le bras plié. Similaire à la clé américaine.",
    niveau: "1er_kyu",
    categorie: "osae_waza",
    articulations: ["Épaule", "Coude"],
    principe: "Rotation de l'épaule avec bras plié",
    points_cles: [
      "Bras de Uke plié à 90°",
      "Contrôle du poignet et du coude",
      "Rotation vers l'extérieur",
      "Pression contrôlée"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kansetsu_waza/ude_garami.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kansetsu_waza/ude_garami/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const KANSETSU_WAZA_STATS = {
  total: KANSETSU_WAZA.length,
  par_categorie: {
    osae_waza: KANSETSU_WAZA.filter(k => k.categorie === "osae_waza").length,
    nage_waza: KANSETSU_WAZA.filter(k => k.categorie === "nage_waza").length,
  },
  videos_disponibles: KANSETSU_WAZA.filter(k => k.video.url !== null).length
};

export default KANSETSU_WAZA;
