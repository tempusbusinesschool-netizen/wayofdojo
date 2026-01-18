/**
 * AIKIDO@GAME — SUWARIWAZA (TECHNIQUES À GENOUX)
 * 
 * Le Suwariwaza désigne la pratique des techniques en position
 * à genoux (seiza). Cette pratique traditionnelle développe
 * la mobilité du bassin et la connexion au sol.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const SUWARIWAZA = [
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
    points_cles: [
      "Respiration coordonnée",
      "Utiliser le hara, pas les bras",
      "Extension vers le partenaire",
      "Projection par le Ki"
    ],
    importance: "Exercice pratiqué à chaque fin de cours. Développe la capacité à projeter sans force.",
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

export const SUWARIWAZA_STATS = {
  total: SUWARIWAZA.length,
  par_categorie: {
    immobilisation: SUWARIWAZA.filter(s => s.categorie === "sw_immobilisation").length,
    projection: SUWARIWAZA.filter(s => s.categorie === "sw_projection").length,
    kokyu: SUWARIWAZA.filter(s => s.categorie === "sw_kokyu").length,
  },
  videos_disponibles: SUWARIWAZA.filter(s => s.video.url !== null).length
};

export default SUWARIWAZA;
