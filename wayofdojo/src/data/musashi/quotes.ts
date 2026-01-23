// Citations de Miyamoto Musashi - Traité des Cinq Roues (五輪書 - Go Rin No Sho)
// Organisées par thème pour le parcours adulte "Samouraï Confirmé"

export interface MusashiQuote {
  id: string;
  japanese: string;
  romaji: string;
  french: string;
  english: string;
  theme: string;
  chapter: 'terre' | 'eau' | 'feu' | 'vent' | 'vide';
  cityId?: string;
}

export const MUSASHI_QUOTES: MusashiQuote[] = [
  // MIYAMOTO - Posture intérieure
  {
    id: 'quote-1',
    japanese: '今日は昨日の我に勝る',
    romaji: 'Kyō wa kinō no ware ni masaru',
    french: 'Aujourd\'hui est victoire sur soi-même d\'hier.',
    english: 'Today is victory over yourself of yesterday.',
    theme: 'posture',
    chapter: 'terre',
    cityId: 'miyamoto'
  },
  {
    id: 'quote-2',
    japanese: '千日の稽古を鍛とし、万日の稽古を練とす',
    romaji: 'Sen nichi no keiko wo tan to shi, man nichi no keiko wo ren to su',
    french: 'Mille jours d\'entraînement pour forger, dix mille jours pour polir.',
    english: 'A thousand days of training to forge, ten thousand days to polish.',
    theme: 'discipline',
    chapter: 'terre',
    cityId: 'kyoto'
  },
  // KYOTO - Discipline
  {
    id: 'quote-3',
    japanese: '道は日々の修行にあり',
    romaji: 'Michi wa hibi no shugyō ni ari',
    french: 'La voie se trouve dans l\'entraînement quotidien.',
    english: 'The way is in the daily training.',
    theme: 'discipline',
    chapter: 'terre',
    cityId: 'kyoto'
  },
  // NARA - Vide / Centrage
  {
    id: 'quote-4',
    japanese: '心を空にせよ',
    romaji: 'Kokoro wo kara ni seyo',
    french: 'Vide-toi de toute pensée.',
    english: 'Empty your mind.',
    theme: 'vide',
    chapter: 'vide',
    cityId: 'nara'
  },
  {
    id: 'quote-5',
    japanese: '空を知ることは、物を知ることなり',
    romaji: 'Kū wo shiru koto wa, mono wo shiru koto nari',
    french: 'Connaître le vide, c\'est connaître toute chose.',
    english: 'To know the void is to know all things.',
    theme: 'vide',
    chapter: 'vide',
    cityId: 'nara'
  },
  // HIMEJI - Distance
  {
    id: 'quote-6',
    japanese: '間合いを制する者は勝負を制す',
    romaji: 'Ma-ai wo seisuru mono wa shōbu wo seisu',
    french: 'Celui qui contrôle la distance contrôle le combat.',
    english: 'He who controls the distance controls the fight.',
    theme: 'distance',
    chapter: 'eau',
    cityId: 'himeji'
  },
  // OSAKA - Stratégie
  {
    id: 'quote-7',
    japanese: '兵法は遠きを見通す眼なり',
    romaji: 'Hyōhō wa tōki wo mitōsu me nari',
    french: 'La stratégie est l\'art de voir loin.',
    english: 'Strategy is the art of seeing far.',
    theme: 'strategie',
    chapter: 'feu',
    cityId: 'osaka'
  },
  {
    id: 'quote-8',
    japanese: '敵を知り、己を知れば百戦危うからず',
    romaji: 'Teki wo shiri, onore wo shireba hyakusen ayaukarazu',
    french: 'Connais ton ennemi, connais-toi toi-même, et tu ne seras jamais en péril.',
    english: 'Know your enemy, know yourself, and you will never be in peril.',
    theme: 'strategie',
    chapter: 'feu',
    cityId: 'osaka'
  },
  // EDO - Leadership
  {
    id: 'quote-9',
    japanese: '将たる者は先頭に立たず、後方から導く',
    romaji: 'Shō taru mono wa sentō ni tatazu, kōhō kara michibiku',
    french: 'Dirige sans dominer. Le vrai chef guide depuis l\'arrière.',
    english: 'Lead without dominating. The true leader guides from behind.',
    theme: 'leadership',
    chapter: 'vent',
    cityId: 'edo'
  },
  // KOKURA - Pression
  {
    id: 'quote-10',
    japanese: '嵐の中でも心を静かに保て',
    romaji: 'Arashi no naka demo kokoro wo shizuka ni tamote',
    french: 'Garde ton esprit calme même dans la tempête.',
    english: 'Keep your mind calm even in the storm.',
    theme: 'pression',
    chapter: 'eau',
    cityId: 'kokura'
  },
  {
    id: 'quote-11',
    japanese: '怒る者はすでに敗れたり',
    romaji: 'Ikaru mono wa sudeni yaburetari',
    french: 'Celui qui s\'énerve a déjà perdu.',
    english: 'He who loses his temper has already lost.',
    theme: 'pression',
    chapter: 'eau',
    cityId: 'kokura'
  },
  // GANRYU-JIMA - Décision
  {
    id: 'quote-12',
    japanese: '機を見て敏なれ',
    romaji: 'Ki wo mite bin nare',
    french: 'Saisis l\'instant avec discernement.',
    english: 'Seize the moment with discernment.',
    theme: 'decision',
    chapter: 'feu',
    cityId: 'ganryujima'
  },
  {
    id: 'quote-13',
    japanese: '一撃必殺の心構え',
    romaji: 'Ichigeki hissatsu no kokorogamae',
    french: 'L\'état d\'esprit d\'une frappe décisive.',
    english: 'The mindset of a decisive strike.',
    theme: 'decision',
    chapter: 'feu',
    cityId: 'ganryujima'
  },
  // KUMAMOTO - Transmission
  {
    id: 'quote-14',
    japanese: '道は終わることなし',
    romaji: 'Michi wa owaru koto nashi',
    french: 'La voie ne s\'arrête jamais.',
    english: 'The way never ends.',
    theme: 'transmission',
    chapter: 'vide',
    cityId: 'kumamoto'
  },
  {
    id: 'quote-15',
    japanese: '学びて時にこれを習う、また説ばしからずや',
    romaji: 'Manabite toki ni kore wo narau, mata yorokobashikarazu ya',
    french: 'Apprendre et pratiquer régulièrement, n\'est-ce pas une joie ?',
    english: 'To learn and practice regularly, is this not a joy?',
    theme: 'transmission',
    chapter: 'terre',
    cityId: 'kumamoto'
  }
];

// Fonction pour obtenir une citation par ville
export function getQuotesByCity(cityId: string): MusashiQuote[] {
  return MUSASHI_QUOTES.filter(q => q.cityId === cityId);
}

// Fonction pour obtenir une citation aléatoire par thème
export function getRandomQuoteByTheme(theme: string): MusashiQuote | undefined {
  const quotes = MUSASHI_QUOTES.filter(q => q.theme === theme);
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Fonction pour obtenir une citation du jour
export function getDailyQuote(): MusashiQuote {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return MUSASHI_QUOTES[dayOfYear % MUSASHI_QUOTES.length];
}
