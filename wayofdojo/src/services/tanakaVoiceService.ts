/**
 * Service pour les phrases pré-enregistrées de Maître Tanaka
 * Permet d'économiser les appels API en utilisant des audios stockés
 */

export interface TanakaPhrase {
  text: string;
  file: string;
}

// Manifest des phrases disponibles
export const TANAKA_PHRASES: Record<string, TanakaPhrase> = {
  // Bienvenue et salutations
  welcome: {
    text: "Bienvenue dans mon dojo virtuel, jeune ninja ! Je suis Maître Tanaka, ton guide sur la Voie de l'Aïkido.",
    file: "/audio/tanaka/welcome.mp3"
  },
  hello_morning: {
    text: "Ohayo gozaimasu, petit guerrier ! Que cette journée soit riche en apprentissages !",
    file: "/audio/tanaka/hello_morning.mp3"
  },
  hello_afternoon: {
    text: "Konnichiwa, jeune ninja ! Es-tu prêt pour ta pratique aujourd'hui ?",
    file: "/audio/tanaka/hello_afternoon.mp3"
  },
  goodbye: {
    text: "Sayonara, mon enfant. Continue de pratiquer avec cœur. À bientôt sur le tatami !",
    file: "/audio/tanaka/goodbye.mp3"
  },

  // Défis complétés
  challenge_complete: {
    text: "Bravo, petit guerrier ! Tu as relevé ce défi avec brio ! Comme le bambou qui plie mais ne rompt jamais, tu montres une belle persévérance.",
    file: "/audio/tanaka/challenge_complete.mp3"
  },
  challenge_first: {
    text: "Ton premier défi est accompli ! C'est le premier pas sur un long chemin. Je suis fier de toi, jeune ninja !",
    file: "/audio/tanaka/challenge_first.mp3"
  },
  challenge_hard: {
    text: "Incroyable ! Ce défi était difficile, mais tu l'as surmonté ! Comme disait O-Sensei : La vraie victoire est celle sur soi-même.",
    file: "/audio/tanaka/challenge_hard.mp3"
  },

  // Nouvelles ceintures
  belt_white: {
    text: "Bienvenue sur le chemin de l'Aïkido, jeune débutant ! Ta ceinture blanche symbolise la pureté de ton esprit, prêt à apprendre.",
    file: "/audio/tanaka/belt_white.mp3"
  },
  belt_yellow: {
    text: "Félicitations pour ta ceinture jaune ! Comme le soleil levant, tu commences à briller. Continue ainsi, petit guerrier !",
    file: "/audio/tanaka/belt_yellow.mp3"
  },
  belt_orange: {
    text: "Ta ceinture orange montre ta progression ! Comme la flamme, tu gagnes en intensité. Magnifique !",
    file: "/audio/tanaka/belt_orange.mp3"
  },
  belt_green: {
    text: "Ceinture verte ! Comme l'arbre qui grandit, tes racines dans l'Aïkido deviennent profondes. Je suis très fier de toi !",
    file: "/audio/tanaka/belt_green.mp3"
  },
  belt_blue: {
    text: "La ceinture bleue, comme le ciel infini ! Tes possibilités sont sans limites maintenant. Continue à explorer la Voie !",
    file: "/audio/tanaka/belt_blue.mp3"
  },
  belt_brown: {
    text: "Ceinture marron ! Tu approches de la maîtrise. Comme la montagne, tu es solide et stable. Quel chemin parcouru !",
    file: "/audio/tanaka/belt_brown.mp3"
  },
  belt_black: {
    text: "La ceinture noire ! Ce n'est pas la fin, mais un nouveau commencement. Maintenant, le vrai apprentissage commence !",
    file: "/audio/tanaka/belt_black.mp3"
  },

  // Séries de pratique (streaks)
  streak_3: {
    text: "Trois jours consécutifs ! La régularité forge le caractère, jeune ninja. Continue ainsi !",
    file: "/audio/tanaka/streak_3.mp3"
  },
  streak_7: {
    text: "Une semaine complète de pratique ! Comme l'eau qui sculpte la pierre, ta persévérance porte ses fruits !",
    file: "/audio/tanaka/streak_7.mp3"
  },
  streak_14: {
    text: "Deux semaines sans relâche ! Tu montres un véritable esprit de Budoka. Ton dévouement m'impressionne, petit guerrier !",
    file: "/audio/tanaka/streak_14.mp3"
  },
  streak_21: {
    text: "Trois semaines de pratique ! Incroyable ! Comme disait O-Sensei : L'Aïkido n'est pas une technique, c'est une façon de vivre. Tu l'as compris !",
    file: "/audio/tanaka/streak_21.mp3"
  },
  streak_30: {
    text: "Un mois complet de pratique ! Tu es devenu un vrai guerrier. O-Sensei serait fier de toi !",
    file: "/audio/tanaka/streak_30.mp3"
  },

  // Encouragements généraux
  encourage_practice: {
    text: "N'oublie pas, jeune ninja : la pratique quotidienne, même courte, vaut mieux qu'une longue séance occasionnelle.",
    file: "/audio/tanaka/encourage_practice.mp3"
  },
  encourage_patience: {
    text: "Patience, petit guerrier. La maîtrise vient avec le temps. Chaque erreur est un pas vers la perfection.",
    file: "/audio/tanaka/encourage_patience.mp3"
  },
  encourage_comeback: {
    text: "Te revoilà ! L'important n'est pas de tomber, mais de se relever. Je suis content de te revoir !",
    file: "/audio/tanaka/encourage_comeback.mp3"
  },

  // XP et niveaux
  xp_gained: {
    text: "Bien joué ! Tu gagnes de l'expérience. Chaque point te rapproche de la maîtrise !",
    file: "/audio/tanaka/xp_gained.mp3"
  },
  level_up: {
    text: "Tu montes de niveau ! Ton esprit grandit, ton corps s'améliore. Continue sur cette voie !",
    file: "/audio/tanaka/level_up.mp3"
  },

  // Technique maîtrisée
  technique_mastered: {
    text: "Cette technique est maintenant gravée dans ton corps ! Comme le dit le proverbe : Pratique dix mille fois, et la technique devient naturelle.",
    file: "/audio/tanaka/technique_mastered.mp3"
  },

  // Erreurs et échecs (encouragements)
  fail_encourage: {
    text: "Ne t'inquiète pas, jeune ninja. L'échec est le meilleur professeur. Essaie encore, tu y arriveras !",
    file: "/audio/tanaka/fail_encourage.mp3"
  },

  // Badges
  badge_earned: {
    text: "Un nouveau badge ! Chaque badge raconte une partie de ton histoire. Collectionne-les avec fierté !",
    file: "/audio/tanaka/badge_earned.mp3"
  },

  // Étapes du parcours guidé
  step_2_techniques: {
    text: "Maintenant, passons aux techniques ! Chaque ceinture a ses propres mouvements à maîtriser. Commence par les bases : les déplacements et les chutes. Ensuite, tu apprendras les vraies techniques !",
    file: "/audio/tanaka/step_2_techniques.mp3"
  },
  step_3_dojo: {
    text: "Bienvenue dans le Dojo Virtuel ! Ici, tu vas jouer à des jeux pour développer ton calme et ta concentration. Quand tu termines un jeu, tes parents diront si tout s'est bien passé. Tu pourras aussi noter les exercices que tu fais au vrai dojo !",
    file: "/audio/tanaka/step_3_dojo.mp3"
  },
  step_4_carnet: {
    text: "Bienvenue dans Ma Pratique ! Après ton cours au dojo, reviens ici pour noter ce que tu as pratiqué. C'est ton carnet personnel. Ta parole compte, sois honnête avec toi-même ! Chaque exercice noté te rapporte des points de Ki.",
    file: "/audio/tanaka/step_4_carnet.mp3"
  },
  step_4_validation: {
    text: "Tes parents sont fiers de toi ! Demande-leur de valider tes efforts. Ils peuvent voir tout ce que tu as accompli !",
    file: "/audio/tanaka/step_4_validation.mp3"
  },
  step_5_progress: {
    text: "Tu progresses vite ! Chaque point XP te rapproche de la prochaine ceinture. Continue comme ça et tu deviendras un vrai maître !",
    file: "/audio/tanaka/step_5_progress.mp3"
  },
  step_6_mastery: {
    text: "Félicitations, jeune ninja ! Tu as parcouru tout le chemin de l'initiation ! Maintenant, ta véritable aventure commence. Vise le titre de Légende du Dojo ! Je crois en toi !",
    file: "/audio/tanaka/step_6_mastery.mp3"
  }
};

