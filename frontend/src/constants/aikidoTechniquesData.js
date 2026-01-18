/**
 * AIKIDO@GAME — INDEX COMPLET DES TECHNIQUES ET MOUVEMENTS
 * 
 * Ce fichier centralise TOUTES les données des techniques d'Aïkido
 * avec un niveau de détail approfondi incluant :
 * - Noms japonais et traductions
 * - Points clés d'exécution
 * - Erreurs courantes à éviter
 * - Niveaux requis
 * - Catégorisation détaillée
 * 
 * TOTAL: 161 techniques et mouvements
 */

// ============================================================================
// ⚔️ ARMES
// ============================================================================

// 🪵 JO (BÂTON) — 46 techniques
export const TECHNIQUES_JO = [
  // ═══════════════════════════════════════════════════════════════════════════
  // JO SUBURI - TSUKI (Piques) — 5 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_suburi_1", 
    nom: "Choku Tsuki",
    nom_japonais: "直突き",
    traduction: "Pique directe",
    description: "Pique directe vers l'avant, mouvement de base fondamental",
    niveau: "5e_kyu",
    ordre: 1,
    categorie: "Jo Suburi - Tsuki",
    points_cles: ["Extension complète du bâton", "Hanches face à la cible", "Poids du corps dans la pique"],
    erreurs_communes: ["Bras trop fléchis", "Manque de puissance des hanches"]
  },
  { 
    id: "jo_suburi_2", 
    nom: "Kaeshi Tsuki",
    nom_japonais: "返し突き",
    traduction: "Pique avec retournement",
    description: "Pique avec retournement du bâton entre les mains",
    niveau: "5e_kyu",
    ordre: 2,
    categorie: "Jo Suburi - Tsuki",
    points_cles: ["Rotation fluide du Jo", "Maintenir la ligne centrale", "Coordination mains-hanches"],
    erreurs_communes: ["Retournement saccadé", "Perte de la trajectoire"]
  },
  { 
    id: "jo_suburi_3", 
    nom: "Ushiro Tsuki",
    nom_japonais: "後ろ突き",
    traduction: "Pique vers l'arrière",
    description: "Pique exécutée vers l'arrière sans se retourner",
    niveau: "5e_kyu",
    ordre: 3,
    categorie: "Jo Suburi - Tsuki",
    points_cles: ["Regard vers l'avant", "Sensation de l'espace arrière", "Extension complète"],
    erreurs_communes: ["Se retourner", "Pique molle"]
  },
  { 
    id: "jo_suburi_4", 
    nom: "Tsuki Gedan Gaeshi",
    nom_japonais: "突き下段返し",
    traduction: "Pique avec retour niveau bas",
    description: "Pique suivie d'un retournement et retour au niveau bas (gedan)",
    niveau: "4e_kyu",
    ordre: 4,
    categorie: "Jo Suburi - Tsuki",
    points_cles: ["Enchaînement fluide", "Niveau bas bien marqué", "Garde stable en fin"],
    erreurs_communes: ["Retour trop haut", "Perte d'équilibre"]
  },
  { 
    id: "jo_suburi_5", 
    nom: "Tsuki Jodan Gaeshi",
    nom_japonais: "突き上段返し",
    traduction: "Pique avec retour niveau haut",
    description: "Pique suivie d'un retournement et retour au niveau haut (jodan)",
    niveau: "4e_kyu",
    ordre: 5,
    categorie: "Jo Suburi - Tsuki",
    points_cles: ["Élévation contrôlée", "Protection de la tête", "Transition fluide"],
    erreurs_communes: ["Bâton trop en arrière", "Ouverture excessive"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO SUBURI - UCHI (Frappes) — 5 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_suburi_6", 
    nom: "Shomen Uchi Komi",
    nom_japonais: "正面打ち込み",
    traduction: "Frappe verticale descendante",
    description: "Frappe verticale de base sur le sommet du crâne",
    niveau: "5e_kyu",
    ordre: 6,
    categorie: "Jo Suburi - Uchi",
    points_cles: ["Trajectoire verticale pure", "Puissance des hanches", "Arrêt net en fin"],
    erreurs_communes: ["Frappe diagonale", "Manque de Kime (décision)"]
  },
  { 
    id: "jo_suburi_7", 
    nom: "Renzoku Uchi Komi",
    nom_japonais: "連続打ち込み",
    traduction: "Frappes continues",
    description: "Série de frappes enchaînées sans interruption",
    niveau: "5e_kyu",
    ordre: 7,
    categorie: "Jo Suburi - Uchi",
    points_cles: ["Rythme constant", "Respiration coordonnée", "Pas de temps mort"],
    erreurs_communes: ["Fatigue = perte de forme", "Frappes de plus en plus faibles"]
  },
  { 
    id: "jo_suburi_8", 
    nom: "Menuchi Gedan Gaeshi",
    nom_japonais: "面打ち下段返し",
    traduction: "Frappe tête avec retour bas",
    description: "Frappe à la tête suivie d'un retour position basse",
    niveau: "4e_kyu",
    ordre: 8,
    categorie: "Jo Suburi - Uchi",
    points_cles: ["Frappe complète avant retour", "Transition fluide", "Garde basse stable"],
    erreurs_communes: ["Retour précipité", "Frappe incomplète"]
  },
  { 
    id: "jo_suburi_9", 
    nom: "Menuchi Ushiro Tsuki",
    nom_japonais: "面打ち後ろ突き",
    traduction: "Frappe tête puis pique arrière",
    description: "Combinaison frappe verticale et pique vers l'arrière",
    niveau: "4e_kyu",
    ordre: 9,
    categorie: "Jo Suburi - Uchi",
    points_cles: ["Deux techniques distinctes", "Rotation des hanches", "Conscience 360°"],
    erreurs_communes: ["Confusion des mouvements", "Pique arrière faible"]
  },
  { 
    id: "jo_suburi_10", 
    nom: "Gyaku Yokomen",
    nom_japonais: "逆横面",
    traduction: "Frappe latérale inversée",
    description: "Frappe latérale du côté opposé au côté habituel",
    niveau: "3e_kyu",
    ordre: 10,
    categorie: "Jo Suburi - Uchi",
    points_cles: ["Angle correct", "Rotation complète", "Puissance égale des deux côtés"],
    erreurs_communes: ["Angle insuffisant", "Déséquilibre"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO SUBURI - KATATE (Une main) — 3 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_suburi_11", 
    nom: "Katate Gedan Gaeshi",
    nom_japonais: "片手下段返し",
    traduction: "Une main - retour bas",
    description: "Mouvement d'une seule main avec retour au niveau bas",
    niveau: "3e_kyu",
    ordre: 11,
    categorie: "Jo Suburi - Katate",
    points_cles: ["Contrôle à une main", "Poignet souple", "Centre stable"],
    erreurs_communes: ["Grip trop serré", "Perte de contrôle"]
  },
  { 
    id: "jo_suburi_12", 
    nom: "Katate Toma Uchi",
    nom_japonais: "片手遠間打ち",
    traduction: "Une main - frappe longue distance",
    description: "Frappe à une main exploitant la portée maximale",
    niveau: "3e_kyu",
    ordre: 12,
    categorie: "Jo Suburi - Katate",
    points_cles: ["Extension maximale", "Timing précis", "Récupération rapide"],
    erreurs_communes: ["Déséquilibre vers l'avant", "Récupération lente"]
  },
  { 
    id: "jo_suburi_13", 
    nom: "Katate Hachi No Ji",
    nom_japonais: "片手八の字",
    traduction: "Une main - mouvement en 8",
    description: "Mouvement en forme de 8 exécuté d'une seule main",
    niveau: "2e_kyu",
    ordre: 13,
    categorie: "Jo Suburi - Katate",
    points_cles: ["Fluidité du 8", "Poignet détendu", "Rythme constant"],
    erreurs_communes: ["8 déformé", "Crispation du poignet"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO SUBURI - HASSO — 5 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_suburi_14", 
    nom: "Hasso Gaeshi Uchi",
    nom_japonais: "八相返し打ち",
    traduction: "Garde hasso puis frappe",
    description: "Depuis la garde Hasso, exécution d'une frappe",
    niveau: "2e_kyu",
    ordre: 14,
    categorie: "Jo Suburi - Hasso",
    points_cles: ["Garde Hasso correcte", "Départ explosif", "Frappe puissante"],
    erreurs_communes: ["Garde Hasso incorrecte", "Télegraphier le mouvement"]
  },
  { 
    id: "jo_suburi_15", 
    nom: "Hasso Gaeshi Tsuki",
    nom_japonais: "八相返し突き",
    traduction: "Garde hasso puis pique",
    description: "Depuis la garde Hasso, exécution d'une pique",
    niveau: "2e_kyu",
    ordre: 15,
    categorie: "Jo Suburi - Hasso",
    points_cles: ["Transition fluide", "Pique directe", "Retour en garde"],
    erreurs_communes: ["Pique arquée", "Lenteur de transition"]
  },
  { 
    id: "jo_suburi_16", 
    nom: "Hasso Gaeshi Ushiro Tsuki",
    nom_japonais: "八相返し後ろ突き",
    traduction: "Garde hasso puis pique arrière",
    description: "Depuis Hasso, rotation et pique vers l'arrière",
    niveau: "1er_kyu",
    ordre: 16,
    categorie: "Jo Suburi - Hasso",
    points_cles: ["Rotation complète", "Pique précise", "Équilibre maintenu"],
    erreurs_communes: ["Rotation incomplète", "Perte de cible"]
  },
  { 
    id: "jo_suburi_17", 
    nom: "Hasso Gaeshi Ushiro Uchi",
    nom_japonais: "八相返し後ろ打ち",
    traduction: "Garde hasso puis frappe arrière",
    description: "Depuis Hasso, rotation et frappe vers l'arrière",
    niveau: "1er_kyu",
    ordre: 17,
    categorie: "Jo Suburi - Hasso",
    points_cles: ["Frappe puissante", "Conscience de l'arrière", "Retour rapide"],
    erreurs_communes: ["Frappe faible", "Déséquilibre"]
  },
  { 
    id: "jo_suburi_18", 
    nom: "Hasso Gaeshi Ushiro Barai",
    nom_japonais: "八相返し後ろ払い",
    traduction: "Garde hasso puis balayage arrière",
    description: "Depuis Hasso, balayage circulaire vers l'arrière",
    niveau: "1er_kyu",
    ordre: 18,
    categorie: "Jo Suburi - Hasso",
    points_cles: ["Arc de cercle complet", "Niveau constant", "Puissance du balayage"],
    erreurs_communes: ["Balayage trop haut", "Manque de puissance"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO SUBURI - NAGARE (Flux) — 2 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_suburi_19", 
    nom: "Hidari Nagare Gaeshi",
    nom_japonais: "左流れ返し",
    traduction: "Flux gauche avec retournement",
    description: "Mouvement fluide vers la gauche avec changement de direction",
    niveau: "1er_kyu",
    ordre: 19,
    categorie: "Jo Suburi - Nagare",
    points_cles: ["Fluidité continue", "Pas de rupture", "Retournement naturel"],
    erreurs_communes: ["Mouvement saccadé", "Perte de fluidité"]
  },
  { 
    id: "jo_suburi_20", 
    nom: "Migi Nagare Gaeshi",
    nom_japonais: "右流れ返し",
    traduction: "Flux droit avec retournement",
    description: "Mouvement fluide vers la droite avec changement de direction",
    niveau: "1er_kyu",
    ordre: 20,
    categorie: "Jo Suburi - Nagare",
    points_cles: ["Symétrie avec Hidari", "Même qualité des deux côtés"],
    erreurs_communes: ["Côté dominant plus fluide", "Asymétrie"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO KATA (Formes) — 3 kata
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "jo_kata_13", 
    nom: "13 Jo Kata",
    nom_japonais: "十三の杖型",
    traduction: "Forme des 13 mouvements",
    description: "Kata de base comprenant 13 mouvements enchaînés",
    niveau: "4e_kyu",
    categorie: "Jo Kata",
    points_cles: ["Mémorisation de la séquence", "Transitions fluides", "Zanshin en fin"],
    erreurs_communes: ["Oubli de mouvements", "Rythme irrégulier"]
  },
  { 
    id: "jo_kata_31", 
    nom: "31 Jo Kata",
    nom_japonais: "三十一の杖型",
    traduction: "Forme des 31 mouvements",
    description: "Kata intermédiaire de 31 mouvements, le plus pratiqué",
    niveau: "3e_kyu",
    categorie: "Jo Kata",
    points_cles: ["Endurance", "Mémorisation longue", "Qualité constante"],
    erreurs_communes: ["Fatigue en fin de kata", "Précipitation"]
  },
  { 
    id: "jo_kata_22", 
    nom: "22 Jo Kata",
    nom_japonais: "二十二の杖型",
    traduction: "Forme des 22 mouvements",
    description: "Kata de 22 mouvements avec techniques avancées",
    niveau: "2e_kyu",
    categorie: "Jo Kata",
    points_cles: ["Techniques plus complexes", "Timing précis"],
    erreurs_communes: ["Confusion avec le 31", "Techniques bâclées"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KUMI JO (Exercices à deux) — 10 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "kumijo_1", nom: "Kumi Jo Ichi", nom_japonais: "組杖一", traduction: "Premier exercice à deux", description: "Premier exercice de base à deux avec Jo", niveau: "3e_kyu", ordre: 1, categorie: "Kumi Jo", points_cles: ["Synchronisation", "Distance correcte", "Timing partagé"] },
  { id: "kumijo_2", nom: "Kumi Jo Ni", nom_japonais: "組杖二", traduction: "Deuxième exercice", description: "Deuxième exercice à deux", niveau: "3e_kyu", ordre: 2, categorie: "Kumi Jo" },
  { id: "kumijo_3", nom: "Kumi Jo San", nom_japonais: "組杖三", traduction: "Troisième exercice", description: "Troisième exercice avec variations", niveau: "2e_kyu", ordre: 3, categorie: "Kumi Jo" },
  { id: "kumijo_4", nom: "Kumi Jo Yon", nom_japonais: "組杖四", traduction: "Quatrième exercice", description: "Quatrième exercice", niveau: "2e_kyu", ordre: 4, categorie: "Kumi Jo" },
  { id: "kumijo_5", nom: "Kumi Jo Go", nom_japonais: "組杖五", traduction: "Cinquième exercice", description: "Cinquième exercice", niveau: "1er_kyu", ordre: 5, categorie: "Kumi Jo" },
  { id: "kumijo_6", nom: "Kumi Jo Roku", nom_japonais: "組杖六", traduction: "Sixième exercice", description: "Sixième exercice", niveau: "1er_kyu", ordre: 6, categorie: "Kumi Jo" },
  { id: "kumijo_7", nom: "Kumi Jo Nana", nom_japonais: "組杖七", traduction: "Septième exercice", description: "Septième exercice - niveau Dan", niveau: "shodan", ordre: 7, categorie: "Kumi Jo" },
  { id: "kumijo_8", nom: "Kumi Jo Hachi", nom_japonais: "組杖八", traduction: "Huitième exercice", description: "Huitième exercice", niveau: "shodan", ordre: 8, categorie: "Kumi Jo" },
  { id: "kumijo_9", nom: "Kumi Jo Kyu", nom_japonais: "組杖九", traduction: "Neuvième exercice", description: "Neuvième exercice - niveau avancé", niveau: "nidan", ordre: 9, categorie: "Kumi Jo" },
  { id: "kumijo_10", nom: "Kumi Jo Ju", nom_japonais: "組杖十", traduction: "Dixième exercice", description: "Dixième exercice", niveau: "nidan", ordre: 10, categorie: "Kumi Jo" },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO DORI (Défense contre bâton) — 10 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "jo_dori_shomen_ikkyo", nom: "Jo Dori Shomen Uchi Ikkyo", nom_japonais: "杖取り正面打ち一教", traduction: "Défense Ikkyo contre frappe verticale", description: "Défense contre frappe verticale au bâton avec Ikkyo", niveau: "2e_kyu", categorie: "Jo Dori", points_cles: ["Timing d'entrée", "Contrôle de l'arme", "Désarmement fluide"] },
  { id: "jo_dori_shomen_nikyo", nom: "Jo Dori Shomen Uchi Nikyo", nom_japonais: "杖取り正面打ち二教", traduction: "Défense Nikyo", description: "Application de Nikyo sur attaque au Jo", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_sankyo", nom: "Jo Dori Shomen Uchi Sankyo", nom_japonais: "杖取り正面打ち三教", traduction: "Défense Sankyo", description: "Application de Sankyo", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_yonkyo", nom: "Jo Dori Shomen Uchi Yonkyo", nom_japonais: "杖取り正面打ち四教", traduction: "Défense Yonkyo", description: "Application de Yonkyo", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_shomen_gokyo", nom: "Jo Dori Shomen Uchi Gokyo", nom_japonais: "杖取り正面打ち五教", traduction: "Défense Gokyo", description: "Application de Gokyo - technique de désarmement", niveau: "1er_kyu", categorie: "Jo Dori", points_cles: ["Contrôle poignet vers l'extérieur", "Désarmement sécurisé"] },
  { id: "jo_dori_tsuki_irimi", nom: "Jo Dori Tsuki Irimi Nage", nom_japonais: "杖取り突き入身投げ", traduction: "Défense Irimi Nage contre pique", description: "Irimi Nage sur attaque en pique", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_tsuki_kote", nom: "Jo Dori Tsuki Kote Gaeshi", nom_japonais: "杖取り突き小手返し", traduction: "Défense Kote Gaeshi contre pique", description: "Kote Gaeshi sur attaque en pique", niveau: "2e_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_tsuki_shiho", nom: "Jo Dori Tsuki Shiho Nage", nom_japonais: "杖取り突き四方投げ", traduction: "Défense Shiho Nage contre pique", description: "Shiho Nage sur pique", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_yokomen_shiho", nom: "Jo Dori Yokomen Shiho Nage", nom_japonais: "杖取り横面四方投げ", traduction: "Défense Shiho Nage contre frappe latérale", description: "Shiho Nage sur Yokomen", niveau: "1er_kyu", categorie: "Jo Dori" },
  { id: "jo_dori_yokomen_kokyu", nom: "Jo Dori Yokomen Kokyu Nage", nom_japonais: "杖取り横面呼吸投げ", traduction: "Défense Kokyu Nage contre frappe latérale", description: "Kokyu Nage sur Yokomen", niveau: "shodan", categorie: "Jo Dori" },

  // ═══════════════════════════════════════════════════════════════════════════
  // JO NAGE (Projections avec bâton) — 3 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "jo_nage_tsuki", nom: "Jo Nage Tsuki", nom_japonais: "杖投げ突き", traduction: "Projection avec pique", description: "Utilisation du Jo pour projeter avec une pique", niveau: "2e_kyu", categorie: "Jo Nage", points_cles: ["Jo comme extension du corps", "Projection par le centre"] },
  { id: "jo_nage_gaeshi", nom: "Jo Nage Gaeshi", nom_japonais: "杖投げ返し", traduction: "Projection avec retournement", description: "Projection en retournant le Jo", niveau: "1er_kyu", categorie: "Jo Nage" },
  { id: "jo_nage_uchi", nom: "Jo Nage Uchi", nom_japonais: "杖投げ打ち", traduction: "Projection avec frappe", description: "Projection utilisant une frappe du Jo", niveau: "1er_kyu", categorie: "Jo Nage" }
];

// 🗡️ BOKKEN (SABRE) — 24 techniques
export const TECHNIQUES_BOKKEN = [
  // ═══════════════════════════════════════════════════════════════════════════
  // KEN SUBURI — 7 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "ken_suburi_1", 
    nom: "Shomen Uchi Ikkyo",
    nom_japonais: "正面打ち一挙",
    traduction: "Frappe verticale - Premier mouvement",
    description: "Frappe verticale de base, fondement de toutes les coupes",
    niveau: "5e_kyu",
    ordre: 1,
    categorie: "Ken Suburi",
    points_cles: ["Coupe depuis le centre", "Arrêt au niveau des yeux", "Tenouchi (serrage) en fin"],
    erreurs_communes: ["Coupe avec les bras seuls", "Arrêt trop haut ou trop bas"]
  },
  { 
    id: "ken_suburi_2", 
    nom: "Shomen Uchi Nikyo (Zenpo)",
    nom_japonais: "正面打ち二挙（前方）",
    traduction: "Frappe verticale avec pas en avant",
    description: "Coupe verticale accompagnée d'un pas vers l'avant",
    niveau: "5e_kyu",
    ordre: 2,
    categorie: "Ken Suburi",
    points_cles: ["Coordination coupe-déplacement", "Pas et coupe simultanés"],
    erreurs_communes: ["Pas avant la coupe", "Coupe avant le pas"]
  },
  { 
    id: "ken_suburi_3", 
    nom: "Shomen Uchi Sankyo (Kotai)",
    nom_japonais: "正面打ち三挙（後退）",
    traduction: "Frappe verticale avec pas en arrière",
    description: "Coupe verticale avec recul défensif",
    niveau: "4e_kyu",
    ordre: 3,
    categorie: "Ken Suburi",
    points_cles: ["Maintenir la pression vers l'avant", "Recul contrôlé"],
    erreurs_communes: ["Fuite désordonnée", "Perte de connexion"]
  },
  { 
    id: "ken_suburi_4", 
    nom: "Shomen Uchi Yonkyo (Zenpo Kotai)",
    nom_japonais: "正面打ち四挙（前方後退）",
    traduction: "Frappe verticale avec pas avant-arrière",
    description: "Enchaînement avancée-retraite avec coupe",
    niveau: "4e_kyu",
    ordre: 4,
    categorie: "Ken Suburi",
    points_cles: ["Fluidité de l'enchaînement", "Même qualité de coupe"],
    erreurs_communes: ["Rupture de rythme", "Seconde coupe faible"]
  },
  { 
    id: "ken_suburi_5", 
    nom: "Yokomen Uchi Gokyo (Zenpo)",
    nom_japonais: "横面打ち五挙（前方）",
    traduction: "Frappe latérale avec pas en avant",
    description: "Coupe diagonale vers la tempe avec avancée",
    niveau: "3e_kyu",
    ordre: 5,
    categorie: "Ken Suburi",
    points_cles: ["Angle de 45 degrés", "Viser la tempe", "Pas décisif"],
    erreurs_communes: ["Angle incorrect", "Frappe horizontale"]
  },
  { 
    id: "ken_suburi_6", 
    nom: "Yokomen Uchi Rokkyo (Kotai)",
    nom_japonais: "横面打ち六挙（後退）",
    traduction: "Frappe latérale avec pas en arrière",
    description: "Coupe diagonale avec recul",
    niveau: "3e_kyu",
    ordre: 6,
    categorie: "Ken Suburi",
    points_cles: ["Maintenir l'angle", "Recul stable"],
    erreurs_communes: ["Perte de l'angle diagonal"]
  },
  { 
    id: "ken_suburi_7", 
    nom: "Yokomen Uchi Nanakyo (Zenpo Kotai)",
    nom_japonais: "横面打ち七挙（前方後退）",
    traduction: "Frappe latérale avec pas avant-arrière",
    description: "Enchaînement Yokomen avec déplacements",
    niveau: "2e_kyu",
    ordre: 7,
    categorie: "Ken Suburi",
    points_cles: ["Alternance fluide", "Qualité constante"],
    erreurs_communes: ["Fatigue = perte de forme"]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KUMI TACHI (Exercices à deux) — 5 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "kumitachi_1", nom: "Kumi Tachi Ichi", nom_japonais: "組太刀一", traduction: "Premier exercice au sabre", description: "Premier exercice à deux sabres - fondamental", niveau: "3e_kyu", ordre: 1, categorie: "Kumi Tachi", points_cles: ["Ma-ai (distance)", "Timing partagé", "Respect du partenaire"] },
  { id: "kumitachi_2", nom: "Kumi Tachi Ni", nom_japonais: "組太刀二", traduction: "Deuxième exercice", description: "Deuxième exercice à deux sabres", niveau: "3e_kyu", ordre: 2, categorie: "Kumi Tachi" },
  { id: "kumitachi_3", nom: "Kumi Tachi San", nom_japonais: "組太刀三", traduction: "Troisième exercice", description: "Troisième exercice avec esquives", niveau: "2e_kyu", ordre: 3, categorie: "Kumi Tachi" },
  { id: "kumitachi_4", nom: "Kumi Tachi Yon", nom_japonais: "組太刀四", traduction: "Quatrième exercice", description: "Quatrième exercice", niveau: "2e_kyu", ordre: 4, categorie: "Kumi Tachi" },
  { id: "kumitachi_5", nom: "Kumi Tachi Go", nom_japonais: "組太刀五", traduction: "Cinquième exercice", description: "Cinquième exercice - avancé", niveau: "1er_kyu", ordre: 5, categorie: "Kumi Tachi" },

  // ═══════════════════════════════════════════════════════════════════════════
  // TACHI DORI (Défense contre sabre) — 12 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "tachi_dori_shomen_ikkyo", nom: "Tachi Dori Shomen Uchi Ikkyo", nom_japonais: "太刀取り正面打ち一教", traduction: "Défense Ikkyo contre frappe verticale au sabre", description: "Ikkyo sur attaque Shomen au Bokken", niveau: "1er_kyu", categorie: "Tachi Dori", points_cles: ["Timing crucial", "Entrée décisive", "Contrôle de la lame"] },
  { id: "tachi_dori_shomen_nikyo", nom: "Tachi Dori Shomen Uchi Nikyo", nom_japonais: "太刀取り正面打ち二教", traduction: "Défense Nikyo", description: "Nikyo sur attaque au Bokken", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_sankyo", nom: "Tachi Dori Shomen Uchi Sankyo", nom_japonais: "太刀取り正面打ち三教", traduction: "Défense Sankyo", description: "Sankyo sur attaque au Bokken", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_yonkyo", nom: "Tachi Dori Shomen Uchi Yonkyo", nom_japonais: "太刀取り正面打ち四教", traduction: "Défense Yonkyo", description: "Yonkyo sur attaque au Bokken", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_gokyo", nom: "Tachi Dori Shomen Uchi Gokyo", nom_japonais: "太刀取り正面打ち五教", traduction: "Défense Gokyo", description: "Gokyo - désarmement spécifique", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_irimi", nom: "Tachi Dori Shomen Uchi Irimi Nage", nom_japonais: "太刀取り正面打ち入身投げ", traduction: "Défense Irimi Nage", description: "Irimi Nage sur attaque au Bokken", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_shiho", nom: "Tachi Dori Shomen Uchi Shiho Nage", nom_japonais: "太刀取り正面打ち四方投げ", traduction: "Défense Shiho Nage", description: "Shiho Nage sur attaque au Bokken", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_shomen_kote", nom: "Tachi Dori Shomen Uchi Kote Gaeshi", nom_japonais: "太刀取り正面打ち小手返し", traduction: "Défense Kote Gaeshi", description: "Kote Gaeshi sur attaque au Bokken", niveau: "1er_kyu", categorie: "Tachi Dori" },
  { id: "tachi_dori_yokomen_shiho", nom: "Tachi Dori Yokomen Shiho Nage", nom_japonais: "太刀取り横面四方投げ", traduction: "Défense Shiho Nage contre Yokomen", description: "Shiho Nage sur frappe latérale", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_yokomen_irimi", nom: "Tachi Dori Yokomen Irimi Nage", nom_japonais: "太刀取り横面入身投げ", traduction: "Défense Irimi Nage contre Yokomen", description: "Irimi Nage sur frappe latérale", niveau: "shodan", categorie: "Tachi Dori" },
  { id: "tachi_dori_tsuki_irimi", nom: "Tachi Dori Tsuki Irimi Nage", nom_japonais: "太刀取り突き入身投げ", traduction: "Défense Irimi Nage contre piqué", description: "Irimi Nage sur Tsuki au Bokken", niveau: "nidan", categorie: "Tachi Dori" },
  { id: "tachi_dori_tsuki_kote", nom: "Tachi Dori Tsuki Kote Gaeshi", nom_japonais: "太刀取り突き小手返し", traduction: "Défense Kote Gaeshi contre piqué", description: "Kote Gaeshi sur Tsuki au Bokken", niveau: "nidan", categorie: "Tachi Dori" }
];

// 🔪 TANTO (COUTEAU) — 21 techniques
export const TECHNIQUES_TANTO = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TANTO DORI - SHOMEN UCHI (Frappe verticale) — 9 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { 
    id: "tanto_shomen_ikkyo_o", 
    nom: "Tanto Dori Shomen Uchi Ikkyo Omote",
    nom_japonais: "短刀取り正面打ち一教表",
    traduction: "Défense Ikkyo côté ouvert contre frappe descendante",
    description: "Ikkyo Omote sur attaque descendante au couteau",
    niveau: "2e_kyu",
    categorie: "Tanto Dori - Shomen Uchi",
    points_cles: ["Contrôle du poignet armé", "Ne jamais croiser la lame", "Désarmement en fin de technique"],
    erreurs_communes: ["Saisir la lame", "Oublier le désarmement"]
  },
  { 
    id: "tanto_shomen_ikkyo_u", 
    nom: "Tanto Dori Shomen Uchi Ikkyo Ura",
    nom_japonais: "短刀取り正面打ち一教裏",
    traduction: "Défense Ikkyo côté fermé",
    description: "Ikkyo Ura sur attaque descendante au couteau",
    niveau: "2e_kyu",
    categorie: "Tanto Dori - Shomen Uchi",
    points_cles: ["Pivot fluide", "Maintien du contrôle de l'arme", "Immobilisation sécurisée"],
    erreurs_communes: ["Perdre le contact", "Laisser la lame libre"]
  },
  { id: "tanto_shomen_nikyo_o", nom: "Tanto Dori Shomen Uchi Nikyo Omote", nom_japonais: "短刀取り正面打ち二教表", traduction: "Défense Nikyo côté ouvert", description: "Nikyo Omote avec torsion du poignet armé", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi", points_cles: ["Torsion contrôlée", "Pression sur le nerf"] },
  { id: "tanto_shomen_nikyo_u", nom: "Tanto Dori Shomen Uchi Nikyo Ura", nom_japonais: "短刀取り正面打ち二教裏", traduction: "Défense Nikyo côté fermé", description: "Nikyo Ura", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_sankyo", nom: "Tanto Dori Shomen Uchi Sankyo", nom_japonais: "短刀取り正面打ち三教", traduction: "Défense Sankyo", description: "Sankyo avec contrôle spiralé", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { 
    id: "tanto_shomen_gokyo_o", 
    nom: "Tanto Dori Shomen Uchi Gokyo Omote",
    nom_japonais: "短刀取り正面打ち五教表",
    traduction: "Défense Gokyo côté ouvert",
    description: "Gokyo Omote - technique privilégiée contre arme blanche",
    niveau: "2e_kyu",
    categorie: "Tanto Dori - Shomen Uchi",
    points_cles: ["Poignet vers l'extérieur", "Contrôle total de la lame", "Technique de désarmement par excellence"],
    erreurs_communes: ["Torsion insuffisante", "Lâcher prise prématuré"]
  },
  { id: "tanto_shomen_gokyo_u", nom: "Tanto Dori Shomen Uchi Gokyo Ura", nom_japonais: "短刀取り正面打ち五教裏", traduction: "Défense Gokyo côté fermé", description: "Gokyo Ura", niveau: "2e_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_shiho_o", nom: "Tanto Dori Shomen Uchi Shiho Nage Omote", nom_japonais: "短刀取り正面打ち四方投げ表", traduction: "Défense Shiho Nage côté ouvert", description: "Shiho Nage Omote", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },
  { id: "tanto_shomen_shiho_u", nom: "Tanto Dori Shomen Uchi Shiho Nage Ura", nom_japonais: "短刀取り正面打ち四方投げ裏", traduction: "Défense Shiho Nage côté fermé", description: "Shiho Nage Ura", niveau: "1er_kyu", categorie: "Tanto Dori - Shomen Uchi" },

  // ═══════════════════════════════════════════════════════════════════════════
  // TANTO DORI - YOKOMEN UCHI (Frappe latérale) — 4 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "tanto_yokomen_gokyo_o", nom: "Tanto Dori Yokomen Gokyo Omote", nom_japonais: "短刀取り横面五教表", traduction: "Défense Gokyo contre frappe latérale", description: "Gokyo Omote sur Yokomen", niveau: "2e_kyu", categorie: "Tanto Dori - Yokomen Uchi", points_cles: ["Bloquer l'angle", "Rediriger la force"] },
  { id: "tanto_yokomen_gokyo_u", nom: "Tanto Dori Yokomen Gokyo Ura", nom_japonais: "短刀取り横面五教裏", traduction: "Défense Gokyo Ura", description: "Gokyo Ura sur Yokomen", niveau: "2e_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  { id: "tanto_yokomen_shiho", nom: "Tanto Dori Yokomen Shiho Nage", nom_japonais: "短刀取り横面四方投げ", traduction: "Défense Shiho Nage", description: "Shiho Nage sur frappe latérale", niveau: "1er_kyu", categorie: "Tanto Dori - Yokomen Uchi" },
  { id: "tanto_yokomen_kote", nom: "Tanto Dori Yokomen Kote Gaeshi", nom_japonais: "短刀取り横面小手返し", traduction: "Défense Kote Gaeshi", description: "Kote Gaeshi sur frappe latérale", niveau: "1er_kyu", categorie: "Tanto Dori - Yokomen Uchi" },

  // ═══════════════════════════════════════════════════════════════════════════
  // TANTO DORI - TSUKI (Piqué) — 8 techniques
  // ═══════════════════════════════════════════════════════════════════════════
  { id: "tanto_tsuki_ikkyo", nom: "Tanto Dori Tsuki Ikkyo", nom_japonais: "短刀取り突き一教", traduction: "Défense Ikkyo contre piqué", description: "Ikkyo sur attaque en piqué au couteau", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki", points_cles: ["Sortir de la ligne d'attaque", "Contrôle immédiat du poignet"] },
  { id: "tanto_tsuki_nikyo", nom: "Tanto Dori Tsuki Nikyo", nom_japonais: "短刀取り突き二教", traduction: "Défense Nikyo contre piqué", description: "Nikyo sur Tsuki", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_sankyo", nom: "Tanto Dori Tsuki Sankyo", nom_japonais: "短刀取り突き三教", traduction: "Défense Sankyo contre piqué", description: "Sankyo sur Tsuki", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_gokyo", nom: "Tanto Dori Tsuki Gokyo", nom_japonais: "短刀取り突き五教", traduction: "Défense Gokyo contre piqué", description: "Gokyo sur Tsuki", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_kote", nom: "Tanto Dori Tsuki Kote Gaeshi", nom_japonais: "短刀取り突き小手返し", traduction: "Défense Kote Gaeshi contre piqué", description: "Kote Gaeshi sur Tsuki", niveau: "2e_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_irimi", nom: "Tanto Dori Tsuki Irimi Nage", nom_japonais: "短刀取り突き入身投げ", traduction: "Défense Irimi Nage contre piqué", description: "Irimi Nage sur Tsuki", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_kaiten", nom: "Tanto Dori Tsuki Kaiten Nage", nom_japonais: "短刀取り突き回転投げ", traduction: "Défense Kaiten Nage contre piqué", description: "Kaiten Nage sur Tsuki", niveau: "1er_kyu", categorie: "Tanto Dori - Tsuki" },
  { id: "tanto_tsuki_hiji", nom: "Tanto Dori Tsuki Hiji Kime Osae", nom_japonais: "短刀取り突き肘極め押さえ", traduction: "Contrôle du coude contre piqué", description: "Immobilisation par contrôle du coude - niveau avancé", niveau: "shodan", categorie: "Tanto Dori - Tsuki", points_cles: ["Hyperextension contrôlée", "Désarmement sécurisé"] }
];

// ============================================================================
// 🏃 MOUVEMENTS FONDAMENTAUX
// ============================================================================

// 🌀 TAI SABAKI (Déplacements) — 10 mouvements
export const TAI_SABAKI = [
  {
    id: "irimi",
    nom: "Irimi",
    nom_japonais: "入り身",
    traduction: "Entrer dans le corps",
    description: "Mouvement d'entrée directe vers le partenaire. Fondamental en Aïkido, il représente l'intention de ne pas fuir mais d'aller à la rencontre de l'attaque.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: ["Pas en avant décisif", "Garder le centre bas", "Regard vers le partenaire", "Bras en protection"],
    erreurs_communes: ["Hésitation dans l'entrée", "Perte d'équilibre vers l'avant", "Oublier la protection des bras"]
  },
  {
    id: "tenkan",
    nom: "Tenkan",
    nom_japonais: "転換",
    traduction: "Pivot, changement de direction",
    description: "Mouvement de pivot sur le pied avant avec rotation de 180°. Permet de se placer dans le dos du partenaire tout en maintenant le contact.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: ["Pivot sur la plante du pied avant", "Rotation de 180 degrés", "Maintenir le contact avec le partenaire", "Terminer en garde stable"],
    erreurs_communes: ["Pivot sur le talon", "Perdre le contact", "Rotation incomplète"]
  },
  {
    id: "irimi_tenkan",
    nom: "Irimi Tenkan",
    nom_japonais: "入り身転換",
    traduction: "Entrée et pivot",
    description: "Combinaison d'un pas d'entrée (irimi) suivi d'un pivot (tenkan). Mouvement fluide qui permet de contourner l'attaque.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: ["Enchaînement fluide irimi puis tenkan", "Pas de temps d'arrêt entre les deux", "Maintenir la connexion", "Finir face à la direction initiale"],
    erreurs_communes: ["Saccade entre les deux mouvements", "Perdre la ligne centrale", "Finir mal positionné"]
  },
  {
    id: "kaiten",
    nom: "Kaiten",
    nom_japonais: "回転",
    traduction: "Rotation",
    description: "Rotation complète du corps sur place. Utilisé pour changer de direction tout en gardant le centre stable.",
    niveau: "5e_kyu",
    categorie: "deplacement_avance",
    points_cles: ["Rotation fluide", "Centre stable", "Pieds qui glissent", "Maintenir l'équilibre"],
    erreurs_communes: ["Déséquilibre", "Rotation saccadée"]
  },
  {
    id: "tenshin",
    nom: "Tenshin",
    nom_japonais: "転身",
    traduction: "Changement de corps",
    description: "Mouvement diagonal d'esquive qui permet de sortir de la ligne d'attaque tout en restant connecté.",
    niveau: "5e_kyu",
    categorie: "deplacement_avance",
    points_cles: ["Déplacement diagonal", "Sortie de la ligne d'attaque", "Rester connecté au partenaire"],
    erreurs_communes: ["Fuite au lieu d'esquive", "Perte de connexion"]
  },
  {
    id: "sokumen",
    nom: "Sokumen Irimi",
    nom_japonais: "側面入り身",
    traduction: "Entrée latérale",
    description: "Entrée par le côté du partenaire à 90 degrés. Position stratégique pour de nombreuses techniques.",
    niveau: "4e_kyu",
    categorie: "deplacement_avance",
    points_cles: ["Angle de 90°", "Position latérale stable", "Contrôle de la distance"],
    erreurs_communes: ["Angle incorrect", "Trop près ou trop loin"]
  },
  {
    id: "tsugi_ashi",
    nom: "Tsugi Ashi",
    nom_japonais: "継ぎ足",
    traduction: "Pas glissé",
    description: "Déplacement où les pieds se suivent sans jamais se croiser. Le pied arrière rejoint le pied avant qui avance ensuite.",
    niveau: "4e_kyu",
    categorie: "deplacement_base",
    points_cles: ["Pieds glissent sur le sol", "Jamais de croisement", "Distance constante entre les pieds", "Centre bas"],
    erreurs_communes: ["Croiser les pieds", "Sautiller au lieu de glisser"]
  },
  {
    id: "ayumi_ashi",
    nom: "Ayumi Ashi",
    nom_japonais: "歩み足",
    traduction: "Pas de marche",
    description: "Déplacement naturel en marchant, pieds alternés comme dans la marche normale.",
    niveau: "6e_kyu",
    categorie: "deplacement_base",
    points_cles: ["Mouvement naturel", "Centre stable pendant la marche"],
    erreurs_communes: ["Trop de balancement"]
  },
  {
    id: "tai_no_henka",
    nom: "Tai No Henka",
    nom_japonais: "体の変化",
    traduction: "Changement du corps",
    description: "Exercice fondamental de connexion et pivot avec un partenaire. Base de nombreuses techniques.",
    niveau: "6e_kyu",
    categorie: "exercice_fondamental",
    points_cles: ["Connexion avec le partenaire", "Pivot synchronisé", "Maintenir le contact tout au long"],
    erreurs_communes: ["Perdre la connexion", "Forcer le mouvement"]
  },
  {
    id: "hiriki_no_yosei",
    nom: "Hiriki No Yosei",
    nom_japonais: "肘力の養成",
    traduction: "Développement de la force du coude",
    description: "Exercice de renforcement de la connexion par le coude. Développe la puissance sans utiliser la force musculaire.",
    niveau: "5e_kyu",
    categorie: "exercice_fondamental",
    points_cles: ["Extension du coude", "Puissance du centre", "Pas de force musculaire"],
    erreurs_communes: ["Utiliser les muscles du bras", "Coude plié"]
  }
];

// 🤸 UKEMI (Chutes) — 9 techniques
export const UKEMI = [
  {
    id: "mae_ukemi",
    nom: "Mae Ukemi",
    nom_japonais: "前受身",
    traduction: "Chute avant",
    description: "Chute roulée vers l'avant. Technique de base pour recevoir les projections en toute sécurité.",
    niveau: "6e_kyu",
    categorie: "ukemi_base",
    points_cles: ["Bras en cercle devant soi", "Menton rentré contre la poitrine", "Rouler sur l'épaule, jamais sur la colonne", "Expirer pendant la chute"],
    erreurs_communes: ["Rouler sur la colonne vertébrale", "Tête qui touche le sol", "Bras trop tendus"]
  },
  {
    id: "ushiro_ukemi",
    nom: "Ushiro Ukemi",
    nom_japonais: "後受身",
    traduction: "Chute arrière",
    description: "Chute roulée vers l'arrière. Essentielle pour les techniques où l'on est projeté vers l'arrière.",
    niveau: "6e_kyu",
    categorie: "ukemi_base",
    points_cles: ["S'asseoir d'abord, ne pas tomber", "Menton bien rentré", "Frapper le sol avec le bras pour absorber", "Rouler en diagonale"],
    erreurs_communes: ["Tête qui touche le sol", "Rebondir au lieu de rouler", "Tomber à plat"]
  },
  {
    id: "yoko_ukemi",
    nom: "Yoko Ukemi",
    nom_japonais: "横受身",
    traduction: "Chute latérale",
    description: "Chute sur le côté avec frappe au sol pour absorber l'impact.",
    niveau: "5e_kyu",
    categorie: "ukemi_base",
    points_cles: ["Frapper avec tout le bras (pas juste la main)", "Corps en arc", "Jambe du dessus relevée"],
    erreurs_communes: ["Frapper avec le coude", "Corps rigide"]
  },
  {
    id: "mae_kaiten_ukemi",
    nom: "Mae Kaiten Ukemi",
    nom_japonais: "前回転受身",
    traduction: "Chute roulée avant",
    description: "Roulade avant complète et fluide, version dynamique du Mae Ukemi.",
    niveau: "5e_kyu",
    categorie: "ukemi_avance",
    points_cles: ["Trajectoire diagonale", "Roulade continue", "Se relever immédiatement"],
    erreurs_communes: ["Roulade droite (sur la colonne)", "Rester au sol"]
  },
  {
    id: "ushiro_kaiten_ukemi",
    nom: "Ushiro Kaiten Ukemi",
    nom_japonais: "後回転受身",
    traduction: "Chute roulée arrière",
    description: "Roulade arrière complète avec sortie dynamique.",
    niveau: "5e_kyu",
    categorie: "ukemi_avance",
    points_cles: ["Menton rentré tout au long", "Pousser avec les mains pour sortir"],
    erreurs_communes: ["Tête qui touche", "Sortie déséquilibrée"]
  },
  {
    id: "tobi_ukemi",
    nom: "Tobi Ukemi",
    nom_japonais: "飛び受身",
    traduction: "Chute plongeante",
    description: "Chute avec envol et roulade. Nécessaire pour les projections puissantes.",
    niveau: "3e_kyu",
    categorie: "ukemi_avance",
    points_cles: ["Impulsion des jambes", "Bras devant pour amortir", "Engagement total", "Confiance"],
    erreurs_communes: ["Atterrir à plat", "Hésitation (très dangereux)", "Mains en premier"]
  },
  {
    id: "zenpo_kaiten_ukemi",
    nom: "Zenpo Kaiten Ukemi",
    nom_japonais: "前方回転受身",
    traduction: "Roulade avant haute",
    description: "Roulade avant avec plus d'amplitude et de hauteur.",
    niveau: "4e_kyu",
    categorie: "ukemi_avance",
    points_cles: ["Plus de hauteur", "Réception souple"],
    erreurs_communes: ["Trop de hauteur sans contrôle"]
  },
  {
    id: "koho_kaiten_ukemi",
    nom: "Koho Kaiten Ukemi",
    nom_japonais: "後方回転受身",
    traduction: "Roulade arrière haute",
    description: "Roulade arrière avec amplitude.",
    niveau: "4e_kyu",
    categorie: "ukemi_avance",
    points_cles: ["Contrôle de l'amplitude"],
    erreurs_communes: ["Perte de contrôle"]
  },
  {
    id: "shikko",
    nom: "Shikko",
    nom_japonais: "膝行",
    traduction: "Marche à genoux",
    description: "Déplacement à genoux utilisé en Suwariwaza. Développe la mobilité du centre.",
    niveau: "5e_kyu",
    categorie: "deplacement_genoux",
    points_cles: ["Genoux qui glissent", "Hanches basses", "Dos droit", "Utiliser les hanches pour avancer"],
    erreurs_communes: ["Se relever", "Dos courbé", "Avancer avec les genoux uniquement"]
  }
];

// 🧘 KAMAE (Postures) — 8 positions
export const KAMAE = [
  {
    id: "ai_hanmi",
    nom: "Ai Hanmi",
    nom_japonais: "相半身",
    traduction: "Garde identique",
    description: "Les deux partenaires sont en garde du même côté (ex: tous deux pied droit devant).",
    niveau: "6e_kyu",
    categorie: "kamae_base",
    points_cles: ["Même pied avant que le partenaire", "Distance appropriée (Ma-ai)", "Regard vers le centre du partenaire"],
    erreurs_communes: ["Mauvaise identification de la garde", "Distance incorrecte"]
  },
  {
    id: "gyaku_hanmi",
    nom: "Gyaku Hanmi",
    nom_japonais: "逆半身",
    traduction: "Garde inversée",
    description: "Les partenaires sont en garde opposée (ex: l'un pied droit, l'autre pied gauche devant).",
    niveau: "6e_kyu",
    categorie: "kamae_base",
    points_cles: ["Pieds avant opposés", "Maintenir la ligne centrale", "Conscience de l'angle différent"],
    erreurs_communes: ["Confusion avec Ai Hanmi"]
  },
  {
    id: "migi_hanmi",
    nom: "Migi Hanmi",
    nom_japonais: "右半身",
    traduction: "Garde droite",
    description: "Position avec le pied droit en avant.",
    niveau: "6e_kyu",
    categorie: "kamae_base",
    points_cles: ["Pied droit devant", "Poids réparti 60/40", "Hanches de trois-quarts"],
    erreurs_communes: ["Poids trop sur l'avant", "Hanches de face"]
  },
  {
    id: "hidari_hanmi",
    nom: "Hidari Hanmi",
    nom_japonais: "左半身",
    traduction: "Garde gauche",
    description: "Position avec le pied gauche en avant.",
    niveau: "6e_kyu",
    categorie: "kamae_base",
    points_cles: ["Pied gauche devant", "Symétrie avec Migi Hanmi"],
    erreurs_communes: ["Moins à l'aise qu'en Migi (normal au début)"]
  },
  {
    id: "chudan_no_kamae",
    nom: "Chudan No Kamae",
    nom_japonais: "中段の構え",
    traduction: "Garde moyenne",
    description: "Position de base avec les mains/arme au niveau du centre (plexus solaire).",
    niveau: "6e_kyu",
    categorie: "kamae_arme",
    points_cles: ["Arme pointée vers le centre adverse", "Coudes légèrement fléchis", "Position défensive ET offensive"],
    erreurs_communes: ["Arme trop haute ou trop basse"]
  },
  {
    id: "jodan_no_kamae",
    nom: "Jodan No Kamae",
    nom_japonais: "上段の構え",
    traduction: "Garde haute",
    description: "Arme levée au-dessus de la tête, prête à frapper.",
    niveau: "5e_kyu",
    categorie: "kamae_arme",
    points_cles: ["Arme au-dessus de la tête", "Prêt à couper", "Ouverture volontaire du centre"],
    erreurs_communes: ["Arme trop en arrière", "Épaules crispées"]
  },
  {
    id: "gedan_no_kamae",
    nom: "Gedan No Kamae",
    nom_japonais: "下段の構え",
    traduction: "Garde basse",
    description: "Arme pointée vers le bas, position défensive ou d'attente.",
    niveau: "5e_kyu",
    categorie: "kamae_arme",
    points_cles: ["Pointe vers le sol ou les genoux adverses", "Position d'attente", "Prêt à remonter"],
    erreurs_communes: ["Arme pendante sans intention"]
  },
  {
    id: "hasso_no_kamae",
    nom: "Hasso No Kamae",
    nom_japonais: "八相の構え",
    traduction: "Garde à huit directions",
    description: "Arme tenue verticalement près de l'épaule, permettant de frapper dans huit directions.",
    niveau: "4e_kyu",
    categorie: "kamae_arme",
    points_cles: ["Arme verticale près de l'épaule", "Peut frapper dans toutes directions", "Position de transition"],
    erreurs_communes: ["Arme trop éloignée du corps", "Coude trop levé"]
  }
];

// 👊 ATEMI (Frappes) — 9 techniques
export const ATEMI = [
  {
    id: "shomen_uchi",
    nom: "Shomen Uchi",
    nom_japonais: "正面打ち",
    traduction: "Frappe verticale",
    description: "Frappe descendante sur le sommet du crâne. Attaque de base en Aïkido.",
    niveau: "6e_kyu",
    categorie: "atemi_main",
    points_cles: ["Main en sabre (Tegatana)", "Trajectoire verticale pure", "Frappe avec le tranchant de la main"],
    erreurs_communes: ["Frappe diagonale", "Utiliser le poing"]
  },
  {
    id: "yokomen_uchi",
    nom: "Yokomen Uchi",
    nom_japonais: "横面打ち",
    traduction: "Frappe latérale",
    description: "Frappe diagonale vers la tempe. Simule une coupe de sabre latérale.",
    niveau: "6e_kyu",
    categorie: "atemi_main",
    points_cles: ["Trajectoire diagonale à 45°", "Viser la tempe", "Rotation des hanches"],
    erreurs_communes: ["Angle trop horizontal", "Manque de puissance des hanches"]
  },
  {
    id: "chudan_tsuki",
    nom: "Chudan Tsuki",
    nom_japonais: "中段突き",
    traduction: "Coup de poing au ventre",
    description: "Frappe de poing direct au niveau du plexus solaire.",
    niveau: "5e_kyu",
    categorie: "atemi_poing",
    points_cles: ["Poing serré", "Trajectoire directe", "Puissance des hanches"],
    erreurs_communes: ["Poing mou", "Frappe avec le bras seul"]
  },
  {
    id: "jodan_tsuki",
    nom: "Jodan Tsuki",
    nom_japonais: "上段突き",
    traduction: "Coup de poing au visage",
    description: "Frappe de poing direct au niveau du visage.",
    niveau: "5e_kyu",
    categorie: "atemi_poing",
    points_cles: ["Viser le menton ou le nez", "Garde haute après la frappe"],
    erreurs_communes: ["Trop télégraphié"]
  },
  {
    id: "gedan_tsuki",
    nom: "Gedan Tsuki",
    nom_japonais: "下段突き",
    traduction: "Coup de poing bas",
    description: "Frappe au niveau du bas-ventre ou des parties génitales.",
    niveau: "4e_kyu",
    categorie: "atemi_poing",
    points_cles: ["Frappe discrète", "Cible basse"],
    erreurs_communes: ["Trop visible"]
  },
  {
    id: "mune_tsuki",
    nom: "Mune Tsuki",
    nom_japonais: "胸突き",
    traduction: "Coup au thorax",
    description: "Frappe directe à la poitrine.",
    niveau: "4e_kyu",
    categorie: "atemi_poing",
    points_cles: ["Cible le sternum", "Peut couper le souffle"],
    erreurs_communes: ["Trop haut ou trop bas"]
  },
  {
    id: "ushiro_empi",
    nom: "Ushiro Empi",
    nom_japonais: "後肘",
    traduction: "Coup de coude arrière",
    description: "Frappe de coude vers l'arrière contre un attaquant dans le dos.",
    niveau: "3e_kyu",
    categorie: "atemi_coude",
    points_cles: ["Rotation des hanches", "Coude serré contre le corps", "Impact avec la pointe du coude"],
    erreurs_communes: ["Bras trop écarté", "Manque de puissance"]
  },
  {
    id: "mae_geri",
    nom: "Mae Geri",
    nom_japonais: "前蹴り",
    traduction: "Coup de pied avant",
    description: "Frappe de pied direct vers l'avant.",
    niveau: "3e_kyu",
    categorie: "atemi_pied",
    points_cles: ["Genou haut d'abord", "Extension rapide", "Récupération rapide"],
    erreurs_communes: ["Pied qui traîne", "Déséquilibre"]
  },
  {
    id: "yoko_geri",
    nom: "Yoko Geri",
    nom_japonais: "横蹴り",
    traduction: "Coup de pied latéral",
    description: "Frappe de pied sur le côté.",
    niveau: "2e_kyu",
    categorie: "atemi_pied",
    points_cles: ["Frappe avec le tranchant du pied", "Hanches de profil"],
    erreurs_communes: ["Frappe avec les orteils", "Hanches de face"]
  }
];

// 🌬️ KOKYU WAZA (Techniques de respiration) — 6 techniques
export const KOKYU_WAZA = [
  {
    id: "kokyu_dosa",
    nom: "Kokyu Dosa",
    nom_japonais: "呼吸動作",
    traduction: "Exercice de respiration",
    description: "Exercice à genoux de développement du Kokyu (souffle/énergie). Pratiqué généralement en fin de cours.",
    niveau: "6e_kyu",
    categorie: "kokyu_base",
    points_cles: ["Extension du Ki", "Coordination avec la respiration", "Utiliser le centre, pas les bras", "Relaxation dans la puissance"],
    erreurs_communes: ["Utiliser la force musculaire", "Bloquer la respiration", "Pousser avec les épaules"]
  },
  {
    id: "kokyu_ho",
    nom: "Kokyu Ho",
    nom_japonais: "呼吸法",
    traduction: "Méthode de respiration",
    description: "Technique de projection utilisant principalement le souffle et l'intention.",
    niveau: "5e_kyu",
    categorie: "kokyu_base",
    points_cles: ["Respiration profonde", "Projection par l'intention", "Minimum d'effort physique"],
    erreurs_communes: ["Forcer la technique"]
  },
  {
    id: "kokyu_nage",
    nom: "Kokyu Nage",
    nom_japonais: "呼吸投げ",
    traduction: "Projection par le souffle",
    description: "Famille de projections utilisant principalement le timing et le Kokyu plutôt que des clés articulaires.",
    niveau: "4e_kyu",
    categorie: "kokyu_projection",
    points_cles: ["Timing parfait", "Utiliser l'élan de Uke", "Minimum de contact"],
    erreurs_communes: ["Trop de contact", "Forcer la projection"]
  },
  {
    id: "tenchi_nage",
    nom: "Tenchi Nage",
    nom_japonais: "天地投げ",
    traduction: "Projection ciel-terre",
    description: "Projection avec une main vers le haut (ciel) et l'autre vers le bas (terre). Exprime l'union des contraires.",
    niveau: "4e_kyu",
    categorie: "kokyu_projection",
    points_cles: ["Une main monte vers le ciel", "Une main descend vers la terre", "Corps unifié malgré les directions opposées", "Avancer dans le centre de Uke"],
    erreurs_communes: ["Mains désynchronisées", "Reculer au lieu d'avancer"]
  },
  {
    id: "sumi_otoshi",
    nom: "Sumi Otoshi",
    nom_japonais: "隅落とし",
    traduction: "Chute dans l'angle",
    description: "Projection dans l'angle mort du partenaire, là où il n'a pas d'appui.",
    niveau: "3e_kyu",
    categorie: "kokyu_projection",
    points_cles: ["Trouver le coin faible", "Projection vers l'angle mort", "Timing précis"],
    erreurs_communes: ["Mauvais angle", "Forcer au lieu de guider"]
  },
  {
    id: "aiki_otoshi",
    nom: "Aiki Otoshi",
    nom_japonais: "合気落とし",
    traduction: "Chute Aiki",
    description: "Projection utilisant le principe de l'Aiki - harmonisation avec l'énergie du partenaire.",
    niveau: "3e_kyu",
    categorie: "kokyu_projection",
    points_cles: ["Harmonisation totale", "Pas de résistance", "Guider l'énergie"],
    erreurs_communes: ["Résister puis projeter", "Manque de connexion"]
  }
];

// 🔐 KANSETSU WAZA (Clés articulaires) — 10 techniques
export const KANSETSU_WAZA = [
  {
    id: "ikkyo",
    nom: "Ikkyo",
    nom_japonais: "一教",
    traduction: "Premier principe / Premier enseignement",
    description: "Contrôle du bras en extension avec pression sur le coude. Technique fondamentale de l'Aïkido, base de nombreuses variations.",
    niveau: "6e_kyu",
    categorie: "osae_waza",
    points_cles: ["Contrôle du coude", "Extension complète du bras de Uke", "Maintien au sol avec le genou", "Pression perpendiculaire au coude"],
    erreurs_communes: ["Tirer au lieu de pousser", "Perdre le contrôle du coude", "Immobilisation instable"]
  },
  {
    id: "nikyo",
    nom: "Nikyo",
    nom_japonais: "二教",
    traduction: "Deuxième principe",
    description: "Contrôle par torsion du poignet vers l'intérieur avec pression sur un point nerveux.",
    niveau: "5e_kyu",
    categorie: "osae_waza",
    points_cles: ["Torsion du poignet vers l'intérieur", "Pression sur le nerf radial", "Coude de Uke contre son corps", "Douleur = compliance"],
    erreurs_communes: ["Torsion excessive (risque de blessure)", "Perdre le contrôle du coude"]
  },
  {
    id: "sankyo",
    nom: "Sankyo",
    nom_japonais: "三教",
    traduction: "Troisième principe",
    description: "Contrôle par torsion du poignet vers l'extérieur dans un mouvement spiralé.",
    niveau: "4e_kyu",
    categorie: "osae_waza",
    points_cles: ["Torsion spirale vers l'extérieur", "Contrôle du coude en même temps", "Mouvement continu"],
    erreurs_communes: ["Torsion plate au lieu de spirale", "Perdre le coude"]
  },
  {
    id: "yonkyo",
    nom: "Yonkyo",
    nom_japonais: "四教",
    traduction: "Quatrième principe",
    description: "Contrôle par pression sur un point nerveux de l'avant-bras (nerf radial).",
    niveau: "3e_kyu",
    categorie: "osae_waza",
    points_cles: ["Trouver le point de pression exact", "Extension du bras de Uke", "Pression avec la base de l'index"],
    erreurs_communes: ["Mauvais point de pression", "Utiliser la force au lieu de la précision"]
  },
  {
    id: "gokyo",
    nom: "Gokyo",
    nom_japonais: "五教",
    traduction: "Cinquième principe",
    description: "Technique spécifique pour le désarmement d'une arme blanche. Poignet tourné vers l'extérieur.",
    niveau: "2e_kyu",
    categorie: "osae_waza",
    points_cles: ["Poignet vers l'extérieur (opposé de Nikyo)", "Immobilisation permettant le désarmement", "Contrôle total de l'arme"],
    erreurs_communes: ["Confusion avec Nikyo", "Oublier le désarmement"]
  },
  {
    id: "kote_gaeshi",
    nom: "Kote Gaeshi",
    nom_japonais: "小手返し",
    traduction: "Retournement du poignet",
    description: "Projection par retournement du poignet vers l'extérieur. Une des projections les plus emblématiques.",
    niveau: "4e_kyu",
    categorie: "nage_waza",
    points_cles: ["Saisie correcte du poignet", "Rotation vers l'extérieur", "Projection vers le bas et non sur le côté"],
    erreurs_communes: ["Tordre au lieu de retourner", "Projection horizontale"]
  },
  {
    id: "shiho_nage",
    nom: "Shiho Nage",
    nom_japonais: "四方投げ",
    traduction: "Projection dans les quatre directions",
    description: "Projection en guidant le bras de Uke dans un grand arc au-dessus de sa tête.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    points_cles: ["Grand arc du bras", "Passer sous le bras de Uke", "Couper vers le bas à la fin", "Garder le contact tout au long"],
    erreurs_communes: ["Arc trop petit", "Perdre le contact", "Ne pas couper vers le bas"]
  },
  {
    id: "irimi_nage",
    nom: "Irimi Nage",
    nom_japonais: "入身投げ",
    traduction: "Projection par entrée",
    description: "Projection par entrée profonde et contrôle de la nuque. Souvent appelée 'la technique des 20 ans' pour sa profondeur.",
    niveau: "5e_kyu",
    categorie: "nage_waza",
    points_cles: ["Entrée profonde (Irimi)", "Contrôle de la nuque", "Déséquilibrer vers l'arrière", "Projection en arc"],
    erreurs_communes: ["Entrée insuffisante", "Forcer sur la nuque", "Projection vers le bas au lieu d'en arc"]
  },
  {
    id: "kaiten_nage",
    nom: "Kaiten Nage",
    nom_japonais: "回転投げ",
    traduction: "Projection rotative",
    description: "Projection en faisant tourner le partenaire autour de son propre axe.",
    niveau: "4e_kyu",
    categorie: "nage_waza",
    points_cles: ["Rotation autour de l'axe de Uke", "Contrôle du bras et de la tête", "Mouvement continu"],
    erreurs_communes: ["Rotation insuffisante", "Perdre le contrôle"]
  },
  {
    id: "koshi_nage",
    nom: "Koshi Nage",
    nom_japonais: "腰投げ",
    traduction: "Projection de hanche",
    description: "Projection en chargeant le partenaire sur la hanche puis en basculant.",
    niveau: "3e_kyu",
    categorie: "nage_waza",
    points_cles: ["Entrer sous le centre de Uke", "Charger sur la hanche", "Basculer et non tirer", "Contrôler la chute"],
    erreurs_communes: ["Ne pas entrer assez bas", "Tirer au lieu de basculer"]
  }
];

// 🧎 SUWARIWAZA (Techniques à genoux) — 10 techniques
export const SUWARIWAZA = [
  { id: "suwari_ikkyo", nom: "Suwariwaza Ikkyo", nom_japonais: "座り技一教", traduction: "Ikkyo à genoux", description: "Premier principe exécuté entièrement à genoux. Développe la puissance du centre.", niveau: "4e_kyu", categorie: "suwariwaza_kihon", points_cles: ["Utiliser les hanches", "Shikko pour les déplacements", "Centre bas et stable"] },
  { id: "suwari_nikyo", nom: "Suwariwaza Nikyo", nom_japonais: "座り技二教", traduction: "Nikyo à genoux", description: "Deuxième principe à genoux", niveau: "3e_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_sankyo", nom: "Suwariwaza Sankyo", nom_japonais: "座り技三教", traduction: "Sankyo à genoux", description: "Troisième principe à genoux", niveau: "2e_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_yonkyo", nom: "Suwariwaza Yonkyo", nom_japonais: "座り技四教", traduction: "Yonkyo à genoux", description: "Quatrième principe à genoux", niveau: "1er_kyu", categorie: "suwariwaza_kihon" },
  { id: "suwari_gokyo", nom: "Suwariwaza Gokyo", nom_japonais: "座り技五教", traduction: "Gokyo à genoux", description: "Cinquième principe à genoux - niveau avancé", niveau: "shodan", categorie: "suwariwaza_kihon" },
  { id: "suwari_irimi", nom: "Suwariwaza Irimi Nage", nom_japonais: "座り技入身投げ", traduction: "Irimi Nage à genoux", description: "Projection par entrée exécutée à genoux", niveau: "3e_kyu", categorie: "suwariwaza_nage", points_cles: ["Entrée en Shikko", "Projection du centre"] },
  { id: "suwari_shiho", nom: "Suwariwaza Shiho Nage", nom_japonais: "座り技四方投げ", traduction: "Shiho Nage à genoux", description: "Projection 4 directions à genoux", niveau: "3e_kyu", categorie: "suwariwaza_nage" },
  { id: "suwari_kote", nom: "Suwariwaza Kote Gaeshi", nom_japonais: "座り技小手返し", traduction: "Kote Gaeshi à genoux", description: "Retournement du poignet à genoux", niveau: "2e_kyu", categorie: "suwariwaza_nage" },
  { id: "suwari_kokyu_ho", nom: "Suwariwaza Kokyu Ho", nom_japonais: "座り技呼吸法", traduction: "Kokyu Ho à genoux", description: "Exercice de respiration à genoux - souvent pratiqué en fin de cours", niveau: "6e_kyu", categorie: "suwariwaza_kokyu", points_cles: ["Extension du Ki", "Coordination respiration-mouvement", "Test de la qualité du centre"] },
  { id: "suwari_kokyu_dosa", nom: "Suwariwaza Kokyu Dosa", nom_japonais: "座り技呼吸動作", traduction: "Exercice de respiration dynamique", description: "Exercice fondamental de développement du Kokyu à genoux", niveau: "6e_kyu", categorie: "suwariwaza_kokyu", points_cles: ["Même principes que Kokyu Dosa debout", "Plus difficile car moins de mobilité"] }
];

// 🧎‍♂️ HANMI HANDACHI (Semi-debout) — 8 techniques
export const HANMI_HANDACHI = [
  { id: "hh_shiho_nage", nom: "Hanmi Handachi Shiho Nage", nom_japonais: "半身半立四方投げ", traduction: "Shiho Nage semi-debout", description: "Projection 4 directions avec Tori à genoux et Uke debout. Développe la gestion du désavantage de hauteur.", niveau: "3e_kyu", categorie: "hanmi_handachi", points_cles: ["Gestion de la hauteur", "Utilisation du centre bas", "Timing crucial", "Entrer sous le centre de Uke"], erreurs_communes: ["Se relever", "Ne pas utiliser l'avantage du centre bas"] },
  { id: "hh_irimi_nage", nom: "Hanmi Handachi Irimi Nage", nom_japonais: "半身半立入身投げ", traduction: "Irimi Nage semi-debout", description: "Projection par entrée - Tori à genoux", niveau: "3e_kyu", categorie: "hanmi_handachi", points_cles: ["Entrée en Shikko", "Contrôle de la nuque depuis le bas"] },
  { id: "hh_kote_gaeshi", nom: "Hanmi Handachi Kote Gaeshi", nom_japonais: "半身半立小手返し", traduction: "Kote Gaeshi semi-debout", description: "Retournement du poignet - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_kaiten_nage", nom: "Hanmi Handachi Kaiten Nage", nom_japonais: "半身半立回転投げ", traduction: "Kaiten Nage semi-debout", description: "Projection rotative - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_ikkyo", nom: "Hanmi Handachi Ikkyo", nom_japonais: "半身半立一教", traduction: "Ikkyo semi-debout", description: "Premier principe - Tori à genoux vs Uke debout", niveau: "2e_kyu", categorie: "hanmi_handachi", points_cles: ["Amener Uke au sol", "Contrôle malgré la différence de hauteur"] },
  { id: "hh_nikyo", nom: "Hanmi Handachi Nikyo", nom_japonais: "半身半立二教", traduction: "Nikyo semi-debout", description: "Deuxième principe - Tori à genoux", niveau: "1er_kyu", categorie: "hanmi_handachi" },
  { id: "hh_sankyo", nom: "Hanmi Handachi Sankyo", nom_japonais: "半身半立三教", traduction: "Sankyo semi-debout", description: "Troisième principe - Tori à genoux", niveau: "1er_kyu", categorie: "hanmi_handachi" },
  { id: "hh_kokyu_nage", nom: "Hanmi Handachi Kokyu Nage", nom_japonais: "半身半立呼吸投げ", traduction: "Kokyu Nage semi-debout", description: "Projection par le souffle - Tori à genoux", niveau: "2e_kyu", categorie: "hanmi_handachi", points_cles: ["Utiliser l'élan de Uke", "Timing parfait compensant le désavantage"] }
];

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================
export default {
  // Armes
  TECHNIQUES_JO,
  TECHNIQUES_BOKKEN,
  TECHNIQUES_TANTO,
  // Mouvements
  TAI_SABAKI,
  UKEMI,
  KAMAE,
  ATEMI,
  KOKYU_WAZA,
  KANSETSU_WAZA,
  SUWARIWAZA,
  HANMI_HANDACHI
};
