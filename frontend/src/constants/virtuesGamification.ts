/**
 * SYSTÈME DE GAMIFICATION DES 7 VERTUS MAGIQUES
 * 
 * Chaque vertu possède :
 * - 5 niveaux de progression (Apprenti → Maître)
 * - Des défis quotidiens et hebdomadaires
 * - Des badges à débloquer
 * - Des points d'expérience (XP)
 * - Un animal gardien qui évolue
 */

export interface AnimalEvolution {
  level: number;
  emoji: string;
  name: string;
  description: string;
}

export interface VirtueLevel {
  level: number;
  name: string;
  xpRequired: number;
  badge: string;
  title: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  xp: number;
  emoji: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
}

export interface Virtue {
  id: string;
  name: string;
  kanji: string;
  romaji: string;
  emoji: string;
  color: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  animal: {
    base: string;
    name: string;
    evolutions: AnimalEvolution[];
  };
  messages: Record<number, string>;
  levels: VirtueLevel[];
  dailyChallenges: Challenge[];
  weeklyChallenges: Challenge[];
  badges: Badge[];
}

export const VIRTUES_GAMIFICATION: Record<string, Virtue> = {
  respect: {
    id: "respect",
    name: "Respect",
    kanji: "礼",
    romaji: "REI",
    emoji: "🙏",
    color: "#FCD34D",
    gradient: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/40",
    animal: {
      base: "🦁",
      name: "Lion Noble",
      evolutions: [
        { level: 1, emoji: "🐱", name: "Petit Lionceau", description: "Tu apprends à saluer !" },
        { level: 2, emoji: "🦁", name: "Jeune Lion", description: "Tu montres du respect !" },
        { level: 3, emoji: "👑🦁", name: "Lion Couronné", description: "Tu inspires le respect !" },
        { level: 4, emoji: "🌟🦁", name: "Lion Étoilé", description: "Tu rayonnes de respect !" },
        { level: 5, emoji: "✨👑🦁", name: "Lion Légendaire", description: "Maître du Respect !" }
      ]
    },
    messages: {
      1: "Commence par bien saluer au dojo !",
      2: "Tu progresses dans le respect des règles !",
      3: "Les autres voient ton respect grandir !",
      4: "Tu deviens un exemple pour tous !",
      5: "Tu as atteint la maîtrise du Respect !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Salut Sincère" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Gardien des Règles" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Cœur Respectueux" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Pilier du Dojo" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître du Respect" }
    ],
    dailyChallenges: [
      { id: "respect_salut", name: "Salut Parfait", description: "Fais un salut sincère au début et à la fin du cours", xp: 10, emoji: "🙇" },
      { id: "respect_tatami", name: "Gardien du Tatami", description: "Aide à nettoyer ou ranger le tatami", xp: 15, emoji: "🧹" },
      { id: "respect_ecoute", name: "Oreilles Attentives", description: "Écoute ton sensei sans interrompre", xp: 10, emoji: "👂" },
      { id: "respect_merci", name: "Merci Sensei", description: "Remercie ton sensei à la fin du cours", xp: 5, emoji: "🙏" },
      { id: "respect_ponctuel", name: "Samouraï Ponctuel", description: "Arrive à l'heure au dojo", xp: 10, emoji: "⏰" }
    ],
    weeklyChallenges: [
      { id: "respect_week_saluts", name: "Semaine du Salut", description: "Fais des saluts parfaits pendant 5 cours", xp: 50, emoji: "🌟" },
      { id: "respect_week_aide", name: "Super Aidant", description: "Aide 3 fois au rangement cette semaine", xp: 40, emoji: "🦸" },
      { id: "respect_week_silence", name: "Maître du Silence", description: "Reste concentré et silencieux pendant tous les cours", xp: 60, emoji: "🤫" }
    ],
    badges: [
      { id: "first_bow", name: "Premier Salut", description: "Tu as fait ton premier salut sincère", emoji: "🙇", condition: "complete_first_challenge" },
      { id: "tatami_guardian", name: "Gardien du Tatami", description: "Tu as aidé 10 fois au rangement", emoji: "🛡️", condition: "help_10_times" },
      { id: "respect_streak_7", name: "7 Jours de Respect", description: "Tu as montré du respect 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "respect_master", name: "Maître du Respect", description: "Tu as atteint le niveau 5 en Respect", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  courage: {
    id: "courage",
    name: "Courage",
    kanji: "勇",
    romaji: "YU",
    emoji: "💪",
    color: "#FB923C",
    gradient: "from-orange-400 to-red-500",
    bgColor: "bg-orange-500/20",
    borderColor: "border-orange-500/40",
    animal: {
      base: "🐯",
      name: "Tigre Brave",
      evolutions: [
        { level: 1, emoji: "🐱", name: "Petit Tigrou", description: "Tu oses essayer !" },
        { level: 2, emoji: "🐯", name: "Jeune Tigre", description: "Tu deviens plus brave !" },
        { level: 3, emoji: "🔥🐯", name: "Tigre de Feu", description: "Le feu du courage brûle en toi !" },
        { level: 4, emoji: "⚡🐯", name: "Tigre Tonnerre", description: "Rien ne t'arrête !" },
        { level: 5, emoji: "✨🔥🐯", name: "Tigre Légendaire", description: "Maître du Courage !" }
      ]
    },
    messages: {
      1: "N'aie pas peur d'essayer !",
      2: "Tu oses faire des choses nouvelles !",
      3: "Ton courage inspire les autres !",
      4: "Tu affrontes tes peurs avec bravoure !",
      5: "Tu as atteint la maîtrise du Courage !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Première Audace" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Cœur Vaillant" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Âme Courageuse" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Guerrier Brave" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître du Courage" }
    ],
    dailyChallenges: [
      { id: "courage_demo", name: "Je montre !", description: "Propose de faire une démonstration devant le groupe", xp: 20, emoji: "🎭" },
      { id: "courage_question", name: "Main Levée", description: "Pose une question au sensei", xp: 10, emoji: "✋" },
      { id: "courage_nouveau", name: "Nouvelle Technique", description: "Essaie une technique que tu trouves difficile", xp: 15, emoji: "🆕" },
      { id: "courage_partenaire", name: "Nouveau Partenaire", description: "Travaille avec quelqu'un de nouveau", xp: 10, emoji: "🤝" },
      { id: "courage_chute", name: "Chute Sans Peur", description: "Fais une chute sans hésiter", xp: 15, emoji: "🌀" }
    ],
    weeklyChallenges: [
      { id: "courage_week_demo", name: "Démonstrateur", description: "Fais 3 démonstrations cette semaine", xp: 50, emoji: "⭐" },
      { id: "courage_week_difficile", name: "Chasseur de Défis", description: "Travaille 5 techniques difficiles", xp: 60, emoji: "🎯" },
      { id: "courage_week_parler", name: "Voix du Dojo", description: "Compte en japonais devant tout le monde", xp: 40, emoji: "🗣️" }
    ],
    badges: [
      { id: "first_demo", name: "Première Démo", description: "Tu as fait ta première démonstration", emoji: "🎭", condition: "complete_first_demo" },
      { id: "question_master", name: "Curieux", description: "Tu as posé 10 questions", emoji: "❓", condition: "ask_10_questions" },
      { id: "courage_streak_7", name: "7 Jours de Courage", description: "Tu as été courageux 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "courage_master", name: "Maître du Courage", description: "Tu as atteint le niveau 5 en Courage", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  maitrise: {
    id: "maitrise",
    name: "Maîtrise",
    kanji: "克",
    romaji: "KOKU",
    emoji: "🧘",
    color: "#22C55E",
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/40",
    animal: {
      base: "🐢",
      name: "Tortue Zen",
      evolutions: [
        { level: 1, emoji: "🐢", name: "Petite Tortue", description: "Tu apprends la patience !" },
        { level: 2, emoji: "🧘🐢", name: "Tortue Calme", description: "Tu restes calme !" },
        { level: 3, emoji: "🌊🐢", name: "Tortue de l'Océan", description: "Calme comme la mer !" },
        { level: 4, emoji: "🌙🐢", name: "Tortue Lunaire", description: "Sérénité parfaite !" },
        { level: 5, emoji: "✨🧘🐢", name: "Tortue Sage", description: "Maître de la Maîtrise !" }
      ]
    },
    messages: {
      1: "Respire et reste calme !",
      2: "Tu contrôles mieux tes émotions !",
      3: "Ta sérénité est remarquable !",
      4: "Tu es un modèle de calme !",
      5: "Tu as atteint la maîtrise de soi !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Souffle Calme" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Esprit Posé" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Cœur Serein" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Âme Zen" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître Zen" }
    ],
    dailyChallenges: [
      { id: "maitrise_respire", name: "Respiration Samouraï", description: "Fais 3 grandes respirations avant le cours", xp: 10, emoji: "🌬️" },
      { id: "maitrise_lent", name: "Mouvement Lent", description: "Exécute une technique très lentement avec contrôle", xp: 15, emoji: "🐌" },
      { id: "maitrise_silence", name: "Silence d'Or", description: "Reste silencieux et concentré pendant 10 minutes", xp: 10, emoji: "🤫" },
      { id: "maitrise_erreur", name: "Erreur Zen", description: "Accepte une erreur sans t'énerver", xp: 15, emoji: "😌" },
      { id: "maitrise_attente", name: "Patience du Samouraï", description: "Attends ton tour calmement", xp: 10, emoji: "⏳" }
    ],
    weeklyChallenges: [
      { id: "maitrise_week_calme", name: "Semaine Zen", description: "Reste calme pendant tous les cours de la semaine", xp: 60, emoji: "🧘" },
      { id: "maitrise_week_respiration", name: "Souffle Maître", description: "Pratique la respiration 5 fois cette semaine", xp: 40, emoji: "🌬️" },
      { id: "maitrise_week_lent", name: "Tortue Sage", description: "Fais 10 techniques au ralenti", xp: 50, emoji: "🐢" }
    ],
    badges: [
      { id: "first_breath", name: "Premier Souffle", description: "Tu as fait ta première respiration consciente", emoji: "🌬️", condition: "complete_first_breath" },
      { id: "zen_master", name: "Esprit Zen", description: "Tu es resté calme 20 fois", emoji: "🧘", condition: "stay_calm_20" },
      { id: "maitrise_streak_7", name: "7 Jours de Calme", description: "Tu es resté zen 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "maitrise_master", name: "Maître de la Maîtrise", description: "Tu as atteint le niveau 5", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  humilite: {
    id: "humilite",
    name: "Humilité",
    kanji: "謙",
    romaji: "KEN",
    emoji: "🌱",
    color: "#A78BFA",
    gradient: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-500/20",
    borderColor: "border-violet-500/40",
    animal: {
      base: "🐰",
      name: "Lapin Sage",
      evolutions: [
        { level: 1, emoji: "🐰", name: "Petit Lapin", description: "Tu apprends à écouter !" },
        { level: 2, emoji: "🌸🐰", name: "Lapin Fleuri", description: "Tu grandis dans l'humilité !" },
        { level: 3, emoji: "📚🐰", name: "Lapin Savant", description: "Tu apprends de tous !" },
        { level: 4, emoji: "🌙🐰", name: "Lapin de Lune", description: "Ta sagesse est grande !" },
        { level: 5, emoji: "✨🌸🐰", name: "Lapin Légendaire", description: "Maître de l'Humilité !" }
      ]
    },
    messages: {
      1: "Accepte d'être débutant !",
      2: "Tu apprends des autres avec plaisir !",
      3: "Tu reconnais tes erreurs avec sagesse !",
      4: "Tu inspires l'humilité autour de toi !",
      5: "Tu as atteint la maîtrise de l'Humilité !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Graine d'Humilité" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Cœur Ouvert" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Esprit Humble" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Sage Modeste" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître de l'Humilité" }
    ],
    dailyChallenges: [
      { id: "humilite_apprendre", name: "Toujours Apprendre", description: "Demande un conseil à quelqu'un", xp: 10, emoji: "📖" },
      { id: "humilite_erreur", name: "Erreur Acceptée", description: "Reconnais une erreur et corrige-la", xp: 15, emoji: "✅" },
      { id: "humilite_feliciter", name: "Bravo l'Ami !", description: "Félicite un camarade pour sa réussite", xp: 10, emoji: "👏" },
      { id: "humilite_debutant", name: "Ami des Débutants", description: "Aide un débutant sans te moquer", xp: 15, emoji: "🤝" },
      { id: "humilite_ecoute", name: "Grande Oreille", description: "Écoute un conseil sans l'interrompre", xp: 10, emoji: "👂" }
    ],
    weeklyChallenges: [
      { id: "humilite_week_aide", name: "Grand Frère/Sœur", description: "Aide 5 débutants cette semaine", xp: 50, emoji: "🤗" },
      { id: "humilite_week_conseil", name: "Éponge à Conseils", description: "Demande 5 conseils différents", xp: 40, emoji: "💡" },
      { id: "humilite_week_feliciter", name: "Champion des Bravos", description: "Félicite 10 camarades", xp: 45, emoji: "🎉" }
    ],
    badges: [
      { id: "first_advice", name: "Premier Conseil", description: "Tu as demandé ton premier conseil", emoji: "💡", condition: "ask_first_advice" },
      { id: "helper", name: "Super Aidant", description: "Tu as aidé 15 débutants", emoji: "🦸", condition: "help_15" },
      { id: "humilite_streak_7", name: "7 Jours d'Humilité", description: "Tu as été humble 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "humilite_master", name: "Maître de l'Humilité", description: "Tu as atteint le niveau 5", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  bienveillance: {
    id: "bienveillance",
    name: "Bienveillance",
    kanji: "仁",
    romaji: "JIN",
    emoji: "💝",
    color: "#EC4899",
    gradient: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-500/20",
    borderColor: "border-pink-500/40",
    animal: {
      base: "🐼",
      name: "Panda Gentil",
      evolutions: [
        { level: 1, emoji: "🐼", name: "Petit Panda", description: "Tu apprends la gentillesse !" },
        { level: 2, emoji: "💕🐼", name: "Panda Câlin", description: "Tu es doux avec les autres !" },
        { level: 3, emoji: "🌸🐼", name: "Panda Fleuri", description: "Ta gentillesse rayonne !" },
        { level: 4, emoji: "💖🐼", name: "Panda d'Amour", description: "Tu répands l'amour !" },
        { level: 5, emoji: "✨💝🐼", name: "Panda Légendaire", description: "Maître de la Bienveillance !" }
      ]
    },
    messages: {
      1: "Sois gentil avec tout le monde !",
      2: "Tu aides les autres avec plaisir !",
      3: "Ta gentillesse fait du bien !",
      4: "Tu es un rayon de soleil au dojo !",
      5: "Tu as atteint la maîtrise de la Bienveillance !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Cœur Doux" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Ami Fidèle" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Cœur Généreux" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Ange Gardien" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître Bienveillant" }
    ],
    dailyChallenges: [
      { id: "bienveillance_sourire", name: "Sourire Samouraï", description: "Souris à 5 personnes au dojo", xp: 10, emoji: "😊" },
      { id: "bienveillance_aide", name: "Coup de Main", description: "Aide quelqu'un spontanément", xp: 15, emoji: "🤝" },
      { id: "bienveillance_encourager", name: "Encourageur", description: "Encourage un camarade en difficulté", xp: 10, emoji: "💪" },
      { id: "bienveillance_accueil", name: "Comité d'Accueil", description: "Accueille un nouveau avec gentillesse", xp: 20, emoji: "👋" },
      { id: "bienveillance_pardon", name: "Pardon Facile", description: "Pardonne à quelqu'un qui t'a bousculé", xp: 10, emoji: "🕊️" }
    ],
    weeklyChallenges: [
      { id: "bienveillance_week_aide", name: "Super Héros", description: "Aide 7 personnes cette semaine", xp: 60, emoji: "🦸" },
      { id: "bienveillance_week_sourire", name: "Rayon de Soleil", description: "Souris à tout le monde pendant 5 cours", xp: 45, emoji: "☀️" },
      { id: "bienveillance_week_accueil", name: "Ambassadeur", description: "Accueille 3 nouveaux", xp: 50, emoji: "🎪" }
    ],
    badges: [
      { id: "first_help", name: "Premier Coup de Main", description: "Tu as aidé quelqu'un pour la première fois", emoji: "🤝", condition: "help_first" },
      { id: "smile_champion", name: "Champion du Sourire", description: "Tu as souri à 50 personnes", emoji: "😊", condition: "smile_50" },
      { id: "bienveillance_streak_7", name: "7 Jours de Bonté", description: "Tu as été bienveillant 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "bienveillance_master", name: "Maître Bienveillant", description: "Tu as atteint le niveau 5", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  attention: {
    id: "attention",
    name: "Attention",
    kanji: "注",
    romaji: "CHU",
    emoji: "👁️",
    color: "#06B6D4",
    gradient: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-500/20",
    borderColor: "border-cyan-500/40",
    animal: {
      base: "🦉",
      name: "Hibou Vigilant",
      evolutions: [
        { level: 1, emoji: "🦉", name: "Petit Hibou", description: "Tu ouvres grand les yeux !" },
        { level: 2, emoji: "👀🦉", name: "Hibou Curieux", description: "Tu observes tout !" },
        { level: 3, emoji: "🔍🦉", name: "Hibou Détective", description: "Rien ne t'échappe !" },
        { level: 4, emoji: "🌟🦉", name: "Hibou Étoilé", description: "Vision parfaite !" },
        { level: 5, emoji: "✨👁️🦉", name: "Hibou Légendaire", description: "Maître de l'Attention !" }
      ]
    },
    messages: {
      1: "Ouvre bien les yeux et les oreilles !",
      2: "Tu deviens plus observateur !",
      3: "Tu remarques les détails importants !",
      4: "Ta vigilance est exemplaire !",
      5: "Tu as atteint la maîtrise de l'Attention !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Yeux Ouverts" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Observateur" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Détective" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Œil de Faucon" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître Vigilant" }
    ],
    dailyChallenges: [
      { id: "attention_regarder", name: "Regard Samouraï", description: "Observe attentivement une démonstration du sensei", xp: 10, emoji: "👀" },
      { id: "attention_details", name: "Chasseur de Détails", description: "Remarque un détail technique et applique-le", xp: 15, emoji: "🔍" },
      { id: "attention_ecouter", name: "Super Oreilles", description: "Répète correctement une instruction du sensei", xp: 10, emoji: "👂" },
      { id: "attention_present", name: "100% Présent", description: "Reste concentré pendant tout le cours", xp: 15, emoji: "🎯" },
      { id: "attention_environnement", name: "Vision Panoramique", description: "Fais attention à l'espace autour de toi", xp: 10, emoji: "🌐" }
    ],
    weeklyChallenges: [
      { id: "attention_week_focus", name: "Super Concentré", description: "Reste attentif pendant 5 cours complets", xp: 60, emoji: "🎯" },
      { id: "attention_week_details", name: "Détective en Chef", description: "Trouve 10 détails techniques à améliorer", xp: 50, emoji: "🔎" },
      { id: "attention_week_ecoute", name: "Maître de l'Écoute", description: "Répète correctement 10 instructions", xp: 45, emoji: "📢" }
    ],
    badges: [
      { id: "first_observation", name: "Premier Regard", description: "Tu as observé attentivement pour la première fois", emoji: "👀", condition: "observe_first" },
      { id: "detail_hunter", name: "Chasseur de Détails", description: "Tu as remarqué 20 détails importants", emoji: "🔍", condition: "details_20" },
      { id: "attention_streak_7", name: "7 Jours d'Attention", description: "Tu as été attentif 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "attention_master", name: "Maître de l'Attention", description: "Tu as atteint le niveau 5", emoji: "👑", condition: "reach_level_5" }
    ]
  },
  
  responsabilite: {
    id: "responsabilite",
    name: "Responsabilité",
    kanji: "責",
    romaji: "SEKI",
    emoji: "⚖️",
    color: "#14B8A6",
    gradient: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/40",
    animal: {
      base: "🦅",
      name: "Aigle Responsable",
      evolutions: [
        { level: 1, emoji: "🦅", name: "Petit Aiglon", description: "Tu apprends à être responsable !" },
        { level: 2, emoji: "🎯🦅", name: "Aigle Précis", description: "Tu assumes tes actes !" },
        { level: 3, emoji: "⚡🦅", name: "Aigle Rapide", description: "Tu agis avec responsabilité !" },
        { level: 4, emoji: "🌟🦅", name: "Aigle Royal", description: "Tu es un exemple !" },
        { level: 5, emoji: "✨👑🦅", name: "Aigle Légendaire", description: "Maître de la Responsabilité !" }
      ]
    },
    messages: {
      1: "Assume tes choix et tes actes !",
      2: "Tu prends soin de tes affaires !",
      3: "On peut compter sur toi !",
      4: "Tu es un pilier de confiance !",
      5: "Tu as atteint la maîtrise de la Responsabilité !"
    },
    levels: [
      { level: 1, name: "Apprenti", xpRequired: 0, badge: "🥉", title: "Première Promesse" },
      { level: 2, name: "Initié", xpRequired: 50, badge: "🥈", title: "Parole Tenue" },
      { level: 3, name: "Confirmé", xpRequired: 150, badge: "🥇", title: "Digne de Confiance" },
      { level: 4, name: "Expert", xpRequired: 300, badge: "🏆", title: "Pilier du Dojo" },
      { level: 5, name: "Maître", xpRequired: 500, badge: "👑", title: "Maître Responsable" }
    ],
    dailyChallenges: [
      { id: "responsabilite_affaires", name: "Mes Affaires", description: "Range correctement ton kimono et tes affaires", xp: 10, emoji: "👕" },
      { id: "responsabilite_promesse", name: "Promesse Tenue", description: "Tiens une promesse que tu as faite", xp: 15, emoji: "🤞" },
      { id: "responsabilite_erreur", name: "J'assume !", description: "Reconnais une erreur sans accuser les autres", xp: 15, emoji: "✋" },
      { id: "responsabilite_role", name: "Mon Rôle", description: "Accomplis une tâche qu'on t'a confiée", xp: 15, emoji: "📋" },
      { id: "responsabilite_securite", name: "Gardien de la Sécurité", description: "Fais attention à ne blesser personne", xp: 10, emoji: "🛡️" }
    ],
    weeklyChallenges: [
      { id: "responsabilite_week_taches", name: "Super Responsable", description: "Accomplis 5 tâches confiées", xp: 50, emoji: "✅" },
      { id: "responsabilite_week_promesses", name: "Parole d'Or", description: "Tiens toutes tes promesses de la semaine", xp: 60, emoji: "🏆" },
      { id: "responsabilite_week_securite", name: "Ange Gardien", description: "Aucun incident de sécurité grâce à toi", xp: 45, emoji: "👼" }
    ],
    badges: [
      { id: "first_promise", name: "Première Promesse", description: "Tu as tenu ta première promesse", emoji: "🤞", condition: "promise_first" },
      { id: "task_master", name: "Maître des Tâches", description: "Tu as accompli 20 tâches", emoji: "✅", condition: "tasks_20" },
      { id: "responsabilite_streak_7", name: "7 Jours de Responsabilité", description: "Tu as été responsable 7 jours d'affilée", emoji: "🔥", condition: "streak_7" },
      { id: "responsabilite_master", name: "Maître Responsable", description: "Tu as atteint le niveau 5", emoji: "👑", condition: "reach_level_5" }
    ]
  }
};

// Global trophies
export interface Trophy {
  id: string;
  name: string;
  description: string;
  emoji: string;
  condition: string;
  xpBonus: number;
}

export const GLOBAL_TROPHIES: Trophy[] = [
  { id: "first_virtue", name: "Première Vertu", description: "Tu as débloqué ta première vertu !", emoji: "🌟", condition: "unlock_first_virtue", xpBonus: 50 },
  { id: "three_virtues", name: "Triangle des Vertus", description: "Tu as atteint le niveau 2 dans 3 vertus différentes", emoji: "🔺", condition: "three_virtues_level_2", xpBonus: 100 },
  { id: "all_virtues_started", name: "Explorateur des Vertus", description: "Tu as commencé à travailler les 7 vertus", emoji: "🗺️", condition: "all_virtues_started", xpBonus: 150 },
  { id: "week_streak", name: "Semaine Parfaite", description: "Tu as validé au moins un défi chaque jour pendant 7 jours", emoji: "🔥", condition: "7_day_streak", xpBonus: 200 },
  { id: "balanced_samouraï", name: "Samouraï Équilibré", description: "Tu as le même niveau dans toutes les vertus", emoji: "☯️", condition: "all_same_level", xpBonus: 250 },
  { id: "grand_master", name: "Grand Maître des Vertus", description: "Tu as atteint le niveau 5 dans toutes les vertus !", emoji: "🏯", condition: "all_level_5", xpBonus: 1000 }
];

// Special titles
export interface SpecialTitle {
  id: string;
  title: string;
  condition: string;
  emoji: string;
}

export const SPECIAL_TITLES: SpecialTitle[] = [
  { id: "debutant", title: "Jeune Samouraï", condition: "default", emoji: "🥋" },
  { id: "apprenti", title: "Apprenti Samouraï", condition: "total_xp_100", emoji: "🌱" },
  { id: "samouraï", title: "Samouraï", condition: "total_xp_500", emoji: "🥷" },
  { id: "samouraï_star", title: "Samouraï Étoilé", condition: "total_xp_1000", emoji: "⭐" },
  { id: "super_samouraï", title: "Super Samouraï", condition: "total_xp_2000", emoji: "💫" },
  { id: "samouraï_master", title: "Samouraï Maître", condition: "total_xp_5000", emoji: "🌟" },
  { id: "legend", title: "Légende du Dojo", condition: "total_xp_10000", emoji: "👑" }
];

// Utility functions
export const calculateLevel = (xp: number, virtueId: string): VirtueLevel => {
  const levels = VIRTUES_GAMIFICATION[virtueId]?.levels || [];
  let currentLevel = levels[0];
  
  for (const level of levels) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
};

export const getAnimalEvolution = (virtueId: string, level: number): AnimalEvolution | null => {
  const virtueData = VIRTUES_GAMIFICATION[virtueId];
  if (!virtueData?.animal?.evolutions) return null;
  
  return virtueData.animal.evolutions.find(e => e.level === level) || virtueData.animal.evolutions[0];
};

export const calculateTotalXp = (virtueXpMap: Record<string, number>): number => {
  return Object.values(virtueXpMap).reduce((sum, xp) => sum + (xp || 0), 0);
};

export default VIRTUES_GAMIFICATION;
