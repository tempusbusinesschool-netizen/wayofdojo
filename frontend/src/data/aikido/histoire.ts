/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HISTOIRE DE L'AÏKIDO — DONNÉES COMPLÈTES
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Contenu historique complet pour la page Histoire de WayofDojo
 * Incluant O'Sensei, la création de l'Aïkido, et la chronologie.
 */

export interface HistoricalFigure {
  id: string;
  name: string;
  japaneseName: string;
  title: string;
  birthYear: number;
  deathYear?: number;
  birthPlace: string;
  photo?: string;
  biography: string;
  keyEvents: { year: number; event: string }[];
  quotes: { japanese: string; french: string; romaji?: string }[];
  legacy: string[];
}

export interface HistoricalPeriod {
  id: string;
  name: string;
  japaneseName: string;
  startYear: number;
  endYear: number;
  description: string;
  keyEvents: { year: number; event: string }[];
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// O'SENSEI — MORIHEI UESHIBA
// ═══════════════════════════════════════════════════════════════════════════════

export const OSENSEI: HistoricalFigure = {
  id: 'osensei',
  name: 'Morihei Ueshiba',
  japaneseName: '植芝盛平',
  title: "O'Sensei (Grand Maître)",
  birthYear: 1883,
  deathYear: 1969,
  birthPlace: 'Tanabe, Préfecture de Wakayama, Japon',
  biography: `Morihei Ueshiba, surnommé O'Sensei ("Grand Maître") par ses élèves, est le fondateur de l'Aïkido. 
  
Né le 14 décembre 1883 à Tanabe, dans la préfecture de Wakayama, il était un enfant de constitution fragile mais d'esprit vif. Son père, Yoroku Ueshiba, était un fermier respecté et membre du conseil municipal.

Dès son plus jeune âge, Morihei fut attiré par les récits de son grand-père sur les exploits martiaux des samouraïs. Cette fascination le poussa à étudier de nombreux arts martiaux :

• Tenshin Shin'yo-ryu Jujutsu (1901)
• Goto-ha Yagyu Shingan-ryu (1903)
• Judo Kodokan sous Kiyoichi Takagi (1911)
• Daito-ryu Aiki-jujutsu sous Sokaku Takeda (1915-1937)

En 1919, sa rencontre avec Onisaburo Deguchi, leader spirituel de la secte Omoto-kyo, marqua un tournant décisif. Cette rencontre influença profondément sa vision spirituelle des arts martiaux.

En 1942, après des années de raffinement de sa pratique, il nomma officiellement son art "Aïkido" — la Voie de l'Harmonie avec l'Énergie.

O'Sensei est décédé le 26 avril 1969, laissant un héritage martial et spirituel qui continue d'inspirer des millions de pratiquants à travers le monde.`,
  
  keyEvents: [
    { year: 1883, event: "Naissance à Tanabe, Japon" },
    { year: 1901, event: "Début de l'étude du Tenshin Shin'yo-ryu Jujutsu à Tokyo" },
    { year: 1903, event: "Engagement dans l'armée japonaise, service en Mandchourie" },
    { year: 1912, event: "Installation à Hokkaido avec sa famille" },
    { year: 1915, event: "Rencontre avec Sokaku Takeda, maître du Daito-ryu" },
    { year: 1919, event: "Rencontre spirituelle décisive avec Onisaburo Deguchi" },
    { year: 1922, event: "Décès de son père; début d'une période de réflexion intense" },
    { year: 1927, event: "Installation à Tokyo, ouverture du premier dojo" },
    { year: 1931, event: "Ouverture du Kobukan Dojo à Wakamatsu-cho" },
    { year: 1942, event: "Création officielle du nom 'Aïkido'" },
    { year: 1948, event: "Fondation de l'Aikikai, reconnaissance officielle" },
    { year: 1961, event: "Voyage historique à Hawaï" },
    { year: 1969, event: "Décès à Iwama, Japon" },
  ],

  quotes: [
    {
      japanese: "合気道は相手と争うためではなく、世界を調和させる道である",
      romaji: "Aikido wa aite to arasou tame de wa naku, sekai wo chōwa saseru michi de aru",
      french: "L'Aïkido n'est pas une technique pour combattre et vaincre l'ennemi. C'est une voie pour réconcilier le monde et faire de l'humanité une seule famille."
    },
    {
      japanese: "真の勝利は自己に勝つことである",
      romaji: "Shin no shōri wa jiko ni katsu koto de aru",
      french: "La vraie victoire est la victoire sur soi-même."
    },
    {
      japanese: "合気とは敵と戦わず、敵と一体になることである",
      romaji: "Aiki to wa teki to tatakawazu, teki to ittai ni naru koto de aru",
      french: "L'Aiki consiste non pas à combattre l'adversaire, mais à ne faire qu'un avec lui."
    },
    {
      japanese: "武道の根本は愛である",
      romaji: "Budō no konpon wa ai de aru",
      french: "Le fondement du Budō est l'amour."
    },
    {
      japanese: "技を学ぶのではなく、心を学びなさい",
      romaji: "Waza wo manabu no de wa naku, kokoro wo manabi nasai",
      french: "N'apprenez pas la technique, apprenez le cœur."
    },
    {
      japanese: "天地と一体となれ",
      romaji: "Tenchi to ittai to nare",
      french: "Devenez un avec le Ciel et la Terre."
    },
  ],

  legacy: [
    "Création de l'Aïkido, art martial pratiqué par des millions de personnes",
    "Fondation de l'Aikikai, organisation mondiale de l'Aïkido",
    "Philosophie de non-violence et d'harmonie universelle",
    "Influence sur le développement des arts martiaux modernes",
    "Transmission d'une vision spirituelle du Budō",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// AUTRES FIGURES IMPORTANTES
// ═══════════════════════════════════════════════════════════════════════════════

export const HISTORICAL_FIGURES: HistoricalFigure[] = [
  OSENSEI,
  {
    id: 'kisshomaru',
    name: 'Kisshomaru Ueshiba',
    japaneseName: '植芝吉祥丸',
    title: 'Nidai Doshu (2e Doshu)',
    birthYear: 1921,
    deathYear: 1999,
    birthPlace: 'Ayabe, Japon',
    biography: `Troisième fils de Morihei Ueshiba, Kisshomaru a consacré sa vie à la diffusion mondiale de l'Aïkido. 
    Il a structuré l'enseignement et créé un système de grades reconnu internationalement. 
    Sous sa direction, l'Aïkido s'est répandu dans plus de 90 pays.`,
    keyEvents: [
      { year: 1921, event: "Naissance à Ayabe" },
      { year: 1942, event: "Diplômé de l'Université Waseda" },
      { year: 1948, event: "Devient Directeur Général de l'Aikikai" },
      { year: 1969, event: "Succède à son père comme Doshu" },
      { year: 1999, event: "Décès, transmission à Moriteru" },
    ],
    quotes: [
      {
        japanese: "合気道は平和への道である",
        french: "L'Aïkido est un chemin vers la paix."
      },
    ],
    legacy: [
      "Diffusion mondiale de l'Aïkido",
      "Standardisation de l'enseignement",
      "Création du système de grades international",
    ],
  },
  {
    id: 'moriteru',
    name: 'Moriteru Ueshiba',
    japaneseName: '植芝守央',
    title: 'Sandai Doshu (3e Doshu)',
    birthYear: 1951,
    birthPlace: 'Tokyo, Japon',
    biography: `Petit-fils du fondateur, Moriteru Ueshiba est l'actuel Doshu de l'Aïkido depuis 1999. 
    Il continue l'œuvre de son père et grand-père en préservant l'essence de l'Aïkido tout en l'adaptant au monde moderne.`,
    keyEvents: [
      { year: 1951, event: "Naissance à Tokyo" },
      { year: 1976, event: "Diplômé de l'Université Meiji Gakuin" },
      { year: 1996, event: "Nommé Directeur du Hombu Dojo" },
      { year: 1999, event: "Devient le 3e Doshu" },
    ],
    quotes: [
      {
        japanese: "稽古は真剣に、しかし楽しく",
        french: "La pratique doit être sérieuse, mais joyeuse."
      },
    ],
    legacy: [
      "Modernisation de l'enseignement",
      "Développement des médias numériques pour l'Aïkido",
      "Maintien de la tradition familiale",
    ],
  },
  {
    id: 'takeda',
    name: 'Sokaku Takeda',
    japaneseName: '武田惣角',
    title: 'Maître du Daito-ryu Aiki-jujutsu',
    birthYear: 1859,
    deathYear: 1943,
    birthPlace: 'Aizu, Japon',
    biography: `Sokaku Takeda était le maître du Daito-ryu Aiki-jujutsu, l'art martial qui a directement influencé la création de l'Aïkido. 
    Réputé pour ses compétences exceptionnelles, il a enseigné à Morihei Ueshiba pendant plus de 20 ans.`,
    keyEvents: [
      { year: 1859, event: "Naissance dans le clan Aizu" },
      { year: 1915, event: "Première rencontre avec Morihei Ueshiba" },
      { year: 1922, event: "Délivre le Kyoju Dairi à Ueshiba" },
      { year: 1943, event: "Décès à Aomori" },
    ],
    quotes: [
      {
        japanese: "合気は愛気なり",
        french: "L'Aiki est l'énergie de l'amour."
      },
    ],
    legacy: [
      "Transmission du Daito-ryu à Morihei Ueshiba",
      "Préservation des techniques anciennes du clan Aizu",
      "Influence fondamentale sur la création de l'Aïkido",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CHRONOLOGIE DE L'AÏKIDO
// ═══════════════════════════════════════════════════════════════════════════════

export const AIKIDO_TIMELINE: HistoricalPeriod[] = [
  {
    id: 'origins',
    name: 'Les Origines',
    japaneseName: '起源',
    startYear: 1883,
    endYear: 1919,
    color: '#8B4513',
    description: "Formation martiale de Morihei Ueshiba, étude des arts traditionnels japonais.",
    keyEvents: [
      { year: 1883, event: "Naissance de Morihei Ueshiba" },
      { year: 1901, event: "Début de l'étude du Jujutsu" },
      { year: 1915, event: "Rencontre avec Sokaku Takeda" },
    ],
  },
  {
    id: 'spiritual',
    name: 'L\'Éveil Spirituel',
    japaneseName: '精神的覚醒',
    startYear: 1919,
    endYear: 1942,
    color: '#4A90D9',
    description: "Période de transformation spirituelle sous l'influence d'Onisaburo Deguchi.",
    keyEvents: [
      { year: 1919, event: "Rencontre avec Onisaburo Deguchi" },
      { year: 1924, event: "Voyage en Mongolie" },
      { year: 1925, event: "Expérience mystique de l'illumination" },
      { year: 1931, event: "Ouverture du Kobukan Dojo" },
    ],
  },
  {
    id: 'creation',
    name: 'Création de l\'Aïkido',
    japaneseName: '合気道創設',
    startYear: 1942,
    endYear: 1969,
    color: '#D4AF37',
    description: "Formalisation et diffusion de l'Aïkido comme art martial distinct.",
    keyEvents: [
      { year: 1942, event: "Adoption officielle du nom 'Aïkido'" },
      { year: 1948, event: "Création de l'Aikikai" },
      { year: 1956, event: "Première démonstration publique à Tokyo" },
      { year: 1961, event: "Voyage d'O'Sensei à Hawaï" },
      { year: 1969, event: "Décès d'O'Sensei" },
    ],
  },
  {
    id: 'expansion',
    name: 'Expansion Mondiale',
    japaneseName: '世界展開',
    startYear: 1969,
    endYear: 1999,
    color: '#2E8B57',
    description: "Diffusion internationale sous la direction de Kisshomaru Ueshiba.",
    keyEvents: [
      { year: 1975, event: "L'Aïkido atteint l'Europe" },
      { year: 1980, event: "Création des fédérations nationales" },
      { year: 1985, event: "Premier congrès mondial à Tokyo" },
      { year: 1999, event: "Décès de Kisshomaru, succession de Moriteru" },
    ],
  },
  {
    id: 'modern',
    name: 'L\'Ère Moderne',
    japaneseName: '現代',
    startYear: 1999,
    endYear: 2025,
    color: '#9370DB',
    description: "Consolidation et adaptation de l'Aïkido au XXIe siècle.",
    keyEvents: [
      { year: 1999, event: "Moriteru Ueshiba devient Doshu" },
      { year: 2008, event: "Célébration des 125 ans de la naissance d'O'Sensei" },
      { year: 2019, event: "Célébration des 50 ans du décès d'O'Sensei" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNIFICATION DU NOM "AÏKIDO"
// ═══════════════════════════════════════════════════════════════════════════════

export const AIKIDO_MEANING = {
  full: '合気道',
  pronunciation: 'Aïkido',
  breakdown: [
    {
      kanji: '合',
      reading: 'Ai',
      meaning: 'Harmonie, Union, Rencontre',
      explanation: "Représente l'idée d'union, de rencontre harmonieuse avec l'énergie de l'adversaire plutôt que d'opposition.",
    },
    {
      kanji: '気',
      reading: 'Ki',
      meaning: 'Énergie vitale, Souffle, Esprit',
      explanation: "Le Ki est l'énergie universelle qui circule en tout être vivant. En Aïkido, on apprend à harmoniser son Ki avec celui du partenaire.",
    },
    {
      kanji: '道',
      reading: 'Dō',
      meaning: 'Voie, Chemin, Méthode',
      explanation: "Le Dō représente un chemin de vie, une quête d'amélioration continue qui va au-delà de la simple technique martiale.",
    },
  ],
  fullMeaning: "La Voie de l'Harmonie avec l'Énergie Universelle",
  philosophy: `L'Aïkido n'est pas seulement un ensemble de techniques de combat, mais une voie de développement personnel et spirituel. 
  Son objectif ultime n'est pas de vaincre un adversaire, mais de transformer le conflit en harmonie, 
  de transcender la dualité attaquant/défenseur pour atteindre un état d'unité.`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// LE BUDO — LA VOIE DU GUERRIER
// ═══════════════════════════════════════════════════════════════════════════════

export const BUDO_DEFINITION = {
  kanji: '武道',
  reading: 'Budō',
  literalMeaning: 'La Voie du Guerrier',
  breakdown: [
    {
      kanji: '武',
      reading: 'Bu',
      meaning: 'Martial, Guerrier',
      explanation: "Le caractère 武 (Bu) est composé de 止 (arrêter) et 戈 (lance/arme). Sa signification profonde est donc 'arrêter les armes' ou 'mettre fin au conflit' — l'essence même du vrai guerrier.",
    },
    {
      kanji: '道',
      reading: 'Dō',
      meaning: 'Voie, Chemin',
      explanation: "Le 道 (Dō) représente un chemin de vie, une quête d'amélioration continue. Ce n'est pas simplement une technique, mais une philosophie de vie.",
    },
  ],
  fullDefinition: `Le **Budō** (武道) est l'ensemble des arts martiaux japonais modernes pratiqués comme voie de développement personnel.

Contrairement au **Bujutsu** (武術 — techniques de guerre) qui visait l'efficacité au combat, le Budō transforme l'entraînement martial en chemin d'évolution spirituelle et morale.

Le paradoxe fondamental du Budō réside dans son étymologie : le caractère 武 (Bu/martial) contient les symboles "arrêter" et "lance". **Le vrai guerrier est celui qui met fin aux conflits, pas celui qui les provoque.**

O'Sensei Morihei Ueshiba disait : *"Le Budō n'est pas de vaincre l'adversaire par la force. C'est l'art de maintenir la paix du monde."*`,

  principles: [
    {
      name: 'Shin Gi Tai',
      kanji: '心技体',
      meaning: 'Esprit, Technique, Corps',
      description: "L'unité des trois éléments fondamentaux. Sans l'un, les deux autres sont incomplets.",
    },
    {
      name: 'Bunbu Ryōdō',
      kanji: '文武両道',
      meaning: 'La double voie des lettres et des armes',
      description: "Le guerrier accompli cultive autant son esprit (文) que ses compétences martiales (武).",
    },
    {
      name: 'Fudōshin',
      kanji: '不動心',
      meaning: 'Esprit immuable',
      description: "Un esprit stable et imperturbable, qui ne se laisse pas troubler par les émotions.",
    },
    {
      name: 'Mushin',
      kanji: '無心',
      meaning: 'Non-esprit / Esprit vide',
      description: "L'état de conscience sans pensées parasites, où l'action devient spontanée et naturelle.",
    },
    {
      name: 'Zanshin',
      kanji: '残心',
      meaning: 'Esprit qui demeure',
      description: "La vigilance maintenue après l'action. Ne jamais relâcher son attention.",
    },
  ],

  disciplines: [
    { name: 'Aïkido', kanji: '合気道', meaning: 'Voie de l\'harmonie avec l\'énergie' },
    { name: 'Judo', kanji: '柔道', meaning: 'Voie de la souplesse' },
    { name: 'Kendo', kanji: '剣道', meaning: 'Voie du sabre' },
    { name: 'Karate-dō', kanji: '空手道', meaning: 'Voie de la main vide' },
    { name: 'Kyūdō', kanji: '弓道', meaning: 'Voie de l\'arc' },
    { name: 'Iaidō', kanji: '居合道', meaning: 'Voie de l\'unité de l\'être' },
  ],

  bushido: {
    kanji: '武士道',
    reading: 'Bushidō',
    meaning: 'La Voie du Guerrier (code des samouraïs)',
    description: `Le **Bushidō** est le code moral et éthique des samouraïs, formalisé durant l'ère Edo (1603-1868).

Il définit les **7 vertus fondamentales** que tout guerrier doit cultiver :
- **Gi** (義) — Rectitude
- **Yū** (勇) — Courage  
- **Jin** (仁) — Bienveillance
- **Rei** (礼) — Respect
- **Makoto** (誠) — Sincérité
- **Meiyo** (名誉) — Honneur
- **Chūgi** (忠義) — Loyauté

Ces vertus ne sont pas de simples concepts — elles sont des guides de vie quotidienne. Le samouraï devait incarner ces valeurs en chaque instant, que ce soit sur le champ de bataille ou dans la vie civile.

Aujourd'hui, le Bushidō continue d'inspirer la pratique des arts martiaux et offre un cadre éthique universel pour le développement personnel.`,
  },

  quotes: [
    {
      author: "O'Sensei Morihei Ueshiba",
      japanese: "武道の根本は愛である",
      french: "Le fondement du Budō est l'amour.",
    },
    {
      author: "Jigoro Kano (Fondateur du Judo)",
      japanese: "精力善用、自他共栄",
      french: "Utiliser au mieux son énergie, prospérité mutuelle.",
    },
    {
      author: "Gichin Funakoshi (Père du Karaté moderne)",
      japanese: "空手に先手なし",
      french: "En karaté, il n'y a pas de première attaque.",
    },
    {
      author: "Miyamoto Musashi",
      japanese: "千日の稽古を鍛とし、万日の稽古を練とす",
      french: "Mille jours d'entraînement pour forger, dix mille jours pour polir.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// LES 7 VERTUS DU BUSHIDO
// ═══════════════════════════════════════════════════════════════════════════════

export interface Virtue {
  id: string;
  name: string;
  kanji: string;
  romaji: string;
  meaning: string;
  description: string;
  application: string;
  color: string;
  icon: string;
}

export const BUSHIDO_VIRTUES: Virtue[] = [
  {
    id: 'gi',
    name: 'Rectitude',
    kanji: '義',
    romaji: 'Gi',
    meaning: 'Justice, Droiture',
    description: "La capacité de prendre la bonne décision avec discernement, sans hésitation. C'est l'intégrité morale qui guide nos actions.",
    application: "En Aïkido, Gi se manifeste dans l'exécution juste et précise des techniques, sans excès ni défaut.",
    color: '#3B82F6',
    icon: '⚖️',
  },
  {
    id: 'yu',
    name: 'Courage',
    kanji: '勇',
    romaji: 'Yū',
    meaning: 'Bravoure, Héroïsme',
    description: "Le courage n'est pas l'absence de peur, mais la capacité d'agir malgré elle. C'est oser faire ce qui est juste.",
    application: "En Aïkido, le courage nous permet d'entrer dans l'attaque (irimi) au lieu de fuir, de faire face à nos limites.",
    color: '#EF4444',
    icon: '🦁',
  },
  {
    id: 'jin',
    name: 'Bienveillance',
    kanji: '仁',
    romaji: 'Jin',
    meaning: 'Compassion, Humanité',
    description: "La sympathie et l'amour inconditionnel pour l'humanité. C'est la capacité de se mettre à la place de l'autre.",
    application: "En Aïkido, Jin nous enseigne à respecter notre partenaire, à ne pas chercher à blesser mais à neutraliser.",
    color: '#EC4899',
    icon: '💝',
  },
  {
    id: 'rei',
    name: 'Respect',
    kanji: '礼',
    romaji: 'Rei',
    meaning: 'Politesse, Étiquette',
    description: "Le respect n'est pas une marque de faiblesse mais de force intérieure. C'est reconnaître la valeur de chaque être.",
    application: "En Aïkido, le salut (rei) ouvre et ferme chaque pratique, marquant le respect mutuel entre partenaires.",
    color: '#F59E0B',
    icon: '🙏',
  },
  {
    id: 'makoto',
    name: 'Sincérité',
    kanji: '誠',
    romaji: 'Makoto',
    meaning: 'Honnêteté, Vérité',
    description: "La sincérité implique de vivre en accord avec ses paroles et ses actes. C'est l'authenticité absolue.",
    application: "En Aïkido, chaque technique doit être exécutée avec une intention sincère, sans tromperie ni artifice.",
    color: '#06B6D4',
    icon: '💎',
  },
  {
    id: 'meiyo',
    name: 'Honneur',
    kanji: '名誉',
    romaji: 'Meiyo',
    meaning: 'Dignité, Gloire',
    description: "L'honneur est le reflet de notre intégrité. Il se construit par nos actions et se perd par nos manquements.",
    application: "En Aïkido, l'honneur nous pousse à donner le meilleur de nous-mêmes et à reconnaître nos erreurs.",
    color: '#8B5CF6',
    icon: '👑',
  },
  {
    id: 'chugi',
    name: 'Loyauté',
    kanji: '忠義',
    romaji: 'Chūgi',
    meaning: 'Fidélité, Dévouement',
    description: "La loyauté est l'engagement envers ceux qui nous font confiance. C'est tenir ses promesses envers et contre tout.",
    application: "En Aïkido, la loyauté envers notre sensei et notre dojo renforce notre progression sur la Voie.",
    color: '#10B981',
    icon: '🛡️',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════

export const getVirtueById = (id: string): Virtue | undefined => {
  return BUSHIDO_VIRTUES.find(v => v.id === id);
};

export const getHistoricalFigureById = (id: string): HistoricalFigure | undefined => {
  return HISTORICAL_FIGURES.find(f => f.id === id);
};

export const getTimelineByPeriod = (periodId: string): HistoricalPeriod | undefined => {
  return AIKIDO_TIMELINE.find(p => p.id === periodId);
};

export default {
  OSENSEI,
  HISTORICAL_FIGURES,
  AIKIDO_TIMELINE,
  AIKIDO_MEANING,
  BUDO_DEFINITION,
  BUSHIDO_VIRTUES,
};
