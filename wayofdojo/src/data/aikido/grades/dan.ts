/**
 * 🥋 WAYOFDOJO — TECHNIQUES DAN (Grades Supérieurs)
 * 
 * Ce fichier contient les techniques requises pour les grades Dan,
 * du Shodan (1er Dan) jusqu'au Nanadan (7e Dan).
 * 
 * Les grades Dan représentent la maturité technique et spirituelle
 * du pratiquant. À partir du Shodan, le pratiquant est considéré
 * comme un "débutant sérieux" dans la Voie.
 * 
 * Migré depuis AIKIDO@GAME
 */

import { CombinaisonTechnique, GradeInfo, NiveauGrade } from '../types';

// =============================================================================
// INFORMATIONS SUR LES GRADES DAN
// =============================================================================

export const GRADES_DAN: GradeInfo[] = [
  {
    id: "shodan",
    nom: "Shodan",
    nom_japonais: "初段",
    couleur_ceinture: "Noire",
    description: "Premier Dan - Début de la maîtrise. Le corps commence à répondre aux commandements de l'esprit.",
    duree_minimale: "1 an après 1er Kyu",
    techniques_requises: [
      "Toutes techniques Kyu en Tachi Waza",
      "Suwariwaza complet (Ikkyo à Yonkyo)",
      "Tanto Dori basique",
      "Jo Dori basique",
      "Randori 2 adversaires"
    ],
    competences_evaluees: [
      "Fluidité des déplacements",
      "Précision des immobilisations",
      "Maîtrise des chutes",
      "Kokyu Ho à genoux"
    ]
  },
  {
    id: "nidan",
    nom: "Nidan",
    nom_japonais: "二段",
    couleur_ceinture: "Noire",
    description: "Deuxième Dan - Rapidité et puissance. Plus grande détermination mentale.",
    duree_minimale: "2 ans après Shodan",
    techniques_requises: [
      "Techniques avec variations (Henka)",
      "Ushiro Waza complet",
      "Tanto Dori avancé",
      "Jo Dori et Jo Nage",
      "Randori 2 adversaires avec engagement"
    ],
    competences_evaluees: [
      "Vitesse d'exécution",
      "Puissance contrôlée",
      "Adaptabilité",
      "Zanshin"
    ]
  },
  {
    id: "sandan",
    nom: "Sandan",
    nom_japonais: "三段",
    couleur_ceinture: "Noire",
    description: "Troisième Dan - Compréhension du Kokyu Ryoku. Entrée dans la dimension spirituelle.",
    duree_minimale: "3 ans après Nidan",
    techniques_requises: [
      "Maîtrise d'Irimi",
      "Ma-ai (juste distance)",
      "Kaeshi Waza (contre-techniques)",
      "Randori 3 adversaires",
      "Jiyu Waza avancé"
    ],
    competences_evaluees: [
      "Kokyu Ryoku",
      "Timing parfait",
      "Lecture de l'intention",
      "Enseignement de base"
    ]
  },
  {
    id: "yondan",
    nom: "Yondan",
    nom_japonais: "四段",
    couleur_ceinture: "Noire",
    description: "Quatrième Dan - Stabilité du Ki. Les techniques deviennent naturelles et fluides.",
    duree_minimale: "4 ans après Sandan",
    techniques_requises: [
      "Ki no Nagare (flux du Ki)",
      "Toutes variations de techniques",
      "Randori multi-adversaires",
      "Démonstration pédagogique"
    ],
    competences_evaluees: [
      "Stabilité énergétique",
      "Harmonie dans le mouvement",
      "Capacité d'enseignement",
      "Présence"
    ]
  },
  {
    id: "godan",
    nom: "Godan",
    nom_japonais: "五段",
    couleur_ceinture: "Noire",
    description: "Cinquième Dan - Aiki accompli. Compréhension profonde de l'harmonie avec le partenaire.",
    duree_minimale: "5 ans après Yondan",
    techniques_requises: [
      "Démonstration libre",
      "Expression personnelle de l'Aiki",
      "Contribution à l'art"
    ],
    competences_evaluees: [
      "Expression personnelle",
      "Sagesse martiale",
      "Leadership",
      "Contribution au dojo"
    ]
  },
  {
    id: "rokudan",
    nom: "Rokudan",
    nom_japonais: "六段",
    couleur_ceinture: "Noire",
    description: "Sixième Dan - Maturité spirituelle. Le pratiquant incarne les principes de l'Aïkido.",
    duree_minimale: "6 ans après Godan",
    techniques_requises: [
      "Démonstration de maîtrise",
      "Transmission de la tradition"
    ],
    competences_evaluees: [
      "Incarnation des principes",
      "Rayonnement",
      "Transmission"
    ]
  },
  {
    id: "nanadan",
    nom: "Nanadan",
    nom_japonais: "七段",
    couleur_ceinture: "Noire",
    description: "Septième Dan - Niveau expert. Contribution significative à la préservation et au développement de l'art.",
    duree_minimale: "7 ans après Rokudan",
    techniques_requises: [
      "Libre expression de l'Aiki",
      "Transmission du savoir"
    ],
    competences_evaluees: [
      "Excellence technique et spirituelle",
      "Contribution au monde de l'Aïkido"
    ]
  }
];

// =============================================================================
// TECHNIQUES SPÉCIFIQUES PAR GRADE DAN
// =============================================================================

