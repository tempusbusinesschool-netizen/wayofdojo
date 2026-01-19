/**
 * 🥋 AIKIDO SPORT CONFIGURATION
 * Configuration complète pour le sport Aikido
 */

import { SportConfig } from '@/types/sport';

export const aikidoConfig: SportConfig = {
  id: 'aikido',
  name: 'Aikido',
  slug: 'aikido',
  
  // Thème visuel
  theme: {
    primaryColor: '#F59E0B', // Amber
    secondaryColor: '#92400E', // Brown
    accentColor: '#FCD34D', // Yellow
    gradientFrom: '#F59E0B',
    gradientTo: '#92400E',
  },
  
  // Système de grades
  grades: {
    kyu: [
      { id: '6e_kyu', name: 'Rokkyu', displayName: '6e Kyu', color: '#FFFFFF', belt: 'white', order: 1 },
      { id: '5e_kyu', name: 'Gokyu', displayName: '5e Kyu', color: '#FFD700', belt: 'yellow', order: 2 },
      { id: '4e_kyu', name: 'Yonkyu', displayName: '4e Kyu', color: '#FFA500', belt: 'orange', order: 3 },
      { id: '3e_kyu', name: 'Sankyu', displayName: '3e Kyu', color: '#228B22', belt: 'green', order: 4 },
      { id: '2e_kyu', name: 'Nikyu', displayName: '2e Kyu', color: '#1E90FF', belt: 'blue', order: 5 },
      { id: '1er_kyu', name: 'Ikkyu', displayName: '1er Kyu', color: '#8B4513', belt: 'brown', order: 6 },
    ],
    dan: [
      { id: 'shodan', name: 'Shodan', displayName: '1er Dan', color: '#000000', belt: 'black', order: 7 },
      { id: 'nidan', name: 'Nidan', displayName: '2e Dan', color: '#000000', belt: 'black', order: 8 },
      { id: 'sandan', name: 'Sandan', displayName: '3e Dan', color: '#000000', belt: 'black', order: 9 },
      { id: 'yondan', name: 'Yondan', displayName: '4e Dan', color: '#000000', belt: 'black', order: 10 },
      { id: 'godan', name: 'Godan', displayName: '5e Dan', color: '#000000', belt: 'black', order: 11 },
    ],
  },
  
  // Catégories de techniques
  categories: [
    { id: 'tachi_waza', name: 'Tachi Waza', description: 'Techniques debout' },
    { id: 'suwari_waza', name: 'Suwari Waza', description: 'Techniques à genoux' },
    { id: 'hanmi_handachi', name: 'Hanmi Handachi Waza', description: 'Uke debout, Tori à genoux' },
    { id: 'bukiwaza', name: 'Buki Waza', description: 'Techniques avec armes' },
    { id: 'ukemi', name: 'Ukemi', description: 'Chutes' },
    { id: 'tai_sabaki', name: 'Tai Sabaki', description: 'Déplacements' },
  ],
  
  // Armes
  weapons: [
    { id: 'jo', name: 'Jo', description: 'Bâton court (128 cm)' },
    { id: 'bokken', name: 'Bokken', description: 'Sabre en bois' },
    { id: 'tanto', name: 'Tanto', description: 'Couteau en bois' },
  ],
  
  // Glossaire (termes jamais traduits)
  glossary: {
    'ikkyo': 'Premier principe (contrôle du coude)',
    'nikyo': 'Deuxième principe (torsion du poignet)',
    'sankyo': 'Troisième principe (torsion spirale)',
    'yonkyo': 'Quatrième principe (pression sur le nerf)',
    'gokyo': 'Cinquième principe (contrôle du couteau)',
    'irimi': 'Entrée directe',
    'tenkan': 'Pivot',
    'omote': 'Devant (face)',
    'ura': 'Derrière (dos)',
    'shomenuchi': 'Frappe verticale au front',
    'yokomenuchi': 'Frappe latérale à la tempe',
    'tsuki': 'Coup de poing direct',
    'katatedori': 'Saisie du poignet',
    'morotedori': 'Saisie à deux mains',
    'ryotedori': 'Saisie des deux poignets',
    'kata': 'Épaule ou forme',
    'kokyu': 'Respiration / énergie',
    'nage': 'Projection / celui qui projette',
    'uke': 'Celui qui reçoit / chute',
    'sensei': 'Professeur / maître',
    'dojo': 'Lieu de pratique de la Voie',
    'rei': 'Salut',
    'seiza': 'Position à genoux formelle',
    'kamae': 'Garde / posture',
    'ma-ai': 'Distance de combat',
    'zanshin': 'Vigilance maintenue',
    'ki': 'Énergie vitale',
    'aiki': 'Harmonie des énergies',
    'do': 'La Voie',
  },
  
  // Gamification spécifique
  gamification: {
    xpPerTechnique: 10,
    xpPerTraining: 25,
    xpPerStage: 100,
    xpPerGradePass: 500,
    virtues: [
      { id: 'gi', name: 'Gi', translation: 'Droiture', icon: '⚖️' },
      { id: 'yu', name: 'Yu', translation: 'Courage', icon: '🦁' },
      { id: 'jin', name: 'Jin', translation: 'Bienveillance', icon: '💚' },
      { id: 'rei', name: 'Rei', translation: 'Respect', icon: '🙏' },
      { id: 'makoto', name: 'Makoto', translation: 'Sincérité', icon: '💎' },
      { id: 'meiyo', name: 'Meiyo', translation: 'Honneur', icon: '🏆' },
      { id: 'chugi', name: 'Chugi', translation: 'Loyauté', icon: '🤝' },
    ],
  },
  
  // Fédérations
  federations: [
    { id: 'ffaaa', name: 'FFAAA', country: 'FR', fullName: 'Fédération Française d\'Aïkido Aïkibudo et Affinitaires' },
    { id: 'ffab', name: 'FFAB', country: 'FR', fullName: 'Fédération Française d\'Aïkido et de Budo' },
    { id: 'aikikai', name: 'Aikikai', country: 'JP', fullName: 'Aikikai Foundation' },
  ],
};

export default aikidoConfig;
