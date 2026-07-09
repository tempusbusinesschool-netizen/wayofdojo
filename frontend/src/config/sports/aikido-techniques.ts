/**
 * 🥋 AIKIDO TECHNIQUES DATA
 * Liste complète des techniques par grade
 */

export interface Technique {
  id: string;
  name: string;
  nameJp: string;
  category: string;
  grade: string;
  description: string;
  attack: string;
  execution: 'omote' | 'ura' | 'both';
  videoUrl?: string;
}

export const AIKIDO_TECHNIQUES: Technique[] = [
  // 6e Kyu - Ceinture Blanche
  {
    id: 'ikkyo_katatedori_omote',
    name: 'Ikkyo sur saisie du poignet (omote)',
    nameJp: 'Katatedori Ikkyo Omote',
    category: 'tachi_waza',
    grade: '6e_kyu',
    description: 'Premier principe - Contrôle du coude par le dessus en entrant devant.',
    attack: 'Katatedori (saisie du poignet)',
    execution: 'omote',
  },
  {
    id: 'ikkyo_katatedori_ura',
    name: 'Ikkyo sur saisie du poignet (ura)',
    nameJp: 'Katatedori Ikkyo Ura',
    category: 'tachi_waza',
    grade: '6e_kyu',
    description: 'Premier principe - Contrôle du coude en pivotant derrière.',
    attack: 'Katatedori (saisie du poignet)',
    execution: 'ura',
  },
  {
    id: 'shihonage_katatedori',
    name: 'Shiho Nage sur saisie',
    nameJp: 'Katatedori Shiho Nage',
    category: 'tachi_waza',
    grade: '6e_kyu',
    description: 'Projection dans les 4 directions - technique fondamentale.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'iriminage_basic',
    name: 'Irimi Nage basique',
    nameJp: 'Irimi Nage',
    category: 'tachi_waza',
    grade: '6e_kyu',
    description: 'Projection par entrée directe.',
    attack: 'Shomenuchi',
    execution: 'omote',
  },
  {
    id: 'kokyuho',
    name: 'Kokyu Ho (à genoux)',
    nameJp: 'Suwari Waza Kokyu Ho',
    category: 'suwari_waza',
    grade: '6e_kyu',
    description: 'Exercice de respiration et de projection assis.',
    attack: 'Ryotedori',
    execution: 'both',
  },
  {
    id: 'mae_ukemi',
    name: 'Chute avant roulée',
    nameJp: 'Mae Ukemi',
    category: 'ukemi',
    grade: '6e_kyu',
    description: 'Chute avant par roulade.',
    attack: '-',
    execution: 'both',
  },
  {
    id: 'ushiro_ukemi',
    name: 'Chute arrière',
    nameJp: 'Ushiro Ukemi',
    category: 'ukemi',
    grade: '6e_kyu',
    description: 'Chute arrière contrôlée.',
    attack: '-',
    execution: 'both',
  },

  // 5e Kyu - Ceinture Jaune
  {
    id: 'nikyo_katatedori_omote',
    name: 'Nikyo sur saisie (omote)',
    nameJp: 'Katatedori Nikyo Omote',
    category: 'tachi_waza',
    grade: '5e_kyu',
    description: 'Deuxième principe - Torsion du poignet vers le centre.',
    attack: 'Katatedori',
    execution: 'omote',
  },
  {
    id: 'nikyo_katatedori_ura',
    name: 'Nikyo sur saisie (ura)',
    nameJp: 'Katatedori Nikyo Ura',
    category: 'tachi_waza',
    grade: '5e_kyu',
    description: 'Deuxième principe - Torsion du poignet en pivotant.',
    attack: 'Katatedori',
    execution: 'ura',
  },
  {
    id: 'kotegaeshi_basic',
    name: 'Kote Gaeshi basique',
    nameJp: 'Kote Gaeshi',
    category: 'tachi_waza',
    grade: '5e_kyu',
    description: 'Retournement du poignet - projection.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'tenchinage',
    name: 'Tenchi Nage',
    nameJp: 'Tenchi Nage',
    category: 'tachi_waza',
    grade: '5e_kyu',
    description: 'Projection ciel-terre sur saisie des deux poignets.',
    attack: 'Ryotedori',
    execution: 'both',
  },
  {
    id: 'ikkyo_shomenuchi',
    name: 'Ikkyo sur frappe verticale',
    nameJp: 'Shomenuchi Ikkyo',
    category: 'tachi_waza',
    grade: '5e_kyu',
    description: 'Premier principe sur attaque au front.',
    attack: 'Shomenuchi',
    execution: 'both',
  },

  // 4e Kyu - Ceinture Orange
  {
    id: 'sankyo_katatedori',
    name: 'Sankyo sur saisie',
    nameJp: 'Katatedori Sankyo',
    category: 'tachi_waza',
    grade: '4e_kyu',
    description: 'Troisième principe - Torsion spirale du poignet.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'iriminage_yokomenuchi',
    name: 'Irimi Nage sur yokomen',
    nameJp: 'Yokomenuchi Irimi Nage',
    category: 'tachi_waza',
    grade: '4e_kyu',
    description: 'Projection par entrée sur frappe latérale.',
    attack: 'Yokomenuchi',
    execution: 'omote',
  },
  {
    id: 'shihonage_yokomenuchi',
    name: 'Shiho Nage sur yokomen',
    nameJp: 'Yokomenuchi Shiho Nage',
    category: 'tachi_waza',
    grade: '4e_kyu',
    description: 'Projection 4 directions sur frappe latérale.',
    attack: 'Yokomenuchi',
    execution: 'both',
  },
  {
    id: 'kaitennage',
    name: 'Kaiten Nage',
    nameJp: 'Kaiten Nage',
    category: 'tachi_waza',
    grade: '4e_kyu',
    description: 'Projection par rotation.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'suwari_ikkyo',
    name: 'Ikkyo à genoux',
    nameJp: 'Suwari Waza Ikkyo',
    category: 'suwari_waza',
    grade: '4e_kyu',
    description: 'Premier principe exécuté à genoux.',
    attack: 'Shomenuchi',
    execution: 'both',
  },

  // 3e Kyu - Ceinture Verte
  {
    id: 'yonkyo_katatedori',
    name: 'Yonkyo sur saisie',
    nameJp: 'Katatedori Yonkyo',
    category: 'tachi_waza',
    grade: '3e_kyu',
    description: 'Quatrième principe - Pression sur le nerf radial.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'udekimenage',
    name: 'Ude Kime Nage',
    nameJp: 'Ude Kime Nage',
    category: 'tachi_waza',
    grade: '3e_kyu',
    description: 'Projection par immobilisation du bras.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'koshinage',
    name: 'Koshi Nage',
    nameJp: 'Koshi Nage',
    category: 'tachi_waza',
    grade: '3e_kyu',
    description: 'Projection de hanche.',
    attack: 'Katatedori',
    execution: 'both',
  },
  {
    id: 'jiyu_waza',
    name: 'Jiyu Waza (libre)',
    nameJp: 'Jiyu Waza',
    category: 'tachi_waza',
    grade: '3e_kyu',
    description: 'Techniques libres sur attaques variées.',
    attack: 'Libre',
    execution: 'both',
  },
  {
    id: 'hanmi_handachi_shihonage',
    name: 'Shiho Nage (hanmi handachi)',
    nameJp: 'Hanmi Handachi Shiho Nage',
    category: 'hanmi_handachi',
    grade: '3e_kyu',
    description: 'Shiho nage avec tori à genoux.',
    attack: 'Katatedori',
    execution: 'both',
  },

  // 2e Kyu - Ceinture Bleue
  {
    id: 'gokyo_tanto',
    name: 'Gokyo (défense couteau)',
    nameJp: 'Tanto Dori Gokyo',
    category: 'bukiwaza',
    grade: '2e_kyu',
    description: 'Cinquième principe - Désarmement du couteau.',
    attack: 'Tanto tsuki',
    execution: 'both',
  },
  {
    id: 'ushiro_tekubidori',
    name: 'Techniques sur saisie arrière',
    nameJp: 'Ushiro Tekubidori',
    category: 'tachi_waza',
    grade: '2e_kyu',
    description: 'Réponses aux saisies des poignets par derrière.',
    attack: 'Ushiro ryotekubidori',
    execution: 'both',
  },
  {
    id: 'jo_suburi',
    name: 'Suburi au Jo',
    nameJp: 'Jo Suburi',
    category: 'bukiwaza',
    grade: '2e_kyu',
    description: 'Mouvements de base au bâton.',
    attack: '-',
    execution: 'both',
  },
  {
    id: 'bokken_suburi',
    name: 'Suburi au Bokken',
    nameJp: 'Bokken Suburi',
    category: 'bukiwaza',
    grade: '2e_kyu',
    description: 'Coupes de base au sabre de bois.',
    attack: '-',
    execution: 'both',
  },
  {
    id: 'randori_2',
    name: 'Randori 2 attaquants',
    nameJp: 'Randori',
    category: 'tachi_waza',
    grade: '2e_kyu',
    description: 'Travail libre contre 2 adversaires.',
    attack: 'Libre',
    execution: 'both',
  },

  // 1er Kyu - Ceinture Marron
  {
    id: 'kaeshi_waza',
    name: 'Kaeshi Waza (contre-techniques)',
    nameJp: 'Kaeshi Waza',
    category: 'tachi_waza',
    grade: '1er_kyu',
    description: 'Contre-techniques et renversements.',
    attack: 'Techniques',
    execution: 'both',
  },
  {
    id: 'tanto_dori_all',
    name: 'Tanto Dori complet',
    nameJp: 'Tanto Dori',
    category: 'bukiwaza',
    grade: '1er_kyu',
    description: 'Toutes les défenses contre couteau.',
    attack: 'Tanto',
    execution: 'both',
  },
  {
    id: 'jo_dori',
    name: 'Jo Dori',
    nameJp: 'Jo Dori',
    category: 'bukiwaza',
    grade: '1er_kyu',
    description: 'Désarmement du bâton.',
    attack: 'Jo',
    execution: 'both',
  },
  {
    id: 'tachi_dori',
    name: 'Tachi Dori',
    nameJp: 'Tachi Dori',
    category: 'bukiwaza',
    grade: '1er_kyu',
    description: 'Désarmement du sabre.',
    attack: 'Bokken',
    execution: 'both',
  },
  {
    id: 'randori_3',
    name: 'Randori 3+ attaquants',
    nameJp: 'Randori',
    category: 'tachi_waza',
    grade: '1er_kyu',
    description: 'Travail libre contre plusieurs adversaires.',
    attack: 'Libre',
    execution: 'both',
  },
];

// Get techniques by grade
export function getTechniquesByGrade(gradeId: string): Technique[] {
  return AIKIDO_TECHNIQUES.filter(t => t.grade === gradeId);
}

// Get techniques by category
export function getTechniquesByCategory(categoryId: string): Technique[] {
  return AIKIDO_TECHNIQUES.filter(t => t.category === categoryId);
}

// Get all grades with technique count
export function getGradesWithTechniqueCount() {
  const grades = ['6e_kyu', '5e_kyu', '4e_kyu', '3e_kyu', '2e_kyu', '1er_kyu'];
  return grades.map(gradeId => ({
    gradeId,
    count: AIKIDO_TECHNIQUES.filter(t => t.grade === gradeId).length,
  }));
}
