/**
 * AIKIDO@GAME — COMBINAISONS VALIDES (Programme Technique Traditionnel)
 * 
 * Ce fichier contient uniquement les combinaisons reconnues et pratiquées
 * dans le programme technique traditionnel de l'Aïkido.
 * 
 * Structure: Phase 1 (Entrée) → Phase 2 (Technique) → Phase 3 (Final)
 * 
 * Chaque combinaison est liée à la dimension philosophique via le fichier
 * aikidoPhilosophie.js — permettant à Maître Tanaka d'accompagner chaque
 * mouvement avec une parole de sagesse adaptée (enfants / adultes).
 */

import { getPhilosophieCombinaison, getTanakaParole } from './aikidoPhilosophie';

export const COMBINAISONS_VALIDES = [
  // ==========================================================================
  // AI HANMI KATATE DORI (Saisie en garde identique)
  // ==========================================================================
  
  // Ikkyo
  { id: "ahkd_ikkyo_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  { id: "ahkd_ikkyo_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  
  // Nikyo
  { id: "ahkd_nikyo_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "ahkd_nikyo_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Sankyo
  { id: "ahkd_sankyo_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "sankyo", direction: "omote" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "ahkd_sankyo_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Yonkyo
  { id: "ahkd_yonkyo_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },
  { id: "ahkd_yonkyo_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "yonkyo", direction: "ura" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },
  
  // Shiho Nage
  { id: "ahkd_shiho_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "ahkd_shiho_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Irimi Nage
  { id: "ahkd_irimi_omote", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "ahkd_irimi_ura", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "irimi_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "ahkd_kote_gaeshi", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Kaiten Nage
  { id: "ahkd_kaiten_uchi", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "kaiten_nage", direction: null, variant: "uchi" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "4e_kyu" },
  { id: "ahkd_kaiten_soto", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "kaiten_nage", direction: null, variant: "soto" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Kokyu Nage
  { id: "ahkd_kokyu_nage", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu" },

  // ==========================================================================
  // GYAKU HANMI KATATE DORI (Saisie en garde inverse)
  // ==========================================================================
  
  // Ikkyo
  { id: "ghkd_ikkyo_omote", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  { id: "ghkd_ikkyo_ura", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  
  // Nikyo
  { id: "ghkd_nikyo_omote", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "ghkd_nikyo_ura", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Sankyo
  { id: "ghkd_sankyo_omote", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "sankyo", direction: "omote" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "ghkd_sankyo_ura", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Shiho Nage
  { id: "ghkd_shiho_omote", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "ghkd_shiho_ura", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Irimi Nage
  { id: "ghkd_irimi_omote", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "ghkd_irimi_ura", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "irimi_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "ghkd_kote_gaeshi", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Kokyu Nage
  { id: "ghkd_kokyu_nage", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "kaiten_ukemi", type: "chute" }, kyu: "1er_kyu" },

  // ==========================================================================
  // KATATE DORI (Saisie d'un poignet)
  // ==========================================================================
  
  // Ikkyo
  { id: "kd_ikkyo_omote", phase1: { attaque: "katate_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  { id: "kd_ikkyo_ura", phase1: { attaque: "katate_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  
  // Nikyo
  { id: "kd_nikyo_omote", phase1: { attaque: "katate_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "kd_nikyo_ura", phase1: { attaque: "katate_dori", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "kd_kote_gaeshi", phase1: { attaque: "katate_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // SHOMEN UCHI (Frappe verticale descendante)
  // ==========================================================================
  
  // Ikkyo
  { id: "su_ikkyo_omote", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  { id: "su_ikkyo_ura", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "6e_kyu" },
  
  // Nikyo
  { id: "su_nikyo_omote", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "su_nikyo_ura", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Sankyo
  { id: "su_sankyo_omote", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "sankyo", direction: "omote" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "su_sankyo_ura", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Yonkyo
  { id: "su_yonkyo_omote", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },
  { id: "su_yonkyo_ura", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "yonkyo", direction: "ura" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },
  
  // Irimi Nage
  { id: "su_irimi_omote", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "su_irimi_ura", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "irimi_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "su_kote_gaeshi", phase1: { attaque: "shomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // YOKOMEN UCHI (Frappe latérale à la tempe)
  // ==========================================================================
  
  // Shiho Nage
  { id: "yu_shiho_omote", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "yu_shiho_ura", phase1: { attaque: "yokomen_uchi", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Irimi Nage
  { id: "yu_irimi_omote", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "yu_irimi_ura", phase1: { attaque: "yokomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "irimi_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "yu_kote_gaeshi", phase1: { attaque: "yokomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Gokyo (spécifique pour défense couteau)
  { id: "yu_gokyo_omote", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },
  { id: "yu_gokyo_ura", phase1: { attaque: "yokomen_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "gokyo", direction: "ura" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "3e_kyu" },

  // ==========================================================================
  // CHUDAN TSUKI (Coup de poing au ventre)
  // ==========================================================================
  
  // Ikkyo
  { id: "ct_ikkyo_omote", phase1: { attaque: "chudan_tsuki", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "ct_ikkyo_ura", phase1: { attaque: "chudan_tsuki", deplacement: "irimi_tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Irimi Nage
  { id: "ct_irimi", phase1: { attaque: "chudan_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "ct_kote_gaeshi", phase1: { attaque: "chudan_tsuki", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Kaiten Nage
  { id: "ct_kaiten_uchi", phase1: { attaque: "chudan_tsuki", deplacement: "irimi" }, phase2: { technique: "kaiten_nage", direction: null, variant: "uchi" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // JODAN TSUKI (Coup de poing au visage)
  // ==========================================================================
  
  // Ikkyo
  { id: "jt_ikkyo_omote", phase1: { attaque: "jodan_tsuki", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  
  // Irimi Nage
  { id: "jt_irimi", phase1: { attaque: "jodan_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kote Gaeshi
  { id: "jt_kote_gaeshi", phase1: { attaque: "jodan_tsuki", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // RYOTE DORI (Saisie des deux poignets)
  // ==========================================================================
  
  // Tenchi Nage
  { id: "rd_tenchi", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "tenchi_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Shiho Nage
  { id: "rd_shiho_omote", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "5e_kyu" },
  { id: "rd_shiho_ura", phase1: { attaque: "ryote_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu" },
  
  // Kokyu Nage
  { id: "rd_kokyu_nage", phase1: { attaque: "ryote_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu" },
  
  // Ikkyo
  { id: "rd_ikkyo_omote", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },
  { id: "rd_ikkyo_ura", phase1: { attaque: "ryote_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu" },

  // ==========================================================================
  // KATA DORI (Saisie de l'épaule)
  // ==========================================================================
  
  // Ikkyo
  { id: "kad_ikkyo_omote", phase1: { attaque: "kata_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "kad_ikkyo_ura", phase1: { attaque: "kata_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Nikyo
  { id: "kad_nikyo_omote", phase1: { attaque: "kata_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "kad_nikyo_ura", phase1: { attaque: "kata_dori", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Irimi Nage
  { id: "kad_irimi", phase1: { attaque: "kata_dori", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // MUNE DORI (Saisie du revers)
  // ==========================================================================
  
  // Ikkyo
  { id: "md_ikkyo_omote", phase1: { attaque: "mune_dori", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "md_ikkyo_ura", phase1: { attaque: "mune_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Kote Gaeshi
  { id: "md_kote_gaeshi", phase1: { attaque: "mune_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Kokyu Nage
  { id: "md_kokyu_nage", phase1: { attaque: "mune_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu" },

  // ==========================================================================
  // KATA DORI MEN UCHI (Saisie épaule + frappe)
  // ==========================================================================
  
  // Ikkyo
  { id: "kdmu_ikkyo_omote", phase1: { attaque: "kata_dori_men_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  { id: "kdmu_ikkyo_ura", phase1: { attaque: "kata_dori_men_uchi", deplacement: "irimi_tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Nikyo
  { id: "kdmu_nikyo_omote", phase1: { attaque: "kata_dori_men_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "4e_kyu" },
  
  // Shiho Nage
  { id: "kdmu_shiho_omote", phase1: { attaque: "kata_dori_men_uchi", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "4e_kyu" },
  
  // Irimi Nage
  { id: "kdmu_irimi", phase1: { attaque: "kata_dori_men_uchi", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "4e_kyu" },

  // ==========================================================================
  // USHIRO RYOTE DORI (Saisie arrière des deux poignets)
  // ==========================================================================
  
  // Ikkyo
  { id: "urd_ikkyo", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "2e_kyu" },
  
  // Shiho Nage
  { id: "urd_shiho", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu" },
  
  // Kote Gaeshi
  { id: "urd_kote_gaeshi", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "2e_kyu" },
  
  // Sankyo
  { id: "urd_sankyo", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "2e_kyu" },
  
  // Kokyu Nage
  { id: "urd_kokyu_nage", phase1: { attaque: "ushiro_ryote_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "kaiten_ukemi", type: "chute" }, kyu: "2e_kyu" },

  // ==========================================================================
  // USHIRO KUBI SHIME (Étranglement arrière)
  // ==========================================================================
  
  // Kote Gaeshi
  { id: "uks_kote_gaeshi", phase1: { attaque: "ushiro_kubi_shime", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "2e_kyu" },
  
  // Irimi Nage
  { id: "uks_irimi", phase1: { attaque: "ushiro_kubi_shime", deplacement: "irimi_tenkan" }, phase2: { technique: "irimi_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu" },
  
  // Kokyu Nage
  { id: "uks_kokyu_nage", phase1: { attaque: "ushiro_kubi_shime", deplacement: "irimi" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu" },

  // ==========================================================================
  // TANTO DORI (Défense contre couteau)
  // ==========================================================================
  
  // Gokyo (technique privilégiée contre arme)
  { id: "td_gokyo_omote", phase1: { attaque: "tanto_dori", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu" },
  { id: "td_gokyo_ura", phase1: { attaque: "tanto_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "gokyo", direction: "ura" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu" },
  
  // Kote Gaeshi
  { id: "td_kote_gaeshi", phase1: { attaque: "tanto_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "2e_kyu" },
  
  // Shiho Nage
  { id: "td_shiho", phase1: { attaque: "tanto_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "2e_kyu" },

  // ==========================================================================
  // PROJECTIONS AVANCÉES (3e Kyu et plus)
  // ==========================================================================
  
  // Koshi Nage (Projection de hanche)
  { id: "ghkd_koshi_nage", phase1: { attaque: "gyaku_hanmi_katate_dori", deplacement: "irimi" }, phase2: { technique: "koshi_nage", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "3e_kyu" },
  { id: "su_koshi_nage", phase1: { attaque: "shomen_uchi", deplacement: "irimi" }, phase2: { technique: "koshi_nage", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "3e_kyu" },
  
  // Sumi Otoshi (Projection dans l'angle)
  { id: "ahkd_sumi_otoshi", phase1: { attaque: "ai_hanmi_katate_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "sumi_otoshi", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "3e_kyu" },
  { id: "rd_sumi_otoshi", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "sumi_otoshi", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "3e_kyu" },
  
  // Aiki Otoshi
  { id: "rd_aiki_otoshi", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "aiki_otoshi", direction: null }, phase3: { final: "yoko_ukemi", type: "chute" }, kyu: "3e_kyu" },

  // ==========================================================================
  // ██████╗  █████╗ ███╗   ██╗    ██╗      ███████╗██╗   ██╗███████╗██╗     ███████╗
  // ██╔══██╗██╔══██╗████╗  ██║    ██║      ██╔════╝██║   ██║██╔════╝██║     ██╔════╝
  // ██║  ██║███████║██╔██╗ ██║    ██║      █████╗  ██║   ██║█████╗  ██║     ███████╗
  // ██║  ██║██╔══██║██║╚██╗██║    ██║      ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ╚════██║
  // ██████╔╝██║  ██║██║ ╚████║    ███████╗ ███████╗ ╚████╔╝ ███████╗███████╗███████║
  // ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝╚══════╝
  // ==========================================================================

  // ==========================================================================
  // SHODAN (1er Dan) - Début de la maîtrise
  // Corps qui commence à répondre aux commandements
  // ==========================================================================
  
  // Suwariwaza (à genoux) - Maîtrise complète
  { id: "shodan_sw_ikkyo_omote", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_ikkyo_ura", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_nikyo", phase1: { attaque: "suwariwaza_katate_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_sankyo", phase1: { attaque: "suwariwaza_katate_dori", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_yonkyo", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_kokyu_ho", phase1: { attaque: "suwariwaza_ryote_dori", deplacement: "kokyu" }, phase2: { technique: "kokyu_ho", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan" },
  
  // Randori 2 adversaires
  { id: "shodan_randori_2", phase1: { attaque: "randori_futari", deplacement: "tai_sabaki" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "shodan" },
  
  // Tanto Dori - Défense couteau
  { id: "shodan_tanto_ikkyo", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_tanto_kote", phase1: { attaque: "tanto_yokomen", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "shodan" },
  
  // Jo Dori - Défense bâton
  { id: "shodan_jo_dori_irimi", phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan" },
  { id: "shodan_jo_nage", phase1: { attaque: "jo_shomen", deplacement: "tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "shodan" },

  // ==========================================================================
  // NIDAN (2e Dan) - Rapidité et puissance
  // Plus grande détermination mentale
  // ==========================================================================
  
  // Tachiwaza avancé - Fluidité accrue
  { id: "nidan_tw_ikkyo_kaeshi", phase1: { attaque: "shomen_uchi", deplacement: "kaeshi" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tw_nikyo_henka", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "henka" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tw_sankyo_nagare", phase1: { attaque: "katate_dori", deplacement: "nagare" }, phase2: { technique: "sankyo", direction: null }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "nidan" },
  
  // Ushiro Waza complet
  { id: "nidan_ushiro_ryote_ikkyo", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_ushiro_ryokata_shiho", phase1: { attaque: "ushiro_ryokata_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },
  { id: "nidan_ushiro_kubi_kokyu", phase1: { attaque: "ushiro_kubi_shime", deplacement: "kokyu" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "nidan" },
  
  // Randori 2 adversaires avec engagement
  { id: "nidan_randori_2_ki", phase1: { attaque: "randori_futari", deplacement: "irimi_tenkan" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "nidan" },
  
  // Tanto Dori avancé
  { id: "nidan_tanto_shiho", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tanto_kaiten", phase1: { attaque: "tanto_tsuki", deplacement: "tenkan" }, phase2: { technique: "kaiten_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },
  
  // Jo Dori avancé
  { id: "nidan_jo_shiho", phase1: { attaque: "jo_yokomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },

  // ==========================================================================
  // SANDAN (3e Dan) - Compréhension du Kokyu Ryoku
  // Entrée dans la dimension spirituelle
  // ==========================================================================
  
  // Grande maîtrise d'Irimi
  { id: "sandan_irimi_pure", phase1: { attaque: "shomen_uchi", deplacement: "irimi_direct" }, phase2: { technique: "irimi_nage", direction: "soku" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "sandan" },
  { id: "sandan_irimi_kokyu", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "sandan" },
  
  // Ma-ai - Juste distance
  { id: "sandan_maai_kote", phase1: { attaque: "chudan_tsuki", deplacement: "maai" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "sandan" },
  
  // Rythme du mouvement
  { id: "sandan_rhythm_jiyu", phase1: { attaque: "jiyu_waza", deplacement: "nagare" }, phase2: { technique: "kaeshi_waza", direction: null }, phase3: { final: "ukemi", type: "chute" }, kyu: "sandan" },
  
  // Randori 3 adversaires
  { id: "sandan_randori_3", phase1: { attaque: "randori_sannin", deplacement: "tai_sabaki" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "sandan" },
  
  // Tachi Dori (Défense sabre)
  { id: "sandan_tachi_dori_irimi", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "sandan" },
  { id: "sandan_tachi_dori_kote", phase1: { attaque: "tachi_yokomen", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "sandan" },
  
  // Kumitachi (Sabre à deux)
  { id: "sandan_kumitachi_1", phase1: { attaque: "kumitachi_ichi", deplacement: "awase" }, phase2: { technique: "ken_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "sandan" },
  { id: "sandan_kumitachi_2", phase1: { attaque: "kumitachi_ni", deplacement: "awase" }, phase2: { technique: "ken_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "sandan" },
  
  // Kumijo (Bâton à deux)
  { id: "sandan_kumijo_1", phase1: { attaque: "kumijo_ichi", deplacement: "awase" }, phase2: { technique: "jo_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "sandan" },
  { id: "sandan_kumijo_2", phase1: { attaque: "kumijo_ni", deplacement: "awase" }, phase2: { technique: "jo_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "sandan" },

  // ==========================================================================
  // YONDAN (4e Dan) - Principes qui régissent les techniques
  // Niveau techniquement avancé
  // ==========================================================================
  
  // Liberté totale Suwariwaza
  { id: "yondan_sw_jiyu_ikkyo", phase1: { attaque: "suwariwaza_jiyu", deplacement: "awase" }, phase2: { technique: "ikkyo", direction: "henka" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "yondan" },
  { id: "yondan_sw_jiyu_nikyo", phase1: { attaque: "suwariwaza_jiyu", deplacement: "awase" }, phase2: { technique: "nikyo", direction: "henka" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "yondan" },
  
  // Futari Dori (Saisie par deux)
  { id: "yondan_futari_dori_1", phase1: { attaque: "futari_dori", deplacement: "tai_sabaki" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "yondan" },
  { id: "yondan_futari_dori_2", phase1: { attaque: "futari_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "yondan" },
  
  // Randori 3 adversaires - Maîtrise
  { id: "yondan_randori_3_mastery", phase1: { attaque: "randori_sannin", deplacement: "nagare" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "yondan" },
  
  // Tanto Dori complet
  { id: "yondan_tanto_irimi", phase1: { attaque: "tanto_jiyu", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "soku" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "yondan" },
  { id: "yondan_tanto_kokyu", phase1: { attaque: "tanto_jiyu", deplacement: "kokyu" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "yondan" },
  
  // Jo complet
  { id: "yondan_jo_kokyu", phase1: { attaque: "jo_jiyu", deplacement: "kokyu" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "yondan" },
  { id: "yondan_jo_koshi", phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, phase2: { technique: "koshi_nage", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "yondan" },
  
  // Tachi Dori complet
  { id: "yondan_tachi_shiho", phase1: { attaque: "tachi_jiyu", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "yondan" },
  { id: "yondan_tachi_kokyu", phase1: { attaque: "tachi_jiyu", deplacement: "kokyu" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "yondan" },
  
  // Kumitachi avancé
  { id: "yondan_kumitachi_3", phase1: { attaque: "kumitachi_san", deplacement: "awase" }, phase2: { technique: "ken_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "yondan" },
  { id: "yondan_kumitachi_4", phase1: { attaque: "kumitachi_yon", deplacement: "awase" }, phase2: { technique: "ken_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "yondan" },
  
  // Kumijo avancé
  { id: "yondan_kumijo_3", phase1: { attaque: "kumijo_san", deplacement: "awase" }, phase2: { technique: "jo_no_ri", direction: null }, phase3: { final: "zanshin", type: "arme" }, kyu: "yondan" },

  // ==========================================================================
  // ██╗    ██╗███████╗ █████╗ ██████╗  ██████╗ ███╗   ██╗███████╗
  // ██║    ██║██╔════╝██╔══██╗██╔══██╗██╔═══██╗████╗  ██║██╔════╝
  // ██║ █╗ ██║█████╗  ███████║██████╔╝██║   ██║██╔██╗ ██║███████╗
  // ██║███╗██║██╔══╝  ██╔══██║██╔═══╝ ██║   ██║██║╚██╗██║╚════██║
  // ╚███╔███╔╝███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║███████║
  //  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝
  // BUKI WAZA - TECHNIQUES AVEC ARMES
  // ==========================================================================

  // ==========================================================================
  // JO (Bâton) - 31 SUBURI FONDAMENTAUX
  // ==========================================================================
  
  // Jo Suburi - Mouvements de base au bâton
  { id: "jo_suburi_1", phase1: { attaque: null, deplacement: "choku_tsuki" }, phase2: { technique: "jo_suburi", direction: "tsuki_1" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "jo" },
  { id: "jo_suburi_2", phase1: { attaque: null, deplacement: "kaeshi_tsuki" }, phase2: { technique: "jo_suburi", direction: "tsuki_2" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "jo" },
  { id: "jo_suburi_3", phase1: { attaque: null, deplacement: "ushiro_tsuki" }, phase2: { technique: "jo_suburi", direction: "tsuki_3" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "jo" },
  { id: "jo_suburi_4", phase1: { attaque: null, deplacement: "tsuki_gedan_gaeshi" }, phase2: { technique: "jo_suburi", direction: "tsuki_4" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "jo" },
  { id: "jo_suburi_5", phase1: { attaque: null, deplacement: "tsuki_jodan_gaeshi" }, phase2: { technique: "jo_suburi", direction: "tsuki_5" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "jo" },
  
  { id: "jo_suburi_6", phase1: { attaque: null, deplacement: "shomen_uchi" }, phase2: { technique: "jo_suburi", direction: "uchi_1" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "jo" },
  { id: "jo_suburi_7", phase1: { attaque: null, deplacement: "renzoku_uchi" }, phase2: { technique: "jo_suburi", direction: "uchi_2" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "jo" },
  { id: "jo_suburi_8", phase1: { attaque: null, deplacement: "menuchi_gedan_gaeshi" }, phase2: { technique: "jo_suburi", direction: "uchi_3" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "jo" },
  { id: "jo_suburi_9", phase1: { attaque: null, deplacement: "menuchi_ushiro_tsuki" }, phase2: { technique: "jo_suburi", direction: "uchi_4" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "jo" },
  { id: "jo_suburi_10", phase1: { attaque: null, deplacement: "gyaku_yokomen" }, phase2: { technique: "jo_suburi", direction: "uchi_5" }, phase3: { final: "kamae", type: "suburi" }, kyu: "3e_kyu", categorie: "jo" },
  
  { id: "jo_suburi_11", phase1: { attaque: null, deplacement: "katate_gedan_gaeshi" }, phase2: { technique: "jo_suburi", direction: "katate_1" }, phase3: { final: "kamae", type: "suburi" }, kyu: "3e_kyu", categorie: "jo" },
  { id: "jo_suburi_12", phase1: { attaque: null, deplacement: "katate_toma_uchi" }, phase2: { technique: "jo_suburi", direction: "katate_2" }, phase3: { final: "kamae", type: "suburi" }, kyu: "3e_kyu", categorie: "jo" },
  { id: "jo_suburi_13", phase1: { attaque: null, deplacement: "katate_hachi_no_ji" }, phase2: { technique: "jo_suburi", direction: "katate_3" }, phase3: { final: "kamae", type: "suburi" }, kyu: "2e_kyu", categorie: "jo" },
  
  { id: "jo_suburi_14", phase1: { attaque: null, deplacement: "hasso_gaeshi_uchi" }, phase2: { technique: "jo_suburi", direction: "hasso_1" }, phase3: { final: "kamae", type: "suburi" }, kyu: "2e_kyu", categorie: "jo" },
  { id: "jo_suburi_15", phase1: { attaque: null, deplacement: "hasso_gaeshi_tsuki" }, phase2: { technique: "jo_suburi", direction: "hasso_2" }, phase3: { final: "kamae", type: "suburi" }, kyu: "2e_kyu", categorie: "jo" },
  { id: "jo_suburi_16", phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_tsuki" }, phase2: { technique: "jo_suburi", direction: "hasso_3" }, phase3: { final: "kamae", type: "suburi" }, kyu: "1er_kyu", categorie: "jo" },
  { id: "jo_suburi_17", phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_uchi" }, phase2: { technique: "jo_suburi", direction: "hasso_4" }, phase3: { final: "kamae", type: "suburi" }, kyu: "1er_kyu", categorie: "jo" },
  { id: "jo_suburi_18", phase1: { attaque: null, deplacement: "hasso_gaeshi_ushiro_barai" }, phase2: { technique: "jo_suburi", direction: "hasso_5" }, phase3: { final: "kamae", type: "suburi" }, kyu: "1er_kyu", categorie: "jo" },
  
  { id: "jo_suburi_19", phase1: { attaque: null, deplacement: "hidari_nagare_gaeshi" }, phase2: { technique: "jo_suburi", direction: "nagare_1" }, phase3: { final: "kamae", type: "suburi" }, kyu: "1er_kyu", categorie: "jo" },
  { id: "jo_suburi_20", phase1: { attaque: null, deplacement: "migi_nagare_gaeshi" }, phase2: { technique: "jo_suburi", direction: "nagare_2" }, phase3: { final: "kamae", type: "suburi" }, kyu: "1er_kyu", categorie: "jo" },

  // ==========================================================================
  // JO KATA - Formes avec bâton
  // ==========================================================================
  
  { id: "jo_kata_31", phase1: { attaque: null, deplacement: "kata" }, phase2: { technique: "31_jo_kata", direction: null }, phase3: { final: "zanshin", type: "kata" }, kyu: "3e_kyu", categorie: "jo" },
  { id: "jo_kata_13", phase1: { attaque: null, deplacement: "kata" }, phase2: { technique: "13_jo_kata", direction: null }, phase3: { final: "zanshin", type: "kata" }, kyu: "4e_kyu", categorie: "jo" },
  { id: "jo_kata_22", phase1: { attaque: null, deplacement: "kata" }, phase2: { technique: "22_jo_kata", direction: null }, phase3: { final: "zanshin", type: "kata" }, kyu: "2e_kyu", categorie: "jo" },

  // ==========================================================================
  // KUMI JO - Exercices à deux avec bâton
  // ==========================================================================
  
  { id: "kumijo_1", phase1: { attaque: "kumijo_ichi", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "3e_kyu", categorie: "jo" },
  { id: "kumijo_2", phase1: { attaque: "kumijo_ni", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "3e_kyu", categorie: "jo" },
  { id: "kumijo_3", phase1: { attaque: "kumijo_san", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "2e_kyu", categorie: "jo" },
  { id: "kumijo_4", phase1: { attaque: "kumijo_yon", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "2e_kyu", categorie: "jo" },
  { id: "kumijo_5", phase1: { attaque: "kumijo_go", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "1er_kyu", categorie: "jo" },
  { id: "kumijo_6", phase1: { attaque: "kumijo_roku", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "1er_kyu", categorie: "jo" },
  { id: "kumijo_7", phase1: { attaque: "kumijo_nana", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "shodan", categorie: "jo" },
  { id: "kumijo_8", phase1: { attaque: "kumijo_hachi", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "shodan", categorie: "jo" },
  { id: "kumijo_9", phase1: { attaque: "kumijo_kyu", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "nidan", categorie: "jo" },
  { id: "kumijo_10", phase1: { attaque: "kumijo_ju", deplacement: "awase" }, phase2: { technique: "jo_awase", direction: null }, phase3: { final: "zanshin", type: "kumijo" }, kyu: "nidan", categorie: "jo" },

  // ==========================================================================
  // JO DORI - Défense contre attaque au bâton
  // ==========================================================================
  
  { id: "jo_dori_shomen_ikkyo", phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "jo_dori" },
  { id: "jo_dori_shomen_nikyo", phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "jo_dori" },
  { id: "jo_dori_shomen_sankyo", phase1: { attaque: "jo_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "jo_dori" },
  { id: "jo_dori_shomen_yonkyo", phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "jo_dori" },
  { id: "jo_dori_shomen_gokyo", phase1: { attaque: "jo_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "jo_dori" },
  { id: "jo_dori_tsuki_irimi", phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu", categorie: "jo_dori" },
  { id: "jo_dori_tsuki_kote", phase1: { attaque: "jo_tsuki", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "2e_kyu", categorie: "jo_dori" },
  { id: "jo_dori_tsuki_shiho", phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "jo_dori" },
  { id: "jo_dori_yokomen_shiho", phase1: { attaque: "jo_yokomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "jo_dori" },
  { id: "jo_dori_yokomen_kokyu", phase1: { attaque: "jo_yokomen", deplacement: "tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan", categorie: "jo_dori" },

  // ==========================================================================
  // JO NAGE - Projection avec le bâton
  // ==========================================================================
  
  { id: "jo_nage_tsuki_1", phase1: { attaque: "katate_dori", deplacement: "jo_tsuki" }, phase2: { technique: "jo_nage", direction: "tsuki" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu", categorie: "jo_nage" },
  { id: "jo_nage_gaeshi_1", phase1: { attaque: "katate_dori", deplacement: "jo_gaeshi" }, phase2: { technique: "jo_nage", direction: "gaeshi" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "jo_nage" },
  { id: "jo_nage_uchi_1", phase1: { attaque: "ryote_dori", deplacement: "jo_uchi" }, phase2: { technique: "jo_nage", direction: "uchi" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "jo_nage" },

  // ==========================================================================
  // BOKKEN / KEN (Sabre en bois) - SUBURI FONDAMENTAUX
  // ==========================================================================
  
  // Ken Suburi - 7 mouvements de base
  { id: "ken_suburi_1", phase1: { attaque: null, deplacement: "shomen_uchi" }, phase2: { technique: "ken_suburi", direction: "ichi" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "bokken" },
  { id: "ken_suburi_2", phase1: { attaque: null, deplacement: "shomen_uchi_zenpo" }, phase2: { technique: "ken_suburi", direction: "ni" }, phase3: { final: "kamae", type: "suburi" }, kyu: "5e_kyu", categorie: "bokken" },
  { id: "ken_suburi_3", phase1: { attaque: null, deplacement: "shomen_uchi_kotai" }, phase2: { technique: "ken_suburi", direction: "san" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "bokken" },
  { id: "ken_suburi_4", phase1: { attaque: null, deplacement: "shomen_uchi_zenpo_kotai" }, phase2: { technique: "ken_suburi", direction: "yon" }, phase3: { final: "kamae", type: "suburi" }, kyu: "4e_kyu", categorie: "bokken" },
  { id: "ken_suburi_5", phase1: { attaque: null, deplacement: "yokomen_uchi_zenpo" }, phase2: { technique: "ken_suburi", direction: "go" }, phase3: { final: "kamae", type: "suburi" }, kyu: "3e_kyu", categorie: "bokken" },
  { id: "ken_suburi_6", phase1: { attaque: null, deplacement: "yokomen_uchi_kotai" }, phase2: { technique: "ken_suburi", direction: "roku" }, phase3: { final: "kamae", type: "suburi" }, kyu: "3e_kyu", categorie: "bokken" },
  { id: "ken_suburi_7", phase1: { attaque: null, deplacement: "yokomen_uchi_zenpo_kotai" }, phase2: { technique: "ken_suburi", direction: "nana" }, phase3: { final: "kamae", type: "suburi" }, kyu: "2e_kyu", categorie: "bokken" },

  // ==========================================================================
  // KUMI TACHI - Exercices à deux avec sabre
  // ==========================================================================
  
  { id: "kumitachi_1", phase1: { attaque: "kumitachi_ichi", deplacement: "awase" }, phase2: { technique: "ken_awase", direction: null }, phase3: { final: "zanshin", type: "kumitachi" }, kyu: "3e_kyu", categorie: "bokken" },
  { id: "kumitachi_2", phase1: { attaque: "kumitachi_ni", deplacement: "awase" }, phase2: { technique: "ken_awase", direction: null }, phase3: { final: "zanshin", type: "kumitachi" }, kyu: "3e_kyu", categorie: "bokken" },
  { id: "kumitachi_3", phase1: { attaque: "kumitachi_san", deplacement: "awase" }, phase2: { technique: "ken_awase", direction: null }, phase3: { final: "zanshin", type: "kumitachi" }, kyu: "2e_kyu", categorie: "bokken" },
  { id: "kumitachi_4", phase1: { attaque: "kumitachi_yon", deplacement: "awase" }, phase2: { technique: "ken_awase", direction: null }, phase3: { final: "zanshin", type: "kumitachi" }, kyu: "2e_kyu", categorie: "bokken" },
  { id: "kumitachi_5", phase1: { attaque: "kumitachi_go", deplacement: "awase" }, phase2: { technique: "ken_awase", direction: null }, phase3: { final: "zanshin", type: "kumitachi" }, kyu: "1er_kyu", categorie: "bokken" },

  // ==========================================================================
  // TACHI DORI - Défense contre attaque au sabre
  // ==========================================================================
  
  { id: "tachi_dori_shomen_ikkyo", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_nikyo", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_sankyo", phase1: { attaque: "tachi_shomen", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_yonkyo", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_gokyo", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_irimi", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_shiho", phase1: { attaque: "tachi_shomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "tachi_dori" },
  { id: "tachi_dori_shomen_kote", phase1: { attaque: "tachi_shomen", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "tachi_dori" },
  { id: "tachi_dori_yokomen_shiho", phase1: { attaque: "tachi_yokomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_yokomen_irimi", phase1: { attaque: "tachi_yokomen", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan", categorie: "tachi_dori" },
  { id: "tachi_dori_tsuki_irimi", phase1: { attaque: "tachi_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "nidan", categorie: "tachi_dori" },
  { id: "tachi_dori_tsuki_kote", phase1: { attaque: "tachi_tsuki", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "nidan", categorie: "tachi_dori" },

  // ==========================================================================
  // TANTO DORI - Défense contre couteau (complet)
  // ==========================================================================
  
  // Shomen Uchi (frappe descendante avec couteau)
  { id: "tanto_dori_shomen_ikkyo_o", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_ikkyo_u", phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_nikyo_o", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_nikyo_u", phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_sankyo", phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_gokyo_o", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_gokyo_u", phase1: { attaque: "tanto_shomen", deplacement: "irimi_tenkan" }, phase2: { technique: "gokyo", direction: "ura" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_shiho_o", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_shomen_shiho_u", phase1: { attaque: "tanto_shomen", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  
  // Yokomen Uchi (frappe latérale avec couteau)
  { id: "tanto_dori_yokomen_gokyo_o", phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_yokomen_gokyo_u", phase1: { attaque: "tanto_yokomen", deplacement: "irimi_tenkan" }, phase2: { technique: "gokyo", direction: "ura" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_yokomen_shiho", phase1: { attaque: "tanto_yokomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_yokomen_kote", phase1: { attaque: "tanto_yokomen", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  
  // Tsuki (piqué avec couteau)
  { id: "tanto_dori_tsuki_ikkyo", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_nikyo", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_sankyo", phase1: { attaque: "tanto_tsuki", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_gokyo", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "gokyo", direction: "omote" }, phase3: { final: "gokyo_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_kote", phase1: { attaque: "tanto_tsuki", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_irimi", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_kaiten", phase1: { attaque: "tanto_tsuki", deplacement: "tenkan" }, phase2: { technique: "kaiten_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "tanto_dori" },
  { id: "tanto_dori_tsuki_hiji", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "hiji_kime_osae", direction: null }, phase3: { final: "hiji_osae", type: "immobilisation" }, kyu: "shodan", categorie: "tanto_dori" },

  // ==========================================================================
  // ████████╗ █████╗ ██╗    ███████╗ █████╗ ██████╗  █████╗ ██╗  ██╗██╗
  //    ██╔══╝██╔══██╗██║    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝██║
  //    ██║   ███████║██║    ███████╗███████║██████╔╝███████║█████╔╝ ██║
  //    ██║   ██╔══██║██║    ╚════██║██╔══██║██╔══██╗██╔══██║██╔═██╗ ██║
  //    ██║   ██║  ██║██║    ███████║██║  ██║██████╔╝██║  ██║██║  ██╗██║
  //    ╚═╝   ╚═╝  ╚═╝╚═╝    ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
  // TAI SABAKI - DÉPLACEMENTS CORPORELS
  // ==========================================================================
  
  { id: "tai_sabaki_irimi", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "tai_sabaki", direction: "avant" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "6e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_tenkan", phase1: { attaque: null, deplacement: "tenkan" }, phase2: { technique: "tai_sabaki", direction: "pivot" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "6e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_irimi_tenkan", phase1: { attaque: null, deplacement: "irimi_tenkan" }, phase2: { technique: "tai_sabaki", direction: "entree_pivot" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "6e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_kaiten", phase1: { attaque: null, deplacement: "kaiten" }, phase2: { technique: "tai_sabaki", direction: "rotation" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "5e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_tenshin", phase1: { attaque: null, deplacement: "tenshin" }, phase2: { technique: "tai_sabaki", direction: "diagonal" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "5e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_sokumen", phase1: { attaque: null, deplacement: "sokumen" }, phase2: { technique: "tai_sabaki", direction: "lateral" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "4e_kyu", categorie: "tai_sabaki" },
  { id: "tai_sabaki_ushiro", phase1: { attaque: null, deplacement: "ushiro" }, phase2: { technique: "tai_sabaki", direction: "arriere" }, phase3: { final: "kamae", type: "deplacement" }, kyu: "4e_kyu", categorie: "tai_sabaki" },

  // ==========================================================================
  // UKEMI - CHUTES
  // ==========================================================================
  
  { id: "ukemi_mae", phase1: { attaque: null, deplacement: "avant" }, phase2: { technique: "mae_ukemi", direction: "avant" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "6e_kyu", categorie: "ukemi" },
  { id: "ukemi_ushiro", phase1: { attaque: null, deplacement: "arriere" }, phase2: { technique: "ushiro_ukemi", direction: "arriere" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "6e_kyu", categorie: "ukemi" },
  { id: "ukemi_yoko", phase1: { attaque: null, deplacement: "lateral" }, phase2: { technique: "yoko_ukemi", direction: "cote" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "5e_kyu", categorie: "ukemi" },
  { id: "ukemi_zenpo_kaiten", phase1: { attaque: null, deplacement: "roulade_avant" }, phase2: { technique: "zenpo_kaiten_ukemi", direction: "avant" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "6e_kyu", categorie: "ukemi" },
  { id: "ukemi_koho_kaiten", phase1: { attaque: null, deplacement: "roulade_arriere" }, phase2: { technique: "koho_kaiten_ukemi", direction: "arriere" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "5e_kyu", categorie: "ukemi" },
  { id: "ukemi_tobi", phase1: { attaque: null, deplacement: "saut" }, phase2: { technique: "tobi_ukemi", direction: "aerien" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "3e_kyu", categorie: "ukemi" },
  { id: "ukemi_mae_tobi", phase1: { attaque: null, deplacement: "plongeon" }, phase2: { technique: "mae_tobi_ukemi", direction: "avant_aerien" }, phase3: { final: "tachi", type: "ukemi" }, kyu: "2e_kyu", categorie: "ukemi" },

  // ==========================================================================
  // KAMAE - POSTURES / GARDES
  // ==========================================================================
  
  { id: "kamae_ai_hanmi", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "ai_hanmi" }, phase3: { final: "garde", type: "kamae" }, kyu: "6e_kyu", categorie: "kamae" },
  { id: "kamae_gyaku_hanmi", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "gyaku_hanmi" }, phase3: { final: "garde", type: "kamae" }, kyu: "6e_kyu", categorie: "kamae" },
  { id: "kamae_hidari", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "hidari" }, phase3: { final: "garde", type: "kamae" }, kyu: "6e_kyu", categorie: "kamae" },
  { id: "kamae_migi", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "migi" }, phase3: { final: "garde", type: "kamae" }, kyu: "6e_kyu", categorie: "kamae" },
  { id: "kamae_seiza", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "seiza" }, phase3: { final: "assis", type: "kamae" }, kyu: "6e_kyu", categorie: "kamae" },
  { id: "kamae_hanmi_handachi", phase1: { attaque: null, deplacement: null }, phase2: { technique: "kamae", direction: "hanmi_handachi" }, phase3: { final: "semi_debout", type: "kamae" }, kyu: "4e_kyu", categorie: "kamae" },

  // ==========================================================================
  // ATEMI WAZA - TECHNIQUES DE FRAPPE
  // ==========================================================================
  
  { id: "atemi_shomen_uchi", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "atemi", direction: "shomen" }, phase3: { final: "kamae", type: "atemi" }, kyu: "5e_kyu", categorie: "atemi" },
  { id: "atemi_yokomen_uchi", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "atemi", direction: "yokomen" }, phase3: { final: "kamae", type: "atemi" }, kyu: "5e_kyu", categorie: "atemi" },
  { id: "atemi_tsuki_chudan", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "atemi", direction: "chudan" }, phase3: { final: "kamae", type: "atemi" }, kyu: "5e_kyu", categorie: "atemi" },
  { id: "atemi_tsuki_jodan", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "atemi", direction: "jodan" }, phase3: { final: "kamae", type: "atemi" }, kyu: "4e_kyu", categorie: "atemi" },
  { id: "atemi_gedan", phase1: { attaque: null, deplacement: "irimi" }, phase2: { technique: "atemi", direction: "gedan" }, phase3: { final: "kamae", type: "atemi" }, kyu: "4e_kyu", categorie: "atemi" },

  // ==========================================================================
  // TECHNIQUES AVANCÉES ET VARIATIONS
  // ==========================================================================
  
  // Hiji Waza (techniques de coude)
  { id: "hiji_kime_osae", phase1: { attaque: "katate_dori", deplacement: "irimi" }, phase2: { technique: "hiji_kime_osae", direction: null }, phase3: { final: "hiji_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "hiji_waza" },
  { id: "hiji_garami", phase1: { attaque: "kata_dori", deplacement: "irimi" }, phase2: { technique: "hiji_garami", direction: null }, phase3: { final: "hiji_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "hiji_waza" },
  
  // Ude Garami (clé de bras)
  { id: "ude_garami", phase1: { attaque: "ryote_dori", deplacement: "tenkan" }, phase2: { technique: "ude_garami", direction: null }, phase3: { final: "ude_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "kansetsu_waza" },
  { id: "ude_kime_nage", phase1: { attaque: "katate_dori", deplacement: "irimi" }, phase2: { technique: "ude_kime_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "1er_kyu", categorie: "kansetsu_waza" },
  
  // Juji Garami (clé en croix)
  { id: "juji_garami", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "juji_garami", direction: null }, phase3: { final: "juji_osae", type: "immobilisation" }, kyu: "1er_kyu", categorie: "kansetsu_waza" },
  { id: "juji_nage", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "juji_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan", categorie: "kansetsu_waza" },

  // ==========================================================================
  // SUWARIWAZA - TECHNIQUES À GENOUX
  // ==========================================================================
  
  { id: "sw_shomen_ikkyo_o", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_ikkyo_u", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "5e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_nikyo_o", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "4e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_nikyo_u", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "nikyo", direction: "ura" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "4e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_sankyo_o", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "sankyo", direction: "omote" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "3e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_sankyo_u", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "3e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_yonkyo_o", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "suwariwaza" },
  { id: "sw_shomen_yonkyo_u", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "yonkyo", direction: "ura" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "2e_kyu", categorie: "suwariwaza" },
  { id: "sw_katate_kote", phase1: { attaque: "suwariwaza_katate_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "3e_kyu", categorie: "suwariwaza" },
  { id: "sw_ryote_kokyu_ho", phase1: { attaque: "suwariwaza_ryote_dori", deplacement: "kokyu" }, phase2: { technique: "kokyu_ho", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "6e_kyu", categorie: "suwariwaza" },

  // ==========================================================================
  // HANMI HANDACHI - Semi-debout vs debout
  // ==========================================================================
  
  { id: "hh_katate_shiho_o", phase1: { attaque: "hh_katate_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "3e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_katate_shiho_u", phase1: { attaque: "hh_katate_dori", deplacement: "tenkan" }, phase2: { technique: "shiho_nage", direction: "ura" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "3e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_katate_kote", phase1: { attaque: "hh_katate_dori", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "3e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_katate_irimi", phase1: { attaque: "hh_katate_dori", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_katate_kaiten", phase1: { attaque: "hh_katate_dori", deplacement: "kaiten" }, phase2: { technique: "kaiten_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "2e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_shomen_ikkyo_o", phase1: { attaque: "hh_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "3e_kyu", categorie: "hanmi_handachi" },
  { id: "hh_shomen_ikkyo_u", phase1: { attaque: "hh_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "3e_kyu", categorie: "hanmi_handachi" },

  // ==========================================================================
  // KOKYU WAZA - Techniques de respiration/énergie
  // ==========================================================================
  
  { id: "kokyu_dosa", phase1: { attaque: "ryote_dori", deplacement: "kokyu" }, phase2: { technique: "kokyu_dosa", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "6e_kyu", categorie: "kokyu_waza" },
  { id: "kokyu_ho_tachi", phase1: { attaque: "ryote_dori", deplacement: "irimi" }, phase2: { technique: "kokyu_ho", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "5e_kyu", categorie: "kokyu_waza" },
  { id: "morote_kokyu_nage", phase1: { attaque: "morote_dori", deplacement: "irimi_tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "4e_kyu", categorie: "kokyu_waza" },
];

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

/**
 * Récupère toutes les combinaisons valides
 */
export const getAllCombinaisons = () => COMBINAISONS_VALIDES;

/**
 * Récupère les combinaisons par niveau de Kyu
 */
export const getCombinaisonsByKyu = (kyu) => {
  return COMBINAISONS_VALIDES.filter(c => c.kyu === kyu);
};

/**
 * Récupère les combinaisons par attaque
 */
export const getCombinaisonsByAttaque = (attaqueId) => {
  return COMBINAISONS_VALIDES.filter(c => c.phase1.attaque === attaqueId);
};

/**
 * Récupère les combinaisons par technique
 */
export const getCombinaisonsByTechnique = (techniqueId) => {
  return COMBINAISONS_VALIDES.filter(c => c.phase2.technique === techniqueId);
};

/**
 * Récupère les combinaisons par type de final
 */
export const getCombinaisonsByFinal = (finalType) => {
  return COMBINAISONS_VALIDES.filter(c => c.phase3.type === finalType);
};

/**
 * Génère le nom lisible d'une combinaison
 */
export const getCombinaisonDisplayName = (combinaison) => {
  const { phase1, phase2, phase3 } = combinaison;
  
  // Formater le nom de l'attaque
  const attaqueName = phase1.attaque.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Formater le nom de la technique
  let techniqueName = phase2.technique.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  if (phase2.direction) {
    techniqueName += ` ${phase2.direction.charAt(0).toUpperCase() + phase2.direction.slice(1)}`;
  }
  if (phase2.variant) {
    techniqueName += ` (${phase2.variant})`;
  }
  
  return `${attaqueName} → ${techniqueName}`;
};

/**
 * Statistiques des combinaisons
 */
export const getCombinaisonsStatistics = () => {
  const stats = {
    total: COMBINAISONS_VALIDES.length,
    parKyu: {},
    parAttaque: {},
    parTechnique: {},
    parFinal: { immobilisation: 0, chute: 0 }
  };
  
  COMBINAISONS_VALIDES.forEach(c => {
    // Par Kyu
    stats.parKyu[c.kyu] = (stats.parKyu[c.kyu] || 0) + 1;
    
    // Par Attaque
    stats.parAttaque[c.phase1.attaque] = (stats.parAttaque[c.phase1.attaque] || 0) + 1;
    
    // Par Technique
    stats.parTechnique[c.phase2.technique] = (stats.parTechnique[c.phase2.technique] || 0) + 1;
    
    // Par Final
    stats.parFinal[c.phase3.type]++;
  });
  
  return stats;
};

/**
 * Récupère une combinaison enrichie avec sa philosophie
 * @param {string} combinaisonId - ID de la combinaison
 * @param {string} audience - "enfant" ou "adulte"
 * @returns {Object} - Combinaison avec philosophie
 */
export const getCombinaisonAvecPhilosophie = (combinaisonId, audience = "enfant") => {
  const combinaison = COMBINAISONS_VALIDES.find(c => c.id === combinaisonId);
  if (!combinaison) return null;
  
  return {
    ...combinaison,
    philosophie: getPhilosophieCombinaison(combinaison, audience),
    tanaka: getTanakaParole(combinaison.phase2.technique, audience)
  };
};

/**
 * Récupère toutes les combinaisons enrichies avec leur philosophie
 * @param {string} audience - "enfant" ou "adulte"
 * @returns {Array} - Combinaisons avec philosophie
 */
export const getAllCombinaisonsAvecPhilosophie = (audience = "enfant") => {
  return COMBINAISONS_VALIDES.map(c => getCombinaisonAvecPhilosophie(c.id, audience));
};

export default {
  COMBINAISONS_VALIDES,
  getAllCombinaisons,
  getCombinaisonsByKyu,
  getCombinaisonsByAttaque,
  getCombinaisonsByTechnique,
  getCombinaisonsByFinal,
  getCombinaisonDisplayName,
  getCombinaisonsStatistics,
  getCombinaisonAvecPhilosophie,
  getAllCombinaisonsAvecPhilosophie,
};
