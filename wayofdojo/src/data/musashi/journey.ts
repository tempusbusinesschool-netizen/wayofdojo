// Parcours initiatique adulte "Samouraï Confirmé"
// 9 villes du Japon - Inspiré du voyage de Miyamoto Musashi

export type MissionType = 'technique' | 'strategie' | 'interieure';
export type AdultRank = 'ronin' | 'kenshi' | 'bushi' | 'sensei' | 'maitre';

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  titleJp: string;
  description: string;
  scenario?: string;
  choices?: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  duration: number; // minutes
  xpReward: number;
  completed?: boolean;
}

export interface City {
  id: string;
  name: string;
  nameJp: string;
  theme: string;
  themeJp: string;
  description: string;
  latitude: number;
  longitude: number;
  color: string;
  gradient: string;
  icon: string;
  level: number;
  missions: Mission[];
  tanakaScript: string;
  musashiQuoteId: string;
  unlockRequirement?: {
    previousCity?: string;
    xpRequired?: number;
    missionsCompleted?: number;
  };
}

export interface AdultRankInfo {
  id: AdultRank;
  name: string;
  nameJp: string;
  description: string;
  minXp: number;
  maxXp: number;
  icon: string;
  color: string;
  kyu?: string;
}

// Rangs adultes hybrides (Titres + Kyu/Dan)
export const ADULT_RANKS: AdultRankInfo[] = [
  {
    id: 'ronin',
    name: 'Rōnin',
    nameJp: '浪人',
    description: 'Le guerrier errant qui cherche sa voie',
    minXp: 0,
    maxXp: 499,
    icon: '⚔️',
    color: '#6B7280',
    kyu: '6e-5e Kyu'
  },
  {
    id: 'kenshi',
    name: 'Kenshi',
    nameJp: '剣士',
    description: 'L\'épéiste qui maîtrise les bases',
    minXp: 500,
    maxXp: 1499,
    icon: '🗡️',
    color: '#3B82F6',
    kyu: '4e-3e Kyu'
  },
  {
    id: 'bushi',
    name: 'Bushi',
    nameJp: '武士',
    description: 'Le guerrier accompli',
    minXp: 1500,
    maxXp: 3499,
    icon: '🎌',
    color: '#8B5CF6',
    kyu: '2e-1er Kyu'
  },
  {
    id: 'sensei',
    name: 'Sensei',
    nameJp: '先生',
    description: 'Le maître qui transmet',
    minXp: 3500,
    maxXp: 6999,
    icon: '🏯',
    color: '#F59E0B',
    kyu: '1er-2e Dan'
  },
  {
    id: 'maitre',
    name: 'Maître',
    nameJp: '師範',
    description: 'Le sage qui a atteint la voie',
    minXp: 7000,
    maxXp: Infinity,
    icon: '🐉',
    color: '#DC2626',
    kyu: '3e Dan+'
  }
];

