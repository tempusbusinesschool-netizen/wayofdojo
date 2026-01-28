/**
 * WAYOFDOJO — SUWARIWAZA (TECHNIQUES À GENOUX)
 * 
 * Le Suwariwaza désigne la pratique des techniques en position
 * à genoux (seiza). Cette pratique traditionnelle développe
 * la mobilité du bassin et la connexion au sol.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { Mouvement, StatistiquesMouvements, NiveauGrade } from '../types';

export const SUWARIWAZA: Mouvement[] = [
  {
    id: "sw_shomen_ikkyo_omote",
    nom: "Suwariwaza Shomen Uchi Ikkyo Omote",
    nom_japonais: "座り技 正面打ち 一教 表",
    traduction: "Technique à genoux - Frappe frontale - 1er principe - Extérieur",
    description: "Ikkyo Omote exécuté en position à genoux contre une frappe Shomen.",
    niveau: "5e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi (frappe verticale)",
    points_cles: [
      "Déplacement en Shikko",
      "Irimi sous l'attaque",
      "Contrôle du coude et du poignet",
      "Amener au sol en position seiza"
    ],
    erreurs_communes: [
      "Se relever pendant la technique",
      "Déplacement trop lent",
      "Perdre le contrôle du bras"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_ikkyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_ikkyo_omote/"
    }
  },
  {
    id: "sw_shomen_ikkyo_ura",
    nom: "Suwariwaza Shomen Uchi Ikkyo Ura",
    nom_japonais: "座り技 正面打ち 一教 裏",
    traduction: "Technique à genoux - Frappe frontale - 1er principe - Intérieur",
    description: "Ikkyo Ura exécuté en position à genoux avec pivot.",
    niveau: "5e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Tenkan en Shikko",
      "Pivot sur les genoux",
      "Maintenir la connexion pendant le pivot",
      "Immobilisation dans l'axe du pivot"
    ],
    erreurs_communes: [
      "Se relever pendant le pivot",
      "Perdre la connexion",
      "Pivot incomplet"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_ikkyo_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_ikkyo_ura/"
    }
  },
  {
    id: "sw_shomen_nikyo_omote",
    nom: "Suwariwaza Shomen Uchi Nikyo Omote",
    nom_japonais: "座り技 正面打ち 二教 表",
    traduction: "Technique à genoux - Frappe frontale - 2e principe - Extérieur",
    description: "Nikyo Omote exécuté en Suwariwaza. La torsion du poignet est amplifiée par la position basse.",
    niveau: "4e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Transition fluide depuis Ikkyo",
      "Prise Nikyo précise",
      "Utiliser le poids du corps",
      "Contrôle jusqu'au sol"
    ],
    erreurs_communes: [
      "Torsion trop rapide",
      "Perdre le contrôle pendant la transition",
      "Se pencher trop en avant"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_nikyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_nikyo_omote/"
    }
  },
  {
    id: "sw_shomen_nikyo_ura",
    nom: "Suwariwaza Shomen Uchi Nikyo Ura",
    nom_japonais: "座り技 正面打ち 二教 裏",
    traduction: "Technique à genoux - Frappe frontale - 2e principe - Intérieur",
    description: "Nikyo Ura en Suwariwaza avec rotation spirale.",
    niveau: "4e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Rotation spirale",
      "Maintenir la pression sur le poignet",
      "Utiliser le mouvement des hanches"
    ],
    erreurs_communes: [
      "Rotation trop rapide",
      "Perdre la spirale",
      "Se lever pendant l'exécution"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_nikyo_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_nikyo_ura/"
    }
  },
  {
    id: "sw_shomen_sankyo_omote",
    nom: "Suwariwaza Shomen Uchi Sankyo Omote",
    nom_japonais: "座り技 正面打ち 三教 表",
    traduction: "Technique à genoux - Frappe frontale - 3e principe - Extérieur",
    description: "Sankyo Omote en position à genoux. Rotation du poignet vers l'extérieur.",
    niveau: "3e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Rotation du poignet vers l'extérieur",
      "Spirale ascendante puis descendante",
      "Amener l'épaule vers le sol"
    ],
    erreurs_communes: [
      "Mouvement linéaire au lieu de spirale",
      "Perdre la connexion pendant la rotation"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_sankyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_sankyo_omote/"
    }
  },
  {
    id: "sw_shomen_sankyo_ura",
    nom: "Suwariwaza Shomen Uchi Sankyo Ura",
    nom_japonais: "座り技 正面打ち 三教 裏",
    traduction: "Technique à genoux - Frappe frontale - 3e principe - Intérieur",
    description: "Sankyo Ura en Suwariwaza. Spirale descendante.",
    niveau: "3e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Spirale descendante",
      "Pivot en maintenant la prise",
      "Immobilisation face contre terre"
    ],
    erreurs_communes: [
      "Pivot trop large",
      "Perdre la spirale"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_sankyo_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_sankyo_ura/"
    }
  },
  {
    id: "sw_shomen_yonkyo_omote",
    nom: "Suwariwaza Shomen Uchi Yonkyo Omote",
    nom_japonais: "座り技 正面打ち 四教 表",
    traduction: "Technique à genoux - Frappe frontale - 4e principe - Extérieur",
    description: "Yonkyo en Suwariwaza. Point de pression sur l'avant-bras.",
    niveau: "2e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Localiser le point nerveux",
      "Pression avec la base de l'index",
      "Maintenir le contrôle du bras"
    ],
    erreurs_communes: [
      "Mauvais placement du point de pression",
      "Pression trop faible"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_yonkyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_yonkyo_omote/"
    }
  },
  {
    id: "sw_shomen_yonkyo_ura",
    nom: "Suwariwaza Shomen Uchi Yonkyo Ura",
    nom_japonais: "座り技 正面打ち 四教 裏",
    traduction: "Technique à genoux - Frappe frontale - 4e principe - Intérieur",
    description: "Yonkyo Ura en Suwariwaza.",
    niveau: "2e_kyu",
    categorie: "sw_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Point de pression maintenu pendant le pivot",
      "Contrôle global du bras"
    ],
    erreurs_communes: [
      "Perdre le point de pression",
      "Pivot trop rapide"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_shomen_yonkyo_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_shomen_yonkyo_ura/"
    }
  },
  {
    id: "sw_katate_kote_gaeshi",
    nom: "Suwariwaza Katate Dori Kote Gaeshi",
    nom_japonais: "座り技 片手取り 小手返し",
    traduction: "Technique à genoux - Saisie poignet - Retournement de poignet",
    description: "Kote Gaeshi exécuté à genoux sur une saisie de poignet.",
    niveau: "3e_kyu",
    categorie: "sw_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Saisie du poignet avec le pouce sur le dos de la main",
      "Rotation vers l'extérieur",
      "Projection vers le sol"
    ],
    erreurs_communes: [
      "Tordre au lieu de retourner",
      "Se lever pendant la technique"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_katate_kote_gaeshi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_katate_kote_gaeshi/"
    }
  },
  {
    id: "sw_ryote_kokyu_ho",
    nom: "Suwariwaza Ryote Dori Kokyu Ho",
    nom_japonais: "座り技 両手取り 呼吸法",
    traduction: "Technique à genoux - Saisie deux mains - Méthode de respiration",
    description: "Exercice fondamental de Kokyu pratiqué à genoux. Aussi appelé Kokyu Dosa.",
    niveau: "6e_kyu",
    categorie: "sw_kokyu",
    attaque: "Ryote Dori (deux poignets saisis)",
    importance: "Exercice pratiqué à chaque fin de cours. Développe la capacité à projeter sans force.",
    points_cles: [
      "Respiration coordonnée",
      "Utiliser le hara, pas les bras",
      "Extension vers le partenaire",
      "Projection par le Ki"
    ],
    erreurs_communes: [
      "Utiliser la force des bras",
      "Oublier de respirer",
      "Perdre la connexion",
      "Se pencher en avant"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/suwariwaza/sw_ryote_kokyu_ho.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/suwariwaza/sw_ryote_kokyu_ho/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const SUWARIWAZA_STATS: StatistiquesMouvements = {
  total: SUWARIWAZA.length,
  par_categorie: {
    immobilisation: SUWARIWAZA.filter(s => s.categorie === "sw_immobilisation").length,
    projection: SUWARIWAZA.filter(s => s.categorie === "sw_projection").length,
    kokyu: SUWARIWAZA.filter(s => s.categorie === "sw_kokyu").length,
  },
  videos_disponibles: SUWARIWAZA.filter(s => s.video.url !== null).length
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getSuwariwazaByNiveau = (niveau: NiveauGrade): Mouvement[] => {
  return SUWARIWAZA.filter(s => s.niveau === niveau);
};

export const getSuwariwazaByCategorie = (categorie: string): Mouvement[] => {
  return SUWARIWAZA.filter(s => s.categorie === categorie);
};

export default SUWARIWAZA;
