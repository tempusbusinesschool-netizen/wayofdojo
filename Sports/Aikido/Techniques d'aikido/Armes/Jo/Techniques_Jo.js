/**
 * AIKIDO@GAME — TECHNIQUES AU JO (BÂTON)
 * 
 * Ce fichier contient toutes les techniques pratiquées avec le Jo,
 * le bâton traditionnel de l'Aïkido (environ 128 cm).
 * 
 * Catégories :
 * - Jo Suburi : Mouvements de base solo (20 suburi)
 * - Jo Kata : Formes codifiées (13, 22, 31 mouvements)
 * - Kumi Jo : Exercices à deux avec bâton
 * - Jo Dori : Défense contre attaque au bâton
 * - Jo Nage : Projection en utilisant le bâton
 */

export const TECHNIQUES_JO = [
  // ==========================================================================
  // JO SUBURI - MOUVEMENTS DE BASE AU BÂTON (20 Suburi)
  // ==========================================================================
  
  // Tsuki (piques) - 5 suburi
  { 
    id: "jo_suburi_1", 
    nom: "Choku Tsuki",
    description: "Pique directe vers l'avant",
    phase1: { attaque: null, deplacement: "choku_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "tsuki_1" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 1
  },
  { 
    id: "jo_suburi_2", 
    nom: "Kaeshi Tsuki",
    description: "Pique avec retournement",
    phase1: { attaque: null, deplacement: "kaeshi_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "tsuki_2" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 2
  },
  { 
    id: "jo_suburi_3", 
    nom: "Ushiro Tsuki",
    description: "Pique vers l'arrière",
    phase1: { attaque: null, deplacement: "ushiro_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "tsuki_3" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 3
  },
  { 
    id: "jo_suburi_4", 
    nom: "Tsuki Gedan Gaeshi",
    description: "Pique avec retour niveau bas",
    phase1: { attaque: null, deplacement: "tsuki_gedan_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "tsuki_4" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 4
  },
  { 
    id: "jo_suburi_5", 
    nom: "Tsuki Jodan Gaeshi",
    description: "Pique avec retour niveau haut",
    phase1: { attaque: null, deplacement: "tsuki_jodan_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "tsuki_5" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 5
  },
  
  // Uchi (frappes) - 5 suburi
  { 
    id: "jo_suburi_6", 
    nom: "Shomen Uchi Komi",
    description: "Frappe verticale descendante",
    phase1: { attaque: null, deplacement: "shomen_uchi" }, 
    phase2: { technique: "jo_suburi", direction: "uchi_1" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 6
  },
  { 
    id: "jo_suburi_7", 
    nom: "Renzoku Uchi Komi",
    description: "Frappes continues",
    phase1: { attaque: null, deplacement: "renzoku_uchi" }, 
    phase2: { technique: "jo_suburi", direction: "uchi_2" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 7
  },
  { 
    id: "jo_suburi_8", 
    nom: "Menuchi Gedan Gaeshi",
    description: "Frappe tête avec retour bas",
    phase1: { attaque: null, deplacement: "menuchi_gedan_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "uchi_3" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 8
  },
  { 
    id: "jo_suburi_9", 
    nom: "Menuchi Ushiro Tsuki",
    description: "Frappe tête suivie de pique arrière",
    phase1: { attaque: null, deplacement: "menuchi_ushiro_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "uchi_4" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 9
  },
  { 
    id: "jo_suburi_10", 
    nom: "Gyaku Yokomen Uchi",
    description: "Frappe latérale inverse",
    phase1: { attaque: null, deplacement: "gyaku_yokomen" }, 
    phase2: { technique: "jo_suburi", direction: "uchi_5" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 10
  },
  
  // Katate (une main) - 3 suburi
  { 
    id: "jo_suburi_11", 
    nom: "Katate Gedan Gaeshi",
    description: "Retour bas à une main",
    phase1: { attaque: null, deplacement: "katate_gedan_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "katate_1" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 11
  },
  { 
    id: "jo_suburi_12", 
    nom: "Katate Toma Uchi",
    description: "Frappe à distance à une main",
    phase1: { attaque: null, deplacement: "katate_toma_uchi" }, 
    phase2: { technique: "jo_suburi", direction: "katate_2" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 12
  },
  { 
    id: "jo_suburi_13", 
    nom: "Katate Hachi No Ji Gaeshi",
    description: "Mouvement en huit à une main",
    phase1: { attaque: null, deplacement: "katate_hachi_no_ji" }, 
    phase2: { technique: "jo_suburi", direction: "katate_3" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "2e_kyu",
    ordre: 13
  },
  
  // Hasso Gaeshi - 5 suburi
  { 
    id: "jo_suburi_14", 
    nom: "Hasso Gaeshi Uchi",
    description: "Frappe depuis Hasso",
    phase1: { attaque: null, deplacement: "hasso_gaeshi_uchi" }, 
    phase2: { technique: "jo_suburi", direction: "hasso_1" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "2e_kyu",
    ordre: 14
  },
  { 
    id: "jo_suburi_15", 
    nom: "Hasso Gaeshi Tsuki",
    description: "Pique depuis Hasso",
    phase1: { attaque: null, deplacement: "hasso_gaeshi_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "hasso_2" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "2e_kyu",
    ordre: 15
  },
  { 
    id: "jo_suburi_16", 
    nom: "Hasso Gaeshi Ushiro Tsuki",
    description: "Pique arrière depuis Hasso",
    phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_tsuki" }, 
    phase2: { technique: "jo_suburi", direction: "hasso_3" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "1er_kyu",
    ordre: 16
  },
  { 
    id: "jo_suburi_17", 
    nom: "Hasso Gaeshi Ushiro Uchi",
    description: "Frappe arrière depuis Hasso",
    phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_uchi" }, 
    phase2: { technique: "jo_suburi", direction: "hasso_4" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "1er_kyu",
    ordre: 17
  },
  { 
    id: "jo_suburi_18", 
    nom: "Hasso Gaeshi Ushiro Barai",
    description: "Balayage arrière depuis Hasso",
    phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_barai" }, 
    phase2: { technique: "jo_suburi", direction: "hasso_5" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "1er_kyu",
    ordre: 18
  },
  
  // Nagare Gaeshi - 2 suburi
  { 
    id: "jo_suburi_19", 
    nom: "Hidari Nagare Gaeshi Uchi",
    description: "Frappe fluide côté gauche",
    phase1: { attaque: null, deplacement: "hidari_nagare_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "nagare_1" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "1er_kyu",
    ordre: 19
  },
  { 
    id: "jo_suburi_20", 
    nom: "Migi Nagare Gaeshi Uchi",
    description: "Frappe fluide côté droit",
    phase1: { attaque: null, deplacement: "migi_nagare_gaeshi" }, 
    phase2: { technique: "jo_suburi", direction: "nagare_2" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "1er_kyu",
    ordre: 20
  },

  // ==========================================================================
  // JO KATA - FORMES CODIFIÉES
  // ==========================================================================
  
  { 
    id: "jo_kata_13", 
    nom: "13 Jo Kata",
    description: "Forme courte de 13 mouvements - Introduction aux katas",
    phase1: { attaque: null, deplacement: "kata" }, 
    phase2: { technique: "13_jo_kata", direction: null }, 
    phase3: { final: "zanshin", type: "kata" }, 
    niveau: "4e_kyu",
    duree: "~30 secondes"
  },
  { 
    id: "jo_kata_22", 
    nom: "22 Jo Kata",
    description: "Forme intermédiaire de 22 mouvements",
    phase1: { attaque: null, deplacement: "kata" }, 
    phase2: { technique: "22_jo_kata", direction: null }, 
    phase3: { final: "zanshin", type: "kata" }, 
    niveau: "2e_kyu",
    duree: "~1 minute"
  },
  { 
    id: "jo_kata_31", 
    nom: "31 Jo Kata",
    description: "Forme longue de 31 mouvements - Kata principal",
    phase1: { attaque: null, deplacement: "kata" }, 
    phase2: { technique: "31_jo_kata", direction: null }, 
    phase3: { final: "zanshin", type: "kata" }, 
    niveau: "3e_kyu",
    duree: "~1 minute 30"
  },

  // ==========================================================================
  // KUMI JO - EXERCICES À DEUX AVEC BÂTON (10 Kumi Jo)
  // ==========================================================================
  
  { 
    id: "kumijo_1", 
    nom: "Kumi Jo Ichi (1)",
    description: "Premier exercice à deux - Base",
    phase1: { attaque: "kumijo_ichi", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumijo_2", 
    nom: "Kumi Jo Ni (2)",
    description: "Deuxième exercice à deux",
    phase1: { attaque: "kumijo_ni", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumijo_3", 
    nom: "Kumi Jo San (3)",
    description: "Troisième exercice à deux",
    phase1: { attaque: "kumijo_san", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "kumijo_4", 
    nom: "Kumi Jo Yon (4)",
    description: "Quatrième exercice à deux",
    phase1: { attaque: "kumijo_yon", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "kumijo_5", 
    nom: "Kumi Jo Go (5)",
    description: "Cinquième exercice à deux",
    phase1: { attaque: "kumijo_go", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "kumijo_6", 
    nom: "Kumi Jo Roku (6)",
    description: "Sixième exercice à deux",
    phase1: { attaque: "kumijo_roku", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "kumijo_7", 
    nom: "Kumi Jo Nana (7)",
    description: "Septième exercice à deux - Niveau Dan",
    phase1: { attaque: "kumijo_nana", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "shodan"
  },
  { 
    id: "kumijo_8", 
    nom: "Kumi Jo Hachi (8)",
    description: "Huitième exercice à deux",
    phase1: { attaque: "kumijo_hachi", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "shodan"
  },
  { 
    id: "kumijo_9", 
    nom: "Kumi Jo Kyu (9)",
    description: "Neuvième exercice à deux",
    phase1: { attaque: "kumijo_kyu", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "nidan"
  },
  { 
    id: "kumijo_10", 
    nom: "Kumi Jo Ju (10)",
    description: "Dixième exercice à deux - Avancé",
    phase1: { attaque: "kumijo_ju", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "nidan"
  },

  // ==========================================================================
  // JO DORI - DÉFENSE CONTRE ATTAQUE AU BÂTON
  // ==========================================================================
  
  { 
    id: "jo_dori_shomen_ikkyo", 
    nom: "Jo Dori - Shomen Uchi Ikkyo",
    description: "Défense contre frappe verticale avec Ikkyo",
    phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_shomen_nikyo", 
    nom: "Jo Dori - Shomen Uchi Nikyo",
    description: "Défense contre frappe verticale avec Nikyo",
    phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "nikyo", direction: "omote" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_shomen_sankyo", 
    nom: "Jo Dori - Shomen Uchi Sankyo",
    description: "Défense contre frappe verticale avec Sankyo",
    phase1: { attaque: "jo_shomen_uchi", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_shomen_yonkyo", 
    nom: "Jo Dori - Shomen Uchi Yonkyo",
    description: "Défense contre frappe verticale avec Yonkyo",
    phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "yonkyo", direction: "omote" }, 
    phase3: { final: "yonkyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_shomen_gokyo", 
    nom: "Jo Dori - Shomen Uchi Gokyo",
    description: "Défense contre frappe verticale avec Gokyo",
    phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_tsuki_irimi", 
    nom: "Jo Dori - Tsuki Irimi Nage",
    description: "Défense contre pique avec projection Irimi",
    phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_tsuki_kote", 
    nom: "Jo Dori - Tsuki Kote Gaeshi",
    description: "Défense contre pique avec retournement de poignet",
    phase1: { attaque: "jo_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "tobi_ukemi", type: "chute" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_tsuki_shiho", 
    nom: "Jo Dori - Tsuki Shiho Nage",
    description: "Défense contre pique avec projection 4 directions",
    phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_yokomen_shiho", 
    nom: "Jo Dori - Yokomen Shiho Nage",
    description: "Défense contre frappe latérale avec Shiho Nage",
    phase1: { attaque: "jo_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_yokomen_kokyu", 
    nom: "Jo Dori - Yokomen Kokyu Nage",
    description: "Défense contre frappe latérale avec projection Kokyu",
    phase1: { attaque: "jo_yokomen", deplacement: "tenkan" }, 
    phase2: { technique: "kokyu_nage", direction: null }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan"
  },

  // ==========================================================================
  // JO NAGE - PROJECTION AVEC LE BÂTON
  // ==========================================================================
  
  { 
    id: "jo_nage_tsuki_1", 
    nom: "Jo Nage - Tsuki",
    description: "Projection en utilisant le Jo comme levier (pique)",
    phase1: { attaque: "katate_dori", deplacement: "jo_tsuki" }, 
    phase2: { technique: "jo_nage", direction: "tsuki" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_nage_gaeshi_1", 
    nom: "Jo Nage - Gaeshi",
    description: "Projection avec retournement du Jo",
    phase1: { attaque: "katate_dori", deplacement: "jo_gaeshi" }, 
    phase2: { technique: "jo_nage", direction: "gaeshi" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_nage_uchi_1", 
    nom: "Jo Nage - Uchi",
    description: "Projection avec frappe du Jo",
    phase1: { attaque: "ryote_dori", deplacement: "jo_uchi" }, 
    phase2: { technique: "jo_nage", direction: "uchi" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const JO_STATISTICS = {
  total: TECHNIQUES_JO.length,
  suburi: TECHNIQUES_JO.filter(t => t.phase3.type === 'suburi').length,
  kata: TECHNIQUES_JO.filter(t => t.phase3.type === 'kata').length,
  kumijo: TECHNIQUES_JO.filter(t => t.phase3.type === 'kumijo').length,
  jo_dori: TECHNIQUES_JO.filter(t => t.id.startsWith('jo_dori')).length,
  jo_nage: TECHNIQUES_JO.filter(t => t.id.startsWith('jo_nage')).length,
};

export default TECHNIQUES_JO;
