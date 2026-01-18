/**
 * AIKIDO@GAME — TECHNIQUES AU TANTO (COUTEAU)
 * 
 * Ce fichier contient toutes les techniques de défense contre le Tanto,
 * le couteau en bois utilisé pour l'entraînement en Aïkido.
 * 
 * Le Tanto Dori (défense contre couteau) est une partie essentielle
 * de la formation en Aïkido, enseignant la gestion du danger et
 * l'importance du Maai (distance).
 * 
 * Catégories d'attaques :
 * - Shomen Uchi : Frappe verticale descendante
 * - Yokomen Uchi : Frappe latérale à la tempe
 * - Tsuki : Piqué direct (chudan ou jodan)
 */

export const TECHNIQUES_TANTO = [
  // ==========================================================================
  // TANTO DORI - SHOMEN UCHI (Frappe verticale descendante)
  // ==========================================================================
  
  { 
    id: "tanto_dori_shomen_ikkyo_o", 
    nom: "Tanto Dori - Shomen Uchi Ikkyo Omote",
    description: "Défense contre frappe descendante - Ikkyo côté ouvert",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Contrôle du poignet armé", "Désarmement en fin de technique"]
  },
  { 
    id: "tanto_dori_shomen_ikkyo_u", 
    nom: "Tanto Dori - Shomen Uchi Ikkyo Ura",
    description: "Défense contre frappe descendante - Ikkyo côté fermé",
    phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "ikkyo", direction: "ura" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Pivot fluide", "Maintien du contrôle de l'arme"]
  },
  { 
    id: "tanto_dori_shomen_nikyo_o", 
    nom: "Tanto Dori - Shomen Uchi Nikyo Omote",
    description: "Défense contre frappe descendante - Nikyo côté ouvert",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, 
    phase2: { technique: "nikyo", direction: "omote" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Torsion du poignet", "Contrôle de la lame"]
  },
  { 
    id: "tanto_dori_shomen_nikyo_u", 
    nom: "Tanto Dori - Shomen Uchi Nikyo Ura",
    description: "Défense contre frappe descendante - Nikyo côté fermé",
    phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "nikyo", direction: "ura" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Entrée spirale", "Désarmement au sol"]
  },
  { 
    id: "tanto_dori_shomen_sankyo", 
    nom: "Tanto Dori - Shomen Uchi Sankyo",
    description: "Défense contre frappe descendante - Sankyo",
    phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Rotation du poignet vers l'extérieur", "Verrouillage sécurisé"]
  },
  { 
    id: "tanto_dori_shomen_gokyo_o", 
    nom: "Tanto Dori - Shomen Uchi Gokyo Omote",
    description: "Défense contre frappe descendante - Gokyo (technique privilégiée)",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Prise inversée du poignet", "Technique spécifique arme blanche"]
  },
  { 
    id: "tanto_dori_shomen_gokyo_u", 
    nom: "Tanto Dori - Shomen Uchi Gokyo Ura",
    description: "Défense contre frappe descendante - Gokyo côté fermé",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi_tenkan" }, 
    phase2: { technique: "gokyo", direction: "ura" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Contrôle du coude", "Immobilisation face contre terre"]
  },
  { 
    id: "tanto_dori_shomen_shiho_o", 
    nom: "Tanto Dori - Shomen Uchi Shiho Nage Omote",
    description: "Défense contre frappe descendante - Projection 4 directions",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "shiho_nage_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Contrôle permanent de l'arme", "Projection avec désarmement"]
  },
  { 
    id: "tanto_dori_shomen_shiho_u", 
    nom: "Tanto Dori - Shomen Uchi Shiho Nage Ura",
    description: "Défense contre frappe descendante - Shiho Nage côté fermé",
    phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "shiho_nage", direction: "ura" }, 
    phase3: { final: "shiho_nage_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Rotation sous le bras", "Immobilisation sécurisée"]
  },
  { 
    id: "tanto_dori_shomen_irimi", 
    nom: "Tanto Dori - Shomen Uchi Irimi Nage",
    description: "Défense contre frappe descendante - Projection d'entrée",
    phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu",
    points_cles: ["Entrée décisive", "Contrôle de la nuque"]
  },
  { 
    id: "tanto_dori_shomen_kote", 
    nom: "Tanto Dori - Shomen Uchi Kote Gaeshi",
    description: "Défense contre frappe descendante - Retournement de poignet",
    phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Redirection de la force", "Désarmement lors de la chute"]
  },

  // ==========================================================================
  // TANTO DORI - YOKOMEN UCHI (Frappe latérale à la tempe)
  // ==========================================================================
  
  { 
    id: "tanto_dori_yokomen_gokyo_o", 
    nom: "Tanto Dori - Yokomen Uchi Gokyo Omote",
    description: "Défense contre frappe latérale - Gokyo côté ouvert",
    phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Interception de l'attaque", "Prise Gokyo spécifique"]
  },
  { 
    id: "tanto_dori_yokomen_gokyo_u", 
    nom: "Tanto Dori - Yokomen Uchi Gokyo Ura",
    description: "Défense contre frappe latérale - Gokyo côté fermé",
    phase1: { attaque: "tanto_yokomen", deplacement: "irimi_tenkan" }, 
    phase2: { technique: "gokyo", direction: "ura" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Esquive pivotante", "Contrôle du coude armé"]
  },
  { 
    id: "tanto_dori_yokomen_shiho", 
    nom: "Tanto Dori - Yokomen Uchi Shiho Nage",
    description: "Défense contre frappe latérale - Projection 4 directions",
    phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "shiho_nage_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Réception de la frappe", "Verrouillage du poignet"]
  },
  { 
    id: "tanto_dori_yokomen_kote", 
    nom: "Tanto Dori - Yokomen Uchi Kote Gaeshi",
    description: "Défense contre frappe latérale - Retournement de poignet",
    phase1: { attaque: "tanto_yokomen", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Pivot extérieur", "Désarmement au sol"]
  },
  { 
    id: "tanto_dori_yokomen_irimi", 
    nom: "Tanto Dori - Yokomen Uchi Irimi Nage",
    description: "Défense contre frappe latérale - Projection d'entrée",
    phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan",
    points_cles: ["Timing précis", "Contrôle du bras armé"]
  },
  { 
    id: "tanto_dori_yokomen_ikkyo", 
    nom: "Tanto Dori - Yokomen Uchi Ikkyo",
    description: "Défense contre frappe latérale - Premier principe",
    phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Interception haute", "Guidage vers le sol"]
  },

  // ==========================================================================
  // TANTO DORI - TSUKI (Piqué direct)
  // ==========================================================================
  
  // Chudan Tsuki (piqué niveau moyen - abdomen)
  { 
    id: "tanto_dori_chudan_ikkyo", 
    nom: "Tanto Dori - Chudan Tsuki Ikkyo",
    description: "Défense contre piqué au ventre - Premier principe",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Esquive du corps", "Redirection du bras"]
  },
  { 
    id: "tanto_dori_chudan_nikyo", 
    nom: "Tanto Dori - Chudan Tsuki Nikyo",
    description: "Défense contre piqué au ventre - Deuxième principe",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "nikyo", direction: "omote" }, 
    phase3: { final: "nikyo_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Contrôle du poignet", "Torsion vers le bas"]
  },
  { 
    id: "tanto_dori_chudan_sankyo", 
    nom: "Tanto Dori - Chudan Tsuki Sankyo",
    description: "Défense contre piqué au ventre - Troisième principe",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "sankyo", direction: "ura" }, 
    phase3: { final: "sankyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Pivot fluide", "Verrouillage spirale"]
  },
  { 
    id: "tanto_dori_chudan_gokyo", 
    nom: "Tanto Dori - Chudan Tsuki Gokyo",
    description: "Défense contre piqué au ventre - Cinquième principe",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Prise inversée", "Désarmement efficace"]
  },
  { 
    id: "tanto_dori_chudan_kote", 
    nom: "Tanto Dori - Chudan Tsuki Kote Gaeshi",
    description: "Défense contre piqué au ventre - Retournement de poignet",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    niveau: "2e_kyu",
    points_cles: ["Redirection latérale", "Projection contrôlée"]
  },
  { 
    id: "tanto_dori_chudan_irimi", 
    nom: "Tanto Dori - Chudan Tsuki Irimi Nage",
    description: "Défense contre piqué au ventre - Projection d'entrée",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "1er_kyu",
    points_cles: ["Entrée décisive", "Projection arrière"]
  },
  { 
    id: "tanto_dori_chudan_kaiten", 
    nom: "Tanto Dori - Chudan Tsuki Kaiten Nage",
    description: "Défense contre piqué au ventre - Projection rotative",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kaiten_nage", direction: null }, 
    phase3: { final: "mae_ukemi", type: "chute" }, 
    niveau: "1er_kyu",
    points_cles: ["Rotation du corps", "Projection avant"]
  },
  { 
    id: "tanto_dori_chudan_hiji", 
    nom: "Tanto Dori - Chudan Tsuki Hiji Kime Osae",
    description: "Défense contre piqué au ventre - Contrôle du coude",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "hiji_kime_osae", direction: null }, 
    phase3: { final: "hiji_osae", type: "immobilisation" }, 
    niveau: "shodan",
    points_cles: ["Verrouillage du coude", "Immobilisation debout"]
  },
  { 
    id: "tanto_dori_chudan_shiho", 
    nom: "Tanto Dori - Chudan Tsuki Shiho Nage",
    description: "Défense contre piqué au ventre - Projection 4 directions",
    phase1: { attaque: "tanto_chudan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "shiho_nage", direction: "omote" }, 
    phase3: { final: "shiho_nage_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Saisie du poignet armé", "Rotation sous le bras"]
  },
  
  // Jodan Tsuki (piqué niveau haut - visage/gorge)
  { 
    id: "tanto_dori_jodan_ikkyo", 
    nom: "Tanto Dori - Jodan Tsuki Ikkyo",
    description: "Défense contre piqué au visage - Premier principe",
    phase1: { attaque: "tanto_jodan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "ikkyo", direction: "omote" }, 
    phase3: { final: "ikkyo_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Esquive de la tête", "Contrôle immédiat"]
  },
  { 
    id: "tanto_dori_jodan_kote", 
    nom: "Tanto Dori - Jodan Tsuki Kote Gaeshi",
    description: "Défense contre piqué au visage - Retournement de poignet",
    phase1: { attaque: "tanto_jodan_tsuki", deplacement: "tenkan" }, 
    phase2: { technique: "kote_gaeshi", direction: null }, 
    phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, 
    niveau: "1er_kyu",
    points_cles: ["Esquive latérale", "Saisie rapide du poignet"]
  },
  { 
    id: "tanto_dori_jodan_irimi", 
    nom: "Tanto Dori - Jodan Tsuki Irimi Nage",
    description: "Défense contre piqué au visage - Projection d'entrée",
    phase1: { attaque: "tanto_jodan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan",
    points_cles: ["Timing critique", "Entrée sous la ligne d'attaque"]
  },
  { 
    id: "tanto_dori_jodan_gokyo", 
    nom: "Tanto Dori - Jodan Tsuki Gokyo",
    description: "Défense contre piqué au visage - Cinquième principe",
    phase1: { attaque: "tanto_jodan_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "gokyo", direction: "omote" }, 
    phase3: { final: "gokyo_osae", type: "immobilisation" }, 
    niveau: "shodan",
    points_cles: ["Réaction rapide", "Désarmement prioritaire"]
  },

  // ==========================================================================
  // TANTO DORI - ATTAQUES SPÉCIALES
  // ==========================================================================
  
  { 
    id: "tanto_dori_ushiro_eri", 
    nom: "Tanto Dori - Ushiro Eri Dori (Menace arrière)",
    description: "Défense contre menace par l'arrière au col",
    phase1: { attaque: "tanto_ushiro_eri", deplacement: "tenkan" }, 
    phase2: { technique: "kokyu_nage", direction: null }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan",
    points_cles: ["Pivotement rapide", "Déséquilibre de l'agresseur"]
  },
  { 
    id: "tanto_dori_mune_tsuki", 
    nom: "Tanto Dori - Mune Tsuki (Piqué poitrine)",
    description: "Défense contre piqué à la poitrine",
    phase1: { attaque: "tanto_mune_tsuki", deplacement: "irimi" }, 
    phase2: { technique: "irimi_nage", direction: "omote" }, 
    phase3: { final: "ushiro_ukemi", type: "chute" }, 
    niveau: "shodan",
    points_cles: ["Entrée profonde", "Contrôle de la distance"]
  },
];

// =============================================================================
// STATISTIQUES ET UTILITAIRES
// =============================================================================

export const TANTO_STATISTICS = {
  total: TECHNIQUES_TANTO.length,
  shomen_uchi: TECHNIQUES_TANTO.filter(t => t.id.includes('shomen')).length,
  yokomen_uchi: TECHNIQUES_TANTO.filter(t => t.id.includes('yokomen')).length,
  tsuki: TECHNIQUES_TANTO.filter(t => t.id.includes('tsuki') || t.id.includes('chudan') || t.id.includes('jodan')).length,
  special: TECHNIQUES_TANTO.filter(t => t.id.includes('ushiro') || t.id.includes('mune')).length,
  immobilisations: TECHNIQUES_TANTO.filter(t => t.phase3.type === 'immobilisation').length,
  projections: TECHNIQUES_TANTO.filter(t => t.phase3.type === 'chute').length,
};

// Techniques par niveau
export const getTantoByNiveau = (niveau) => {
  return TECHNIQUES_TANTO.filter(t => t.niveau === niveau);
};

// Techniques par type d'attaque
export const getTantoByAttaque = (type) => {
  return TECHNIQUES_TANTO.filter(t => t.phase1.attaque.includes(type));
};

export default TECHNIQUES_TANTO;
