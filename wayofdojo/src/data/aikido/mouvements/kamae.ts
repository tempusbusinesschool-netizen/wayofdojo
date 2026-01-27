/**
 * 🥋 WAYOFDOJO — KAMAE (POSTURES / GARDES)
 * 
 * Les Kamae sont les positions de garde fondamentales en Aïkido.
 * Elles déterminent la relation avec le partenaire et préparent
 * l'exécution des techniques.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { NiveauGrade } from '../types';

export interface Kamae {
  id: string;
  nom: string;
  nom_japonais: string;
  traduction: string;
  description: string;
  niveau: NiveauGrade;
  categorie: 'kamae_debout' | 'kamae_sol' | 'kamae_special';
  caracteristiques: {
    pieds?: string;
    hanches?: string;
    poids?: string;
    bras?: string;
    position?: string;
    dos?: string;
    mains?: string;
    regard?: string;
    tori?: string;
    uke?: string;
    distance?: string;
    defi?: string;
    preparation?: string;
    intention?: string;
    energie?: string;
    application?: string;
  };
  points_cles: string[];
  applications?: string[];
  utilisation?: string[];
  erreurs_communes?: string[];
}

export const KAMAE: Kamae[] = [
  {
    id: "ai_hanmi",
    nom: "Ai Hanmi",
    nom_japonais: "相半身",
    traduction: "Garde identique",
    description: "Position où les deux partenaires ont le même pied avancé (tous deux pied droit ou tous deux pied gauche). Position miroir.",
    niveau: "6e_kyu",
    categorie: "kamae_debout",
    caracteristiques: {
      pieds: "Même pied avancé que le partenaire",
      hanches: "45° par rapport à la ligne d'attaque",
      poids: "60% sur le pied arrière",
      bras: "Avant-bras avant en protection"
    },
    points_cles: [
      "Pieds écartés largeur épaules",
      "Genoux légèrement fléchis",
      "Dos droit, épaules relâchées",
      "Regard vers le partenaire"
    ],
    applications: [
      "Katate Dori",
      "Ai Hanmi Katate Dori",
      "Shomen Uchi"
    ]
  },
  {
    id: "gyaku_hanmi",
    nom: "Gyaku Hanmi",
    nom_japonais: "逆半身",
    traduction: "Garde inversée",
    description: "Position où les partenaires ont des pieds opposés avancés (un pied droit, l'autre pied gauche). Position en croix.",
    niveau: "6e_kyu",
    categorie: "kamae_debout",
    caracteristiques: {
      pieds: "Pied opposé à celui du partenaire",
      hanches: "45° par rapport à la ligne d'attaque",
      poids: "60% sur le pied arrière",
      bras: "Avant-bras avant croise celui du partenaire"
    },
    points_cles: [
      "Position stable et équilibrée",
      "Prêt à recevoir une saisie croisée",
      "Distance correcte (maai)",
      "Centre engagé"
    ],
    applications: [
      "Gyaku Hanmi Katate Dori",
      "Yokomen Uchi",
      "Tsuki"
    ]
  },
  {
    id: "migi_hanmi",
    nom: "Migi Hanmi",
    nom_japonais: "右半身",
    traduction: "Garde droite",
    description: "Position avec le pied droit avancé. Garde standard pour la majorité des pratiquants.",
    niveau: "6e_kyu",
    categorie: "kamae_debout",
    caracteristiques: {
      pieds: "Pied droit devant",
      hanches: "Ouvertes vers la droite",
      poids: "Réparti 60/40",
      bras: "Bras droit en avant"
    },
    points_cles: [
      "Pied droit pointe vers l'avant",
      "Pied gauche à 45°",
      "Hanches stables",
      "Prêt à se déplacer"
    ]
  },
  {
    id: "hidari_hanmi",
    nom: "Hidari Hanmi",
    nom_japonais: "左半身",
    traduction: "Garde gauche",
    description: "Position avec le pied gauche avancé. Importante pour l'équilibre de la pratique.",
    niveau: "6e_kyu",
    categorie: "kamae_debout",
    caracteristiques: {
      pieds: "Pied gauche devant",
      hanches: "Ouvertes vers la gauche",
      poids: "Réparti 60/40",
      bras: "Bras gauche en avant"
    },
    points_cles: [
      "Symétrique à Migi Hanmi",
      "Pratiquer des deux côtés",
      "Même qualité que côté dominant",
      "Développe l'ambidextrie"
    ]
  },
  {
    id: "seiza",
    nom: "Seiza",
    nom_japonais: "正座",
    traduction: "Position assise correcte",
    description: "Position à genoux traditionnelle japonaise. Position de départ et d'arrivée de la pratique.",
    niveau: "6e_kyu",
    categorie: "kamae_sol",
    caracteristiques: {
      position: "À genoux, assis sur les talons",
      dos: "Droit et détendu",
      mains: "Sur les cuisses",
      regard: "Droit devant"
    },
    points_cles: [
      "Genoux écartés de deux poings",
      "Gros orteils croisés ou côte à côte",
      "Colonne vertébrale alignée",
      "Respiration naturelle"
    ],
    utilisation: [
      "Début et fin de cours",
      "Salutations (Rei)",
      "Position de repos",
      "Suwariwaza"
    ]
  },
  {
    id: "kiza",
    nom: "Kiza",
    nom_japonais: "跪座",
    traduction: "Position à genoux relevée",
    description: "Position à genoux avec les orteils relevés. Position de transition et de préparation.",
    niveau: "5e_kyu",
    categorie: "kamae_sol",
    caracteristiques: {
      position: "À genoux, orteils relevés",
      dos: "Droit",
      poids: "Sur les orteils",
      preparation: "Prêt à se lever rapidement"
    },
    points_cles: [
      "Orteils fléchis sous les pieds",
      "Prêt à bondir",
      "Position active",
      "Transition seiza-debout"
    ]
  },
  {
    id: "hanmi_handachi",
    nom: "Hanmi Handachi Kamae",
    nom_japonais: "半身半立構え",
    traduction: "Garde semi-debout",
    description: "Position où Tori est à genoux et Uke est debout. Situation de désavantage à gérer.",
    niveau: "4e_kyu",
    categorie: "kamae_special",
    caracteristiques: {
      tori: "Position à genoux (seiza ou shikko)",
      uke: "Position debout (hanmi)",
      distance: "Maai adapté",
      defi: "Gérer le désavantage de hauteur"
    },
    points_cles: [
      "Tori doit utiliser les déplacements au sol",
      "Exploiter la différence de niveau",
      "Techniques adaptées à la situation",
      "Développe l'adaptabilité"
    ]
  },
  {
    id: "chudan_no_kamae",
    nom: "Chudan no Kamae",
    nom_japonais: "中段の構え",
    traduction: "Garde niveau moyen",
    description: "Garde avec les mains au niveau du centre (hara). Position neutre et polyvalente.",
    niveau: "5e_kyu",
    categorie: "kamae_debout",
    caracteristiques: {
      mains: "Niveau du nombril/plexus",
      intention: "Protection et préparation",
      energie: "Centrée",
      application: "Position standard"
    },
    points_cles: [
      "Mains devant le centre",
      "Coudes légèrement fléchis",
      "Épaules basses et détendues",
      "Prêt pour toute action"
    ]
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const KAMAE_STATS = {
  total: KAMAE.length,
  par_categorie: {
    debout: KAMAE.filter(k => k.categorie === "kamae_debout").length,
    sol: KAMAE.filter(k => k.categorie === "kamae_sol").length,
    special: KAMAE.filter(k => k.categorie === "kamae_special").length,
  },
  par_niveau: {
    "6e_kyu": KAMAE.filter(k => k.niveau === "6e_kyu").length,
    "5e_kyu": KAMAE.filter(k => k.niveau === "5e_kyu").length,
    "4e_kyu": KAMAE.filter(k => k.niveau === "4e_kyu").length,
  }
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getKamaeById = (id: string): Kamae | undefined => {
  return KAMAE.find(k => k.id === id);
};

export const getKamaeByNiveau = (niveau: NiveauGrade): Kamae[] => {
  return KAMAE.filter(k => k.niveau === niveau);
};

export const getKamaeByCategorie = (categorie: string): Kamae[] => {
  return KAMAE.filter(k => k.categorie === categorie);
};

export default KAMAE;
