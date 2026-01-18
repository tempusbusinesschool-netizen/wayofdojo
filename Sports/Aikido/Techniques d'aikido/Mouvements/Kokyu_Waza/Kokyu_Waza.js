/**
 * AIKIDO@GAME — KOKYU WAZA (TECHNIQUES DE RESPIRATION/ÉNERGIE)
 * 
 * Les Kokyu Waza sont les techniques basées sur la respiration et
 * l'énergie interne (Ki). Elles développent la connexion avec le
 * partenaire et la capacité à projeter sans force musculaire.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const KOKYU_WAZA = [
  {
    id: "kokyu_dosa",
    nom: "Kokyu Dosa",
    nom_japonais: "呼吸動作",
    traduction: "Exercice de respiration",
    description: "Exercice de base pratiqué à genoux face à face. Développe la capacité à projeter en utilisant le kokyu (respiration/énergie).",
    niveau: "6e_kyu",
    categorie: "kokyu_base",
    position: "Seiza face à face",
    points_cles: [
      "Respiration coordonnée avec le mouvement",
      "Utiliser le centre (hara) pas les bras",
      "Maintenir la connexion avec le partenaire",
      "Extension vers l'extérieur",
      "Inspirer en montant, expirer en projetant"
    ],
    erreurs_communes: [
      "Utiliser la force des bras",
      "Oublier de respirer",
      "Perdre la connexion",
      "Se pencher en avant"
    ],
    philosophie: "Le Kokyu Dosa enseigne que la vraie puissance vient du centre et de l'harmonie avec le partenaire, non de la force musculaire.",
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/kokyu_dosa.mp4"
    },
    animation: {
      phases: 5,
      images: [
        null, // Phase 1: Position initiale (seiza face à face)
        null, // Phase 2: Saisie des poignets
        null, // Phase 3: Montée avec inspiration
        null, // Phase 4: Extension et déséquilibre
        null  // Phase 5: Projection avec expiration
      ],
      placeholder: "/animations/kokyu_waza/kokyu_dosa/"
    }
  },
  {
    id: "kokyu_ho",
    nom: "Kokyu Ho",
    nom_japonais: "呼吸法",
    traduction: "Méthode de respiration",
    description: "Technique de projection debout utilisant la respiration et l'extension d'énergie. Forme avancée du Kokyu Dosa.",
    niveau: "5e_kyu",
    categorie: "kokyu_base",
    position: "Debout, saisie Ryote Dori",
    points_cles: [
      "Recevoir l'énergie de l'attaque",
      "Rediriger sans bloquer",
      "Projeter par extension du Ki",
      "Mouvement en spirale",
      "Timing avec la respiration"
    ],
    erreurs_communes: [
      "Bloquer la force de l'attaque",
      "Tirer le partenaire",
      "Mouvement linéaire au lieu de spiral"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/kokyu_ho.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kokyu_waza/kokyu_ho/"
    }
  },
  {
    id: "kokyu_nage",
    nom: "Kokyu Nage",
    nom_japonais: "呼吸投げ",
    traduction: "Projection par la respiration",
    description: "Famille de projections utilisant le kokyu. Le timing et la connexion sont plus importants que la technique spécifique.",
    niveau: "4e_kyu",
    categorie: "kokyu_projection",
    variantes: [
      "Tenchi Nage (projection ciel-terre)",
      "Irimi Kokyu Nage",
      "Tenkan Kokyu Nage",
      "Ushiro Kokyu Nage"
    ],
    points_cles: [
      "Projeter au moment de l'expiration",
      "Utiliser la connexion établie",
      "Mouvement fluide sans interruption",
      "Le Ki guide le corps"
    ],
    erreurs_communes: [
      "Forcer la projection",
      "Technique mécanique sans Ki",
      "Perdre le timing"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/kokyu_nage.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kokyu_waza/kokyu_nage/"
    }
  },
  {
    id: "tenchi_nage",
    nom: "Tenchi Nage",
    nom_japonais: "天地投げ",
    traduction: "Projection ciel-terre",
    description: "Projection où une main monte vers le ciel et l'autre descend vers la terre, créant un déséquilibre total.",
    niveau: "4e_kyu",
    categorie: "kokyu_projection",
    position: "Ryote Dori",
    points_cles: [
      "Une main monte (Ten - ciel)",
      "L'autre main descend (Chi - terre)",
      "Corps passe au centre",
      "Déséquilibre par opposition",
      "Projection fluide vers l'arrière"
    ],
    symbolisme: "Représente l'harmonie entre les forces opposées du ciel et de la terre, principe fondamental de l'Aïkido.",
    erreurs_communes: [
      "Mains au même niveau",
      "Ne pas passer au centre",
      "Forcer au lieu de guider"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/tenchi_nage.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/kokyu_waza/tenchi_nage/"
    }
  },
  {
    id: "aiki_age",
    nom: "Aiki Age",
    nom_japonais: "合気上げ",
    traduction: "Montée par l'Aiki",
    description: "Exercice de développement du Ki où l'on lève les bras malgré la pression du partenaire.",
    niveau: "3e_kyu",
    categorie: "kokyu_exercice",
    position: "Assis ou debout, poignets saisis",
    points_cles: [
      "Relâcher les épaules complètement",
      "Initier le mouvement depuis le hara",
      "Les bras suivent, ne dirigent pas",
      "Extension vers le haut et l'avant",
      "Garder la connexion"
    ],
    erreurs_communes: [
      "Utiliser la force des bras",
      "Épaules qui montent",
      "Perdre le centre"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/aiki_age.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/kokyu_waza/aiki_age/"
    }
  },
  {
    id: "aiki_sage",
    nom: "Aiki Sage",
    nom_japonais: "合気下げ",
    traduction: "Descente par l'Aiki",
    description: "Exercice complémentaire à Aiki Age où l'on abaisse les bras en gardant la connexion.",
    niveau: "3e_kyu",
    categorie: "kokyu_exercice",
    position: "Assis ou debout, poignets saisis",
    points_cles: [
      "Poids qui descend naturellement",
      "Extension vers le bas",
      "Connexion maintenue",
      "Partenaire suit le mouvement"
    ],
    erreurs_communes: [
      "Appuyer vers le bas",
      "Couper la connexion",
      "Mouvement brusque"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/kokyu_waza/aiki_sage.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/kokyu_waza/aiki_sage/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const KOKYU_WAZA_STATS = {
  total: KOKYU_WAZA.length,
  par_categorie: {
    base: KOKYU_WAZA.filter(k => k.categorie === "kokyu_base").length,
    projection: KOKYU_WAZA.filter(k => k.categorie === "kokyu_projection").length,
    exercice: KOKYU_WAZA.filter(k => k.categorie === "kokyu_exercice").length,
  },
  videos_disponibles: KOKYU_WAZA.filter(k => k.video.url !== null).length
};

export default KOKYU_WAZA;