export const TECHNIQUES_SHODAN: CombinaisonTechnique[] = [
  // Suwariwaza (à genoux) - Maîtrise complète
  { id: "shodan_sw_ikkyo_omote", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_ikkyo_ura", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_nikyo", phase1: { attaque: "suwariwaza_katate_dori", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: "omote" }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_sankyo", phase1: { attaque: "suwariwaza_katate_dori", deplacement: "tenkan" }, phase2: { technique: "sankyo", direction: "ura" }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_yonkyo", phase1: { attaque: "suwariwaza_shomen_uchi", deplacement: "irimi" }, phase2: { technique: "yonkyo", direction: "omote" }, phase3: { final: "yonkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_sw_kokyu_ho", phase1: { attaque: "suwariwaza_ryote_dori", deplacement: "kokyu" }, phase2: { technique: "kokyu_ho", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan" },
  
  // Randori 2 adversaires
  { id: "shodan_randori_2", phase1: { attaque: "randori_futari", deplacement: "tai_sabaki" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "shodan" },
  
  // Tanto Dori
  { id: "shodan_tanto_ikkyo", phase1: { attaque: "tanto_tsuki", deplacement: "irimi" }, phase2: { technique: "ikkyo", direction: "omote" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "shodan" },
  { id: "shodan_tanto_kote", phase1: { attaque: "tanto_yokomen", deplacement: "tenkan" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "kote_gaeshi_osae", type: "immobilisation" }, kyu: "shodan" },
  
  // Jo Dori
  { id: "shodan_jo_dori_irimi", phase1: { attaque: "jo_tsuki", deplacement: "irimi" }, phase2: { technique: "irimi_nage", direction: "omote" }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "shodan" },
  { id: "shodan_jo_nage", phase1: { attaque: "jo_shomen", deplacement: "tenkan" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "shodan" },
];

export const TECHNIQUES_NIDAN: CombinaisonTechnique[] = [
  // Tachiwaza avancé - Fluidité accrue
  { id: "nidan_tw_ikkyo_kaeshi", phase1: { attaque: "shomen_uchi", deplacement: "kaeshi" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tw_nikyo_henka", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "nikyo", direction: null }, phase3: { final: "nikyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tw_sankyo_nagare", phase1: { attaque: "katate_dori", deplacement: "nagare" }, phase2: { technique: "sankyo", direction: null }, phase3: { final: "sankyo_osae", type: "immobilisation" }, kyu: "nidan" },
  
  // Ushiro Waza complet
  { id: "nidan_ushiro_ryote_ikkyo", phase1: { attaque: "ushiro_ryote_dori", deplacement: "tenkan" }, phase2: { technique: "ikkyo", direction: "ura" }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_ushiro_ryokata_shiho", phase1: { attaque: "ushiro_ryokata_dori", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },
  { id: "nidan_ushiro_kubi_kokyu", phase1: { attaque: "ushiro_kubi_shime", deplacement: "kokyu" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "nidan" },
  
  // Randori avec engagement
  { id: "nidan_randori_2_ki", phase1: { attaque: "randori_futari", deplacement: "irimi_tenkan" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "nidan" },
  
  // Tanto Dori avancé
  { id: "nidan_tanto_shiho", phase1: { attaque: "tanto_shomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "shiho_nage_osae", type: "immobilisation" }, kyu: "nidan" },
  { id: "nidan_tanto_kaiten", phase1: { attaque: "tanto_tsuki", deplacement: "tenkan" }, phase2: { technique: "kaiten_nage", direction: null }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },
  
  // Jo Dori avancé
  { id: "nidan_jo_shiho", phase1: { attaque: "jo_yokomen", deplacement: "irimi" }, phase2: { technique: "shiho_nage", direction: "omote" }, phase3: { final: "mae_ukemi", type: "chute" }, kyu: "nidan" },
];

export const TECHNIQUES_SANDAN: CombinaisonTechnique[] = [
  // Grande maîtrise d'Irimi
  { id: "sandan_irimi_pure", phase1: { attaque: "shomen_uchi", deplacement: "irimi_direct" }, phase2: { technique: "irimi_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "sandan" },
  { id: "sandan_irimi_kokyu", phase1: { attaque: "yokomen_uchi", deplacement: "irimi" }, phase2: { technique: "kokyu_nage", direction: null }, phase3: { final: "ushiro_ukemi", type: "chute" }, kyu: "sandan" },
  
  // Ma-ai - Juste distance
  { id: "sandan_maai_kote", phase1: { attaque: "chudan_tsuki", deplacement: "maai" }, phase2: { technique: "kote_gaeshi", direction: null }, phase3: { final: "tobi_ukemi", type: "chute" }, kyu: "sandan" },
  
  // Kaeshi Waza - Contre-techniques
  { id: "sandan_kaeshi_ikkyo", phase1: { attaque: "ikkyo_tentative", deplacement: "kaeshi" }, phase2: { technique: "kaeshi_waza", direction: null }, phase3: { final: "ikkyo_osae", type: "immobilisation" }, kyu: "sandan" },
  
  // Randori 3 adversaires
  { id: "sandan_randori_3", phase1: { attaque: "randori_sannin", deplacement: "tai_sabaki" }, phase2: { technique: "jiyu_waza", direction: null }, phase3: { final: "zanshin", type: "libre" }, kyu: "sandan" },
];

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

export const getGradeInfo = (gradeId: NiveauGrade): GradeInfo | undefined => {
  return GRADES_DAN.find(g => g.id === gradeId);
};

export const getTechniquesByDan = (danId: NiveauGrade): CombinaisonTechnique[] => {
  switch (danId) {
    case "shodan": return TECHNIQUES_SHODAN;
    case "nidan": return TECHNIQUES_NIDAN;
    case "sandan": return TECHNIQUES_SANDAN;
    default: return [];
  }
};

export const getAllDanTechniques = (): CombinaisonTechnique[] => {
  return [
    ...TECHNIQUES_SHODAN,
    ...TECHNIQUES_NIDAN,
    ...TECHNIQUES_SANDAN,
  ];
};

export default GRADES_DAN;