// Les 9 villes du parcours
export const ADULT_JOURNEY_CITIES: City[] = [
  {
    id: 'miyamoto',
    name: 'Miyamoto',
    nameJp: '宮本',
    theme: 'Posture intérieure',
    themeJp: '内なる姿勢',
    description: 'Le village natal de Musashi. Ici commence le voyage intérieur.',
    latitude: 34.8,
    longitude: 134.2,
    color: '#6B7280',
    gradient: 'from-slate-600 to-slate-800',
    icon: '🏔️',
    level: 1,
    musashiQuoteId: 'quote-1',
    tanakaScript: 'Avant de manier le corps, apprends à observer ton esprit. Le vrai combat commence en toi. Bienvenue sur la voie du Budō.',
    missions: [
      {
        id: 'miy-tech-1',
        type: 'technique',
        title: 'Posture naturelle',
        titleJp: '自然体',
        description: 'Analyse de la posture naturelle (shizentai). Identifier la posture correcte.',
        duration: 10,
        xpReward: 30,
        choices: [
          { id: 'a', text: 'Trop rigide - les épaules tendues', isCorrect: false, feedback: 'La rigidité empêche la fluidité du mouvement.' },
          { id: 'b', text: 'Trop relâchée - le centre est faible', isCorrect: false, feedback: 'Sans centre fort, pas de puissance dans la technique.' },
          { id: 'c', text: 'Stable et détendue - alignée', isCorrect: true, feedback: 'Excellent ! L\'équilibre entre tension et relâchement est la clé.' }
        ]
      },
      {
        id: 'miy-strat-1',
        type: 'strategie',
        title: 'Premier jour au dojo',
        titleJp: '道場の初日',
        description: 'Tu débutes dans un nouveau dojo. Comment te comporter ?',
        scenario: 'Tu arrives dans un dojo où tu ne connais personne. Les pratiquants semblent expérimentés.',
        duration: 15,
        xpReward: 40,
        choices: [
          { id: 'a', text: 'Montrer que tu sais déjà pratiquer', isCorrect: false, feedback: 'L\'orgueil est un obstacle sur la voie. Chaque dojo a ses particularités.' },
          { id: 'b', text: 'Observer en silence, avec humilité', isCorrect: true, feedback: 'Comme Musashi, observe d\'abord. L\'humilité est la porte de l\'apprentissage.' },
          { id: 'c', text: 'Te comparer aux autres pratiquants', isCorrect: false, feedback: 'La comparaison détourne de ton propre chemin. Concentre-toi sur toi-même.' }
        ]
      },
      {
        id: 'miy-int-1',
        type: 'interieure',
        title: 'Intention',
        titleJp: '意志',
        description: 'Méditation guidée : Pourquoi pratiques-tu l\'aïkido ?',
        scenario: 'Ferme les yeux. Respire profondément. Pose-toi cette question fondamentale.',
        duration: 10,
        xpReward: 35
      }
    ]
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    nameJp: '京都',
    theme: 'Discipline',
    themeJp: '規律',
    description: 'L\'ancienne capitale. Le cœur de la tradition et de la rigueur.',
    latitude: 35.0,
    longitude: 135.7,
    color: '#DC2626',
    gradient: 'from-red-600 to-red-800',
    icon: '⛩️',
    level: 2,
    musashiQuoteId: 'quote-3',
    tanakaScript: 'La discipline n\'est pas une contrainte. C\'est un engagement envers toi-même. Chaque répétition forge ton esprit.',
    unlockRequirement: { previousCity: 'miyamoto', missionsCompleted: 2 },
    missions: [
      {
        id: 'kyo-tech-1',
        type: 'technique',
        title: 'Irimi ou Tenkan',
        titleJp: '入身・転換',
        description: 'Face à shomen-uchi, choisis la bonne entrée selon le timing.',
        duration: 12,
        xpReward: 35,
        choices: [
          { id: 'a', text: 'Irimi direct - entrer immédiatement', isCorrect: false, feedback: 'Attention au timing. Trop tôt et tu prends le coup.' },
          { id: 'b', text: 'Tenkan - pivoter pour esquiver', isCorrect: false, feedback: 'Le tenkan est une option, mais parfois l\'entrée directe est plus efficace.' },
          { id: 'c', text: 'Analyser le timing puis choisir', isCorrect: true, feedback: 'Exact ! Le choix dépend du moment et de l\'intention de l\'attaquant.' }
        ]
      },
      {
        id: 'kyo-strat-1',
        type: 'strategie',
        title: 'Fatigue et engagement',
        titleJp: '疲労と献身',
        description: 'Tu es fatigué après une longue journée. L\'entraînement commence.',
        scenario: 'Ton corps est lourd, ton esprit dispersé. Mais le cours va commencer.',
        duration: 15,
        xpReward: 45,
        choices: [
          { id: 'a', text: 'Reporter l\'entraînement à demain', isCorrect: false, feedback: 'Reporter devient une habitude. La discipline combat la paresse.' },
          { id: 'b', text: 'S\'entraîner malgré la fatigue', isCorrect: true, feedback: 'C\'est dans l\'adversité que se forge le caractère. Continue !' },
          { id: 'c', text: 'Faire seulement l\'échauffement', isCorrect: false, feedback: 'Un demi-engagement produit des demi-résultats.' }
        ]
      },
      {
        id: 'kyo-int-1',
        type: 'interieure',
        title: 'Gestion de l\'effort',
        titleJp: '努力の管理',
        description: 'Visualisation : Accepter la difficulté comme un cadeau.',
        duration: 10,
        xpReward: 35
      }
    ]
  },
  {
    id: 'nara',
    name: 'Nara',
    nameJp: '奈良',
    theme: 'Vide / Centrage',
    themeJp: '空・中心',
    description: 'La cité des temples et de la méditation. Trouver le calme intérieur.',
    latitude: 34.7,
    longitude: 135.8,
    color: '#059669',
    gradient: 'from-emerald-600 to-emerald-800',
    icon: '🦌',
    level: 3,
    musashiQuoteId: 'quote-4',
    tanakaScript: 'Lorsque l\'esprit se tait, le corps comprend. Le vide n\'est pas l\'absence, c\'est la présence totale.',
    unlockRequirement: { previousCity: 'kyoto', missionsCompleted: 2 },
    missions: [
      {
        id: 'nar-tech-1',
        type: 'technique',
        title: 'Lecture d\'intention',
        titleJp: '意図の読み',
        description: 'Identifier l\'intention réelle de l\'attaquant.',
        duration: 15,
        xpReward: 40,
        choices: [
          { id: 'a', text: 'Attaque réelle - mouvement engagé', isCorrect: true, feedback: 'Bien vu ! Le corps entier s\'engage dans une vraie attaque.' },
          { id: 'b', text: 'Feinte - le regard trahit', isCorrect: false, feedback: 'Observe plus profondément. Une feinte a un autre rythme.' },
          { id: 'c', text: 'Hésitation - le doute est visible', isCorrect: false, feedback: 'L\'hésitation se voit dans le démarrage, pas dans ce cas.' }
        ]
      },
      {
        id: 'nar-strat-1',
        type: 'strategie',
        title: 'Agir ou attendre',
        titleJp: '行動か待機か',
        description: 'Face à un partenaire immobile, que fais-tu ?',
        scenario: 'Ton partenaire te fixe, immobile. Tu sens une tension.',
        duration: 12,
        xpReward: 40,
        choices: [
          { id: 'a', text: 'Attaquer en premier pour surprendre', isCorrect: false, feedback: 'L\'aïkido n\'initie jamais l\'attaque. Patience.' },
          { id: 'b', text: 'Rester centré, observer sans agir', isCorrect: true, feedback: 'Le vide permet de recevoir. Tu es prêt à tout moment.' },
          { id: 'c', text: 'Provoquer pour créer une réaction', isCorrect: false, feedback: 'La provocation est le contraire de l\'harmonie.' }
        ]
      },
      {
        id: 'nar-int-1',
        type: 'interieure',
        title: 'Méditation Zazen',
        titleJp: '座禅',
        description: 'Pratique de méditation assise. Vider l\'esprit.',
        duration: 15,
        xpReward: 50
      }
    ]
  },
  {
    id: 'himeji',
    name: 'Himeji',
    nameJp: '姫路',
    theme: 'Distance',
    themeJp: '間合い',
    description: 'Le château blanc. La perfection de la distance juste.',
    latitude: 34.8,
    longitude: 134.7,
    color: '#F5F5F5',
    gradient: 'from-gray-200 to-gray-400',
    icon: '🏯',
    level: 4,
    musashiQuoteId: 'quote-6',
    tanakaScript: 'Ni trop loin, ni trop près. La justesse de la distance est la clé de toute interaction, sur le tatami comme dans la vie.',
    unlockRequirement: { previousCity: 'nara', missionsCompleted: 2 },
    missions: [
      {
        id: 'him-tech-1',
        type: 'technique',
        title: 'Ma-ai parfait',
        titleJp: '完璧な間合い',
        description: 'Identifier la distance correcte pour différentes attaques.',
        duration: 15,
        xpReward: 45,
        choices: [
          { id: 'a', text: 'Distance longue (tōma) pour yokomen', isCorrect: false, feedback: 'Yokomen nécessite une distance moyenne.' },
          { id: 'b', text: 'Distance moyenne (chūma) pour shomen', isCorrect: true, feedback: 'Correct ! Chūma permet la réception et le mouvement.' },
          { id: 'c', text: 'Distance courte (chika-ma) pour tsuki', isCorrect: false, feedback: 'Tsuki est dangereux en distance courte.' }
        ]
      },
      {
        id: 'him-strat-1',
        type: 'strategie',
        title: 'Distance relationnelle',
        titleJp: '関係の距離',
        description: 'Dans un conflit personnel, comment gérer la distance ?',
        scenario: 'Une discussion s\'envenime avec un collègue. La tension monte.',
        duration: 15,
        xpReward: 50,
        choices: [
          { id: 'a', text: 'Se rapprocher pour intimider', isCorrect: false, feedback: 'L\'intimidation escalade le conflit.' },
          { id: 'b', text: 'Reculer pour fuir la confrontation', isCorrect: false, feedback: 'Fuir ne résout rien. Le conflit reviendra.' },
          { id: 'c', text: 'Maintenir une distance respectueuse', isCorrect: true, feedback: 'Comme en aïkido, la bonne distance permet le dialogue.' }
        ]
      },
      {
        id: 'him-int-1',
        type: 'interieure',
        title: 'Conscience spatiale',
        titleJp: '空間意識',
        description: 'Exercice de proprioception et de conscience de l\'espace.',
        duration: 12,
        xpReward: 40
      }
    ]
  },
  {
    id: 'osaka',
    name: 'Osaka',
    nameJp: '大阪',
    theme: 'Stratégie',
    themeJp: '戦略',
    description: 'La cité marchande. L\'art de l\'adaptation et de l\'anticipation.',
    latitude: 34.7,
    longitude: 135.5,
    color: '#F59E0B',
    gradient: 'from-amber-500 to-amber-700',
    icon: '🌆',
    level: 5,
    musashiQuoteId: 'quote-7',
    tanakaScript: 'Ne combats pas l\'attaque. Comprends-la. La stratégie véritable est de voir au-delà de l\'instant présent.',
    unlockRequirement: { previousCity: 'himeji', missionsCompleted: 2 },
    missions: [
      {
        id: 'osa-tech-1',
        type: 'technique',
        title: 'Direct, circulaire ou esquive',
        titleJp: '直接・円・躱し',
        description: 'Face à une attaque, quelle stratégie adopter ?',
        duration: 15,
        xpReward: 50,
        choices: [
          { id: 'a', text: 'Mouvement direct (irimi)', isCorrect: false, feedback: 'Parfois efficace, mais pas toujours la meilleure option.' },
          { id: 'b', text: 'Mouvement circulaire (tenkan)', isCorrect: false, feedback: 'Le tenkan est puissant mais demande le bon timing.' },
          { id: 'c', text: 'Adapter selon l\'énergie reçue', isCorrect: true, feedback: 'Excellent ! Le stratège s\'adapte. Pas de réponse fixe.' }
        ]
      },
      {
        id: 'osa-strat-1',
        type: 'strategie',
        title: 'Partenaire imprévisible',
        titleJp: '予測不能な相手',
        description: 'Comment gérer un partenaire aux mouvements chaotiques ?',
        scenario: 'Ton partenaire change constamment de rythme et de technique.',
        duration: 15,
        xpReward: 55,
        choices: [
          { id: 'a', text: 'Imposer ton propre rythme', isCorrect: false, feedback: 'Forcer crée une opposition. L\'aïkido harmonise.' },
          { id: 'b', text: 'Suivre son chaos sans structure', isCorrect: false, feedback: 'Sans structure, tu perds ton centre.' },
          { id: 'c', text: 'Rester centré et absorber le chaos', isCorrect: true, feedback: 'Le calme au centre de la tempête. Tu deviens le point fixe.' }
        ]
      },
      {
        id: 'osa-int-1',
        type: 'interieure',
        title: 'Prise de décision calme',
        titleJp: '冷静な決断',
        description: 'Exercice de respiration sous pression simulée.',
        duration: 12,
        xpReward: 45
      }
    ]
  },
  {
    id: 'edo',
    name: 'Edo',
    nameJp: '江戸',
    theme: 'Leadership',
    themeJp: '指導力',
    description: 'L\'ancienne Tokyo. Le siège du pouvoir et de la responsabilité.',
    latitude: 35.7,
    longitude: 139.8,
    color: '#8B5CF6',
    gradient: 'from-violet-600 to-violet-800',
    icon: '👑',
    level: 6,
    musashiQuoteId: 'quote-9',
    tanakaScript: 'Le vrai leader n\'impose pas. Il élève les autres. Diriger, c\'est servir.',
    unlockRequirement: { previousCity: 'osaka', missionsCompleted: 2 },
    missions: [
      {
        id: 'edo-tech-1',
        type: 'technique',
        title: 'Randori à deux',
        titleJp: '二人取り',
        description: 'Gérer deux attaquants simultanément.',
        duration: 20,
        xpReward: 60,
        choices: [
          { id: 'a', text: 'Neutraliser le plus proche d\'abord', isCorrect: false, feedback: 'Logique mais te rend vulnérable au second.' },
          { id: 'b', text: 'Se placer pour les aligner', isCorrect: true, feedback: 'Le positionnement stratégique est la clé. Un seul adversaire à la fois.' },
          { id: 'c', text: 'Attendre qu\'ils attaquent ensemble', isCorrect: false, feedback: 'L\'attente passive te met en danger.' }
        ]
      },
      {
        id: 'edo-strat-1',
        type: 'strategie',
        title: 'Encadrer un débutant',
        titleJp: '初心者の指導',
        description: 'Comment guider un pratiquant novice ?',
        scenario: 'Un nouveau venu te demande de l\'aide. Il fait tout incorrectement.',
        duration: 15,
        xpReward: 55,
        choices: [
          { id: 'a', text: 'Corriger chaque erreur immédiatement', isCorrect: false, feedback: 'Trop de corrections découragent. Priorise.' },
          { id: 'b', text: 'Le laisser découvrir par lui-même', isCorrect: false, feedback: 'Sans guidage, les mauvaises habitudes s\'installent.' },
          { id: 'c', text: 'Encourager d\'abord, corriger ensuite', isCorrect: true, feedback: 'Le vrai sensei valorise l\'effort avant de corriger.' }
        ]
      },
      {
        id: 'edo-int-1',
        type: 'interieure',
        title: 'Vision du leader',
        titleJp: '指導者のビジョン',
        description: 'Réflexion : Quel type de leader veux-tu être ?',
        duration: 15,
        xpReward: 50
      }
    ]
  },
  {
    id: 'kokura',
    name: 'Kokura',
    nameJp: '小倉',
    theme: 'Pression',
    themeJp: 'プレッシャー',
    description: 'La porte de Kyūshū. Gérer le stress et les provocations.',
    latitude: 33.9,
    longitude: 130.9,
    color: '#EF4444',
    gradient: 'from-red-500 to-red-700',
    icon: '🌋',
    level: 7,
    musashiQuoteId: 'quote-10',
    tanakaScript: 'Celui qui s\'énerve a déjà perdu. La vraie force est de rester calme quand tout pousse à réagir.',
    unlockRequirement: { previousCity: 'edo', missionsCompleted: 2 },
    missions: [
      {
        id: 'kok-tech-1',
        type: 'technique',
        title: 'Respirer sous attaque rapide',
        titleJp: '速攻下の呼吸',
        description: 'Maintenir une respiration contrôlée sous pression.',
        duration: 15,
        xpReward: 55,
        choices: [
          { id: 'a', text: 'Bloquer la respiration pour se concentrer', isCorrect: false, feedback: 'Bloquer la respiration crée de la tension.' },
          { id: 'b', text: 'Expirer sur chaque mouvement', isCorrect: true, feedback: 'L\'expiration libère, l\'inspiration prépare. Le cycle continu.' },
          { id: 'c', text: 'Respirer rapidement pour plus d\'énergie', isCorrect: false, feedback: 'La respiration rapide épuise et décentre.' }
        ]
      },
      {
        id: 'kok-strat-1',
        type: 'strategie',
        title: 'Provocation verbale',
        titleJp: '言葉の挑発',
        description: 'Comment réagir face à une provocation au dojo ?',
        scenario: 'Un partenaire fait des remarques désagréables pendant la pratique.',
        duration: 15,
        xpReward: 60,
        choices: [
          { id: 'a', text: 'Répondre avec la même agressivité', isCorrect: false, feedback: 'Tu nourris le conflit. L\'escalade est garantie.' },
          { id: 'b', text: 'Ignorer et continuer en silence', isCorrect: true, feedback: 'Le silence désarme la provocation. Reste dans ta pratique.' },
          { id: 'c', text: 'Se plaindre au sensei', isCorrect: false, feedback: 'Parfois nécessaire, mais d\'abord, gère par toi-même.' }
        ]
      },
      {
        id: 'kok-int-1',
        type: 'interieure',
        title: 'Gestion émotionnelle',
        titleJp: '感情管理',
        description: 'Visualisation pour transformer la colère en calme.',
        duration: 15,
        xpReward: 55
      }
    ]
  },
  {
    id: 'ganryujima',
    name: 'Ganryū-jima',
    nameJp: '巌流島',
    theme: 'Décision',
    themeJp: '決断',
    description: 'L\'île du duel légendaire. Le moment de vérité.',
    latitude: 33.9,
    longitude: 130.8,
    color: '#1F2937',
    gradient: 'from-gray-800 to-gray-900',
    icon: '⚡',
    level: 8,
    musashiQuoteId: 'quote-12',
    tanakaScript: 'La justesse du moment vaut plus que la force. Un instant d\'hésitation, et tout est perdu. Un instant trop tôt, pareil.',
    unlockRequirement: { previousCity: 'kokura', missionsCompleted: 2 },
    missions: [
      {
        id: 'gan-tech-1',
        type: 'technique',
        title: 'Timing parfait',
        titleJp: '完璧なタイミング',
        description: 'Identifier le moment exact pour exécuter la technique.',
        duration: 20,
        xpReward: 65,
        choices: [
          { id: 'a', text: 'Agir dès le début du mouvement', isCorrect: false, feedback: 'Trop tôt. L\'attaque n\'est pas encore engagée.' },
          { id: 'b', text: 'Agir au moment de l\'engagement', isCorrect: true, feedback: 'Le "kyo" - l\'instant de vulnérabilité. Tu l\'as saisi.' },
          { id: 'c', text: 'Agir après l\'impact', isCorrect: false, feedback: 'Trop tard. Tu as subi l\'attaque.' }
        ]
      },
      {
        id: 'gan-strat-1',
        type: 'strategie',
        title: 'Agir maintenant ou attendre',
        titleJp: '今行動か待機か',
        description: 'Une opportunité se présente mais le risque est réel.',
        scenario: 'Dans ta vie professionnelle, une décision importante. Agir ou attendre ?',
        duration: 20,
        xpReward: 70,
        choices: [
          { id: 'a', text: 'Attendre plus d\'informations', isCorrect: false, feedback: 'L\'attente infinie paralyse. Parfois, il faut trancher.' },
          { id: 'b', text: 'Agir sans réfléchir', isCorrect: false, feedback: 'L\'impulsivité n\'est pas le courage.' },
          { id: 'c', text: 'Évaluer, décider, assumer', isCorrect: true, feedback: 'Comme Musashi à Ganryū-jima. Prépare, agis, assume.' }
        ]
      },
      {
        id: 'gan-int-1',
        type: 'interieure',
        title: 'Assumer ses choix',
        titleJp: '選択を受け入れる',
        description: 'Méditation sur la responsabilité de ses décisions.',
        duration: 15,
        xpReward: 60
      }
    ]
  },
  {
    id: 'kumamoto',
    name: 'Kumamoto',
    nameJp: '熊本',
    theme: 'Transmission',
    themeJp: '伝承',
    description: 'La dernière demeure de Musashi. L\'héritage et le sens.',
    latitude: 32.8,
    longitude: 130.7,
    color: '#10B981',
    gradient: 'from-emerald-500 to-emerald-700',
    icon: '📜',
    level: 9,
    musashiQuoteId: 'quote-14',
    tanakaScript: 'Tu es devenu ce que tu pratiques. Maintenant, transmets. La voie continue à travers ceux que tu inspires.',
    unlockRequirement: { previousCity: 'ganryujima', missionsCompleted: 2 },
    missions: [
      {
        id: 'kum-tech-1',
        type: 'technique',
        title: 'Corriger avec bienveillance',
        titleJp: '優しく正す',
        description: 'Comment transmettre une correction technique ?',
        duration: 20,
        xpReward: 70,
        choices: [
          { id: 'a', text: 'Montrer l\'erreur clairement', isCorrect: false, feedback: 'Pointer l\'erreur peut décourager. Montre le bon chemin.' },
          { id: 'b', text: 'Démontrer la technique correcte', isCorrect: true, feedback: 'L\'exemple vaut mille mots. Inspire par l\'action.' },
          { id: 'c', text: 'Laisser l\'élève trouver seul', isCorrect: false, feedback: 'Guidage excessivement passif. Le sensei éclaire le chemin.' }
        ]
      },
      {
        id: 'kum-strat-1',
        type: 'strategie',
        title: 'Transmettre sans imposer',
        titleJp: '押し付けずに伝える',
        description: 'Comment partager ta passion sans forcer ?',
        scenario: 'Un ami te demande des conseils sur l\'aïkido pour sa vie.',
        duration: 15,
        xpReward: 65,
        choices: [
          { id: 'a', text: 'Donner tous les conseils possibles', isCorrect: false, feedback: 'L\'excès d\'information noie le message.' },
          { id: 'b', text: 'Partager une seule idée clé', isCorrect: true, feedback: 'Une graine bien plantée pousse seule. Moins mais mieux.' },
          { id: 'c', text: 'Refuser pour ne pas imposer', isCorrect: false, feedback: 'Partager n\'est pas imposer. L\'échange enrichit.' }
        ]
      },
      {
        id: 'kum-int-1',
        type: 'interieure',
        title: 'Bilan du voyage',
        titleJp: '旅の総括',
        description: 'Réflexion finale : Qu\'as-tu appris sur toi-même ?',
        duration: 20,
        xpReward: 80
      }
    ]
  }
];

