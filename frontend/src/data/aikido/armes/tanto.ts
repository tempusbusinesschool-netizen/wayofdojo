/**
 * 🥋 WAYOFDOJO — TECHNIQUES AU TANTO (COUTEAU)
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
 * 
 * Migré depuis AIKIDO@GAME
 */

import { TechniqueArme, NiveauGrade } from '../types';

export const TECHNIQUES_TANTO: TechniqueArme[] = [
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
];

// =============================================================================
// STATISTIQUES
// =============================================================================

export const TANTO_STATISTICS = {
  total: TECHNIQUES_TANTO.length,
  shomen_uchi: TECHNIQUES_TANTO.filter(t => t.id.includes('shomen')).length,
  yokomen_uchi: TECHNIQUES_TANTO.filter(t => t.id.includes('yokomen')).length,
  chudan_tsuki: TECHNIQUES_TANTO.filter(t => t.id.includes('chudan')).length,
  jodan_tsuki: TECHNIQUES_TANTO.filter(t => t.id.includes('jodan')).length,
  immobilisations: TECHNIQUES_TANTO.filter(t => t.phase3.type === 'immobilisation').length,
  projections: TECHNIQUES_TANTO.filter(t => t.phase3.type === 'chute').length,
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getTantoByNiveau = (niveau: NiveauGrade): TechniqueArme[] => {
  return TECHNIQUES_TANTO.filter(t => t.niveau === niveau);
};

export const getTantoByAttaque = (type: string): TechniqueArme[] => {
  return TECHNIQUES_TANTO.filter(t => t.phase1.attaque.includes(type));
};

export default TECHNIQUES_TANTO;
