/**
 * Service pour les phrases pré-enregistrées de Maître Tanaka
 * Permet d'économiser les appels API en utilisant des audios stockés
 */

// Manifest des phrases disponibles
export const TANAKA_PHRASES: Record<string, { text: string; file: string }> = {
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
    text: "Bravo, petit guerrier ! Tu as relevé ce défi avec brio !",
    file: "/audio/tanaka/challenge_complete.mp3"
  },
  challenge_first: {
    text: "Ton premier défi est accompli ! Je suis fier de toi, jeune ninja !",
    file: "/audio/tanaka/challenge_first.mp3"
  },
  challenge_hard: {
    text: "Incroyable ! Ce défi était difficile, mais tu l'as surmonté !",
    file: "/audio/tanaka/challenge_hard.mp3"
  },

  // Ceintures
  belt_white: {
    text: "Bienvenue sur le chemin de l'Aïkido ! Ta ceinture blanche symbolise la pureté de ton esprit.",
    file: "/audio/tanaka/belt_white.mp3"
  },
  belt_yellow: {
    text: "Félicitations pour ta ceinture jaune ! Comme le soleil levant, tu commences à briller.",
    file: "/audio/tanaka/belt_yellow.mp3"
  },
  belt_orange: {
    text: "Ta ceinture orange montre ta progression ! Comme la flamme, tu gagnes en intensité.",
    file: "/audio/tanaka/belt_orange.mp3"
  },
  belt_green: {
    text: "Ceinture verte ! Tes racines dans l'Aïkido deviennent profondes.",
    file: "/audio/tanaka/belt_green.mp3"
  },
  belt_blue: {
    text: "La ceinture bleue, comme le ciel infini ! Continue à explorer la Voie !",
    file: "/audio/tanaka/belt_blue.mp3"
  },
  belt_brown: {
    text: "Ceinture marron ! Tu approches de la maîtrise.",
    file: "/audio/tanaka/belt_brown.mp3"
  },
  belt_black: {
    text: "La ceinture noire ! Maintenant, le vrai apprentissage commence !",
    file: "/audio/tanaka/belt_black.mp3"
  },

  // Streaks
  streak_3: {
    text: "Trois jours consécutifs ! La régularité forge le caractère.",
    file: "/audio/tanaka/streak_3.mp3"
  },
  streak_7: {
    text: "Une semaine complète de pratique ! Ta persévérance porte ses fruits !",
    file: "/audio/tanaka/streak_7.mp3"
  },
  streak_14: {
    text: "Deux semaines sans relâche ! Tu montres un véritable esprit de Budoka.",
    file: "/audio/tanaka/streak_14.mp3"
  },
  streak_21: {
    text: "Trois semaines de pratique ! L'Aïkido devient une façon de vivre pour toi !",
    file: "/audio/tanaka/streak_21.mp3"
  },

  // Encouragements
  encourage_practice: {
    text: "La pratique quotidienne, même courte, vaut mieux qu'une longue séance occasionnelle.",
    file: "/audio/tanaka/encourage_practice.mp3"
  },
  encourage_patience: {
    text: "Patience, petit guerrier. La maîtrise vient avec le temps.",
    file: "/audio/tanaka/encourage_patience.mp3"
  },
  encourage_comeback: {
    text: "Te revoilà ! L'important n'est pas de tomber, mais de se relever.",
    file: "/audio/tanaka/encourage_comeback.mp3"
  },

  // XP et niveaux
  xp_gained: {
    text: "Bien joué ! Tu gagnes de l'expérience.",
    file: "/audio/tanaka/xp_gained.mp3"
  },
  level_up: {
    text: "Tu montes de niveau ! Ton esprit grandit, ton corps s'améliore.",
    file: "/audio/tanaka/level_up.mp3"
  },
  technique_mastered: {
    text: "Cette technique est maintenant gravée dans ton corps !",
    file: "/audio/tanaka/technique_mastered.mp3"
  },
  fail_encourage: {
    text: "Ne t'inquiète pas. L'échec est le meilleur professeur. Essaie encore !",
    file: "/audio/tanaka/fail_encourage.mp3"
  },
  badge_earned: {
    text: "Un nouveau badge ! Collectionne-les avec fierté !",
    file: "/audio/tanaka/badge_earned.mp3"
  },

  // Étapes du parcours
  step_2_techniques: {
    text: "Passons aux techniques ! Commence par les bases : les déplacements et les chutes.",
    file: "/audio/tanaka/step_2_techniques.mp3"
  },
  step_3_dojo: {
    text: "Bienvenue dans le Dojo Virtuel ! Tu vas jouer à des jeux pour développer ton calme.",
    file: "/audio/tanaka/step_3_dojo.mp3"
  },
  step_4_carnet: {
    text: "Bienvenue dans Ma Pratique ! Note ce que tu as pratiqué au dojo.",
    file: "/audio/tanaka/step_4_carnet.mp3"
  },
  step_5_progress: {
    text: "Tu progresses vite ! Continue comme ça !",
    file: "/audio/tanaka/step_5_progress.mp3"
  },
  step_6_mastery: {
    text: "Félicitations ! Ta véritable aventure commence maintenant.",
    file: "/audio/tanaka/step_6_mastery.mp3"
  }
};

export const BELT_PHRASE_MAP: Record<string, string> = {
  '6e_kyu': 'belt_white',
  '5e_kyu': 'belt_yellow',
  '4e_kyu': 'belt_orange',
  '3e_kyu': 'belt_green',
  '2e_kyu': 'belt_blue',
  '1er_kyu': 'belt_brown',
  'shodan': 'belt_black'
};

export const playTanakaPhrase = (phraseKey: string): Promise<{ audio: HTMLAudioElement; text: string; playing?: boolean; ended?: boolean }> => {
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

export const getGreetingPhrase = (): string => {
  const hour = new Date().getHours();
  return hour < 12 ? 'hello_morning' : 'hello_afternoon';
};

export const getBeltPhrase = (beltLevel: string): string => {
  return BELT_PHRASE_MAP[beltLevel] || 'belt_white';
};

export const getStreakPhrase = (streakDays: number): string | null => {
  if (streakDays >= 21) return 'streak_21';
  if (streakDays >= 14) return 'streak_14';
  if (streakDays >= 7) return 'streak_7';
  if (streakDays >= 3) return 'streak_3';
  return null;
};

export const getPhraseText = (phraseKey: string): string | null => {
  const phrase = TANAKA_PHRASES[phraseKey];
  return phrase ? phrase.text : null;
};

export const getAvailablePhrases = (): string[] => Object.keys(TANAKA_PHRASES);

export const phraseExists = (phraseKey: string): boolean => phraseKey in TANAKA_PHRASES;

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
