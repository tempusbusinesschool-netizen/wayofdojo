/**
 * PROGRAMME TECHNIQUE AIKIDO PAR KYU
 * 
 * Chaque niveau de ceinture a ses techniques à maîtriser.
 * Les techniques doivent être validées une par une pour progresser.
 */

export interface Technique {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  type?: string;
}

export interface TechniqueCategory {
  name: string;
  icon: string;
  techniques: Technique[];
}

export interface KyuProgram {
  name: string;
  belt: string;
  color: string;
  gradient: string;
  emoji: string;
  description: string;
  categories: TechniqueCategory[];
}

export const TECHNIQUES_BY_KYU: Record<string, KyuProgram> = {
  "6e_kyu": {
    name: "6e Kyu",
    belt: "Ceinture Blanche",
    color: "#E5E7EB",
    gradient: "from-gray-100 to-gray-300",
    emoji: "⚪",
    description: "Les bases fondamentales de l'Aïkido",
    categories: [
      {
        name: "Ukemi (Chutes)",
        icon: "🔄",
        techniques: [
          { id: "mae_ukemi", name: "Mae Ukemi", description: "Chute avant roulée", difficulty: 1 },
          { id: "ushiro_ukemi", name: "Ushiro Ukemi", description: "Chute arrière roulée", difficulty: 1 },
          { id: "yoko_ukemi", name: "Yoko Ukemi", description: "Chute latérale", difficulty: 2 },
        ]
      },
      {
        name: "Tai Sabaki (Déplacements)",
        icon: "🦶",
        techniques: [
          { id: "irimi", name: "Irimi", description: "Entrer", difficulty: 1 },
          { id: "tenkan", name: "Tenkan", description: "Pivot 180°", difficulty: 1 },
          { id: "irimi_tenkan", name: "Irimi Tenkan", description: "Entrer et pivoter", difficulty: 2 },
        ]
      },
      {
        name: "Techniques de base",
        icon: "🥋",
        techniques: [
          { id: "ikkyo_omote", name: "Ikkyo Omote", description: "1ère technique - forme avant", difficulty: 2 },
          { id: "ikkyo_ura", name: "Ikkyo Ura", description: "1ère technique - forme arrière", difficulty: 2 },
        ]
      },
      {
        name: "Postures",
        icon: "🧘",
        techniques: [
          { id: "seiza", name: "Seiza", description: "Position à genoux", difficulty: 1 },
          { id: "kamae", name: "Kamae", description: "Garde de base", difficulty: 1 },
          { id: "shikko", name: "Shikko", description: "Marche à genoux", difficulty: 2 },
        ]
      },
      {
        name: "Attaques (Frappes)",
        icon: "👊",
        techniques: [
          { id: "shomen_uchi", name: "Shomen Uchi", description: "Frappe verticale descendante sur la tête", difficulty: 1, type: "dynamique" },
          { id: "yokomen_uchi", name: "Yokomen Uchi", description: "Frappe latérale à la tempe", difficulty: 2, type: "dynamique" },
          { id: "chudan_tsuki", name: "Chudan Tsuki", description: "Coup de poing direct au ventre", difficulty: 1, type: "dynamique" },
          { id: "jodan_tsuki", name: "Jodan Tsuki", description: "Coup de poing direct au visage", difficulty: 2, type: "dynamique" },
        ]
      }
    ]
  },
  "5e_kyu": {
    name: "5e Kyu",
    belt: "Ceinture Jaune",
    color: "#FCD34D",
    gradient: "from-yellow-300 to-yellow-500",
    emoji: "🟡",
    description: "Consolidation des bases et premières projections",
    categories: [
      {
        name: "Ukemi avancés",
        icon: "🔄",
        techniques: [
          { id: "mae_ukemi_debout", name: "Mae Ukemi Debout", description: "Chute avant depuis debout", difficulty: 2 },
          { id: "tobu_ukemi", name: "Tobu Ukemi", description: "Chute volante", difficulty: 3 },
        ]
      },
      {
        name: "Projections",
        icon: "🌀",
        techniques: [
          { id: "shiho_nage_omote", name: "Shiho Nage Omote", description: "Projection 4 directions - avant", difficulty: 2 },
          { id: "shiho_nage_ura", name: "Shiho Nage Ura", description: "Projection 4 directions - arrière", difficulty: 2 },
          { id: "irimi_nage", name: "Irimi Nage", description: "Projection en entrant", difficulty: 3 },
        ]
      },
      {
        name: "Immobilisations",
        icon: "💪",
        techniques: [
          { id: "nikyo_omote", name: "Nikyo Omote", description: "2e technique - forme avant", difficulty: 2 },
          { id: "nikyo_ura", name: "Nikyo Ura", description: "2e technique - forme arrière", difficulty: 2 },
        ]
      },
      {
        name: "Saisies",
        icon: "✋",
        techniques: [
          { id: "katate_dori", name: "Katate Dori", description: "Saisie d'un poignet", difficulty: 1, type: "statique" },
          { id: "ai_hanmi", name: "Ai Hanmi Katate Dori", description: "Saisie en garde identique", difficulty: 1, type: "statique" },
          { id: "gyaku_hanmi", name: "Gyaku Hanmi Katate Dori", description: "Saisie en garde inverse", difficulty: 1, type: "statique" },
        ]
      },
      {
        name: "Attaques avancées",
        icon: "👊",
        techniques: [
          { id: "ushiro_ryote_dori", name: "Ushiro Ryote Dori", description: "Saisie arrière des deux poignets", difficulty: 2, type: "statique" },
          { id: "mae_geri", name: "Mae Geri", description: "Coup de pied avant", difficulty: 3, type: "dynamique" },
        ]
      }
    ]
  },
  "4e_kyu": {
    name: "4e Kyu",
    belt: "Ceinture Orange",
    color: "#FB923C",
    gradient: "from-orange-400 to-orange-600",
    emoji: "🟠",
    description: "Développement technique et fluidité",
    categories: [
      {
        name: "Projections",
        icon: "🌀",
        techniques: [
          { id: "kote_gaeshi", name: "Kote Gaeshi", description: "Retournement du poignet", difficulty: 3 },
          { id: "kaiten_nage_uchi", name: "Kaiten Nage Uchi", description: "Projection rotative intérieure", difficulty: 3 },
          { id: "kaiten_nage_soto", name: "Kaiten Nage Soto", description: "Projection rotative extérieure", difficulty: 3 },
          { id: "tenchi_nage", name: "Tenchi Nage", description: "Projection ciel-terre", difficulty: 2 },
        ]
      },
      {
        name: "Immobilisations",
        icon: "💪",
        techniques: [
          { id: "sankyo_omote", name: "Sankyo Omote", description: "3e technique - forme avant", difficulty: 3 },
          { id: "sankyo_ura", name: "Sankyo Ura", description: "3e technique - forme arrière", difficulty: 3 },
        ]
      },
      {
        name: "Saisies multiples",
        icon: "✋",
        techniques: [
          { id: "ryote_dori", name: "Ryote Dori", description: "Saisie des deux poignets", difficulty: 2, type: "statique" },
          { id: "kata_dori", name: "Kata Dori", description: "Saisie de l'épaule", difficulty: 2, type: "statique" },
          { id: "mune_dori", name: "Mune Dori", description: "Saisie du revers", difficulty: 2, type: "statique" },
        ]
      },
      {
        name: "Attaques combinées",
        icon: "⚡",
        techniques: [
          { id: "kata_dori_men_uchi", name: "Kata Dori Men Uchi", description: "Saisie épaule + frappe à la tête", difficulty: 3, type: "dynamique" },
          { id: "mune_dori_tsuki", name: "Mune Dori Tsuki", description: "Saisie revers + coup de poing", difficulty: 3, type: "dynamique" },
        ]
      }
    ]
  },
  "3e_kyu": {
    name: "3e Kyu",
    belt: "Ceinture Verte",
    color: "#22C55E",
    gradient: "from-green-500 to-green-700",
    emoji: "🟢",
    description: "Maîtrise technique et travail au sol",
    categories: [
      {
        name: "Immobilisations",
        icon: "💪",
        techniques: [
          { id: "yonkyo_omote", name: "Yonkyo Omote", description: "4e technique - forme avant", difficulty: 3 },
          { id: "yonkyo_ura", name: "Yonkyo Ura", description: "4e technique - forme arrière", difficulty: 3 },
          { id: "gokyo", name: "Gokyo", description: "5e technique", difficulty: 4 },
        ]
      },
      {
        name: "Projections avancées",
        icon: "🌀",
        techniques: [
          { id: "koshi_nage", name: "Koshi Nage", description: "Projection de hanche", difficulty: 4 },
          { id: "sumi_otoshi", name: "Sumi Otoshi", description: "Projection dans l'angle", difficulty: 3 },
          { id: "aiki_otoshi", name: "Aiki Otoshi", description: "Projection Aiki", difficulty: 4 },
        ]
      },
      {
        name: "Suwari Waza",
        icon: "🧘",
        techniques: [
          { id: "suwari_ikkyo", name: "Suwari Waza Ikkyo", description: "Ikkyo à genoux", difficulty: 3 },
          { id: "suwari_nikyo", name: "Suwari Waza Nikyo", description: "Nikyo à genoux", difficulty: 3 },
          { id: "suwari_irimi", name: "Suwari Waza Irimi Nage", description: "Irimi Nage à genoux", difficulty: 4 },
        ]
      }
    ]
  },
  "2e_kyu": {
    name: "2e Kyu",
    belt: "Ceinture Bleue",
    color: "#3B82F6",
    gradient: "from-blue-500 to-blue-700",
    emoji: "🔵",
    description: "Techniques arrière et travail aux armes",
    categories: [
      {
        name: "Ushiro Waza (Attaques arrière)",
        icon: "↩️",
        techniques: [
          { id: "ushiro_ryote_ikkyo", name: "Ushiro Ryote Dori Ikkyo", description: "Ikkyo sur saisie arrière", difficulty: 4 },
          { id: "ushiro_ryote_shiho", name: "Ushiro Ryote Dori Shiho Nage", description: "Shiho Nage sur saisie arrière", difficulty: 4 },
          { id: "ushiro_kubi_shime", name: "Ushiro Kubi Shime", description: "Étranglement arrière", difficulty: 4 },
        ]
      },
      {
        name: "Jo (Bâton)",
        icon: "🪵",
        techniques: [
          { id: "jo_suburi", name: "Jo Suburi", description: "Frappes de base au bâton", difficulty: 3 },
          { id: "jo_awase", name: "Jo Awase", description: "Travail en duo au Jo", difficulty: 3 },
          { id: "jo_kata", name: "Jo Kata", description: "Formes codifiées au Jo", difficulty: 4 },
          { id: "jo_dori", name: "Jo Dori", description: "Désarmement du Jo", difficulty: 4 },
        ]
      },
      {
        name: "Bokken (Sabre)",
        icon: "⚔️",
        techniques: [
          { id: "bokken_suburi", name: "Bokken Suburi", description: "Frappes de base au sabre", difficulty: 3 },
          { id: "bokken_awase", name: "Bokken Awase", description: "Travail en duo au Bokken", difficulty: 3 },
          { id: "ken_tai_jo", name: "Ken Tai Jo", description: "Sabre contre bâton", difficulty: 4 },
          { id: "kumitachi", name: "Kumitachi", description: "Combat codifié au sabre", difficulty: 4 },
        ]
      },
      {
        name: "Tanto (Couteau)",
        icon: "🗡️",
        techniques: [
          { id: "tanto_dori", name: "Tanto Dori", description: "Désarmement de couteau", difficulty: 4 },
          { id: "tanto_tsuki", name: "Tanto Tsuki Kotegaeshi", description: "Contre attaque piquée", difficulty: 4 },
          { id: "tanto_yokomen", name: "Tanto Yokomen Iriminage", description: "Contre frappe latérale", difficulty: 4 },
        ]
      },
      {
        name: "Hanmi Handachi",
        icon: "🧎",
        techniques: [
          { id: "hanmi_shiho", name: "Hanmi Handachi Shiho Nage", description: "Shiho Nage (tori à genoux)", difficulty: 4 },
          { id: "hanmi_irimi", name: "Hanmi Handachi Irimi Nage", description: "Irimi Nage (tori à genoux)", difficulty: 4 },
          { id: "hanmi_kaiten", name: "Hanmi Handachi Kaiten Nage", description: "Kaiten Nage (tori à genoux)", difficulty: 4 },
        ]
      }
    ]
  },
  "1er_kyu": {
    name: "1er Kyu",
    belt: "Ceinture Marron",
    color: "#92400E",
    gradient: "from-amber-700 to-amber-900",
    emoji: "🟤",
    description: "Préparation au grade Dan - maîtrise complète",
    categories: [
      {
        name: "Kokyu Nage",
        icon: "💨",
        techniques: [
          { id: "kokyu_nage_1", name: "Kokyu Nage (Katate Dori)", description: "Projection par le souffle", difficulty: 4 },
          { id: "kokyu_nage_2", name: "Kokyu Nage (Ryote Dori)", description: "Projection souffle 2 mains", difficulty: 4 },
          { id: "kokyu_ho", name: "Kokyu Ho", description: "Exercice de respiration", difficulty: 3 },
        ]
      },
      {
        name: "Jiyu Waza",
        icon: "🎭",
        techniques: [
          { id: "jiyu_waza_1", name: "Jiyu Waza (1 attaquant)", description: "Travail libre 1 contre 1", difficulty: 5 },
          { id: "jiyu_waza_2", name: "Jiyu Waza (2 attaquants)", description: "Travail libre 1 contre 2", difficulty: 5 },
        ]
      },
      {
        name: "Révision complète",
        icon: "📚",
        techniques: [
          { id: "revision_tachi", name: "Tachi Waza Complet", description: "Toutes techniques debout", difficulty: 5 },
          { id: "revision_suwari", name: "Suwari Waza Complet", description: "Toutes techniques à genoux", difficulty: 5 },
          { id: "revision_hanmi", name: "Hanmi Handachi Complet", description: "Toutes techniques mixtes", difficulty: 5 },
        ]
      }
    ]
  }
};