// Belt mapping for automatic phrase selection
const BELT_PHRASE_MAP: Record<string, string> = {
  '6e_kyu': 'belt_white',
  '5e_kyu': 'belt_yellow',
  '4e_kyu': 'belt_orange',
  '3e_kyu': 'belt_green',
  '2e_kyu': 'belt_blue',
  '1er_kyu': 'belt_brown',
  'shodan': 'belt_black'
};

export interface PlayResult {
  audio: HTMLAudioElement;
  text: string;
  playing?: boolean;
  ended?: boolean;
}

/**
 * Play a pre-recorded phrase from Maître Tanaka
 */
export const playTanakaPhrase = (phraseKey: string): Promise<PlayResult> => {
  return new Promise((resolve, reject) => {
    const phrase = TANAKA_PHRASES[phraseKey];
    if (!phrase) {
      reject(new Error(`Unknown phrase: ${phraseKey}`));
      return;
    }

    const audio = new Audio(phrase.file);
    let resolved = false;
    
    audio.onended = () => {
      if (!resolved) {
        resolved = true;
        resolve({ audio, text: phrase.text, ended: true });
      }
    };
    
    audio.onerror = (error) => {
      if (!resolved) {
        resolved = true;
        console.error(`Error playing phrase ${phraseKey}:`, error);
        reject(error);
      }
    };

    audio.play()
      .then(() => {
        if (!resolved) {
          resolve({ audio, text: phrase.text, playing: true });
        }
      })
      .catch((err) => {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      });
  });
};

