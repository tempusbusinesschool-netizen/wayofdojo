/**
 * AIKIDO@GAME — TAI SABAKI (DÉPLACEMENTS CORPORELS)
 * 
 * Les Tai Sabaki sont les mouvements fondamentaux du corps en Aïkido.
 * Ils permettent d'esquiver, de se positionner et de créer les conditions
 * pour l'exécution des techniques.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const TAI_SABAKI = [
  {
    id: "irimi",
    nom: "Irimi",
    nom_japonais: "入り身",
    traduction: "Entrer dans le corps",
    description: "Mouvement d'entrée directe vers le partenaire. Fondamental en Aïkido, il représente l'intention de ne pas fuir mais d'aller à la rencontre de l'attaque.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: [
      "Pas en avant décisif",
      "Garder le centre bas",
      "Regard vers le partenaire",
      "Bras en protection"
    ],
    erreurs_communes: [
      "Hésitation dans l'entrée",
      "Perte d'équilibre vers l'avant",
      "Oublier la protection des bras"
    ],
    video: {
      url: null, // À remplir avec l'URL de la vidéo
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/irimi.mp4"
    },
    animation: {
      phases: 3,
      images: [
        null, // Phase 1: Position initiale
        null, // Phase 2: Mouvement
        null  // Phase 3: Position finale
      ],
      placeholder: "/animations/tai_sabaki/irimi/"
    }
  },
  {
    id: "tenkan",
    nom: "Tenkan",
    nom_japonais: "転換",
    traduction: "Pivot, changement de direction",
    description: "Mouvement de pivot sur le pied avant avec rotation de 180°. Permet de se placer dans le dos du partenaire tout en maintenant le contact.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: [
      "Pivot sur la plante du pied avant",
      "Rotation de 180 degrés",
      "Maintenir le contact avec le partenaire",
      "Terminer en garde stable"
    ],
    erreurs_communes: [
      "Pivot sur le talon",
      "Perdre le contact",
      "Rotation incomplète"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/tenkan.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/tenkan/"
    }
  },
  {
    id: "irimi_tenkan",
    nom: "Irimi Tenkan",
    nom_japonais: "入り身転換",
    traduction: "Entrée et pivot",
    description: "Combinaison d'un pas d'entrée (irimi) suivi d'un pivot (tenkan). Mouvement fluide qui permet de contourner l'attaque.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: [
      "Enchaînement fluide irimi puis tenkan",
      "Pas de temps d'arrêt entre les deux",
      "Maintenir la connexion",
      "Finir face à la direction initiale"
    ],
    erreurs_communes: [
      "Saccade entre les deux mouvements",
      "Perdre la ligne centrale",
      "Finir mal positionné"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/irimi_tenkan.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/irimi_tenkan/"
    }
  },
  {
    id: "kaiten",
    nom: "Kaiten",
    nom_japonais: "回転",
    traduction: "Rotation",
    description: "Rotation du corps sur place ou en déplacement. Utilisé pour générer de la puissance dans les projections rotatives.",
    niveau: "5e_kyu",
    categorie: "deplacement_intermediaire",
    points_cles: [
      "Centre de rotation au niveau du hara",
      "Bras suivent naturellement",
      "Regard précède le mouvement",
      "Pieds glissent sur le sol"
    ],
    erreurs_communes: [
      "Rotation initiée par les épaules",
      "Perte d'équilibre",
      "Pieds décollent du sol"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/kaiten.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/kaiten/"
    }
  },
  {
    id: "tenshin",
    nom: "Tenshin",
    nom_japonais: "転身",
    traduction: "Déplacement diagonal arrière",
    description: "Mouvement d'esquive en diagonale arrière. Permet d'éviter une attaque tout en restant à portée pour la riposte.",
    niveau: "5e_kyu",
    categorie: "deplacement_intermediaire",
    points_cles: [
      "Pas en diagonale arrière (45°)",
      "Maintenir la garde",
      "Rester connecté au partenaire",
      "Prêt pour la contre-technique"
    ],
    erreurs_communes: [
      "Fuir au lieu d'esquiver",
      "Angle incorrect",
      "Perdre la distance de travail"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/tenshin.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/tenshin/"
    }
  },
  {
    id: "sokumen",
    nom: "Sokumen Irimi",
    nom_japonais: "側面入り身",
    traduction: "Entrée latérale",
    description: "Entrée sur le côté du partenaire. Permet d'éviter l'axe d'attaque tout en se positionnant avantageusement.",
    niveau: "4e_kyu",
    categorie: "deplacement_intermediaire",
    points_cles: [
      "Pas latéral vers l'extérieur",
      "Angle d'environ 90° par rapport à l'attaque",
      "Hanches face au partenaire",
      "Position dominante sur le flanc"
    ],
    erreurs_communes: [
      "Pas assez latéral",
      "Rester sur la ligne d'attaque",
      "Hanches mal orientées"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/sokumen.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/sokumen/"
    }
  },
  {
    id: "ushiro_sabaki",
    nom: "Ushiro Sabaki",
    nom_japonais: "後ろ捌き",
    traduction: "Déplacement arrière",
    description: "Recul contrôlé permettant de créer de la distance tout en maintenant la possibilité de contre-attaquer.",
    niveau: "4e_kyu",
    categorie: "deplacement_intermediaire",
    points_cles: [
      "Pas arrière avec le pied arrière d'abord",
      "Garder le centre stable",
      "Maintenir la garde active",
      "Distance maai préservée"
    ],
    erreurs_communes: [
      "Croiser les pieds",
      "Se pencher en arrière",
      "Perdre le contact visuel"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/ushiro_sabaki.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/ushiro_sabaki/"
    }
  },
  {
    id: "tsugi_ashi",
    nom: "Tsugi Ashi",
    nom_japonais: "継ぎ足",
    traduction: "Pas glissé",
    description: "Déplacement où le pied arrière rejoint le pied avant sans le dépasser, suivi d'un nouveau pas avant. Permet d'avancer rapidement.",
    niveau: "5e_kyu",
    categorie: "deplacement_base",
    points_cles: [
      "Glisser les pieds sans les lever",
      "Pied arrière ne dépasse pas le pied avant",
      "Mouvement continu et fluide",
      "Centre de gravité stable"
    ],
    erreurs_communes: [
      "Sautiller au lieu de glisser",
      "Pas trop grands",
      "Perte de stabilité"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/tsugi_ashi.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/tsugi_ashi/"
    }
  },
  {
    id: "ayumi_ashi",
    nom: "Ayumi Ashi",
    nom_japonais: "歩み足",
    traduction: "Marche normale",
    description: "Déplacement en marchant naturellement, alternant pied gauche et pied droit. Base de tout déplacement.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: [
      "Marche naturelle et détendue",
      "Pieds parallèles",
      "Centre de gravité constant",
      "Posture droite"
    ],
    erreurs_communes: [
      "Pas trop rigides",
      "Rebonds verticaux",
      "Épaules tendues"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/ayumi_ashi.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/ayumi_ashi/"
    }
  },
  {
    id: "shikko",
    nom: "Shikko",
    nom_japonais: "膝行",
    traduction: "Marche à genoux",
    description: "Déplacement à genoux utilisé en Suwariwaza. Développe la mobilité du bassin et renforce les jambes.",
    niveau: "5e_kyu",
    categorie: "deplacement_special",
    points_cles: [
      "Genoux glissent sur le tatami",
      "Hanches mobiles et basses",
      "Dos droit",
      "Utiliser le hara pour avancer"
    ],
    erreurs_communes: [
      "Se lever trop haut",
      "Dos voûté",
      "Genoux qui tapent"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/shikko.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/shikko/"
    }
  }
];

// =============================================================================
// STATISTIQUES ET UTILITAIRES
// =============================================================================

export const TAI_SABAKI_STATS = {
  total: TAI_SABAKI.length,
  par_niveau: {
    "6e_kyu": TAI_SABAKI.filter(t => t.niveau === "6e_kyu").length,
    "5e_kyu": TAI_SABAKI.filter(t => t.niveau === "5e_kyu").length,
    "4e_kyu": TAI_SABAKI.filter(t => t.niveau === "4e_kyu").length,
  },
  par_categorie: {
    base: TAI_SABAKI.filter(t => t.categorie === "deplacement_base").length,
    intermediaire: TAI_SABAKI.filter(t => t.categorie === "deplacement_intermediaire").length,
    special: TAI_SABAKI.filter(t => t.categorie === "deplacement_special").length,
  },
  videos_disponibles: TAI_SABAKI.filter(t => t.video.url !== null).length,
  animations_disponibles: TAI_SABAKI.filter(t => t.animation.images[0] !== null).length
};

export default TAI_SABAKI;