// Fonctions utilitaires
export function getCityById(id: string): City | undefined {
  return ADULT_JOURNEY_CITIES.find(city => city.id === id);
}

export function getRankByXp(xp: number): AdultRankInfo {
  return ADULT_RANKS.find(rank => xp >= rank.minXp && xp <= rank.maxXp) || ADULT_RANKS[0];
}

export function getNextRank(currentRank: AdultRank): AdultRankInfo | null {
  const index = ADULT_RANKS.findIndex(r => r.id === currentRank);
  return index < ADULT_RANKS.length - 1 ? ADULT_RANKS[index + 1] : null;
}

export function calculateProgress(completedMissions: string[]): number {
  const totalMissions = ADULT_JOURNEY_CITIES.reduce((sum, city) => sum + city.missions.length, 0);
  return Math.round((completedMissions.length / totalMissions) * 100);
}

export function isCityUnlocked(cityId: string, completedMissions: string[], totalXp: number): boolean {
  const city = getCityById(cityId);
  if (!city || !city.unlockRequirement) return true;
  
  const { previousCity, xpRequired, missionsCompleted } = city.unlockRequirement;
  
  if (previousCity) {
    const prevCity = getCityById(previousCity);
    if (prevCity) {
      const prevMissionsCompleted = prevCity.missions.filter(m => completedMissions.includes(m.id)).length;
      if (prevMissionsCompleted < (missionsCompleted || prevCity.missions.length)) {
        return false;
      }
    }
  }
  
  if (xpRequired && totalXp < xpRequired) return false;
  
  return true;
}