/**
 * Get the appropriate greeting based on time of day
 */
export const getGreetingPhrase = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'hello_morning';
  }
  return 'hello_afternoon';
};

/**
 * Get the belt congratulation phrase
 */
export const getBeltPhrase = (beltLevel: string): string => {
  return BELT_PHRASE_MAP[beltLevel] || 'belt_white';
};

/**
 * Get the streak congratulation phrase
 */
export const getStreakPhrase = (streakDays: number): string | null => {
  if (streakDays >= 30) return 'streak_30';
  if (streakDays >= 21) return 'streak_21';
  if (streakDays >= 14) return 'streak_14';
  if (streakDays >= 7) return 'streak_7';
  if (streakDays >= 3) return 'streak_3';
  return null;
};

/**
 * Get phrase text without playing audio
 */
export const getPhraseText = (phraseKey: string): string | null => {
  const phrase = TANAKA_PHRASES[phraseKey];
  return phrase ? phrase.text : null;
};

/**
 * Get all available phrase keys
 */
export const getAvailablePhrases = (): string[] => {
  return Object.keys(TANAKA_PHRASES);
};

/**
 * Check if a phrase exists
 */
export const phraseExists = (phraseKey: string): boolean => {
  return phraseKey in TANAKA_PHRASES;
};

export default {
  playTanakaPhrase,
  getGreetingPhrase,
  getBeltPhrase,
  getStreakPhrase,
  getPhraseText,
  getAvailablePhrases,
  phraseExists,
  TANAKA_PHRASES
};
