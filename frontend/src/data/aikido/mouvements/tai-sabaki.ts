/**
 * 🥋 WAYOFDOJO — TAI SABAKI (DÉPLACEMENTS CORPORELS)
 * 
 * Les Tai Sabaki sont les mouvements de corps fondamentaux en Aïkido.
 * Ils permettent d'esquiver, de se repositionner et de créer
 * les angles nécessaires à l'exécution des techniques.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { Mouvement, StatistiquesMouvements, NiveauGrade } from '../types';

export const TAI_SABAKI: Mouvement[] = [
  {
    id: "irimi",
    nom: "Irimi",
    nom_japonais: "入身",
    traduction: "Entrer / Entrée",
    description: "Mouvement d'entrée directe vers le partenaire. Fondement de l'Aïkido - entrer dans l'attaque plutôt que de reculer.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    principe: "Entrer dans la ligne d'attaque pour la neutraliser",
    points_cles: [
      "Avancer en ligne droite",
      "Hanches face à la direction",
      "Maintenir la posture",
      "Entrer au moment de l'attaque"
    ],
    erreurs_communes: [
      "Reculer au lieu d'entrer",
      "Entrer trop tard",
      "Perdre la connexion avec le partenaire"
    ],
    applications: [
      "Base de Irimi Nage",
      "Esquive intérieure",
      "Prise d'angle"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/irimi.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/irimi/"
    }
  },
  {
    id: "tenkan",
    nom: "Tenkan",
    nom_japonais: "転換",
    traduction: "Pivot / Rotation",
    description: "Pivot de 180° sur le pied avant. Permet de rediriger l'énergie de l'attaquant sans opposition directe.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    principe: "Tourner pour rediriger l'énergie",
    points_cles: [
      "Pivoter sur le pied avant",
      "Rotation de 180°",
      "Hanches qui guident le mouvement",
      "Garder le centre stable"
    ],
    erreurs_communes: [
      "Pivoter sur le mauvais pied",
      "Rotation incomplète",
      "Perdre l'équilibre"
    ],
    applications: [
      "Techniques Ura",
      "Redirection de force",
      "Création d'angle"
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
    nom_japonais: "入身転換",
    traduction: "Entrer et pivoter",
    description: "Combinaison d'une entrée suivie d'un pivot. Mouvement fluide permettant de passer de l'entrée à la redirection.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    principe: "Entrer puis tourner",
    points_cles: [
      "Irimi d'abord",
      "Enchaîner avec Tenkan",
      "Mouvement continu et fluide",
      "Maintenir le contact"
    ],
    erreurs_communes: [
      "Séparer les deux mouvements",
      "Perdre la connexion",
      "Mouvement saccadé"
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
    description: "Rotation du corps sur son axe central. Base des techniques rotatives comme Kaiten Nage.",
    niveau: "5e_kyu",
    categorie: "deplacement_base",
    principe: "Tourner autour de son axe central",
    points_cles: [
      "Rotation autour du centre",
      "Pieds qui suivent les hanches",
      "Maintenir la verticalité",
      "Mouvement spiralé"
    ],
    erreurs_communes: [
      "Tourner avec les épaules",
      "Perdre l'axe central",
      "Rotation désordonnée"
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
    id: "tai_no_henko",
    nom: "Tai no Henko",
    nom_japonais: "体の変更",
    traduction: "Changement du corps",
    description: "Exercice fondamental de Tenkan avec un partenaire. Apprend à rediriger l'énergie d'une saisie.",
    niveau: "6e_kyu",
    categorie: "exercice_base",
    principe: "Apprendre le Tenkan avec résistance",
    importance: "Exercice pratiqué à chaque début de cours dans de nombreux dojos",
    points_cles: [
      "Partenaire saisit le poignet",
      "Tenkan en maintenant le contact",
      "Finir à côté du partenaire",
      "Connexion maintenue tout au long"
    ],
    erreurs_communes: [
      "Casser la connexion",
      "Tirer sur le partenaire",
      "Pivoter trop loin"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/tai_no_henko.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/tai_no_henko/"
    }
  },
  {
    id: "tsugi_ashi",
    nom: "Tsugi Ashi",
    nom_japonais: "継ぎ足",
    traduction: "Pas glissé",
    description: "Déplacement en glissant les pieds. Le pied arrière suit le pied avant sans jamais le dépasser.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    principe: "Glisser sans lever les pieds",
    points_cles: [
      "Pieds qui glissent sur le tatami",
      "Le pied arrière ne dépasse jamais le pied avant",
      "Hanches basses et stables",
      "Mouvement silencieux"
    ],
    erreurs_communes: [
      "Lever les pieds",
      "Croiser les pieds",
      "Mouvement bruyant"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/tsugi_ashi.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/tsugi_ashi/"
    }
  },
  {
    id: "ayumi_ashi",
    nom: "Ayumi Ashi",
    nom_japonais: "歩み足",
    traduction: "Pas de marche",
    description: "Marche normale avec alternance des pieds. Utilisée pour les déplacements longs.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    principe: "Marcher normalement tout en gardant la garde",
    points_cles: [
      "Alternance des pieds comme la marche",
      "Hanches stables",
      "Garder la connexion au sol",
      "Posture maintenue"
    ],
    erreurs_communes: [
      "Perdre la posture",
      "Mouvements verticaux excessifs",
      "Hanches qui bougent trop"
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
    id: "okuri_ashi",
    nom: "Okuri Ashi",
    nom_japonais: "送り足",
    traduction: "Pas chassé",
    description: "Pas chassé latéral. Un pied pousse, l'autre suit.",
    niveau: "5e_kyu",
    categorie: "deplacement_base",
    principe: "Déplacement latéral rapide",
    points_cles: [
      "Un pied pousse vers la direction",
      "L'autre pied suit",
      "Mouvement horizontal",
      "Garde maintenue"
    ],
    erreurs_communes: [
      "Croiser les pieds",
      "Perdre l'équilibre",
      "Mouvement trop lent"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/okuri_ashi.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/okuri_ashi/"
    }
  },
  {
    id: "tenshin",
    nom: "Tenshin",
    nom_japonais: "転身",
    traduction: "Rotation du corps / Esquive",
    description: "Rotation d'esquive où le corps entier pivote pour éviter l'attaque tout en restant proche.",
    niveau: "4e_kyu",
    categorie: "deplacement_avance",
    principe: "Esquiver en tournant le corps entier",
    points_cles: [
      "Pivot sur un pied",
      "Corps qui tourne comme une porte",
      "Rester proche de l'attaquant",
      "Prêt à contre-attaquer"
    ],
    erreurs_communes: [
      "S'éloigner trop",
      "Rotation incomplète",
      "Perdre le contact visuel"
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
    id: "hiraki",
    nom: "Hiraki",
    nom_japonais: "開き",
    traduction: "Ouverture",
    description: "Mouvement d'ouverture latérale. Le corps s'ouvre sur le côté pour créer un angle.",
    niveau: "4e_kyu",
    categorie: "deplacement_avance",
    principe: "Ouvrir le corps sur le côté",
    points_cles: [
      "Ouvrir le corps latéralement",
      "Un pied pivote, l'autre avance",
      "Créer un angle de 45°",
      "Rester face au partenaire"
    ],
    erreurs_communes: [
      "Tourner le dos",
      "Ouverture trop grande",
      "Perdre la connexion"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/hiraki.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/tai_sabaki/hiraki/"
    }
  },
  {
    id: "nagare",
    nom: "Nagare",
    nom_japonais: "流れ",
    traduction: "Flux / Écoulement",
    description: "Mouvement fluide qui accompagne l'énergie du partenaire sans interruption.",
    niveau: "3e_kyu",
    categorie: "deplacement_avance",
    principe: "Couler avec l'énergie",
    points_cles: [
      "Pas de résistance",
      "Accompagner le mouvement",
      "Fluidité constante",
      "Rediriger sans bloquer"
    ],
    erreurs_communes: [
      "Bloquer le mouvement",
      "Saccades dans le déplacement",
      "Perdre le rythme du partenaire"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/tai_sabaki/nagare.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/tai_sabaki/nagare/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const TAI_SABAKI_STATS: StatistiquesMouvements = {
  total: TAI_SABAKI.length,
  par_categorie: {
    deplacement_base: TAI_SABAKI.filter(t => t.categorie === "deplacement_base").length,
    deplacement_avance: TAI_SABAKI.filter(t => t.categorie === "deplacement_avance").length,
    exercice_base: TAI_SABAKI.filter(t => t.categorie === "exercice_base").length,
  },
  videos_disponibles: TAI_SABAKI.filter(t => t.video.url !== null).length
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getTaiSabakiByNiveau = (niveau: NiveauGrade): Mouvement[] => {
  return TAI_SABAKI.filter(t => t.niveau === niveau);
};

export const getTaiSabakiByCategorie = (categorie: string): Mouvement[] => {
  return TAI_SABAKI.filter(t => t.categorie === categorie);
};

export default TAI_SABAKI;
