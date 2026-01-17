/**
 * 🏯 DOJO VIRTUEL - Centre d'entraînement gamifié
 * 
 * Architecture:
 * - 10 mini-jeux numériques pour enfants 6-14 ans
 * - Jeux numériques : validés par les PARENTS uniquement
 * - Exercices au dojo réel : AUTO-VALIDATION par l'utilisateur
 * - Coach virtuel: Maître Tanaka
 * - Système de points de Ki, badges, progression
 * 
 * RÈGLES DE VALIDATION STRICTES:
 * ✅ Jeux numériques → Parents valident
 * ✅ Exercices au dojo → L'enfant s'auto-valide (honnêteté)
 * ❌ Le sensei n'intervient PAS dans la validation numérique
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { 
  Gamepad2, Wind, Target, Ear, Brain, 
  Users, Heart, Eye, Footprints, Shield,
  Trophy, Star, Lock, Play, ChevronRight,
  X, Volume2, Info, Sparkles, RotateCcw
} from 'lucide-react';
import ProgressionTunnel from '../ProgressionTunnel';
import { getBeltByPoints } from '@/constants/aikidoBelts';

// Import des mini-jeux
import MessagerDuKi from './games/MessagerDuKi';
import ParcoursduSouffle from './games/ParcoursduSouffle';
import SenseiInvisible from './games/SenseiInvisible';
import ReflexePacifique from './games/ReflexePacifique';
import GardienEspace from './games/GardienEspace';
import MiroirHarmonie from './games/MiroirHarmonie';
import CheminEquilibre from './games/CheminEquilibre';
import MemorySensei from './games/MemorySensei';
import RythmeDuDojo from './games/RythmeDuDojo';
import QueteVertus from './games/QueteVertus';

// Image de Maître Tanaka
const TANAKA_IMAGE = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop&crop=face";

/**
 * Configuration des 10 mini-jeux
 */
