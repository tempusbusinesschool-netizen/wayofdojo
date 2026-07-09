/**
 * WAYOFDOJO — PASSAGES DE GRADES
 * 
 * Ce fichier contient le programme officiel des passages de grades en Aïkido,
 * du 6e Kyu (ceinture blanche) jusqu'au 4e Dan (ceinture noire avancée).
 * 
 * Chaque grade comprend :
 * - Les techniques requises
 * - Les mouvements fondamentaux à maîtriser
 * - Les armes (si applicable)
 * - La durée minimale de pratique
 * - Les critères d'évaluation
 * 
 * Migré depuis AIKIDO@GAME
 */

import { NiveauGrade } from '../types';

// =============================================================================
// TYPES SPÉCIFIQUES AUX PASSAGES DE GRADES
// =============================================================================

export interface ElementProgramme {
  nom: string;
  description?: string;
  obligatoire: boolean;
}

export interface CategorieProgramme {
  categorie: string;
  elements: ElementProgramme[];
  video?: {
    url: string | null;
    placeholder: string;
  };
}

export interface TechniqueRequise {
  attaque: string;
  attaque_jp?: string;
  description?: string;
  techniques: ElementProgramme[];
  video?: {
    url: string | null;
    placeholder: string;
  };
}

export interface ProgrammeGrade {
  id: NiveauGrade;
  nom: string;
  nom_japonais: string;
  ceinture: string;
  couleur_ceinture: string;
  niveau: string;
  duree_minimale: string;
  heures_minimales: number;
  description: string;
  objectifs: string[];
  prerequis?: string;
  mouvements_requis: CategorieProgramme[];
  techniques_requises: TechniqueRequise[];
  criteres_evaluation: string[];
  video_complete: {
    url: string | null;
    duree: string;
    placeholder: string;
  };
  // Champs spécifiques pour les Dan
  programme_complet?: {
    techniques_mains_nues?: string;
    armes?: string;
    defenses?: string;
    randori?: string;
  };
  techniques_specifiques?: ElementProgramme[];
}

// =============================================================================
// PROGRAMMES PAR GRADE
// =============================================================================

