/**
 * AIKIDO@GAME — UKEMI (CHUTES)
 * 
 * Les Ukemi sont les techniques de chute en Aïkido.
 * Essentielles pour la pratique sécurisée, elles permettent de
 * recevoir les techniques sans se blesser.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const UKEMI = [
  {
    id: "mae_ukemi",
    nom: "Mae Ukemi",
    nom_japonais: "前受身",
    traduction: "Chute avant",
    description: "Chute roulée vers l'avant. La plus courante en Aïkido, elle permet de recevoir les projections en douceur.",
    niveau: "6e_kyu",
    categorie: "ukemi_base",
    points_cles: [
      "Rentrer le menton",
      "Arrondir le dos",
      "Bras en arc de cercle",
      "Rouler sur l'épaule, pas sur la colonne",
      "Se relever en garde"
    ],
    erreurs_communes: [
      "Tête relevée (risque de choc)",
      "Rouler sur la colonne vertébrale",
      "Bras tendu (risque au coude)",
      "Ne pas se relever"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/mae_ukemi.mp4"
    },
    animation: {
      phases: 5,
      images: [
        null, // Phase 1: Position initiale
        null, // Phase 2: Engagement
        null, // Phase 3: Contact sol
        null, // Phase 4: Roulade
        null  // Phase 5: Relevé
      ],
      placeholder: "/animations/ukemi/mae_ukemi/"
    }
  },
  {
    id: "ushiro_ukemi",
    nom: "Ushiro Ukemi",
    nom_japonais: "後ろ受身",
    traduction: "Chute arrière",
    description: "Chute roulée vers l'arrière. Utilisée pour les techniques qui projettent vers l'arrière.",
    niveau: "6e_kyu",
    categorie: "ukemi_base",
    points_cles: [
      "Rentrer le menton contre la poitrine",
      "Arrondir le dos complètement",
      "Bras frappent le sol pour amortir",
      "Rouler sur l'épaule",
      "Se relever en garde"
    ],
    erreurs_communes: [
      "Tête en arrière (choc crânien)",
      "Tomber sur les fesses",
      "Bras trop tendus",
      "Rester au sol"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/ushiro_ukemi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/ukemi/ushiro_ukemi/"
    }
  },
  {
    id: "yoko_ukemi",
    nom: "Yoko Ukemi",
    nom_japonais: "横受身",
    traduction: "Chute latérale",
    description: "Chute sur le côté. Utilisée lorsque la projection est dirigée latéralement.",
    niveau: "5e_kyu",
    categorie: "ukemi_base",
    points_cles: [
      "Corps entier touche le sol simultanément",
      "Bras frappe le sol (angle 45°)",
      "Tête protégée par l'épaule",
      "Jambes légèrement fléchies",
      "Expirer à l'impact"
    ],
    erreurs_communes: [
      "Tomber sur le coude",
      "Tête qui touche le sol",
      "Corps en tension",
      "Bras trop près du corps"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/yoko_ukemi.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/ukemi/yoko_ukemi/"
    }
  },
  {
    id: "zenpo_kaiten_ukemi",
    nom: "Zenpo Kaiten Ukemi",
    nom_japonais: "前方回転受身",
    traduction: "Roulade avant",
    description: "Roulade avant complète. Forme de base du Mae Ukemi, pratiquée de manière continue.",
    niveau: "6e_kyu",
    categorie: "ukemi_base",
    points_cles: [
      "Départ en position basse",
      "Main guide la direction",
      "Rouler en diagonale sur le dos",
      "Garder le mouvement fluide",
      "Se relever debout"
    ],
    erreurs_communes: [
      "Rouler droit (sur la colonne)",
      "Sauter au lieu de rouler",
      "Perdre la direction",
      "S'arrêter en cours de route"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/zenpo_kaiten_ukemi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/ukemi/zenpo_kaiten_ukemi/"
    }
  },
  {
    id: "koho_kaiten_ukemi",
    nom: "Koho Kaiten Ukemi",
    nom_japonais: "後方回転受身",
    traduction: "Roulade arrière",
    description: "Roulade arrière complète. Permet de se remettre debout après une chute arrière.",
    niveau: "5e_kyu",
    categorie: "ukemi_base",
    points_cles: [
      "Menton rentré",
      "Dos arrondi",
      "Rouler sur l'épaule",
      "Utiliser l'élan pour se relever",
      "Terminer en garde"
    ],
    erreurs_communes: [
      "Rouler sur la nuque",
      "Perdre l'élan",
      "Corps rigide",
      "Ne pas se relever"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/koho_kaiten_ukemi.mp4"
    },
    animation: {
      phases: 5,
      images: [null, null, null, null, null],
      placeholder: "/animations/ukemi/koho_kaiten_ukemi/"
    }
  },
  {
    id: "tobi_ukemi",
    nom: "Tobi Ukemi",
    nom_japonais: "飛び受身",
    traduction: "Chute plongée / aérienne",
    description: "Chute avec phase aérienne. Utilisée pour les techniques de projection puissantes comme Kote Gaeshi.",
    niveau: "3e_kyu",
    categorie: "ukemi_avance",
    points_cles: [
      "Sauter pour accompagner la technique",
      "Corps en extension pendant le vol",
      "Préparer l'atterrissage",
      "Amortir avec le bras et le corps",
      "Rouler pour dissiper l'énergie"
    ],
    erreurs_communes: [
      "Résister à la projection",
      "Atterrir sur les mains tendues",
      "Ne pas rouler après l'atterrissage",
      "Panique en l'air"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/tobi_ukemi.mp4"
    },
    animation: {
      phases: 6,
      images: [null, null, null, null, null, null],
      placeholder: "/animations/ukemi/tobi_ukemi/"
    }
  },
  {
    id: "mae_tobi_ukemi",
    nom: "Mae Tobi Ukemi",
    nom_japonais: "前飛び受身",
    traduction: "Chute plongée avant",
    description: "Plongeon avant avec roulade. Version avancée pour les projections très puissantes vers l'avant.",
    niveau: "2e_kyu",
    categorie: "ukemi_avance",
    points_cles: [
      "Plonger vers l'avant",
      "Bras absorbent le premier impact",
      "Rouler immédiatement",
      "Utiliser l'élan du plongeon",
      "Se relever en continuité"
    ],
    erreurs_communes: [
      "Plonger à plat",
      "Bras qui cèdent",
      "Bloquer au lieu de rouler",
      "Tête qui touche le sol"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/mae_tobi_ukemi.mp4"
    },
    animation: {
      phases: 6,
      images: [null, null, null, null, null, null],
      placeholder: "/animations/ukemi/mae_tobi_ukemi/"
    }
  },
  {
    id: "suwari_mae_ukemi",
    nom: "Suwari Mae Ukemi",
    nom_japonais: "座り前受身",
    traduction: "Chute avant à genoux",
    description: "Chute avant exécutée depuis la position à genoux (seiza ou shikko).",
    niveau: "4e_kyu",
    categorie: "ukemi_special",
    points_cles: [
      "Départ depuis seiza",
      "Même principe que mae ukemi",
      "Amplitude réduite",
      "Retour en seiza"
    ],
    erreurs_communes: [
      "Se lever avant de rouler",
      "Rouler sur les genoux",
      "Mouvement trop ample"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/suwari_mae_ukemi.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/ukemi/suwari_mae_ukemi/"
    }
  },
  {
    id: "suwari_ushiro_ukemi",
    nom: "Suwari Ushiro Ukemi",
    nom_japonais: "座り後ろ受身",
    traduction: "Chute arrière à genoux",
    description: "Chute arrière exécutée depuis la position à genoux.",
    niveau: "4e_kyu",
    categorie: "ukemi_special",
    points_cles: [
      "Départ depuis seiza",
      "Arrondir le dos",
      "Rouler sur l'épaule",
      "Retour en seiza possible"
    ],
    erreurs_communes: [
      "Tomber sur les fesses",
      "Tête en arrière",
      "Mouvement saccadé"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/ukemi/suwari_ushiro_ukemi.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/ukemi/suwari_ushiro_ukemi/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const UKEMI_STATS = {
  total: UKEMI.length,
  par_niveau: {
    "6e_kyu": UKEMI.filter(u => u.niveau === "6e_kyu").length,
    "5e_kyu": UKEMI.filter(u => u.niveau === "5e_kyu").length,
    "4e_kyu": UKEMI.filter(u => u.niveau === "4e_kyu").length,
    "3e_kyu": UKEMI.filter(u => u.niveau === "3e_kyu").length,
    "2e_kyu": UKEMI.filter(u => u.niveau === "2e_kyu").length,
  },
  par_categorie: {
    base: UKEMI.filter(u => u.categorie === "ukemi_base").length,
    avance: UKEMI.filter(u => u.categorie === "ukemi_avance").length,
    special: UKEMI.filter(u => u.categorie === "ukemi_special").length,
  },
  videos_disponibles: UKEMI.filter(u => u.video.url !== null).length
};

export default UKEMI;
