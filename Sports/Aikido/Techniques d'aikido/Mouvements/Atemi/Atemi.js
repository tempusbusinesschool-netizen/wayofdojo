/**
 * AIKIDO@GAME — ATEMI (TECHNIQUES DE FRAPPE)
 * 
 * Les Atemi sont les techniques de frappe en Aïkido.
 * Bien que l'Aïkido soit un art de défense, les atemi sont
 * essentiels pour déstabiliser, créer des ouvertures et
 * contrôler le partenaire.
 * 
 * 🎬 Chaque mouvement dispose d'un emplacement pour une vidéo animée
 */

export const ATEMI = [
  {
    id: "shomen_ate",
    nom: "Shomen Ate",
    nom_japonais: "正面当て",
    traduction: "Frappe frontale",
    description: "Frappe directe vers le visage avec le tranchant de la main ou la paume. Atemi fondamental.",
    niveau: "5e_kyu",
    categorie: "atemi_main",
    cible: "Visage (front, nez)",
    forme_main: "Tegatana (tranchant) ou Shotei (paume)",
    points_cles: [
      "Frappe partant du centre (hara)",
      "Bras détendu puis tendu à l'impact",
      "Regard vers la cible",
      "Kiai pour concentrer l'énergie"
    ],
    erreurs_communes: [
      "Frapper avec l'épaule",
      "Bras tendu dès le départ",
      "Perdre l'équilibre vers l'avant"
    ],
    applications: [
      "Ouverture pour Irimi Nage",
      "Distraction",
      "Contrôle de la distance"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/shomen_ate.mp4"
    },
    animation: {
      phases: 3,
      images: [
        null, // Phase 1: Préparation
        null, // Phase 2: Frappe
        null  // Phase 3: Retour
      ],
      placeholder: "/animations/atemi/shomen_ate/"
    }
  },
  {
    id: "yokomen_ate",
    nom: "Yokomen Ate",
    nom_japonais: "横面当て",
    traduction: "Frappe latérale",
    description: "Frappe circulaire visant la tempe ou le côté de la tête. Utilisée pour créer une rotation.",
    niveau: "5e_kyu",
    categorie: "atemi_main",
    cible: "Tempe, côté du visage",
    forme_main: "Tegatana (tranchant de la main)",
    points_cles: [
      "Mouvement circulaire partant de l'épaule",
      "Rotation des hanches accompagne la frappe",
      "Impact avec le tranchant de la main",
      "Retour en garde"
    ],
    erreurs_communes: [
      "Mouvement trop large",
      "Hanches statiques",
      "Perdre la connexion au centre"
    ],
    applications: [
      "Ouverture pour Shiho Nage",
      "Déséquilibre latéral",
      "Redirection de l'attention"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/yokomen_ate.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/yokomen_ate/"
    }
  },
  {
    id: "chudan_tsuki",
    nom: "Chudan Tsuki",
    nom_japonais: "中段突き",
    traduction: "Coup de poing niveau moyen",
    description: "Coup de poing direct au niveau du plexus solaire ou de l'abdomen.",
    niveau: "5e_kyu",
    categorie: "atemi_poing",
    cible: "Plexus solaire, abdomen",
    forme_main: "Seiken (poing fermé)",
    points_cles: [
      "Poing part de la hanche",
      "Rotation du poignet à l'impact",
      "Hanches engagées",
      "Bras revient rapidement"
    ],
    erreurs_communes: [
      "Poing levé trop haut",
      "Pas de rotation des hanches",
      "Impact avec les doigts"
    ],
    applications: [
      "Atemi de déstabilisation",
      "Réponse à une saisie",
      "Création d'espace"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/chudan_tsuki.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/chudan_tsuki/"
    }
  },
  {
    id: "jodan_tsuki",
    nom: "Jodan Tsuki",
    nom_japonais: "上段突き",
    traduction: "Coup de poing niveau haut",
    description: "Coup de poing direct au niveau du visage. Atemi puissant mais plus visible.",
    niveau: "4e_kyu",
    categorie: "atemi_poing",
    cible: "Visage, menton",
    forme_main: "Seiken (poing fermé)",
    points_cles: [
      "Trajectoire directe vers le visage",
      "Protection de l'autre main",
      "Retour rapide en garde",
      "Kime à l'impact"
    ],
    erreurs_communes: [
      "Télégraphier le coup",
      "Baisser la garde",
      "S'exposer en frappant"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/jodan_tsuki.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/jodan_tsuki/"
    }
  },
  {
    id: "gedan_ate",
    nom: "Gedan Ate",
    nom_japonais: "下段当て",
    traduction: "Frappe niveau bas",
    description: "Frappe dirigée vers les parties basses (abdomen bas, aine).",
    niveau: "4e_kyu",
    categorie: "atemi_main",
    cible: "Bas-ventre, aine",
    forme_main: "Tegatana ou Shotei",
    points_cles: [
      "Frappe descendante",
      "Utilise le poids du corps",
      "Cible discrète",
      "Effet déstabilisant"
    ],
    erreurs_communes: [
      "Se pencher trop",
      "Perdre sa garde haute",
      "Frappe trop faible"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/gedan_ate.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/gedan_ate/"
    }
  },
  {
    id: "ura_ken",
    nom: "Ura Ken",
    nom_japonais: "裏拳",
    traduction: "Revers de poing",
    description: "Frappe avec le dos du poing. Mouvement rapide et difficile à anticiper.",
    niveau: "3e_kyu",
    categorie: "atemi_poing",
    cible: "Tempe, nez",
    forme_main: "Dos du poing",
    points_cles: [
      "Mouvement de fouet",
      "Rotation du poignet",
      "Frappe sèche et rapide",
      "Utilise le snap"
    ],
    erreurs_communes: [
      "Mouvement trop ample",
      "Pas de rotation",
      "Impact avec les doigts"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/ura_ken.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/ura_ken/"
    }
  },
  {
    id: "hiji_ate",
    nom: "Hiji Ate",
    nom_japonais: "肘当て",
    traduction: "Coup de coude",
    description: "Frappe avec le coude. Très puissant à courte distance.",
    niveau: "3e_kyu",
    categorie: "atemi_coude",
    cible: "Côtes, visage, plexus",
    forme: "Coude fléchi à 90°",
    points_cles: [
      "Efficace à très courte distance",
      "Rotation des hanches pour la puissance",
      "Peut être horizontal ou montant",
      "Très déstabilisant"
    ],
    erreurs_communes: [
      "Distance trop grande",
      "Pas assez de rotation",
      "Coude mal positionné"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/hiji_ate.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/hiji_ate/"
    }
  },
  {
    id: "mune_ate",
    nom: "Mune Ate",
    nom_japonais: "胸当て",
    traduction: "Frappe à la poitrine",
    description: "Frappe directe à la poitrine avec la paume. Utilisé pour repousser.",
    niveau: "4e_kyu",
    categorie: "atemi_main",
    cible: "Sternum, poitrine",
    forme_main: "Shotei (paume)",
    points_cles: [
      "Paume ouverte, doigts vers le haut",
      "Pousse plus que frappe",
      "Déséquilibre vers l'arrière",
      "Peut être suivi d'une technique"
    ],
    applications: [
      "Créer de l'espace",
      "Début de Kokyu Nage",
      "Réponse à une saisie"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/mune_ate.mp4"
    },
    animation: {
      phases: 3,
      images: [null, null, null],
      placeholder: "/animations/atemi/mune_ate/"
    }
  },
  {
    id: "mae_geri",
    nom: "Mae Geri",
    nom_japonais: "前蹴り",
    traduction: "Coup de pied frontal",
    description: "Coup de pied direct vers l'avant. Moins courant en Aïkido mais utile à connaître.",
    niveau: "2e_kyu",
    categorie: "atemi_pied",
    cible: "Genou, bas-ventre",
    forme: "Frappe avec le bol du pied ou le talon",
    points_cles: [
      "Genou monte d'abord",
      "Extension de la jambe",
      "Retour rapide",
      "Garder l'équilibre"
    ],
    erreurs_communes: [
      "Jambe tendue dès le départ",
      "Perdre l'équilibre",
      "Frapper avec les orteils"
    ],
    video: {
      url: null,
      thumbnail: null,
      duree: null,
      format: "mp4",
      placeholder: "/videos/mouvements/atemi/mae_geri.mp4"
    },
    animation: {
      phases: 4,
      images: [null, null, null, null],
      placeholder: "/animations/atemi/mae_geri/"
    }
  }
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const ATEMI_STATS = {
  total: ATEMI.length,
  par_categorie: {
    main: ATEMI.filter(a => a.categorie === "atemi_main").length,
    poing: ATEMI.filter(a => a.categorie === "atemi_poing").length,
    coude: ATEMI.filter(a => a.categorie === "atemi_coude").length,
    pied: ATEMI.filter(a => a.categorie === "atemi_pied").length,
  },
  videos_disponibles: ATEMI.filter(a => a.video.url !== null).length
};

export default ATEMI;
