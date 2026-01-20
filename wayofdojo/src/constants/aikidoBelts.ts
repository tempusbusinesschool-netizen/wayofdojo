// Aikido Belt System - Real grades with KYU equivalence

export interface Belt {
  name: string;
  grade: string;
  color: string;
  gradient: string;
  textColor: string;
  emoji: string;
  order: number;
  points: number;
  symbolicRole: {
    name: string;
    virtue: string;
    intention: string;
  } | null;
  associatedVirtue: string;
  message: string;
  funMessage: string;
  animalSpirit: string;
  animalName: string;
  encouragement: string;
}

export const AIKIDO_BELTS: Record<string, Belt> = {
  "6e_kyu": {
    name: "Ceinture Blanche",
    grade: "6e kyu",
    color: "#E5E7EB",
    gradient: "from-gray-100 to-gray-300",
    textColor: "text-gray-800",
    emoji: "⚪",
    order: 0,
    points: 0,
    symbolicRole: null,
    associatedVirtue: "Humilité",
    message: "Bienvenue sur le chemin de l'Aïkido !",
    funMessage: "Tu commences une grande aventure ! 🌟",
    animalSpirit: "🪲",
    animalName: "Petit Scarabée",
    encouragement: "Chaque samouraï commence par le premier pas !"
  },
  "5e_kyu": {
    name: "Ceinture Jaune",
    grade: "5e kyu",
    color: "#FCD34D",
    gradient: "from-yellow-300 to-yellow-500",
    textColor: "text-yellow-900",
    emoji: "🟡",
    order: 1,
    points: 10,
    symbolicRole: { name: "Gardien du respect", virtue: "Respect", intention: "Cadre (salut, soin du tatami, posture)" },
    associatedVirtue: "Respect",
    message: "Tu apprends les bases avec sérieux !",
    funMessage: "Bravo ! Tu brilles comme le soleil ! ☀️",
    animalSpirit: "🪲",
    animalName: "Scarabée Doré",
    encouragement: "Tu grandis vite, continue comme ça !"
  },
  "4e_kyu": {
    name: "Ceinture Orange",
    grade: "4e kyu",
    color: "#FB923C",
    gradient: "from-orange-400 to-orange-600",
    textColor: "text-orange-900",
    emoji: "🟠",
    order: 2,
    points: 20,
    symbolicRole: { name: "Éclaireur du groupe", virtue: "Courage", intention: "Prise de parole (ex : compte en japonais, démontre avec le sensei)" },
    associatedVirtue: "Courage",
    message: "Tu progresses avec courage !",
    funMessage: "Tu es comme un tigre courageux ! 🐯",
    animalSpirit: "🐯",
    animalName: "Tigre Flamboyant",
    encouragement: "Rugis avec fierté, tu deviens fort !"
  },
  "3e_kyu": {
    name: "Ceinture Verte",
    grade: "3e kyu",
    color: "#22C55E",
    gradient: "from-green-500 to-green-700",
    textColor: "text-green-900",
    emoji: "🟢",
    order: 3,
    points: 30,
    symbolicRole: { name: "Gardien de l'harmonie", virtue: "Bienveillance", intention: "Aide les plus jeunes (tutorat doux)" },
    associatedVirtue: "Bienveillance",
    message: "Tu aides les autres avec bienveillance !",
    funMessage: "Tu es sage comme la forêt ! 🌲",
    animalSpirit: "🐢",
    animalName: "Tortue Sage",
    encouragement: "Pas à pas, tu traces ton chemin !"
  },
  "2e_kyu": {
    name: "Ceinture Bleue",
    grade: "2e kyu",
    color: "#3B82F6",
    gradient: "from-blue-500 to-blue-700",
    textColor: "text-blue-900",
    emoji: "🔵",
    order: 4,
    points: 40,
    symbolicRole: { name: "Gardien de la sérénité", virtue: "Sincérité", intention: "Calme et écoute active (reste centré, guide par le silence)" },
    associatedVirtue: "Sincérité",
    message: "Tu avances avec sérénité et sincérité !",
    funMessage: "Calme comme l'océan profond ! 🌊",
    animalSpirit: "🐬",
    animalName: "Dauphin Serein",
    encouragement: "Tu nages vers la maîtrise !"
  },
  "1er_kyu": {
    name: "Ceinture Marron",
    grade: "1er kyu",
    color: "#92400E",
    gradient: "from-amber-700 to-amber-900",
    textColor: "text-amber-100",
    emoji: "🟤",
    order: 5,
    points: 50,
    symbolicRole: { name: "Gardien de l'honneur", virtue: "Honneur", intention: "Représente les valeurs du dojo (exemple vivant pour les autres)" },
    associatedVirtue: "Honneur",
    message: "Tu incarnes l'honneur du dojo !",
    funMessage: "Tu es comme un aigle majestueux ! 🦅",
    animalSpirit: "🦅",
    animalName: "Aigle Royal",
    encouragement: "Tu survoles les autres, guide-les !"
  },
  "shodan": {
    name: "Ceinture Noire",
    grade: "Shodan (1er dan)",
    color: "#1F2937",
    gradient: "from-slate-800 to-slate-950",
    textColor: "text-white",
    emoji: "⚫",
    order: 6,
    points: 100,
    symbolicRole: { name: "Gardien de la transmission", virtue: "Loyauté", intention: "Responsabilité de transmettre (assiste le sensei)" },
    associatedVirtue: "Loyauté",
    message: "Tu es prêt à transmettre ton savoir !",
    funMessage: "Tu es devenu un vrai Samouraï Maître ! 🥷",
    animalSpirit: "🐉",
    animalName: "Dragon Légendaire",
    encouragement: "Le voyage continue, toujours plus haut !"
  }
};

