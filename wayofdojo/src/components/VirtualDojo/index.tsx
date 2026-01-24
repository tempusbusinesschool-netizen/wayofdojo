/**
 * 🏯 DOJO VIRTUEL - Centre d'entraînement gamifié
 * 
 * 10 mini-jeux numériques pour enfants 6-14 ans
 * Validations parentales et progression Ki
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { 
  Gamepad2, Wind, Target, Brain, 
  Users, Heart, Footprints, Shield,
  Trophy, Lock, Play, X, Volume2, VolumeX, RotateCcw, Eye, Ear
} from 'lucide-react';
import { playTanakaPhrase } from '@/services/tanakaVoiceService';

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
    description: 'Traverse le dojo virtuel sans perdre ton équilibre.',
    tanakaIntro: "Le Ki est l'énergie qui nous anime. Traverse le dojo en gardant ton calme !",
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
    description: 'Ton avatar avance uniquement si tu respires au bon rythme.',
    tanakaIntro: "La respiration est la clé de tout. Inspire par le nez, expire par la bouche.",
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
    description: 'Ferme les yeux et suis les instructions de Maître Tanaka.',
    tanakaIntro: "Ferme les yeux et fais confiance à tes autres sens.",
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
    description: 'Face à des situations imprévues, choisis la réponse la plus sage.',
    tanakaIntro: "L'Aïkido nous apprend à ne pas réagir avec colère. Réfléchis avant de répondre.",
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
    description: 'Maintiens la distance parfaite avec les autres pratiquants.',
    tanakaIntro: "Le Ma-ai est l'espace parfait. Ni trop près, ni trop loin !",
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
    description: 'Reproduis les mouvements de Maître Tanaka comme un miroir.',
    tanakaIntro: "En Aïkido, on apprend en observant. Sois mon reflet parfait !",
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
    description: 'Garde ton avatar en équilibre sur un chemin étroit.',
    tanakaIntro: "Le Hara est ton centre. Trouve-le et reste stable !",
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
    tanakaIntro: "Un bon aikidoka connaît les noms de toutes les techniques !",
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
    tanakaIntro: "L'Aïkido a son propre rythme. Sens-le et suis-le !",
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
    tanakaIntro: "Le Budo repose sur 7 vertus. Découvre-les toutes !",
    xpReward: 50,
    kiReward: 40,
    unlockLevel: 4,
    component: QueteVertus
  }
];

interface VirtualDojoProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userLevel?: number;
  userKi?: number;
  userId?: string;
  onGameComplete?: (gameId: string, score: number, ki: number) => void;
}

const VirtualDojo: React.FC<VirtualDojoProps> = ({ 
  isOpen, 
  onClose, 
  userName = '',
  userLevel = 0,
  userKi = 0,
  userId = '',
  onGameComplete
}) => {
  const [selectedGame, setSelectedGame] = useState<typeof DOJO_GAMES[0] | null>(null);
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [tanakaMessage, setTanakaMessage] = useState('');
  const [isTanakaSpeaking, setIsTanakaSpeaking] = useState(false);
  const [completedGames, setCompletedGames] = useState<string[]>([]);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});
  const [totalKi, setTotalKi] = useState(userKi);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedWelcomeRef = useRef(false);

  // Play Tanaka audio
  const playTanakaAudio = async (phraseKey: string) => {
    if (audioMuted) return;
    
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    try {
      setIsAudioPlaying(true);
      setIsTanakaSpeaking(true);
      const result = await playTanakaPhrase(phraseKey);
      if (result.audio) {
        currentAudioRef.current = result.audio;
        result.audio.onended = () => {
          setIsAudioPlaying(false);
          setIsTanakaSpeaking(false);
          currentAudioRef.current = null;
        };
      }
    } catch (error) {
      console.error('Error playing Tanaka audio:', error);
      setIsAudioPlaying(false);
      setIsTanakaSpeaking(false);
    }
  };

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('aikido_dojo_progress');
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedGames(data.completedGames || []);
      setGameScores(data.gameScores || {});
      setTotalKi(data.totalKi || 0);
    }
  }, []);

  // Welcome message
  useEffect(() => {
    if (isOpen && !selectedGame) {
      const displayName = userName || 'jeune ninja';
      const completedCount = completedGames.length;
      
      if (completedCount === 0) {
        setTanakaMessage(
          `Bienvenue dans le Dojo Virtuel, ${displayName} ! 🎮\n\n` +
          `Ici, tu vas apprendre en jouant ! Chaque jeu est un petit défi.\n\n` +
          `Prends ton temps et amuse-toi bien !`
        );
      } else {
        setTanakaMessage(
          `Te revoilà, ${displayName} ! 🌟\n\n` +
          `Tu as déjà terminé ${completedCount} jeu${completedCount > 1 ? 'x' : ''}.\n\n` +
          `Continue comme ça !`
        );
      }
      setIsTanakaSpeaking(true);
      setTimeout(() => setIsTanakaSpeaking(false), 3000);
      
      if (!hasPlayedWelcomeRef.current) {
        hasPlayedWelcomeRef.current = true;
        setTimeout(() => playTanakaAudio('step_3_dojo'), 500);
      }
    }
    
    if (!isOpen) {
      hasPlayedWelcomeRef.current = false;
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsAudioPlaying(false);
      setIsTanakaSpeaking(false);
    }
  }, [isOpen, selectedGame, userName, completedGames.length, audioMuted]);

  const isGameUnlocked = (game: typeof DOJO_GAMES[0]) => userLevel >= game.unlockLevel;

  const handleGameComplete = useCallback((gameId: string, score: number, kiEarned: number) => {
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
    
    // Save progress
    const data = { completedGames: newCompleted, gameScores: newScores, totalKi: newKi };
    localStorage.setItem('aikido_dojo_progress', JSON.stringify(data));
    
    // Notify parent
    if (onGameComplete) {
      onGameComplete(gameId, score, kiEarned);
    }
    
    const game = DOJO_GAMES.find(g => g.id === gameId);
    setTanakaMessage(`Bravo ${userName || 'ninja'} ! 🎉 Tu as terminé "${game?.name}" avec ${score} points ! +${kiEarned} Ki !`);
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 4000);
    
    setIsPlayingGame(false);
    setSelectedGame(null);
  }, [completedGames, gameScores, totalKi, userName, onGameComplete]);

  const startGame = (game: typeof DOJO_GAMES[0]) => {
    setTanakaMessage(game.tanakaIntro);
    setIsTanakaSpeaking(true);
    setTimeout(() => {
      setIsTanakaSpeaking(false);
      setIsPlayingGame(true);
    }, 2000);
  };

  const handleResetProgress = () => {
    setCompletedGames([]);
    setGameScores({});
    setTotalKi(0);
    localStorage.removeItem('aikido_dojo_progress');
    setShowResetConfirm(false);
    setTanakaMessage('Tu recommences le parcours. Amuse-toi bien !');
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 3000);
  };

  const renderGame = () => {
    if (!selectedGame || !isPlayingGame) return null;
    
    const GameComponent = selectedGame.component;
    
    return (
      <GameComponent
        userName={userName}
        onComplete={(score: number, ki: number) => handleGameComplete(selectedGame.id, score, ki)}
        onExit={() => { setIsPlayingGame(false); setSelectedGame(null); }}
        tanakaSpeak={(msg: string) => {
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
          <DialogTitle>Dojo Virtuel</DialogTitle>
          <DialogDescription>10 mini-jeux éducatifs guidés par Maître Tanaka</DialogDescription>
        </VisuallyHidden>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 p-4 border-b border-amber-500/30">
          <div className="flex items-start gap-4">
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ y: [0, -4, 0], rotate: isTanakaSpeaking ? [0, -2, 2, 0] : 0 }}
              transition={{ y: { duration: 2, repeat: Infinity }, rotate: { duration: 0.3, repeat: isTanakaSpeaking ? Infinity : 0 } }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-amber-400 shadow-lg shadow-amber-500/30">
                <img src={TANAKA_IMAGE} alt="Maître Tanaka" className="w-full h-full object-cover" />
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1"
                animate={isTanakaSpeaking ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isTanakaSpeaking ? Infinity : 0 }}
              >
                <Volume2 className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-amber-100">🏯 Dojo Virtuel</h2>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => setAudioMuted(!audioMuted)}
                    className={`p-2 rounded-full transition-all ${audioMuted ? 'bg-red-500/30' : 'bg-amber-500/20'}`}
                  >
                    {audioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>
                  
                  {completedGames.length > 0 && (
                    <button onClick={() => setShowResetConfirm(true)} className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs">
                      <RotateCcw className="w-3 h-3" /><span>Recommencer</span>
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full">
                    <span className="text-cyan-400">✨</span>
                    <span className="text-cyan-300 font-bold">{totalKi} Ki</span>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">{completedGames.length}/{DOJO_GAMES.length}</span>
                  </div>
                </div>
              </div>
              
              <motion.div key={tanakaMessage} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-3">
                <p className="text-amber-100 text-sm leading-relaxed whitespace-pre-line">{tanakaMessage}</p>
              </motion.div>
            </div>

            <button onClick={onClose} className="text-amber-400 hover:text-white p-1 rounded-lg hover:bg-amber-500/20" data-testid="close-dojo-dialog">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isPlayingGame ? (
            renderGame()
          ) : selectedGame ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
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
                  <button onClick={() => setSelectedGame(null)} className="text-white/70 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">👶 {selectedGame.ageRange}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">⏱️ {selectedGame.duration}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">✨ +{selectedGame.xpReward} XP</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">🌊 +{selectedGame.kiReward} Ki</span>
                </div>
                
                <div className="mt-4">
                  <p className="text-white/70 text-sm mb-2">Compétences développées :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame.skills.map((skill, idx) => (
                      <span key={idx} className="bg-black/20 px-2 py-1 rounded text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {gameScores[selectedGame.id] && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm">Meilleur score</p>
                  <p className="text-2xl font-bold text-amber-400">{gameScores[selectedGame.id]} pts</p>
                </div>
              )}

              <Button onClick={() => startGame(selectedGame)} className={`w-full bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white font-bold py-4 text-lg`} data-testid="start-game-btn">
                <Play className="w-5 h-5 mr-2" />
                Commencer le jeu !
              </Button>
            </motion.div>
          ) : (
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
                    className={`relative p-4 rounded-xl text-center transition-all ${
                      unlocked 
                        ? `bg-gradient-to-br ${game.color} ${game.shadowColor} shadow-lg hover:shadow-xl cursor-pointer` 
                        : 'bg-slate-800/50 cursor-not-allowed opacity-60'
                    }`}
                    data-testid={`game-card-${game.id}`}
                  >
                    {completed && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-lg">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
                        <div className="text-center">
                          <Lock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <span className="text-slate-400 text-xs">Niveau {game.unlockLevel}</span>
                        </div>
                      </div>
                    )}
                    
                    <span className="text-3xl block mb-2">{game.emoji}</span>
                    <h3 className="text-white font-bold text-sm leading-tight">{game.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{game.subtitle}</p>
                    
                    {gameScores[game.id] && (
                      <div className="mt-2 bg-black/20 rounded-full px-2 py-0.5">
                        <span className="text-amber-300 text-xs font-bold">⭐ {gameScores[game.id]}</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Reset confirmation */}
      <AnimatePresence>
        {showResetConfirm && (
          <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <DialogContent className="sm:max-w-md bg-slate-900 border-amber-500/30">
              <div className="text-center py-4">
                <span className="text-5xl block mb-4">🔄</span>
                <h3 className="text-xl font-bold text-white mb-3">Recommencer le parcours ?</h3>
                <p className="text-slate-300 text-sm mb-6">Ta progression sera remise à zéro.</p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => setShowResetConfirm(false)} variant="outline" className="text-white border-slate-600">
                    Non, je continue
                  </Button>
                  <Button onClick={handleResetProgress} className="bg-gradient-to-r from-amber-500 to-orange-600">
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