// Extended technique interface for functions
export interface ExtendedTechnique extends Technique {
  category: string;
  categoryIcon: string;
  kyu: string;
  belt: string;
}

// Get all techniques for a specific Kyu
export const getTechniquesByKyu = (kyuId: string): ExtendedTechnique[] => {
  const kyu = TECHNIQUES_BY_KYU[kyuId];
  if (!kyu) return [];
  
  const allTechniques: ExtendedTechnique[] = [];
  kyu.categories.forEach(category => {
    category.techniques.forEach(tech => {
      allTechniques.push({
        ...tech,
        category: category.name,
        categoryIcon: category.icon,
        kyu: kyu.name,
        belt: kyu.belt
      });
    });
  });
  return allTechniques;
};

// Count total techniques per Kyu
export const getTechniqueCountByKyu = (kyuId: string): number => {
  const kyu = TECHNIQUES_BY_KYU[kyuId];
  if (!kyu) return 0;
  
  return kyu.categories.reduce((total, cat) => total + cat.techniques.length, 0);
};

// Kyu order (from beginner to advanced)
export const KYU_ORDER = ["6e_kyu", "5e_kyu", "4e_kyu", "3e_kyu", "2e_kyu", "1er_kyu"];

// Total of all techniques
export const TOTAL_TECHNIQUES = KYU_ORDER.reduce((total, kyuId) => {
  return total + getTechniqueCountByKyu(kyuId);
}, 0);

export default TECHNIQUES_BY_KYU;