const DOJO_GAMES = [
  {
    id: 'messager_ki',
    name: 'Le Messager du Ki',
    subtitle: 'Gestion du stress',
    icon: Wind,
    color: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-500/40',
    emoji: '🌊',
    ageRange: '5-14 ans',
    duration: '3-5 min',
    skills: ['Calme', 'Patience', 'Anticipation'],
    description: 'Traverse le dojo virtuel sans perdre ton équilibre. Respire, ralentis, garde ta posture !',
    tanakaIntro: "Jeune ninja, le Ki est l'énergie qui nous anime. Dans ce jeu, tu vas apprendre à le maîtriser en traversant le dojo. Si tu vas trop vite, tu perdras l'équilibre !",
    xpReward: 20,
    kiReward: 15,
    unlockLevel: 0,
    component: MessagerDuKi
  },
  {
    id: 'parcours_souffle',
    name: 'Parcours du Souffle',
    subtitle: 'Respiration consciente',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/40',
    emoji: '💨',
    ageRange: '5-14 ans',
    duration: '2-4 min',
    skills: ['Respiration', 'Concentration', 'Calme'],
    description: 'Ton avatar avance uniquement si tu respires au bon rythme. Inspire... Expire...',
    tanakaIntro: "La respiration est la clé de tout, petit guerrier. Dans ce parcours, ton avatar n'avancera que si tu respires correctement. Inspire par le nez, expire par la bouche.",
    xpReward: 25,
    kiReward: 20,
    unlockLevel: 1,
    component: ParcoursduSouffle
  },
  {
    id: 'sensei_invisible',
    name: 'Le Sensei Invisible',
    subtitle: 'Écoute & attention',
    icon: Ear,
    color: 'from-purple-500 to-violet-600',
    shadowColor: 'shadow-purple-500/40',
    emoji: '👂',
    ageRange: '6-14 ans',
    duration: '3-5 min',
    skills: ['Écoute', 'Attention', 'Confiance'],
    description: 'Ferme les yeux et suis les instructions de Maître Tanaka. Tourne, recule, salue...',
    tanakaIntro: "Ferme les yeux, jeune ninja. Je vais te guider uniquement avec ma voix. Fais confiance à tes autres sens. L'Aïkido se pratique aussi les yeux fermés !",
    xpReward: 30,
    kiReward: 25,
    unlockLevel: 2,
    component: SenseiInvisible
  },
  {
    id: 'reflexe_pacifique',
    name: 'Réflexe Pacifique',
    subtitle: 'Intelligence émotionnelle',
    icon: Brain,
    color: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/40',
    emoji: '🧠',
    ageRange: '7-14 ans',
    duration: '4-6 min',
    skills: ['Gestion émotions', 'Réflexion', 'Non-violence'],
    description: 'Face à des situations imprévues, choisis la réponse la plus sage. Pas de réaction automatique !',
    tanakaIntro: "L'Aïkido nous apprend à ne pas réagir avec colère ou peur. Dans ce jeu, tu vas voir des situations difficiles. Prends le temps de réfléchir avant de répondre.",
    xpReward: 35,
    kiReward: 30,
    unlockLevel: 3,
    component: ReflexePacifique
  },
  {
    id: 'gardien_espace',
    name: 'Gardien de l\'Espace',
    subtitle: 'Maîtrise du Ma-ai',
    icon: Target,
    color: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/40',
    emoji: '🎯',
    ageRange: '6-14 ans',
    duration: '3-5 min',
    skills: ['Distance', 'Anticipation', 'Positionnement'],
    description: 'Maintiens la distance parfaite avec les autres pratiquants. Ni trop près, ni trop loin !',
    tanakaIntro: "Le Ma-ai est l'espace entre toi et ton partenaire. Trop près, tu es en danger. Trop loin, tu ne peux pas agir. Trouve l'équilibre parfait !",
    xpReward: 25,
    kiReward: 20,
    unlockLevel: 2,
    component: GardienEspace
  },
  {
    id: 'miroir_harmonie',
    name: 'Miroir d\'Harmonie',
    subtitle: 'Synchronisation',
    icon: Users,
    color: 'from-indigo-500 to-blue-600',
    shadowColor: 'shadow-indigo-500/40',
    emoji: '🪞',
    ageRange: '5-12 ans',
    duration: '2-4 min',
    skills: ['Imitation', 'Observation', 'Coordination'],
    description: 'Reproduis les mouvements de Maître Tanaka comme un miroir parfait.',
    tanakaIntro: "En Aïkido, on apprend en observant et en imitant. Regarde bien mes mouvements et reproduis-les comme si tu étais mon reflet dans un miroir.",
    xpReward: 20,
    kiReward: 15,
    unlockLevel: 0,
    component: MiroirHarmonie
  },
  {
    id: 'chemin_equilibre',
    name: 'Chemin de l\'Équilibre',
    subtitle: 'Posture & centre',
    icon: Footprints,
    color: 'from-yellow-500 to-amber-600',
    shadowColor: 'shadow-yellow-500/40',
    emoji: '⚖️',
    ageRange: '5-14 ans',
    duration: '3-5 min',
    skills: ['Équilibre', 'Posture', 'Centre'],
    description: 'Garde ton avatar en équilibre sur un chemin étroit. Trouve ton centre !',
    tanakaIntro: "Le centre de ton corps, le Hara, est la source de ta force. Dans ce jeu, tu dois garder ton équilibre en trouvant ton centre. Ne te penche ni trop à gauche, ni trop à droite.",
    xpReward: 25,
    kiReward: 20,
    unlockLevel: 1,
    component: CheminEquilibre
  },
  {
    id: 'memory_sensei',
    name: 'Memory du Sensei',
    subtitle: 'Mémoire visuelle',
    icon: Eye,
    color: 'from-red-500 to-rose-600',
    shadowColor: 'shadow-red-500/40',
    emoji: '🎴',
    ageRange: '5-12 ans',
    duration: '3-5 min',
    skills: ['Mémoire', 'Concentration', 'Observation'],
    description: 'Associe les techniques d\'Aïkido avec leurs noms japonais.',
    tanakaIntro: "Un bon aikidoka doit connaître les noms de toutes les techniques. Dans ce jeu de mémoire, tu vas associer les images des techniques avec leurs noms japonais.",
    xpReward: 20,
    kiReward: 15,
    unlockLevel: 1,
    component: MemorySensei
  },
  {
    id: 'rythme_dojo',
    name: 'Rythme du Dojo',
    subtitle: 'Tempo & fluidité',
    icon: Gamepad2,
    color: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/40',
    emoji: '🥁',
    ageRange: '6-14 ans',
    duration: '2-4 min',
    skills: ['Rythme', 'Timing', 'Fluidité'],
    description: 'Tape au bon rythme pour accompagner les mouvements du dojo.',
    tanakaIntro: "L'Aïkido a son propre rythme. Parfois lent et fluide, parfois rapide et décisif. Dans ce jeu, tu vas apprendre à sentir ce rythme et à le suivre.",
    xpReward: 25,
    kiReward: 20,
    unlockLevel: 2,
    component: RythmeDuDojo
  },
  {
    id: 'quete_vertus',
    name: 'Quête des 7 Vertus',
    subtitle: 'Valeurs du Budo',
    icon: Shield,
    color: 'from-slate-600 to-slate-800',
    shadowColor: 'shadow-slate-500/40',
    emoji: '🛡️',
    ageRange: '7-14 ans',
    duration: '5-8 min',
    skills: ['Éthique', 'Réflexion', 'Valeurs'],
    description: 'Collecte les 7 vertus du Budo en résolvant des énigmes morales.',
    tanakaIntro: "Le Budo repose sur 7 vertus : Respect, Courage, Maîtrise, Humilité, Bienveillance, Attention et Responsabilité. Dans cette quête, tu vas découvrir chacune d'elles.",
    xpReward: 50,
    kiReward: 40,
    unlockLevel: 4,
    component: QueteVertus
  }
];