// Mapping for legacy belt values (from old database format)
const LEGACY_BELT_MAPPING: Record<string, string> = {
  'blanche': '6e_kyu',
  'jaune': '5e_kyu',
  'orange': '4e_kyu',
  'verte': '3e_kyu',
  'bleue': '2e_kyu',
  'marron': '1er_kyu',
  'noire': 'shodan',
};

// Normalize belt key (handles both old and new formats)
export const normalizeBeltKey = (key: string | null | undefined): string => {
  if (!key) return '6e_kyu';
  // If it's already a valid key, return it
  if (AIKIDO_BELTS[key]) return key;
  // Check if it's a legacy value
  if (LEGACY_BELT_MAPPING[key.toLowerCase()]) {
    return LEGACY_BELT_MAPPING[key.toLowerCase()];
  }
  // Default fallback
  return '6e_kyu';
};

// Get belt by grade key (with legacy support)
export const getBeltByKey = (key: string): Belt => {
  const normalizedKey = normalizeBeltKey(key);
  return AIKIDO_BELTS[normalizedKey] || AIKIDO_BELTS["6e_kyu"];
};

// Get belt by points
export const getBeltByPoints = (points: number): Belt => {
  const belts = Object.values(AIKIDO_BELTS).sort((a, b) => b.points - a.points);
  return belts.find(belt => points >= belt.points) || AIKIDO_BELTS["6e_kyu"];
};

// Get next belt
export const getNextBelt = (currentBelt: Belt | null): Belt | null => {
  if (!currentBelt) return AIKIDO_BELTS["5e_kyu"];
  const belts = Object.values(AIKIDO_BELTS).sort((a, b) => a.order - b.order);
  const currentIndex = belts.findIndex(b => b.order === currentBelt.order);
  return currentIndex < belts.length - 1 ? belts[currentIndex + 1] : null;
};

// Belt order for progression
export const BELT_ORDER = ["6e_kyu", "5e_kyu", "4e_kyu", "3e_kyu", "2e_kyu", "1er_kyu", "shodan"];

export default AIKIDO_BELTS;
