/**
 * 📅 AIKIDO STAGES DATA
 * Calendrier des stages et séminaires
 */

export interface Stage {
  id: string;
  title: string;
  sensei: string;
  senseiGrade: string;
  senseiPhoto?: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  city: string;
  country: string;
  description: string;
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  price: number;
  currency: string;
  maxParticipants?: number;
  currentParticipants: number;
  federation?: string;
  tags: string[];
  imageUrl?: string;
}

export const AIKIDO_STAGES: Stage[] = [
  {
    id: 'stage_paris_2026_01',
    title: 'Stage National FFAAA',
    sensei: 'Christian Tissier',
    senseiGrade: '8e Dan',
    date: '2026-02-15',
    endDate: '2026-02-16',
    time: '09:00 - 17:00',
    location: 'Gymnase Japy',
    city: 'Paris',
    country: 'France',
    description: 'Stage national dirigé par Christian Tissier Shihan. Travail des fondamentaux et techniques avancées.',
    level: 'all',
    price: 60,
    currency: 'EUR',
    maxParticipants: 200,
    currentParticipants: 145,
    federation: 'FFAAA',
    tags: ['national', 'shihan', 'paris'],
  },
  {
    id: 'stage_lyon_2026_02',
    title: 'Stage Régional Auvergne-Rhône-Alpes',
    sensei: 'Pascal Guillemin',
    senseiGrade: '6e Dan',
    date: '2026-02-22',
    time: '14:00 - 18:00',
    location: 'Dojo Municipal',
    city: 'Lyon',
    country: 'France',
    description: 'Stage régional - Travail des immobilisations (Osae Waza)',
    level: 'intermediate',
    price: 25,
    currency: 'EUR',
    maxParticipants: 80,
    currentParticipants: 52,
    federation: 'FFAAA',
    tags: ['regional', 'osae-waza', 'lyon'],
  },
  {
    id: 'stage_bordeaux_2026_03',
    title: 'Stage Armes - Jo et Bokken',
    sensei: 'Marc Bachraty',
    senseiGrade: '5e Dan',
    date: '2026-03-08',
    time: '10:00 - 17:00',
    location: 'Dojo Bordeaux Aikido',
    city: 'Bordeaux',
    country: 'France',
    description: 'Stage thématique sur le travail des armes traditionnelles.',
    level: 'intermediate',
    price: 35,
    currency: 'EUR',
    maxParticipants: 50,
    currentParticipants: 28,
    federation: 'FFAAA',
    tags: ['armes', 'jo', 'bokken', 'bordeaux'],
  },
  {
    id: 'stage_marseille_2026_04',
    title: 'Stage Préparation Grades',
    sensei: 'Philippe Gouttard',
    senseiGrade: '6e Dan',
    date: '2026-03-15',
    time: '09:00 - 12:00',
    location: 'Palais des Sports',
    city: 'Marseille',
    country: 'France',
    description: 'Stage de préparation aux passages de grades Kyu.',
    level: 'beginner',
    price: 20,
    currency: 'EUR',
    maxParticipants: 60,
    currentParticipants: 45,
    federation: 'FFAAA',
    tags: ['grades', 'preparation', 'kyu'],
  },
  {
    id: 'stage_tokyo_2026_05',
    title: 'Hombu Dojo Seminar',
    sensei: 'Mitsuteru Ueshiba',
    senseiGrade: 'Doshu',
    date: '2026-04-12',
    endDate: '2026-04-14',
    time: '06:30 - 08:00 / 15:00 - 16:30',
    location: 'Aikikai Hombu Dojo',
    city: 'Tokyo',
    country: 'Japan',
    description: 'Séminaire international au siège mondial de l\'Aikido avec le Doshu.',
    level: 'all',
    price: 15000,
    currency: 'JPY',
    maxParticipants: 300,
    currentParticipants: 267,
    federation: 'Aikikai',
    tags: ['international', 'hombu', 'doshu', 'japan'],
  },
  {
    id: 'stage_nantes_2026_06',
    title: 'Stage Jeunes - Ninja Camp',
    sensei: 'Sophie Martin',
    senseiGrade: '4e Dan',
    date: '2026-04-05',
    time: '10:00 - 16:00',
    location: 'Complexe Sportif Mangin-Beaulieu',
    city: 'Nantes',
    country: 'France',
    description: 'Stage ludique pour les jeunes pratiquants (8-14 ans). Jeux, techniques et philosophie.',
    level: 'beginner',
    price: 15,
    currency: 'EUR',
    maxParticipants: 40,
    currentParticipants: 32,
    federation: 'FFAAA',
    tags: ['jeunes', 'enfants', 'ludique', 'nantes'],
  },
  {
    id: 'stage_strasbourg_2026_07',
    title: 'Stage Européen - Ukemi Masterclass',
    sensei: 'Endo Seishiro',
    senseiGrade: '8e Dan',
    date: '2026-05-10',
    endDate: '2026-05-11',
    time: '09:00 - 18:00',
    location: 'Palais des Sports',
    city: 'Strasbourg',
    country: 'France',
    description: 'Masterclass sur l\'art de l\'ukemi (chutes) avec Endo Sensei.',
    level: 'advanced',
    price: 80,
    currency: 'EUR',
    maxParticipants: 150,
    currentParticipants: 89,
    federation: 'FFAAA',
    tags: ['european', 'ukemi', 'masterclass', 'shihan'],
  },
  {
    id: 'stage_toulouse_2026_08',
    title: 'Stage Découverte Aikido',
    sensei: 'Jean-Pierre Dupont',
    senseiGrade: '3e Dan',
    date: '2026-05-24',
    time: '14:00 - 17:00',
    location: 'Dojo Toulouse Centre',
    city: 'Toulouse',
    country: 'France',
    description: 'Stage d\'initiation gratuit ouvert à tous. Venez découvrir l\'Aikido !',
    level: 'beginner',
    price: 0,
    currency: 'EUR',
    maxParticipants: 30,
    currentParticipants: 18,
    federation: 'FFAAA',
    tags: ['decouverte', 'gratuit', 'initiation', 'toulouse'],
  },
];

// Get upcoming stages
export function getUpcomingStages(): Stage[] {
  const today = new Date().toISOString().split('T')[0];
  return AIKIDO_STAGES
    .filter(stage => stage.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Get stages by city
export function getStagesByCity(city: string): Stage[] {
  return AIKIDO_STAGES.filter(stage => 
    stage.city.toLowerCase().includes(city.toLowerCase())
  );
}

// Get stages by level
export function getStagesByLevel(level: Stage['level']): Stage[] {
  return AIKIDO_STAGES.filter(stage => stage.level === level || stage.level === 'all');
}

// Check if stage is full
export function isStageFull(stage: Stage): boolean {
  return stage.maxParticipants !== undefined && 
         stage.currentParticipants >= stage.maxParticipants;
}

// Format price
export function formatPrice(price: number, currency: string): string {
  if (price === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(price);
}