/**
 * VirtualDojo - Composant principal du Dojo Virtuel
 */
const VirtualDojo = ({ 
  isOpen, 
  onClose, 
  userName = '',
  userLevel = 0,
  userKi = 0,
  // Props pour les Défis du Jour
  statistics = {},
  virtueData = [],
  userId = null,
  isAuthenticated = false,
  onRefreshData = null
}) => {
  // États
  const [selectedGame, setSelectedGame] = useState(null);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [tanakaMessage, setTanakaMessage] = useState('');
  const [isTanakaSpeaking, setIsTanakaSpeaking] = useState(false);
  const [completedGames, setCompletedGames] = useState([]);
  const [gameScores, setGameScores] = useState({});
  const [totalKi, setTotalKi] = useState(userKi);
  const [showDojoReal, setShowDojoReal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // État pour les exercices au dojo réel validés par l'enfant
  const [completedDojoExercises, setCompletedDojoExercises] = useState(() => {
    const saved = localStorage.getItem('aikido_dojo_exercises_today');
    if (saved) {
      const data = JSON.parse(saved);
      // Reset si c'est un nouveau jour
      const today = new Date().toDateString();
      if (data.date === today) {
        return data.exercises || [];
      }
    }
    return [];
  });

  // Liste des exercices au dojo réel
  const DOJO_EXERCISES = [
    { 
      id: 'salut', 
      name: 'Salut au dojo', 
      emoji: '🙏', 
      ki: 10,
      description: 'Tu as salué en entrant et en sortant du tatami',
      encouragement: 'Le respect commence par le salut !'
    },
    { 
      id: 'echauffement', 
      name: 'Échauffement', 
      emoji: '🔥', 
      ki: 15,
      description: 'Tu as bien préparé ton corps avant de pratiquer',
      encouragement: 'Un corps bien échauffé est prêt à apprendre !'
    },
    { 
      id: 'ukemi', 
      name: 'Chutes (Ukemi)', 
      emoji: '🔄', 
      ki: 20,
      description: 'Tu as pratiqué les roulades avant ou arrière',
      encouragement: 'Savoir chuter, c\'est savoir se protéger !'
    },
    { 
      id: 'tai_sabaki', 
      name: 'Déplacements', 
      emoji: '🦶', 
      ki: 20,
      description: 'Tu as travaillé tes déplacements (Tai Sabaki)',
      encouragement: 'Bien se déplacer, c\'est la base de tout !'
    },
    { 
      id: 'technique', 
      name: 'Technique avec partenaire', 
      emoji: '🤝', 
      ki: 25,
      description: 'Tu as pratiqué une technique avec un partenaire',
      encouragement: 'Ensemble, on progresse mieux !'
    },
    { 
      id: 'attention', 
      name: 'Bien écouté le cours', 
      emoji: '👂', 
      ki: 15,
      description: 'Tu as été attentif aux explications',
      encouragement: 'L\'écoute est la clé de l\'apprentissage !'
    },
    { 
      id: 'aide', 
      name: 'Aidé un camarade', 
      emoji: '💝', 
      ki: 20,
      description: 'Tu as aidé quelqu\'un pendant le cours',
      encouragement: 'La bienveillance te rend plus fort !'
    },
    { 
      id: 'rangement', 
      name: 'Rangement du dojo', 
      emoji: '🧹', 
      ki: 10,
      description: 'Tu as participé au rangement après le cours',
      encouragement: 'Prendre soin du dojo, c\'est respecter la pratique !'
    }
  ];

  // Valider un exercice au dojo
  const handleValidateDojoExercise = (exerciseId) => {
    const exercise = DOJO_EXERCISES.find(e => e.id === exerciseId);
    if (!exercise || completedDojoExercises.includes(exerciseId)) return;
    
    const newCompleted = [...completedDojoExercises, exerciseId];
    setCompletedDojoExercises(newCompleted);
    
    // Sauvegarder avec la date du jour
    const today = new Date().toDateString();
    localStorage.setItem('aikido_dojo_exercises_today', JSON.stringify({
      date: today,
      exercises: newCompleted
    }));
    
    // Ajouter les points Ki
    const newKi = totalKi + exercise.ki;
    setTotalKi(newKi);
    
    // Sauvegarder la progression totale
    const progressData = {
      completedGames,
      gameScores,
      totalKi: newKi
    };
    localStorage.setItem('aikido_dojo_progress', JSON.stringify(progressData));
    
    // Message de Tanaka
    setTanakaMessage(`${exercise.encouragement} +${exercise.ki} points de Ki ! 🌟`);
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 3000);
  };

  // Calculer la progression du jour
  const todayProgress = {
    completed: completedDojoExercises.length,
    total: DOJO_EXERCISES.length,
    percent: Math.round((completedDojoExercises.length / DOJO_EXERCISES.length) * 100),
    kiEarned: completedDojoExercises.reduce((sum, id) => {
      const ex = DOJO_EXERCISES.find(e => e.id === id);
      return sum + (ex?.ki || 0);
    }, 0)
  };

  // Charger la progression depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aikido_dojo_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedGames(data.completedGames || []);
      setGameScores(data.gameScores || {});
      setTotalKi(data.totalKi || 0);
    }
  }, []);

  // Recommencer le parcours (remise à zéro)
  const handleResetProgress = () => {
    setCompletedGames([]);
    setGameScores({});
    setTotalKi(0);
    localStorage.removeItem('aikido_dojo_progress');
    setShowResetConfirm(false);
    setTanakaMessage('Tu recommences le parcours. Tu pourras rejouer tranquillement !');
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 3000);
  };

  // Sauvegarder la progression
  const saveProgress = useCallback((newCompleted, newScores, newKi) => {
    const data = { completedGames: newCompleted, gameScores: newScores, totalKi: newKi };
    localStorage.setItem('aikido_dojo_progress', JSON.stringify(data));
  }, []);

  // Message d'accueil de Tanaka - Pédagogique et rassurant pour les enfants 6-14 ans
  useEffect(() => {
    if (isOpen && !selectedGame) {
      const displayName = userName || 'jeune ninja';
      const completedCount = completedGames.length;
      
      if (completedCount === 0) {
        // Premier message : explication complète, rassurante et pédagogique
        setTanakaMessage(
          `Bienvenue dans le Dojo Virtuel, ${displayName} ! 🎮\n\n` +
          `Ici, tu vas apprendre en jouant ! Chaque jeu est un petit défi pour t'aider à mieux comprendre les mouvements, la concentration et l'esprit du dojo.\n\n` +
          `Prends ton temps : tu peux recommencer autant de fois que tu veux. Il n'y a pas d'échec, seulement des progrès !\n\n` +
          `Quand tu as terminé un jeu, ce sont tes parents qui diront si tout s'est bien passé.\n\n` +
          `L'important, ce n'est pas d'être parfait, mais d'essayer et de progresser. Prêt ? Alors choisis un jeu et commençons ensemble !`
        );
      } else if (completedCount < 5) {
        setTanakaMessage(
          `Te revoilà, ${displayName} ! 🌟\n\n` +
          `Tu as déjà terminé ${completedCount} jeu${completedCount > 1 ? 'x' : ''}. C'est super !\n\n` +
          `Continue comme ça, chaque partie te fait progresser. N'oublie pas : tes parents valident tes jeux terminés. Montre-leur ce que tu sais faire !`
        );
      } else {
        setTanakaMessage(
          `${displayName}, quel progrès ! 🏆\n\n` +
          `${completedCount} jeux terminés, tu deviens un vrai petit maître !\n\n` +
          `Continue à t'entraîner pour améliorer tes scores. Tes parents sont fiers de toi !`
        );
      }
      setIsTanakaSpeaking(true);
      setTimeout(() => setIsTanakaSpeaking(false), 4000);
    }
  }, [isOpen, selectedGame, userName, completedGames]);

  // Vérifier si un jeu est débloqué
  const isGameUnlocked = (game) => {
    return userLevel >= game.unlockLevel;
  };

  // Gérer la fin d'un jeu
  const handleGameComplete = useCallback((gameId, score, kiEarned) => {
    const newCompleted = completedGames.includes(gameId) 
      ? completedGames 
      : [...completedGames, gameId];
    
    const newScores = {
      ...gameScores,
      [gameId]: Math.max(gameScores[gameId] || 0, score)
    };
    
    const newKi = totalKi + kiEarned;
    
    setCompletedGames(newCompleted);
    setGameScores(newScores);
    setTotalKi(newKi);
    saveProgress(newCompleted, newScores, newKi);
    
    // Message de félicitation de Tanaka
    const game = DOJO_GAMES.find(g => g.id === gameId);
    setTanakaMessage(`Bravo ${userName || 'ninja'} ! 🎉 Tu as terminé "${game?.name}" avec ${score} points ! +${kiEarned} points de Ki !`);
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 4000);
    
    setIsPlayingGame(false);
    setSelectedGame(null);
  }, [completedGames, gameScores, totalKi, userName, saveProgress]);

  // Lancer un jeu
  const startGame = (game) => {
    setTanakaMessage(game.tanakaIntro);
    setIsTanakaSpeaking(true);
    setTimeout(() => {
      setIsTanakaSpeaking(false);
      setIsPlayingGame(true);
    }, 2000);
  };

  // Rendu du jeu sélectionné
  const renderGame = () => {
    if (!selectedGame || !isPlayingGame) return null;
    
    const GameComponent = selectedGame.component;
    if (!GameComponent) {
      return (
        <div className="text-center py-12">
          <p className="text-white text-lg">Ce jeu sera bientôt disponible !</p>
          <Button 
            onClick={() => { setIsPlayingGame(false); setSelectedGame(null); }}
            className="mt-4"
          >
            Retour
          </Button>
        </div>
      );
    }
    
    return (
      <GameComponent
        userName={userName}
        onComplete={(score, ki) => handleGameComplete(selectedGame.id, score, ki)}
        onExit={() => { setIsPlayingGame(false); setSelectedGame(null); }}
        tanakaSpeak={(msg) => {
          setTanakaMessage(msg);
          setIsTanakaSpeaking(true);
          setTimeout(() => setIsTanakaSpeaking(false), 3000);
        }}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30 p-0 overflow-hidden" data-testid="virtual-dojo-dialog">
        <VisuallyHidden>
          <DialogTitle>Dojo Virtuel - Centre d'entraînement</DialogTitle>
          <DialogDescription>Entraîne-toi avec 10 mini-jeux éducatifs guidés par Maître Tanaka</DialogDescription>
        </VisuallyHidden>

        {/* HEADER - Maître Tanaka Coach */}
        <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 p-4 border-b border-amber-500/30">
          <div className="flex items-start gap-4">
            {/* Avatar Tanaka */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ 
                y: [0, -4, 0],
                rotate: isTanakaSpeaking ? [0, -2, 2, 0] : 0
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0.3, repeat: isTanakaSpeaking ? Infinity : 0 }
              }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-amber-400 shadow-lg shadow-amber-500/30">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1"
                animate={isTanakaSpeaking ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isTanakaSpeaking ? Infinity : 0 }}
              >
                <Volume2 className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            {/* Message de Tanaka */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                  🏯 Dojo Virtuel
                </h2>
                <div className="flex items-center gap-4">
                  {/* Bouton Recommencer le parcours */}
                  {completedGames.length > 0 && (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Recommencer le parcours</span>
                    </button>
                  )}
                  {/* Points de Ki */}
                  <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full">
                    <span className="text-cyan-400 text-lg">✨</span>
                    <span className="text-cyan-300 font-bold">{totalKi} Ki</span>
                  </div>
                  {/* Jeux complétés */}
                  <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">{completedGames.length}/{DOJO_GAMES.length}</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                key={tanakaMessage}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3"
              >
                <p className="text-amber-100 text-sm leading-relaxed">{tanakaMessage}</p>
              </motion.div>
            </div>

            {/* Bouton fermer */}
            <button 
              onClick={onClose}
              className="text-amber-400 hover:text-white p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
              data-testid="close-dojo-dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isPlayingGame ? (
            // Afficher le jeu en cours
            renderGame()
          ) : selectedGame ? (
            // Aperçu du jeu sélectionné
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Carte de présentation du jeu */}
              <div className={`bg-gradient-to-r ${selectedGame.color} rounded-2xl p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-5xl">{selectedGame.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedGame.name}</h3>
                        <p className="text-white/80">{selectedGame.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-white/90 mt-3">{selectedGame.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="text-white/70 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Infos du jeu */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    👶 {selectedGame.ageRange}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    ⏱️ {selectedGame.duration}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    ✨ +{selectedGame.xpReward} XP
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    🌊 +{selectedGame.kiReward} Ki
                  </span>
                </div>
                
                {/* Compétences */}
                <div className="mt-4">
                  <p className="text-white/70 text-sm mb-2">Compétences développées :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame.skills.map((skill, idx) => (
                      <span key={idx} className="bg-black/20 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meilleur score */}
              {gameScores[selectedGame.id] && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm">Meilleur score</p>
                  <p className="text-2xl font-bold text-amber-400">{gameScores[selectedGame.id]} pts</p>
                </div>
              )}

              {/* Bouton Jouer */}
              <Button
                onClick={() => startGame(selectedGame)}
                className={`w-full bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white font-bold py-4 text-lg`}
                data-testid="start-game-btn"
              >
                <Play className="w-5 h-5 mr-2" />
                Commencer le jeu !
              </Button>
            </motion.div>
          ) : (
            // Liste des jeux
            <>
              {/* Onglets Numérique / Dojo Réel */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setShowDojoReal(false)}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
                    !showDojoReal 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🖥️ Jeux Numériques
                </button>
                <button
                  onClick={() => setShowDojoReal(true)}
                  className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all ${
                    showDojoReal 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🥋 Exercices au Dojo
                </button>
              </div>

              {!showDojoReal ? (
                // Grille des jeux numériques
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {DOJO_GAMES.map((game, index) => {
                    const unlocked = isGameUnlocked(game);
                    const completed = completedGames.includes(game.id);
                    const Icon = game.icon;
                    
                    return (
                      <motion.button
                        key={game.id}
                        onClick={() => unlocked && setSelectedGame(game)}
                        disabled={!unlocked}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={unlocked ? { scale: 1.05 } : {}}
                        whileTap={unlocked ? { scale: 0.95 } : {}}
                        className={`
                          relative p-4 rounded-xl text-center transition-all
                          ${unlocked 
                            ? `bg-gradient-to-br ${game.color} ${game.shadowColor} shadow-lg hover:shadow-xl cursor-pointer` 
                            : 'bg-slate-800/50 cursor-not-allowed opacity-60'
                          }
                        `}
                        data-testid={`game-card-${game.id}`}
                      >
                        {/* Badge complété */}
                        {completed && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                            <Trophy className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        {/* Badge verrouillé */}
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
                            <div className="text-center">
                              <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                              <span className="text-slate-400 text-xs">Niveau {game.unlockLevel}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Contenu de la carte */}
                        <span className="text-3xl block mb-2">{game.emoji}</span>
                        <h3 className="text-white font-bold text-sm leading-tight">{game.name}</h3>
                        <p className="text-white/70 text-xs mt-1">{game.subtitle}</p>
                        
                        {/* Score */}
                        {gameScores[game.id] && (
                          <div className="mt-2 bg-black/20 rounded-full px-2 py-0.5">
                            <span className="text-amber-300 text-xs font-bold">
                              ⭐ {gameScores[game.id]}
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                // Section Dojo Réel - Défis du Jour + Exercices
                <div className="space-y-6">
                  {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                  {/* DÉFIS DU JOUR - Tunnel de progression (gagne des points !) */}
                  {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                  <section data-testid="section-defis-dojo">
                    {/* Titre de section */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-r from-transparent via-pink-500 to-pink-500 rounded-full" />
                      <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                        <span className="text-xl sm:text-2xl">🎯</span>
                        <span className="hidden xs:inline">Mes </span>Défis du Jour
                      </h2>
                      <div className="h-0.5 sm:h-1 flex-1 bg-gradient-to-l from-transparent via-pink-500 to-pink-500 rounded-full" />
                    </div>

                    <ProgressionTunnel
                      currentBelt={getBeltByPoints(statistics.total_points || 0)}
                      statistics={statistics}
                      virtueData={virtueData}
                      userName={userName}
                      userId={userId}
                      isAuthenticated={isAuthenticated}
                      onRefreshStats={onRefreshData}
                      onCompleteChallenge={(challenge) => {
                        console.log("Challenge completed:", challenge);
                        onRefreshData?.();
                      }}
                      onRequestParentValidation={(challenge) => {
                        console.log("Parent validation requested:", challenge);
                      }}
                    />
                  </section>

                  {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                  {/* EXERCICES AU DOJO RÉEL - Auto-validation par l'utilisateur */}
                  {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-amber-500/30">
                    <div className="text-center mb-6">
                      <span className="text-6xl block mb-3">🥋</span>
                      <h3 className="text-xl font-bold text-white">Exercices au Dojo Réel</h3>
                      <p className="text-slate-400 mt-2 leading-relaxed">
                        Ces exercices sont pratiqués au vrai dojo, avec ton corps et tes partenaires.
                      </p>
                      <p className="text-amber-400 mt-2 font-medium">
                        Quand tu as fait un exercice au dojo, c'est toi qui le notes ici !
                      </p>
                    </div>
                    
                    {/* Explication pédagogique */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                      <p className="text-amber-200 text-sm leading-relaxed">
                        🌟 <strong>Comment ça marche ?</strong><br/>
                        Après un cours au dojo, reviens ici et coche les exercices que tu as pratiqués. 
                        C'est ta parole qui compte : sois honnête avec toi-même !
                      </p>
                    </div>
                    
                    {/* Liste des exercices */}
                    <div className="space-y-3">
                      {[
                        { name: 'Tai Sabaki en groupe', xp: 30, emoji: '🦶', desc: 'Déplacements avec les autres' },
                        { name: 'Ukemi avec partenaire', xp: 35, emoji: '🔄', desc: 'Chutes et roulades' },
                        { name: 'Randori guidé', xp: 40, emoji: '⚔️', desc: 'Pratique libre encadrée' },
                        { name: 'Méditation collective', xp: 25, emoji: '🧘', desc: 'Calme et concentration' },
                        { name: 'Kata en duo', xp: 45, emoji: '🤝', desc: 'Techniques avec un partenaire' },
                      ].map((exercice, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3 hover:bg-slate-700/70 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{exercice.emoji}</span>
                            <div>
                              <span className="text-white font-medium block">{exercice.name}</span>
                              <span className="text-slate-500 text-xs">{exercice.desc}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-400 text-sm">+{exercice.xp} Ki</span>
                            <div className="w-5 h-5 rounded border-2 border-slate-500 hover:border-emerald-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-center text-emerald-400/80 text-sm mt-4 font-medium">
                      ✅ C'est toi qui valides tes exercices au dojo !
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>

      {/* Modal de confirmation - Recommencer le parcours */}
      <AnimatePresence>
        {showResetConfirm && (
          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-amber-500/30">
              <div className="text-center py-4">
                <span className="text-5xl block mb-4">🔄</span>
                <h3 className="text-xl font-bold text-white mb-3">Recommencer le parcours ?</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Tu vas recommencer le jeu depuis le début. Ta progression actuelle sera remise à zéro. Tu pourras rejouer tranquillement.
                </p>
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={() => setShowResetConfirm(false)}
                    variant="outline" 
                    className="text-white border-slate-600"
                  >
                    Non, je continue
                  </Button>
                  <Button 
                    onClick={handleResetProgress}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    Oui, je recommence
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default VirtualDojo;
