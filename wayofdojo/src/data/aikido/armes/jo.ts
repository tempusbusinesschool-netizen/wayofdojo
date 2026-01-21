/**
 * 🥋 WAYOFDOJO — TECHNIQUES AU JO (BÂTON)
 * 
 * Ce fichier contient toutes les techniques pratiquées avec le Jo,
 * le bâton de bois de 128 cm utilisé en Aïkido.
 * 
 * Catégories :
 * - Jo Suburi : Mouvements de base solo (31 suburi selon Saito Sensei)
 * - Jo Kata : Formes codifiées
 * - Kumi Jo : Exercices à deux avec bâton
 * - Jo Dori : Défense contre attaque au bâton
 * - Jo Nage : Projection avec le bâton
 * 
 * Migré depuis AIKIDO@GAME
 */

import { TechniqueArme, NiveauGrade } from '../types';

export const TECHNIQUES_JO: TechniqueArme[] = [
  // ==========================================================================
  // JO SUBURI - MOUVEMENTS DE BASE AU BÂTON (20 premiers)
  // ==========================================================================
  
  // Tsuki (Piqués) - 5 suburi
  { 
    id: "jo_suburi_1", 
    nom: "Choku Tsuki (Tsuki direct)",
    description: "Piqué direct vers l'avant - le plus fondamental",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "tsuki", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "6e_kyu",
    ordre: 1
  },
  { 
    id: "jo_suburi_2", 
    nom: "Kaeshi Tsuki (Tsuki retourné)",
    description: "Piqué avec retournement du Jo",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "tsuki", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "6e_kyu",
    ordre: 2
  },
  { 
    id: "jo_suburi_3", 
    nom: "Ushiro Tsuki (Tsuki arrière)",
    description: "Piqué vers l'arrière",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "tsuki", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 3
  },
  { 
    id: "jo_suburi_4", 
    nom: "Tsuki Gedan Gaeshi",
    description: "Piqué avec retour vers le bas",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "tsuki", direction: null }, 
    phase3: { final: "gedan_kamae", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 4
  },
  { 
    id: "jo_suburi_5", 
    nom: "Tsuki Jodan Gaeshi",
    description: "Piqué avec retour vers le haut",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "tsuki", direction: null }, 
    phase3: { final: "jodan_kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 5
  },
  
  // Uchi (Frappes) - 5 suburi
  { 
    id: "jo_suburi_6", 
    nom: "Shomen Uchi",
    description: "Frappe verticale descendante",
    phase1: { attaque: "", deplacement: "jodan_kamae" }, 
    phase2: { technique: "shomen_uchi", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "6e_kyu",
    ordre: 6
  },
  { 
    id: "jo_suburi_7", 
    nom: "Renzoku Uchikomi",
    description: "Frappes continues en avançant",
    phase1: { attaque: "", deplacement: "jodan_kamae" }, 
    phase2: { technique: "shomen_uchi", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "5e_kyu",
    ordre: 7
  },
  { 
    id: "jo_suburi_8", 
    nom: "Men Uchi Gedan Gaeshi",
    description: "Frappe à la tête avec retour bas",
    phase1: { attaque: "", deplacement: "jodan_kamae" }, 
    phase2: { technique: "shomen_uchi", direction: null }, 
    phase3: { final: "gedan_kamae", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 8
  },
  { 
    id: "jo_suburi_9", 
    nom: "Men Uchi Ushiro Tsuki",
    description: "Frappe suivie de piqué arrière",
    phase1: { attaque: "", deplacement: "jodan_kamae" }, 
    phase2: { technique: "shomen_uchi", direction: null }, 
    phase3: { final: "ushiro_tsuki", type: "suburi" }, 
    niveau: "4e_kyu",
    ordre: 9
  },
  { 
    id: "jo_suburi_10", 
    nom: "Gyaku Yokomen Uchi",
    description: "Frappe latérale inversée",
    phase1: { attaque: "", deplacement: "hasso_kamae" }, 
    phase2: { technique: "yokomen_uchi", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 10
  },
  
  // Suburi combinés (11-20)
  { 
    id: "jo_suburi_11", 
    nom: "Katate Gedan Gaeshi",
    description: "Rotation une main vers le bas",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "gaeshi", direction: null }, 
    phase3: { final: "gedan_kamae", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 11
  },
  { 
    id: "jo_suburi_12", 
    nom: "Katate Toma Uchi",
    description: "Frappe longue distance une main",
    phase1: { attaque: "", deplacement: "jodan_kamae" }, 
    phase2: { technique: "uchi", direction: null }, 
    phase3: { final: "zanshin", type: "suburi" }, 
    niveau: "3e_kyu",
    ordre: 12
  },
  { 
    id: "jo_suburi_13", 
    nom: "Katate Hachi No Ji Gaeshi",
    description: "Mouvement en huit une main",
    phase1: { attaque: "", deplacement: "chudan_kamae" }, 
    phase2: { technique: "gaeshi", direction: null }, 
    phase3: { final: "chudan_kamae", type: "suburi" }, 
    niveau: "2e_kyu",
    ordre: 13
  },
  
  // ==========================================================================
  // KUMI JO - EXERCICES À DEUX
  // ==========================================================================
  
  { 
    id: "kumijo_1", 
    nom: "Kumi Jo Ichi (1)",
    description: "Premier exercice à deux au Jo",
    phase1: { attaque: "kumijo_ichi", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "4e_kyu"
  },
  { 
    id: "kumijo_2", 
    nom: "Kumi Jo Ni (2)",
    description: "Deuxième exercice à deux au Jo",
    phase1: { attaque: "kumijo_ni", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "4e_kyu"
  },
  { 
    id: "kumijo_3", 
    nom: "Kumi Jo San (3)",
    description: "Troisième exercice à deux au Jo",
    phase1: { attaque: "kumijo_san", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumijo_4", 
    nom: "Kumi Jo Yon (4)",
    description: "Quatrième exercice à deux au Jo",
    phase1: { attaque: "kumijo_yon", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "kumijo_5", 
    nom: "Kumi Jo Go (5)",
    description: "Cinquième exercice à deux au Jo",
    phase1: { attaque: "kumijo_go", deplacement: "awase" }, 
    phase2: { technique: "jo_awase", direction: null }, 
    phase3: { final: "zanshin", type: "kumijo" }, 
    niveau: "2e_kyu"
  },
  
  // ==========================================================================
  // JO KATA - FORMES CODIFIÉES
  // ==========================================================================
  
  { 
    id: "jo_kata_31", 
    nom: "31 Jo Kata",
    description: "Kata des 31 mouvements - forme solo complète",
    phase1: { attaque: "", deplacement: "kata" }, 
    phase2: { technique: "jo_kata", direction: null }, 
    phase3: { final: "zanshin", type: "kata" }, 
    niveau: "3e_kyu"
  },
  { 
    id: "jo_kata_13", 
    nom: "13 Jo Kata",
    description: "Kata des 13 mouvements - forme intermédiaire",
    phase1: { attaque: "", deplacement: "kata" }, 
    phase2: { technique: "jo_kata", direction: null }, 
    phase3: { final: "zanshin", type: "kata" }, 
    niveau: "4e_kyu"
  },
  
  // ==========================================================================
  // JO DORI - DÉFENSE CONTRE ATTAQUE AU BÂTON
  // ==========================================================================
  
  { 
    id: "jo_dori_ikkyo_1", 
    nom: "Jo Dori - Tsuki Ikkyo",
    description: "Défense contre piqué avec Ikkyo",
    phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_shiho_1", 
    nom: "Jo Dori - Shomen Shiho Nage",
    description: "Défense contre frappe avec Shiho Nage",
    phase1: { attaque: "jo_shomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_dori_irimi_1", 
    nom: "Jo Dori - Irimi Nage",
    description: "Défense avec projection d'entrée",
    phase1: { attaque: "jo_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_kote_1", 
    nom: "Jo Dori - Kote Gaeshi",
    description: "Défense avec retournement de poignet",
    phase1: { attaque: "jo_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "tobi_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_dori_kokyu_1", 
    nom: "Jo Dori - Kokyu Nage",
    description: "Défense avec projection par la respiration",
    phase1: { attaque: "jo_shomen", deplacement: "irimi_tenkan" }, 
    phase2: { technique: "kokyu_nage", direction: null }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  
  // ==========================================================================
  // JO NAGE - PROJECTION AVEC LE BÂTON
  // ==========================================================================
  
  { 
    id: "jo_nage_tsuki_1", 
    nom: "Jo Nage - Tsuki",
    description: "Projection en utilisant le Jo comme levier (pique)",
    phase1: { attaque: "katate_dori", deplacement: "jo_tsuki" }, 
    phase2: { technique: "jo_nage", direction: null }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "2e_kyu"
  },
  { 
    id: "jo_nage_gaeshi_1", 
    nom: "Jo Nage - Gaeshi",
    description: "Projection avec retournement du Jo",
    phase1: { attaque: "katate_dori", deplacement: "jo_gaeshi" }, 
    phase2: { technique: "jo_nage", direction: null }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu"
  },
  { 
    id: "jo_nage_uchi_1", 
    nom: "Jo Nage - Uchi",
    description: "Projection avec frappe du Jo",
    phase1: { attaque: "ryote_dori", deplacement: "jo_uchi" }, 
    phase2: { technique: "jo_nage", direction: null }, 
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

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getJoByNiveau = (niveau: NiveauGrade): TechniqueArme[] => {
  return TECHNIQUES_JO.filter(t => t.niveau === niveau);
};

export const getJoByType = (type: string): TechniqueArme[] => {
  return TECHNIQUES_JO.filter(t => t.phase3.type === type);
};

export default TECHNIQUES_JO;
