/**
 * WAYOFDOJO — HANMI HANDACHI (SEMI-DEBOUT)
 * 
 * Le Hanmi Handachi désigne la pratique où Tori (celui qui exécute
 * la technique) est à genoux tandis que Uke (l'attaquant) est debout.
 * Cette pratique développe l'adaptabilité et la gestion du désavantage.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { Mouvement, StatistiquesMouvements, NiveauGrade } from '../types';

export const HANMI_HANDACHI: Mouvement[] = [
  {
    id: "hh_katate_shiho_omote",
    nom: "Hanmi Handachi Katate Dori Shiho Nage Omote",
    nom_japonais: "半身半立ち 片手取り 四方投げ 表",
    traduction: "Semi-debout - Saisie poignet - Projection 4 directions - Extérieur",
    description: "Shiho Nage Omote exécuté depuis la position à genoux contre un attaquant debout.",
    niveau: "3e_kyu",
    categorie: "hh_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Utiliser le désavantage de hauteur",
      "Rentrer sous le centre de Uke",
      "Déplacement en Shikko rapide",
      "Projection en utilisant la gravité"
    ],
    erreurs_communes: [
      "Essayer de se lever",
      "Rester statique",
      "Ne pas utiliser le niveau bas"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_katate_shiho_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_katate_shiho_omote/"
    }
  },
  {
    id: "hh_katate_shiho_ura",
    nom: "Hanmi Handachi Katate Dori Shiho Nage Ura",
    nom_japonais: "半身半立ち 片手取り 四方投げ 裏",
    traduction: "Semi-debout - Saisie poignet - Projection 4 directions - Intérieur",
    description: "Shiho Nage Ura en position désavantageuse avec pivot.",
    niveau: "3e_kyu",
    categorie: "hh_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Pivot fluide en Shikko",
      "Maintenir la connexion pendant le pivot",
      "Projection vers l'arrière de Uke"
    ],
    erreurs_communes: [
      "Pivot trop large",
      "Se lever pendant le pivot"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_katate_shiho_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_katate_shiho_ura/"
    }
  },
  {
    id: "hh_katate_kote_gaeshi",
    nom: "Hanmi Handachi Katate Dori Kote Gaeshi",
    nom_japonais: "半身半立ち 片手取り 小手返し",
    traduction: "Semi-debout - Saisie poignet - Retournement de poignet",
    description: "Kote Gaeshi depuis la position à genoux. Le niveau bas facilite la projection.",
    niveau: "3e_kyu",
    categorie: "hh_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Saisir le poignet en remontant",
      "Utiliser le déséquilibre naturel de Uke",
      "Projection vers le sol efficace",
      "Immobilisation rapide"
    ],
    erreurs_communes: [
      "Forcer sur le poignet",
      "Se lever pour projeter"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_katate_kote_gaeshi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_katate_kote_gaeshi/"
    }
  },
  {
    id: "hh_katate_irimi_nage",
    nom: "Hanmi Handachi Katate Dori Irimi Nage",
    nom_japonais: "半身半立ち 片手取り 入り身投げ",
    traduction: "Semi-debout - Saisie poignet - Projection d'entrée",
    description: "Irimi Nage depuis la position à genoux. Technique avancée nécessitant timing et fluidité.",
    niveau: "2e_kyu",
    categorie: "hh_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Se relever dans le mouvement",
      "Irimi profond",
      "Utiliser l'élan de Uke",
      "Projection fluide"
    ],
    erreurs_communes: [
      "Se lever trop tôt",
      "Perdre la connexion avec Uke"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_katate_irimi_nage.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_katate_irimi_nage/"
    }
  },
  {
    id: "hh_katate_kaiten_nage",
    nom: "Hanmi Handachi Katate Dori Kaiten Nage",
    nom_japonais: "半身半立ち 片手取り 回転投げ",
    traduction: "Semi-debout - Saisie poignet - Projection rotative",
    description: "Kaiten Nage depuis le sol. La rotation est facilitée par la position basse.",
    niveau: "2e_kyu",
    categorie: "hh_projection",
    attaque: "Katate Dori",
    points_cles: [
      "Guider la rotation depuis le sol",
      "Utiliser le niveau bas comme avantage",
      "Projection en spirale"
    ],
    erreurs_communes: [
      "Perdre la spirale",
      "Se lever pendant la rotation"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_katate_kaiten_nage.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_katate_kaiten_nage/"
    }
  },
  {
    id: "hh_shomen_ikkyo_omote",
    nom: "Hanmi Handachi Shomen Uchi Ikkyo Omote",
    nom_japonais: "半身半立ち 正面打ち 一教 表",
    traduction: "Semi-debout - Frappe frontale - 1er principe - Extérieur",
    description: "Ikkyo Omote contre une frappe d'un attaquant debout.",
    niveau: "3e_kyu",
    categorie: "hh_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Irimi sous la frappe",
      "Contrôle du bras en montant",
      "Amener Uke au sol",
      "Immobilisation standard"
    ],
    erreurs_communes: [
      "Attendre la frappe au lieu d'entrer",
      "Se lever pendant la technique"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_shomen_ikkyo_omote.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_shomen_ikkyo_omote/"
    }
  },
  {
    id: "hh_shomen_ikkyo_ura",
    nom: "Hanmi Handachi Shomen Uchi Ikkyo Ura",
    nom_japonais: "半身半立ち 正面打ち 一教 裏",
    traduction: "Semi-debout - Frappe frontale - 1er principe - Intérieur",
    description: "Ikkyo Ura en Hanmi Handachi avec pivot.",
    niveau: "3e_kyu",
    categorie: "hh_immobilisation",
    attaque: "Shomen Uchi",
    points_cles: [
      "Recevoir la frappe puis pivoter",
      "Pivot en Shikko",
      "Amener Uke au sol derrière soi"
    ],
    erreurs_communes: [
      "Pivot incomplet",
      "Perdre le contrôle du bras"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_shomen_ikkyo_ura.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_shomen_ikkyo_ura/"
    }
  },
  {
    id: "hh_ryote_kokyu_nage",
    nom: "Hanmi Handachi Ryote Dori Kokyu Nage",
    nom_japonais: "半身半立ち 両手取り 呼吸投げ",
    traduction: "Semi-debout - Saisie deux mains - Projection par respiration",
    description: "Kokyu Nage contre un attaquant debout saisissant les deux poignets.",
    niveau: "2e_kyu",
    categorie: "hh_kokyu",
    attaque: "Ryote Dori",
    points_cles: [
      "Extension vers le haut",
      "Utiliser le Ki, pas la force",
      "Déséquilibrer par le haut",
      "Projection fluide"
    ],
    erreurs_communes: [
      "Utiliser la force des bras",
      "Se lever au lieu de projeter"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/hanmi_handachi/hh_ryote_kokyu_nage.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/hanmi_handachi/hh_ryote_kokyu_nage/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const HANMI_HANDACHI_STATS: StatistiquesMouvements = {
  total: HANMI_HANDACHI.length,
  par_categorie: {
    projection: HANMI_HANDACHI.filter(h => h.categorie === "hh_projection").length,
    immobilisation: HANMI_HANDACHI.filter(h => h.categorie === "hh_immobilisation").length,
    kokyu: HANMI_HANDACHI.filter(h => h.categorie === "hh_kokyu").length,
  },
  videos_disponibles: HANMI_HANDACHI.filter(h => h.video.url !== null).length
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getHanmiHandachiByNiveau = (niveau: NiveauGrade): Mouvement[] => {
  return HANMI_HANDACHI.filter(h => h.niveau === niveau);
};

export const getHanmiHandachiByCategorie = (categorie: string): Mouvement[] => {
  return HANMI_HANDACHI.filter(h => h.categorie === categorie);
};

export default HANMI_HANDACHI;
