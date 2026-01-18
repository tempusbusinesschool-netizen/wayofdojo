/**
 * AIKIDO@GAME — TECHNIQUES AU BOKKEN (SABRE EN BOIS)
 * 
 * Ce fichier contient toutes les techniques pratiquées avec le Bokken,
 * le sabre en bois traditionnel de l'Aïkido.
 * 
 * Catégories :
 * - Ken Suburi : Mouvements de base solo (7 suburi)
 * - Kumi Tachi : Exercices à deux avec sabre
 * - Tachi Dori : Défense contre attaque au sabre
 * - Ken Tai Jo : Sabre contre bâton
 */

export const TECHNIQUES_BOKKEN = [
  // ==========================================================================
  // KEN SUBURI - MOUVEMENTS DE BASE AU SABRE (7 Suburi)
  // ==========================================================================
  
  { 
    id: "ken_suburi_1", 
    nom: "Shomen Uchi Ikkyo",
    description: "Frappe verticale de base - Premier suburi",
    phase1: { attaque: null, deplacement: "shomen_uchi" }, 
    phase2: { technique: "ken_suburi", direction: "ichi" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 1
  },
  { 
    id: "ken_suburi_2", 
    nom: "Shomen Uchi Nikyo (Zenpo)",
    description: "Frappe verticale avec pas en avant",
    phase1: { attaque: null, deplacement: "shomen_uchi_zenpo" }, 
    phase2: { technique: "ken_suburi", direction: "ni" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 2
  },
  { 
    id: "ken_suburi_3", 
    nom: "Shomen Uchi Sankyo (Kotai)",
    description: "Frappe verticale avec pas en arrière",
    phase1: { attaque: null, deplacement: "shomen_uchi_kotai" }, 
    phase2: { technique: "ken_suburi", direction: "san" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 3
  },
  { 
    id: "ken_suburi_4", 
    nom: "Shomen Uchi Yonkyo (Zenpo Kotai)",
    description: "Frappe verticale avec pas avant-arrière",
    phase1: { attaque: null, deplacement: "shomen_uchi_zenpo_kotai" }, 
    phase2: { technique: "ken_suburi", direction: "yon" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 4
  },
  { 
    id: "ken_suburi_5", 
    nom: "Yokomen Uchi Gokyo (Zenpo)",
    description: "Frappe latérale avec pas en avant",
    phase1: { attaque: null, deplacement: "yokomen_uchi_zenpo" }, 
    phase2: { technique: "ken_suburi", direction: "go" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 5
  },
  { 
    id: "ken_suburi_6", 
    nom: "Yokomen Uchi Rokkyo (Kotai)",
    description: "Frappe latérale avec pas en arrière",
    phase1: { attaque: null, deplacement: "yokomen_uchi_kotai" }, 
    phase2: { technique: "ken_suburi", direction: "roku" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 6
  },
  { 
    id: "ken_suburi_7", 
    nom: "Yokomen Uchi Nanakyo (Zenpo Kotai)",
    description: "Frappe latérale avec pas avant-arrière",
    phase1: { attaque: null, deplacement: "yokomen_uchi_zenpo_kotai" }, 
    phase2: { technique: "ken_suburi", direction: "nana" }, 
    phase3: { final: "kamae", type: "suburi" }, 
    niveau: "2e_kyu",
    ordre: 7
  },

  // ==========================================================================
  // KUMI TACHI - EXERCICES À DEUX AVEC SABRE (5 Kumi Tachi)
  // ==========================================================================
  
  { 
    id: "kumitachi_1", 
    nom: "Kumi Tachi Ichi (1)",
    description: "Premier exercice à deux - Shomen contre Shomen",
    phase1: { attaque: "kumitachi_ichi", deplacement: "awase" }, 
    phase2: { technique: "ken_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumitachi" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumitachi_2", 
    nom: "Kumi Tachi Ni (2)",
    description: "Deuxième exercice à deux - Variations",
    phase1: { attaque: "kumitachi_ni", deplacement: "awase" }, 
    phase2: { technique: "ken_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumitachi" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumitachi_3", 
    nom: "Kumi Tachi San (3)",
    description: "Troisième exercice à deux - Yokomen",
    phase1: { attaque: "kumitachi_san", deplacement: "awase" }, 
    phase2: { technique: "ken_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumitachi" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "kumitachi_4", 
    nom: "Kumi Tachi Yon (4)",
    description: "Quatrième exercice à deux - Tsuki",
    phase1: { attaque: "kumitachi_yon", deplacement: "awase" }, 
    phase2: { technique: "ken_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumitachi" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "kumitachi_5", 
    nom: "Kumi Tachi Go (5)",
    description: "Cinquième exercice à deux - Avancé",
    phase1: { attaque: "kumitachi_go", deplacement: "awase" }, 
    phase2: { technique: "ken_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumitachi" }, 
    niveau: "1er_kyu"
  },

  // ==========================================================================
  // TACHI DORI - DÉFENSE CONTRE ATTAQUE AU SABRE
  // ==========================================================================
  
  // Shomen Uchi (frappe verticale)
  { 
    id: "tachi_dori_shomen_ikkyo", 
    nom: "Tachi Dori - Shomen Uchi Ikkyo",
    description: "Défense contre frappe verticale avec Ikkyo",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "tachi_dori_shomen_nikyo", 
    nom: "Tachi Dori - Shomen Uchi Nikyo",
    description: "Défense contre frappe verticale avec Nikyo",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "nikyo", direction: "omote" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_shomen_sankyo", 
    nom: "Tachi Dori - Shomen Uchi Sankyo",
    description: "Défense contre frappe verticale avec Sankyo",
    phase1: { attaque: "tachi_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_shomen_yonkyo", 
    nom: "Tachi Dori - Shomen Uchi Yonkyo",
    description: "Défense contre frappe verticale avec Yonkyo",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "yonkyo", direction: "omote" }, 
    phase3: { final: "yonkyo_osae", type: "immobilisation" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_shomen_gokyo", 
    nom: "Tachi Dori - Shomen Uchi Gokyo",
    description: "Défense contre frappe verticale avec Gokyo",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_shomen_irimi", 
    nom: "Tachi Dori - Shomen Uchi Irimi Nage",
    description: "Défense contre frappe verticale avec Irimi Nage",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "tachi_dori_shomen_shiho", 
    nom: "Tachi Dori - Shomen Uchi Shiho Nage",
    description: "Défense contre frappe verticale avec Shiho Nage",
    phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "tachi_dori_shomen_kote", 
    nom: "Tachi Dori - Shomen Uchi Kote Gaeshi",
    description: "Défense contre frappe verticale avec Kote Gaeshi",
    phase1: { attaque: "tachi_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "tobi_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  
  // Yokomen Uchi (frappe latérale)
  { 
    id: "tachi_dori_yokomen_shiho", 
    nom: "Tachi Dori - Yokomen Uchi Shiho Nage",
    description: "Défense contre frappe latérale avec Shiho Nage",
    phase1: { attaque: "tachi_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_yokomen_irimi", 
    nom: "Tachi Dori - Yokomen Uchi Irimi Nage",
    description: "Défense contre frappe latérale avec Irimi Nage",
    phase1: { attaque: "tachi_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan"
  },
  { 
    id: "tachi_dori_yokomen_kote", 
    nom: "Tachi Dori - Yokomen Uchi Kote Gaeshi",
    description: "Défense contre frappe latérale avec Kote Gaeshi",
    phase1: { attaque: "tachi_yokomen", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "tobi_ukemi", type: "chute" }, 
    niveau: "shodan"
  },
  
  // Tsuki (pique)
  { 
    id: "tachi_dori_tsuki_irimi", 
    nom: "Tachi Dori - Tsuki Irimi Nage",
    description: "Défense contre pique au sabre avec Irimi Nage",
    phase1: { attaque: "tachi_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "nidan"
  },
  { 
    id: "tachi_dori_tsuki_kote", 
    nom: "Tachi Dori - Tsuki Kote Gaeshi",
    description: "Défense contre pique au sabre avec Kote Gaeshi",
    phase1: { attaque: "tachi_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "tobi_ukemi", type: "chute" }, 
    niveau: "nidan"
  },
  { 
    id: "tachi_dori_tsuki_shiho", 
    nom: "Tachi Dori - Tsuki Shiho Nage",
    description: "Défense contre pique au sabre avec Shiho Nage",
    phase1: { attaque: "tachi_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "nidan"
  },

  // ==========================================================================
  // KEN TAI JO - SABRE CONTRE BÂTON
  // ==========================================================================
  
  { 
    id: "ken_tai_jo_1", 
    nom: "Ken Tai Jo Ichi (1)",
    description: "Premier exercice sabre contre bâton",
    phase1: { attaque: "ken_tai_jo_ichi", deplacement: "awase" }, 
    phase2: { technique: "ken_jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "ken_tai_jo" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "ken_tai_jo_2", 
    nom: "Ken Tai Jo Ni (2)",
    description: "Deuxième exercice sabre contre bâton",
    phase1: { attaque: "ken_tai_jo_ni", deplacement: "awase" }, 
    phase2: { technique: "ken_jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "ken_tai_jo" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "ken_tai_jo_3", 
    nom: "Ken Tai Jo San (3)",
    description: "Troisième exercice sabre contre bâton",
    phase1: { attaque: "ken_tai_jo_san", deplacement: "awase" }, 
    phase2: { technique: "ken_jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "ken_tai_jo" }, 
    niveau: "shodan"
  },
  { 
    id: "ken_tai_jo_4", 
    nom: "Ken Tai Jo Yon (4)",
    description: "Quatrième exercice sabre contre bâton",
    phase1: { attaque: "ken_tai_jo_yon", deplacement: "awase" }, 
    phase2: { technique: "ken_jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "ken_tai_jo" }, 
    niveau: "shodan"
  },
  { 
    id: "ken_tai_jo_5", 
    nom: "Ken Tai Jo Go (5)",
    description: "Cinquième exercice sabre contre bâton - Avancé",
    phase1: { attaque: "ken_tai_jo_go", deplacement: "awase" }, 
    phase2: { technique: "ken_jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "ken_tai_jo" }, 
    niveau: "nidan"
  },
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const BOKKEN_STATISTICS = {
  total: TECHNIQUES_BOKKEN.length,
  suburi: TECHNIQUES_BOKKEN.filter(t => t.phase3.type === 'suburi').length,
  kumitachi: TECHNIQUES_BOKKEN.filter(t => t.phase3.type === 'kumitachi').length,
  tachi_dori: TECHNIQUES_BOKKEN.filter(t => t.id.startsWith('tachi_dori')).length,
  ken_tai_jo: TECHNIQUES_BOKKEN.filter(t => t.phase3.type === 'ken_tai_jo').length,
};

export default TECHNIQUES_BOKKEN;