export const PASSAGES_DE_GRADES: Record<string, ProgrammeGrade> = {
  // ==========================================================================
  // 6e KYU - CEINTURE BLANCHE (Débutant)
  // ==========================================================================
  
  "6e_kyu": {
    id: "6e_kyu",
    nom: "6e Kyu",
    nom_japonais: "六級",
    ceinture: "Blanche",
    couleur_ceinture: "#FFFFFF",
    niveau: "Débutant",
    duree_minimale: "3 mois de pratique",
    heures_minimales: 40,
    description: "Premier passage de grade. Évaluation des bases fondamentales de l'Aïkido.",
    
    objectifs: [
      "Connaître l'étiquette du dojo (Reishiki)",
      "Maîtriser les chutes de base",
      "Exécuter les déplacements fondamentaux",
      "Réaliser les premières techniques simples"
    ],
    
    mouvements_requis: [
      {
        categorie: "Ukemi (Chutes)",
        elements: [
          { nom: "Mae Ukemi", description: "Chute avant roulée", obligatoire: true },
          { nom: "Ushiro Ukemi", description: "Chute arrière roulée", obligatoire: true },
          { nom: "Zenpo Kaiten Ukemi", description: "Roulade avant", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/ukemi.mp4" }
      },
      {
        categorie: "Tai Sabaki (Déplacements)",
        elements: [
          { nom: "Irimi", description: "Entrée directe", obligatoire: true },
          { nom: "Tenkan", description: "Pivot 180°", obligatoire: true },
          { nom: "Irimi Tenkan", description: "Entrée + pivot", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/tai_sabaki.mp4" }
      },
      {
        categorie: "Kamae (Postures)",
        elements: [
          { nom: "Ai Hanmi", description: "Garde identique", obligatoire: true },
          { nom: "Gyaku Hanmi", description: "Garde inversée", obligatoire: true },
          { nom: "Seiza", description: "Position assise", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/kamae.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Ai Hanmi Katate Dori",
        attaque_jp: "相半身片手取り",
        description: "Saisie du poignet en garde identique",
        techniques: [
          { nom: "Ikkyo Omote", description: "1er principe - côté ouvert", obligatoire: true },
          { nom: "Ikkyo Ura", description: "1er principe - côté fermé", obligatoire: true },
          { nom: "Shiho Nage Omote", description: "Projection 4 directions - ouvert", obligatoire: true },
          { nom: "Shiho Nage Ura", description: "Projection 4 directions - fermé", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/ai_hanmi_katate_dori.mp4" }
      },
      {
        attaque: "Gyaku Hanmi Katate Dori",
        attaque_jp: "逆半身片手取り",
        description: "Saisie du poignet en garde inversée",
        techniques: [
          { nom: "Ikkyo Omote", obligatoire: true },
          { nom: "Ikkyo Ura", obligatoire: true },
          { nom: "Irimi Nage", description: "Projection d'entrée", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/gyaku_hanmi_katate_dori.mp4" }
      },
      {
        attaque: "Suwariwaza Ryote Dori",
        attaque_jp: "座り技両手取り",
        description: "À genoux - saisie des deux poignets",
        techniques: [
          { nom: "Kokyu Ho", description: "Méthode de respiration", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/6e_kyu/suwari_kokyu_ho.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Respect de l'étiquette et du partenaire",
      "Qualité des chutes (sécurité)",
      "Fluidité des déplacements",
      "Compréhension du principe de base des techniques",
      "Attitude et engagement dans la pratique"
    ],
    
    video_complete: {
      url: null,
      duree: "5-7 minutes",
      placeholder: "/videos/grades/6e_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // 5e KYU - CEINTURE JAUNE
  // ==========================================================================
  
  "5e_kyu": {
    id: "5e_kyu",
    nom: "5e Kyu",
    nom_japonais: "五級",
    ceinture: "Jaune",
    couleur_ceinture: "#FFD700",
    niveau: "Débutant confirmé",
    duree_minimale: "3 mois après le 6e Kyu",
    heures_minimales: 60,
    description: "Consolidation des bases et introduction de nouvelles techniques.",
    
    objectifs: [
      "Améliorer la qualité des chutes",
      "Diversifier les attaques",
      "Approfondir les immobilisations",
      "Découvrir les projections"
    ],
    
    prerequis: "6e Kyu validé",
    
    mouvements_requis: [
      {
        categorie: "Ukemi (Chutes)",
        elements: [
          { nom: "Mae Ukemi", description: "Amélioration de la fluidité", obligatoire: true },
          { nom: "Ushiro Ukemi", description: "Enchaînement fluide", obligatoire: true },
          { nom: "Yoko Ukemi", description: "Chute latérale", obligatoire: true },
          { nom: "Koho Kaiten Ukemi", description: "Roulade arrière", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/ukemi.mp4" }
      },
      {
        categorie: "Tai Sabaki (Déplacements)",
        elements: [
          { nom: "Kaiten", description: "Rotation", obligatoire: true },
          { nom: "Tenshin", description: "Esquive diagonale", obligatoire: true },
          { nom: "Tsugi Ashi", description: "Pas glissé", obligatoire: true },
          { nom: "Shikko", description: "Marche à genoux", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/tai_sabaki.mp4" }
      },
      {
        categorie: "Atemi (Frappes)",
        elements: [
          { nom: "Shomen Ate", description: "Frappe frontale", obligatoire: true },
          { nom: "Yokomen Ate", description: "Frappe latérale", obligatoire: true },
          { nom: "Chudan Tsuki", description: "Coup de poing niveau moyen", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/atemi.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Shomen Uchi",
        attaque_jp: "正面打ち",
        description: "Frappe verticale descendante",
        techniques: [
          { nom: "Ikkyo Omote/Ura", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", description: "Retournement de poignet", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/shomen_uchi.mp4" }
      },
      {
        attaque: "Kata Dori",
        attaque_jp: "肩取り",
        description: "Saisie de l'épaule",
        techniques: [
          { nom: "Ikkyo Omote/Ura", obligatoire: true },
          { nom: "Nikyo Omote/Ura", description: "2e principe", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/kata_dori.mp4" }
      },
      {
        attaque: "Ryote Dori",
        attaque_jp: "両手取り",
        description: "Saisie des deux poignets",
        techniques: [
          { nom: "Tenchi Nage", description: "Projection ciel-terre", obligatoire: true },
          { nom: "Kokyu Nage", description: "Projection par la respiration", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/ryote_dori.mp4" }
      },
      {
        attaque: "Suwariwaza Shomen Uchi",
        attaque_jp: "座り技正面打ち",
        description: "À genoux - frappe verticale",
        techniques: [
          { nom: "Ikkyo Omote/Ura", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/5e_kyu/suwari_shomen.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Qualité et sécurité des ukemi",
      "Précision des déplacements",
      "Compréhension de Ikkyo et Nikyo",
      "Début de fluidité dans l'exécution",
      "Connection avec le partenaire"
    ],
    
    video_complete: {
      url: null,
      duree: "7-10 minutes",
      placeholder: "/videos/grades/5e_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // 4e KYU - CEINTURE ORANGE
  // ==========================================================================
  
  "4e_kyu": {
    id: "4e_kyu",
    nom: "4e Kyu",
    nom_japonais: "四級",
    ceinture: "Orange",
    couleur_ceinture: "#FF8C00",
    niveau: "Intermédiaire débutant",
    duree_minimale: "3 mois après le 5e Kyu",
    heures_minimales: 80,
    description: "Élargissement du répertoire technique et amélioration de la fluidité.",
    
    objectifs: [
      "Maîtriser les 4 premiers principes (Ikkyo à Yonkyo)",
      "Diversifier les projections",
      "Améliorer la connexion avec le partenaire",
      "Commencer le travail Hanmi Handachi"
    ],
    
    prerequis: "5e Kyu validé",
    
    mouvements_requis: [
      {
        categorie: "Ukemi (Chutes)",
        elements: [
          { nom: "Toutes les chutes précédentes", description: "Amélioration continue", obligatoire: true },
          { nom: "Suwari Mae Ukemi", description: "Chute avant depuis seiza", obligatoire: true },
          { nom: "Suwari Ushiro Ukemi", description: "Chute arrière depuis seiza", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/ukemi.mp4" }
      },
      {
        categorie: "Tai Sabaki",
        elements: [
          { nom: "Sokumen Irimi", description: "Entrée latérale", obligatoire: true },
          { nom: "Ushiro Sabaki", description: "Déplacement arrière", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/tai_sabaki.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Yokomen Uchi",
        attaque_jp: "横面打ち",
        description: "Frappe latérale à la tempe",
        techniques: [
          { nom: "Ikkyo à Yonkyo (Omote/Ura)", obligatoire: true },
          { nom: "Shiho Nage", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/yokomen_uchi.mp4" }
      },
      {
        attaque: "Morote Dori",
        attaque_jp: "諸手取り",
        description: "Saisie à deux mains sur un poignet",
        techniques: [
          { nom: "Ikkyo Omote/Ura", obligatoire: true },
          { nom: "Nikyo Omote/Ura", obligatoire: true },
          { nom: "Kokyu Nage", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/morote_dori.mp4" }
      },
      {
        attaque: "Ushiro Ryote Dori",
        attaque_jp: "後ろ両手取り",
        description: "Saisie des deux poignets par l'arrière",
        techniques: [
          { nom: "Ikkyo", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true },
          { nom: "Kokyu Nage", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/ushiro_ryote.mp4" }
      },
      {
        attaque: "Hanmi Handachi - Katate Dori",
        attaque_jp: "半身半立ち片手取り",
        description: "Tori à genoux, Uke debout",
        techniques: [
          { nom: "Shiho Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/hanmi_handachi.mp4" }
      },
      {
        attaque: "Suwariwaza Shomen Uchi",
        techniques: [
          { nom: "Nikyo Omote/Ura", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/4e_kyu/suwari_nikyo.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Distinction claire entre Omote et Ura",
      "Compréhension des 4 premiers principes",
      "Fluidité dans les enchaînements",
      "Adaptation aux différentes attaques",
      "Qualité du travail Hanmi Handachi"
    ],
    
    video_complete: {
      url: null,
      duree: "10-12 minutes",
      placeholder: "/videos/grades/4e_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // 3e KYU - CEINTURE VERTE
  // ==========================================================================
  
  "3e_kyu": {
    id: "3e_kyu",
    nom: "3e Kyu",
    nom_japonais: "三級",
    ceinture: "Verte",
    couleur_ceinture: "#228B22",
    niveau: "Intermédiaire",
    duree_minimale: "4 mois après le 4e Kyu",
    heures_minimales: 100,
    description: "Approfondissement technique et introduction aux armes.",
    
    objectifs: [
      "Maîtriser Sankyo en détail",
      "Découvrir les techniques d'armes (Jo, Bokken)",
      "Améliorer la chute Tobi Ukemi",
      "Développer la capacité d'adaptation"
    ],
    
    prerequis: "4e Kyu validé",
    
    mouvements_requis: [
      {
        categorie: "Ukemi (Chutes)",
        elements: [
          { nom: "Tobi Ukemi", description: "Chute plongée/aérienne", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/tobi_ukemi.mp4" }
      },
      {
        categorie: "Armes - Ken (Bokken)",
        elements: [
          { nom: "Ken Suburi 1-4", description: "4 premiers suburi au sabre", obligatoire: true },
          { nom: "Kumitachi 1-2", description: "Exercices à deux au sabre", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/ken_suburi.mp4" }
      },
      {
        categorie: "Armes - Jo",
        elements: [
          { nom: "Jo Suburi 1-10", description: "10 premiers suburi au bâton", obligatoire: true },
          { nom: "13 Jo Kata", description: "Forme de 13 mouvements", obligatoire: false },
          { nom: "Kumijo 1-2", description: "Exercices à deux au bâton", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/jo_suburi.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Toutes les attaques précédentes",
        techniques: [
          { nom: "Sankyo Omote/Ura", description: "3e principe - maîtrise", obligatoire: true },
          { nom: "Kaiten Nage", description: "Projection rotative", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/sankyo.mp4" }
      },
      {
        attaque: "Chudan Tsuki",
        attaque_jp: "中段突き",
        description: "Coup de poing au ventre",
        techniques: [
          { nom: "Ikkyo à Sankyo", obligatoire: true },
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/chudan_tsuki.mp4" }
      },
      {
        attaque: "Ushiro Kubishime",
        attaque_jp: "後ろ首絞め",
        description: "Étranglement par l'arrière",
        techniques: [
          { nom: "Kote Gaeshi", obligatoire: true },
          { nom: "Shiho Nage", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/ushiro_kubishime.mp4" }
      },
      {
        attaque: "Suwariwaza Shomen Uchi",
        techniques: [
          { nom: "Sankyo Omote/Ura", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/suwari_sankyo.mp4" }
      },
      {
        attaque: "Hanmi Handachi",
        techniques: [
          { nom: "Ikkyo", obligatoire: true },
          { nom: "Kaiten Nage", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/3e_kyu/hanmi_handachi.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Maîtrise de la spirale dans Sankyo",
      "Qualité de Tobi Ukemi",
      "Bases des armes acquises",
      "Fluidité générale",
      "Capacité à recevoir (Uke) correctement"
    ],
    
    video_complete: {
      url: null,
      duree: "12-15 minutes",
      placeholder: "/videos/grades/3e_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // 2e KYU - CEINTURE BLEUE
  // ==========================================================================
  
  "2e_kyu": {
    id: "2e_kyu",
    nom: "2e Kyu",
    nom_japonais: "二級",
    ceinture: "Bleue",
    couleur_ceinture: "#0000CD",
    niveau: "Intermédiaire avancé",
    duree_minimale: "4 mois après le 3e Kyu",
    heures_minimales: 120,
    description: "Préparation au niveau avancé. Introduction du Tanto Dori.",
    
    objectifs: [
      "Maîtriser Yonkyo",
      "Apprendre les défenses contre couteau (Tanto Dori)",
      "Perfectionner les armes",
      "Développer le Kokyu (respiration/énergie)"
    ],
    
    prerequis: "3e Kyu validé",
    
    mouvements_requis: [
      {
        categorie: "Ukemi",
        elements: [
          { nom: "Mae Tobi Ukemi", description: "Chute plongée avant", obligatoire: true },
          { nom: "Tous les ukemi fluides", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/ukemi.mp4" }
      },
      {
        categorie: "Armes - Ken",
        elements: [
          { nom: "Ken Suburi 1-7", description: "7 suburi complets", obligatoire: true },
          { nom: "Kumitachi 1-3", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/ken.mp4" }
      },
      {
        categorie: "Armes - Jo",
        elements: [
          { nom: "Jo Suburi 1-13", obligatoire: true },
          { nom: "31 Jo Kata", description: "Forme de 31 mouvements", obligatoire: true },
          { nom: "Kumijo 1-4", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/jo.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Toutes les attaques précédentes",
        techniques: [
          { nom: "Yonkyo Omote/Ura", description: "4e principe - maîtrise", obligatoire: true },
          { nom: "Hiji Kime Osae", description: "Contrôle du coude", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/yonkyo.mp4" }
      },
      {
        attaque: "Tanto Dori - Shomen Uchi",
        attaque_jp: "短刀取り正面打ち",
        description: "Défense contre couteau - frappe verticale",
        techniques: [
          { nom: "Gokyo Omote/Ura", description: "5e principe (spécial armes)", obligatoire: true },
          { nom: "Ikkyo à Yonkyo", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/tanto_shomen.mp4" }
      },
      {
        attaque: "Tanto Dori - Tsuki",
        attaque_jp: "短刀取り突き",
        description: "Défense contre couteau - piqué",
        techniques: [
          { nom: "Kote Gaeshi", obligatoire: true },
          { nom: "Gokyo", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/tanto_tsuki.mp4" }
      },
      {
        attaque: "Jo Dori",
        attaque_jp: "杖取り",
        description: "Défense contre bâton",
        techniques: [
          { nom: "Ikkyo/Nikyo", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/jo_dori.mp4" }
      },
      {
        attaque: "Suwariwaza Shomen Uchi",
        techniques: [
          { nom: "Yonkyo Omote/Ura", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/suwari_yonkyo.mp4" }
      },
      {
        attaque: "Hanmi Handachi",
        techniques: [
          { nom: "Irimi Nage", obligatoire: true },
          { nom: "Kaiten Nage", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/2e_kyu/hanmi_handachi.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Maîtrise des 5 premiers principes",
      "Qualité du Tanto Dori (sécurité)",
      "Fluidité des enchaînements d'armes",
      "Capacité à s'adapter aux situations",
      "Début d'expression personnelle"
    ],
    
    video_complete: {
      url: null,
      duree: "15-18 minutes",
      placeholder: "/videos/grades/2e_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // 1er KYU - CEINTURE MARRON
  // ==========================================================================
  
  "1er_kyu": {
    id: "1er_kyu",
    nom: "1er Kyu",
    nom_japonais: "一級",
    ceinture: "Marron",
    couleur_ceinture: "#8B4513",
    niveau: "Avancé (pré-Dan)",
    duree_minimale: "6 mois après le 2e Kyu",
    heures_minimales: 150,
    description: "Dernier grade Kyu. Préparation complète au passage Shodan.",
    
    objectifs: [
      "Maîtriser l'ensemble du programme technique",
      "Perfectionner toutes les armes",
      "Démontrer une pratique fluide et martiale",
      "Développer sa capacité d'enseignement"
    ],
    
    prerequis: "2e Kyu validé",
    
    mouvements_requis: [
      {
        categorie: "Ukemi",
        elements: [
          { nom: "Tous les ukemi", description: "Maîtrise complète", obligatoire: true },
          { nom: "Ukemi en randori", description: "Chutes continues", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/ukemi.mp4" }
      },
      {
        categorie: "Armes - Ken",
        elements: [
          { nom: "Ken Suburi 1-7", description: "Maîtrise", obligatoire: true },
          { nom: "Kumitachi 1-5", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/ken.mp4" }
      },
      {
        categorie: "Armes - Jo",
        elements: [
          { nom: "Jo Suburi 1-20", obligatoire: true },
          { nom: "31 Jo Kata", description: "Maîtrise", obligatoire: true },
          { nom: "22 Jo Kata", obligatoire: false },
          { nom: "Kumijo 1-6", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/jo.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Toutes les attaques",
        techniques: [
          { nom: "Ikkyo à Gokyo", description: "Les 5 principes maîtrisés", obligatoire: true },
          { nom: "Toutes les projections", description: "Shiho, Irimi, Kote, Kaiten, etc.", obligatoire: true },
          { nom: "Jiyu Waza", description: "Techniques libres", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/techniques.mp4" }
      },
      {
        attaque: "Tanto Dori complet",
        techniques: [
          { nom: "Shomen, Yokomen, Tsuki", description: "Toutes les défenses", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/tanto_dori.mp4" }
      },
      {
        attaque: "Tachi Dori",
        attaque_jp: "太刀取り",
        description: "Défense contre sabre",
        techniques: [
          { nom: "Ikkyo à Sankyo", obligatoire: true },
          { nom: "Shiho Nage", obligatoire: true },
          { nom: "Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/tachi_dori.mp4" }
      },
      {
        attaque: "Jo Dori complet",
        techniques: [
          { nom: "Toutes les techniques", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/jo_dori.mp4" }
      },
      {
        attaque: "Jo Nage",
        attaque_jp: "杖投げ",
        description: "Projection avec le bâton",
        techniques: [
          { nom: "Tsuki, Gaeshi, Uchi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/jo_nage.mp4" }
      },
      {
        attaque: "Suwariwaza complet",
        techniques: [
          { nom: "Ikkyo à Yonkyo + Kote Gaeshi", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/suwariwaza.mp4" }
      },
      {
        attaque: "Hanmi Handachi complet",
        techniques: [
          { nom: "Toutes les techniques", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/1er_kyu/hanmi_handachi.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Maîtrise technique complète",
      "Fluidité et puissance dans l'exécution",
      "Connexion forte avec le partenaire",
      "Compréhension martiale des techniques",
      "Capacité à mener un cours (pédagogie)",
      "Attitude de futur Yudansha"
    ],
    
    video_complete: {
      url: null,
      duree: "20-25 minutes",
      placeholder: "/videos/grades/1er_kyu/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // SHODAN - 1er DAN (Ceinture Noire)
  // ==========================================================================
  
  "shodan": {
    id: "shodan",
    nom: "Shodan (1er Dan)",
    nom_japonais: "初段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "Expert débutant",
    duree_minimale: "1 an après le 1er Kyu",
    heures_minimales: 200,
    description: "Premier grade de ceinture noire. 'Sho' signifie 'début' - c'est le commencement du vrai apprentissage.",
    
    objectifs: [
      "Démontrer une maîtrise complète du programme",
      "Montrer une compréhension profonde des principes",
      "Exécuter avec fluidité et efficacité martiale",
      "Être capable d'enseigner aux débutants"
    ],
    
    prerequis: "1er Kyu validé, 1 an minimum de pratique après",
    
    programme_complet: {
      techniques_mains_nues: "Tout le programme Kyu + Gokyo complet + variations",
      armes: "Jo et Ken complets + Ken Tai Jo",
      defenses: "Tanto Dori, Tachi Dori, Jo Dori complets",
      randori: "Jiyu Waza contre plusieurs attaquants"
    },
    
    mouvements_requis: [
      {
        categorie: "Programme complet",
        elements: [
          { nom: "Tout le programme Kyu", description: "Maîtrise", obligatoire: true },
          { nom: "Randori 2 personnes", description: "Défense contre 2 attaquants", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/shodan/programme.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Programme complet",
        techniques: [
          { nom: "Ushiro Waza complet", description: "Toutes techniques arrière", obligatoire: true },
          { nom: "Futari Dori", description: "Défense contre 2 attaquants", obligatoire: true },
          { nom: "Kaeshi Waza", description: "Contre-techniques", obligatoire: true },
          { nom: "Henka Waza", description: "Enchaînements et variations", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/shodan/techniques.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Excellence technique",
      "Compréhension des principes de l'Aïkido",
      "Capacité martiale",
      "Attitude de Budoka",
      "Capacité pédagogique"
    ],
    
    video_complete: {
      url: null,
      duree: "30-40 minutes",
      placeholder: "/videos/grades/shodan/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // NIDAN - 2e DAN
  // ==========================================================================
  
  "nidan": {
    id: "nidan",
    nom: "Nidan (2e Dan)",
    nom_japonais: "二段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "Expert confirmé",
    duree_minimale: "2 ans après Shodan",
    heures_minimales: 300,
    description: "Approfondissement de la pratique. Développement de la recherche personnelle.",
    
    objectifs: [
      "Approfondir la compréhension des principes",
      "Développer une expression personnelle",
      "Maîtriser les situations multiples (Futari/Sannin Dori)",
      "Perfectionner l'enseignement"
    ],
    
    prerequis: "Shodan validé, 2 ans minimum de pratique après",
    
    mouvements_requis: [
      {
        categorie: "Programme avancé",
        elements: [
          { nom: "Kata Dori Menuchi", description: "Saisie épaule + frappe", obligatoire: true },
          { nom: "Futari Dori avancé", description: "2 attaquants - variations", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/nidan/programme.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Programme avancé",
        techniques: [
          { nom: "Kaeshi Waza avancé", description: "Contre-techniques complexes", obligatoire: true },
          { nom: "Buki Waza avancé", description: "Armes niveau expert", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/nidan/techniques.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Expression personnelle",
      "Profondeur de compréhension",
      "Capacité à gérer plusieurs attaquants",
      "Qualité d'enseignement"
    ],
    
    video_complete: {
      url: null,
      duree: "40-50 minutes",
      placeholder: "/videos/grades/nidan/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // SANDAN - 3e DAN
  // ==========================================================================
  
  "sandan": {
    id: "sandan",
    nom: "Sandan (3e Dan)",
    nom_japonais: "三段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "Expert avancé",
    duree_minimale: "3 ans après Nidan",
    heures_minimales: 400,
    description: "Niveau d'enseignant confirmé. Expression personnelle de l'Aïkido.",
    
    objectifs: [
      "Développer une pratique personnelle aboutie",
      "Maîtriser toutes les formes de pratique",
      "Être capable de former des ceintures noires",
      "Contribuer au développement de l'Aïkido"
    ],
    
    prerequis: "Nidan validé, 3 ans minimum de pratique après",
    
    mouvements_requis: [
      {
        categorie: "Programme expert",
        elements: [
          { nom: "Sannin Dori", description: "3 attaquants", obligatoire: true },
          { nom: "Henka Waza libre", description: "Enchaînements spontanés", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/sandan/programme.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Programme expert",
        techniques: [
          { nom: "Oyo Waza", description: "Applications martiales", obligatoire: true },
          { nom: "Tanto Randori", description: "Défense libre contre couteau", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/sandan/techniques.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Pratique personnelle aboutie",
      "Capacité à former des Dan",
      "Contribution au développement",
      "Niveau martial élevé"
    ],
    
    video_complete: {
      url: null,
      duree: "50-60 minutes",
      placeholder: "/videos/grades/sandan/passage_complet.mp4"
    }
  },

  // ==========================================================================
  // YONDAN - 4e DAN
  // ==========================================================================
  
  "yondan": {
    id: "yondan",
    nom: "Yondan (4e Dan)",
    nom_japonais: "四段",
    ceinture: "Noire",
    couleur_ceinture: "#000000",
    niveau: "Maître",
    duree_minimale: "4 ans après Sandan",
    heures_minimales: 500,
    description: "Niveau de maîtrise. 'Takemusu Aiki' - création spontanée de techniques.",
    
    objectifs: [
      "Atteindre le niveau de Takemusu Aiki",
      "Expression libre et spontanée de l'Aïkido",
      "Transmission de l'essence de l'art",
      "Contribution majeure au développement"
    ],
    
    prerequis: "Sandan validé, 4 ans minimum de pratique après",
    
    mouvements_requis: [
      {
        categorie: "Programme maître",
        elements: [
          { nom: "Yonin Dori", description: "4+ attaquants", obligatoire: true },
          { nom: "Takemusu Aiki", description: "Création spontanée", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/yondan/programme.mp4" }
      }
    ],
    
    techniques_requises: [
      {
        attaque: "Programme maître",
        techniques: [
          { nom: "Ki no Nagare", description: "Flux continu", obligatoire: true },
          { nom: "Kuden", description: "Enseignement oral - secrets de l'école", obligatoire: true }
        ],
        video: { url: null, placeholder: "/videos/grades/yondan/techniques.mp4" }
      }
    ],
    
    criteres_evaluation: [
      "Niveau de Takemusu Aiki",
      "Expression libre",
      "Transmission de l'essence",
      "Contribution majeure"
    ],
    
    video_complete: {
      url: null,
      duree: "60+ minutes",
      placeholder: "/videos/grades/yondan/passage_complet.mp4"
    }
  }
};

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

/**
 * Récupère le programme d'un grade spécifique
 */
export const getProgrammeGrade = (gradeId: string): ProgrammeGrade | null => {
  return PASSAGES_DE_GRADES[gradeId] || null;
};

/**
 * Récupère tous les grades Kyu
 */
export const getGradesKyu = (): ProgrammeGrade[] => {
  return ["6e_kyu", "5e_kyu", "4e_kyu", "3e_kyu", "2e_kyu", "1er_kyu"]
    .map(id => PASSAGES_DE_GRADES[id])
    .filter(Boolean);
};

/**
 * Récupère tous les grades Dan
 */
export const getGradesDan = (): ProgrammeGrade[] => {
  return ["shodan", "nidan", "sandan", "yondan"]
    .map(id => PASSAGES_DE_GRADES[id])
    .filter(Boolean);
};

/**
 * Calcule le nombre total de techniques requises pour un grade
 */
export const getNombreTechniquesGrade = (gradeId: string): number => {
  const grade = PASSAGES_DE_GRADES[gradeId];
  if (!grade || !grade.techniques_requises) return 0;
  
  return grade.techniques_requises.reduce((total, attaque) => {
    return total + (attaque.techniques ? attaque.techniques.length : 0);
  }, 0);
};

/**
 * Statistiques globales
 */
export const GRADES_STATISTICS = {
  total_grades: Object.keys(PASSAGES_DE_GRADES).length,
  grades_kyu: 6,
  grades_dan: 4,
  heures_totales_kyu: 150,
  heures_totales_shodan: 200,
  duree_minimum_shodan: "3 ans minimum de pratique"
};

export default PASSAGES_DE_GRADES;
