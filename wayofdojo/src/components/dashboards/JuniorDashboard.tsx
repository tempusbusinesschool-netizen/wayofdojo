'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Medal, Scroll, Castle, Sparkles, Compass,
  ChevronDown, Volume2, Play, Trophy, Bell, Gift, X, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import JourneyPath from '@/components/JourneyPath';

// ⚠️ IMAGE OFFICIELLE DE TANAKA - VERROUILLÉE - NE JAMAIS CHANGER
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorDashboard - Dashboard pour les "Jeune Samouraï" (enfants < 14 ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Layout: SIDEBAR RPG / GAMING
 * Style jeu vidéo avec néons, barres de progression, quêtes
 * Sidebar gauche avec fiche personnage et quêtes actives
 */

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  profile: 'jeune_samourai' | 'samourai_confirme';
  sport: string;
  grade: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    badges: string[];
    completedTechniques: string[];
    completedChallenges?: string[];
    virtuesProgress?: Record<string, number>;
    journeyCompletedSteps?: number[];
  };
}

interface BeltConfig {
  grade: string;
  name: string;
  color: string;
  gradient: string;
  animalSpirit: string;
  nextGrade: string;
}

interface JuniorDashboardProps {
  user: User;
  locale: string;
  sport: string;
  currentXp: number;
  currentLevel: number;
  currentStreak: number;
  currentBelt: BeltConfig;
  completedChallenges: string[];
  processingChallenge: string | null;
  onCompleteChallenge: (challengeId: string, virtueId: string, xpReward: number) => void;
  onNavigate: (path: string) => void;
  onUserNameChange?: (firstName: string) => void;
}

// Défis quotidiens par vertu (Quêtes)
const DAILY_CHALLENGES_BASE = [
  { id: 'respect_salut', title: 'Salut Parfait', emoji: '🙇', desc: 'Faire un salut sincère', xp: 10, virtue: 'respect' },
  { id: 'courage_chute', title: 'Maître des Chutes', emoji: '🌪️', desc: 'Tomber sans crainte', xp: 15, virtue: 'courage' },
  { id: 'attention_ecoute', title: 'Oreilles Attentives', emoji: '👂', desc: 'Écouter le sensei', xp: 10, virtue: 'attention' },
  { id: 'responsabilite_rangement', title: 'Gardien du Tatami', emoji: '🧹', desc: 'Aider à ranger', xp: 15, virtue: 'responsabilite' },
  { id: 'maitrise_repetition', title: 'Technique du Jour', emoji: '💪', desc: 'Répéter une technique', xp: 20, virtue: 'maitrise' },
  { id: 'bienveillance_aide', title: 'Bon Partenaire', emoji: '🤝', desc: 'Aider un débutant', xp: 15, virtue: 'bienveillance' },
];

// Vertus avec niveaux et explications enfantines
const VIRTUES_CONFIG = [
  { 
    id: 'respect', 
    name: 'Respect', 
    kanji: '礼', 
    color: 'bg-red-500', 
    gradient: 'from-red-500 to-red-600',
    emoji: '🙇',
    childExplanation: 'Être poli et gentil avec tout le monde !',
    childDetails: 'Le respect, c\'est comme un super-pouvoir ! Quand tu salues ton sensei, quand tu dis "merci" et "s\'il te plaît", quand tu écoutes les autres sans les interrompre... Tu montres que tu es un vrai samouraï !',
    examples: ['Saluer en entrant dans le dojo', 'Écouter quand quelqu\'un parle', 'Dire merci à son partenaire'],
    animal: '🦁'
  },
  { 
    id: 'courage', 
    name: 'Courage', 
    kanji: '勇', 
    color: 'bg-orange-500', 
    gradient: 'from-orange-500 to-orange-600',
    emoji: '💪',
    childExplanation: 'Oser essayer même si on a un peu peur !',
    childDetails: 'Le courage, ce n\'est pas de ne jamais avoir peur. C\'est d\'essayer quand même ! Quand tu fais une chute pour la première fois, quand tu essaies une technique difficile... Tu deviens plus fort à chaque fois !',
    examples: ['Essayer une nouvelle technique', 'Faire une chute sans hésiter', 'Poser une question au sensei'],
    animal: '🐯'
  },
  { 
    id: 'maitrise', 
    name: 'Maîtrise', 
    kanji: '克', 
    color: 'bg-yellow-500', 
    gradient: 'from-yellow-500 to-yellow-600',
    emoji: '🎯',
    childExplanation: 'S\'entraîner encore et encore pour devenir meilleur !',
    childDetails: 'La maîtrise, c\'est comme apprendre à faire du vélo. Au début c\'est difficile, mais si tu répètes encore et encore, un jour ça devient facile ! Les vrais samouraïs s\'entraînent tous les jours.',
    examples: ['Répéter une technique 10 fois', 'Rester concentré pendant tout le cours', 'Ne pas abandonner quand c\'est dur'],
    animal: '🦅'
  },
  { 
    id: 'humilite', 
    name: 'Humilité', 
    kanji: '謙', 
    color: 'bg-green-500', 
    gradient: 'from-green-500 to-green-600',
    emoji: '🌱',
    childExplanation: 'Savoir qu\'on peut toujours apprendre des autres !',
    childDetails: 'L\'humilité, c\'est accepter qu\'on ne sait pas tout. Même les plus grands maîtres continuent d\'apprendre ! Quand quelqu\'un te corrige, dis "merci" car il t\'aide à progresser.',
    examples: ['Accepter les conseils du sensei', 'Féliciter un camarade qui réussit', 'Reconnaître ses erreurs'],
    animal: '🐢'
  },
  { 
    id: 'bienveillance', 
    name: 'Bienveillance', 
    kanji: '仁', 
    color: 'bg-blue-500', 
    gradient: 'from-blue-500 to-blue-600',
    emoji: '💙',
    childExplanation: 'Être gentil et aider les autres !',
    childDetails: 'La bienveillance, c\'est avoir un grand cœur ! Quand tu aides un ami qui a du mal, quand tu fais attention à ne pas faire mal à ton partenaire, tu montres que tu es un samouraï au cœur d\'or.',
    examples: ['Aider un débutant', 'Encourager un camarade', 'Prêter son matériel'],
    animal: '🐻'
  },
  { 
    id: 'attention', 
    name: 'Attention', 
    kanji: '注', 
    color: 'bg-indigo-500', 
    gradient: 'from-indigo-500 to-indigo-600',
    emoji: '👀',
    childExplanation: 'Bien regarder et bien écouter !',
    childDetails: 'L\'attention, c\'est comme avoir des super-yeux et des super-oreilles ! Quand tu regardes bien ce que fait le sensei, tu apprends plus vite. Les ninjas sont toujours attentifs à tout !',
    examples: ['Regarder le sensei montrer la technique', 'Écouter les consignes', 'Rester concentré sans bavarder'],
    animal: '🦉'
  },
  { 
    id: 'responsabilite', 
    name: 'Responsabilité', 
    kanji: '責', 
    color: 'bg-purple-500', 
    gradient: 'from-purple-500 to-purple-600',
    emoji: '⭐',
    childExplanation: 'Faire ce qu\'on doit faire, même tout seul !',
    childDetails: 'La responsabilité, c\'est être digne de confiance ! Quand tu ranges ton keikogi tout seul, quand tu arrives à l\'heure, quand tu aides à ranger le tatami... Tu montres que tu es un grand samouraï !',
    examples: ['Ranger ses affaires après le cours', 'Arriver à l\'heure', 'Prendre soin du matériel'],
    animal: '🐺'
  },
];

export const JuniorDashboard: React.FC<JuniorDashboardProps> = ({
  user,
  locale,
  sport,
  currentXp,
  currentLevel,
  currentStreak,
  currentBelt,
  completedChallenges,
  processingChallenge,
  onCompleteChallenge,
  onNavigate,
  onUserNameChange,
}) => {
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [showJourneyPath, setShowJourneyPath] = useState(false);
  const [selectedVirtue, setSelectedVirtue] = useState<typeof VIRTUES_CONFIG[0] | null>(null);
  
  // Étapes du parcours complétées
  const [journeyCompletedSteps, setJourneyCompletedSteps] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aikido_journey_completed_steps');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Map les défis avec leur statut
  const dailyChallenges = DAILY_CHALLENGES_BASE.map(c => ({
    ...c,
    completed: completedChallenges.includes(c.id),
  }));

  const completedCount = dailyChallenges.filter(c => c.completed).length;
  const completedTechniquesCount = user.gamification.completedTechniques?.length || 0;
  const badgesCount = user.gamification.badges?.length || 0;
  
  // Progression des vertus (simulée basée sur les défis complétés)
  const virtueProgress = user.gamification.virtuesProgress || {};

  // XP nécessaire pour le prochain niveau
  const xpForNextLevel = currentLevel * 100 + 200;
  const xpProgress = Math.min((currentXp / xpForNextLevel) * 100, 100);

  // Gérer la complétion d'une étape du parcours
  const handleStepComplete = useCallback((stepId: number) => {
    const newCompletedSteps = [...journeyCompletedSteps, stepId];
    setJourneyCompletedSteps(newCompletedSteps);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aikido_journey_completed_steps', JSON.stringify(newCompletedSteps));
    }
  }, [journeyCompletedSteps]);

  // Gérer la navigation depuis le JourneyPath
  const handleJourneyNavigate = useCallback((target: string) => {
    const pathMap: Record<string, string> = {
      'profil': `/${locale}/${sport}/profil`,
      'techniques': `/${locale}/${sport}/techniques`,
      'dojo_virtuel': `/${locale}/${sport}/dojo-virtuel`,
      'carnet_dojo': `/${locale}/${sport}/carnet`,
      'progression': `/${locale}/${sport}/progression`,
      'trophees': `/${locale}/${sport}/trophees`,
    };
    const path = pathMap[target] || `/${locale}/${sport}/${target}`;
    onNavigate(path);
  }, [locale, sport, onNavigate]);

  // Compléter un défi
  const handleCompleteChallenge = (challenge: typeof dailyChallenges[0]) => {
    if (!challenge.completed && !processingChallenge) {
      onCompleteChallenge(challenge.id, challenge.virtue, challenge.xp);
    }
  };

  // Lecture du message vocal de Maître Tanaka
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingTanaka, setIsPlayingTanaka] = useState(false);
  const handleListenTanaka = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Voix ElevenLabs "Adam" pré-enregistrée - même voix que le chat Tanaka
      const audio = new Audio('/audio/tanaka/welcome.mp3');
      audioRef.current = audio;
      audio.onended = () => setIsPlayingTanaka(false);
      audio.onerror = () => setIsPlayingTanaka(false);
      setIsPlayingTanaka(true);
      audio.play().catch((err) => {
        console.error('Tanaka audio playback error:', err);
        setIsPlayingTanaka(false);
      });
    } catch (err) {
      console.error('Tanaka audio error:', err);
      setIsPlayingTanaka(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col lg:flex-row" data-testid="junior-dashboard">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR GAUCHE - Style RPG Gaming */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full lg:w-72 xl:w-80 bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-purple-500/30 flex flex-col lg:shrink-0"
        data-testid="sidebar-rpg"
      >
        {/* Character Card */}
        <div className="p-4 lg:p-5 border-b border-purple-500/30">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl" />
            
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-amber-500/30">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative">
                  <img 
                    src={TANAKA_IMAGE}
                    alt="Avatar"
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl object-cover border-2 border-amber-500"
                    data-testid="user-avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-900">
                    {currentLevel}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-base lg:text-lg truncate" data-testid="user-name">
                    {user.firstName || 'Jeune Ninja'}
                  </p>
                  <p className="text-amber-400 text-xs lg:text-sm">Jeune Samouraï</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] lg:text-xs text-slate-400">{currentBelt?.grade || '6e Kyu'}</span>
                    <span className="text-amber-400">•</span>
                    <span className="text-[10px] lg:text-xs text-amber-400">{currentBelt?.animalSpirit || '🐣'} {currentBelt?.name || 'Rokkyu'}</span>
                  </div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mt-4" data-testid="xp-bar">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">XP</span>
                  <span className="text-amber-400 font-bold">{currentXp} / {xpForNextLevel}</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-800 rounded-lg p-2 text-center" data-testid="stat-streak">
                  <Flame className="w-4 h-4 text-orange-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">{currentStreak}</p>
                  <p className="text-slate-500 text-[10px]">Série</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center" data-testid="stat-badges">
                  <Medal className="w-4 h-4 text-amber-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">{badgesCount}</p>
                  <p className="text-slate-500 text-[10px]">Badges</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center" data-testid="stat-techniques">
                  <Scroll className="w-4 h-4 text-cyan-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">{completedTechniquesCount}</p>
                  <p className="text-slate-500 text-[10px]">Techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-4 lg:px-5 py-3 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </h3>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              {6 - completedCount} nouvelles
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            {/* Notification: Nouvelles quêtes */}
            {completedCount < 6 && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors"
                data-testid="notif-quests"
              >
                <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Compass className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{6 - completedCount} quêtes disponibles</p>
                  <p className="text-emerald-400/70 text-[10px]">+{85 - (completedCount * 14)} XP à gagner</p>
                </div>
              </motion.div>
            )}
            {/* Notification: Récompense à réclamer */}
            {badgesCount > 0 && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/20 transition-colors"
                data-testid="notif-reward"
              >
                <div className="w-7 h-7 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Gift className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">Nouveau badge débloqué !</p>
                  <p className="text-amber-400/70 text-[10px]">Réclamer ta récompense</p>
                </div>
              </motion.div>
            )}
            {/* Notification: Streak */}
            {currentStreak >= 3 && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg cursor-pointer hover:bg-orange-500/20 transition-colors"
                data-testid="notif-streak"
              >
                <div className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">🔥 Série de {currentStreak} jours !</p>
                  <p className="text-orange-400/70 text-[10px]">Continue comme ça !</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Skills / Vertus */}
        <div className="p-4 lg:p-5 border-b border-purple-500/30">
          <h3 className="text-xs lg:text-sm font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Vertus du Budo
          </h3>
          <div className="space-y-2 lg:space-y-3">
            {VIRTUES_CONFIG.slice(0, 4).map((virtue, idx) => {
              const level = virtueProgress[virtue.id] || Math.floor(Math.random() * 5);
              return (
                <div key={idx} data-testid={`virtue-progress-${virtue.id}`}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{virtue.name}</span>
                    <span className="text-purple-400">Lv.{level}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(level / 10) * 100}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className={`h-full ${virtue.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Quests */}
        <div className="flex-1 p-4 lg:p-5 overflow-auto">
          <h3 className="text-xs lg:text-sm font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" /> Quêtes Actives
          </h3>
          <div className="space-y-2">
            {dailyChallenges.slice(0, 4).map((quest) => (
              <motion.div
                key={quest.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  if (!quest.completed) {
                    setExpandedQuest(expandedQuest === quest.id ? null : quest.id);
                  }
                }}
                className={`rounded-xl p-3 cursor-pointer transition-all ${
                  quest.completed 
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : processingChallenge === quest.id
                      ? 'bg-amber-500/20 border border-amber-500/50 animate-pulse'
                      : 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50'
                }`}
                data-testid={`quest-${quest.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl lg:text-2xl">{quest.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm truncate ${quest.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {quest.title}
                    </p>
                    <p className="text-xs text-slate-400">+{quest.xp} XP</p>
                  </div>
                  {quest.completed ? (
                    <span className="text-emerald-400 text-xl">✓</span>
                  ) : (
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedQuest === quest.id ? 'rotate-180' : ''}`} />
                  )}
                </div>
                {/* Expanded Quest Action */}
                {expandedQuest === quest.id && !quest.completed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-3 pt-3 border-t border-slate-700"
                  >
                    <p className="text-xs text-slate-400 mb-2">{quest.desc}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteChallenge(quest);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white text-xs font-bold hover:from-emerald-600 hover:to-green-600 transition-colors"
                    >
                      ✓ Valider la quête
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
            {dailyChallenges.length > 4 && (
              <p className="text-center text-xs text-slate-500 mt-2">
                +{dailyChallenges.length - 4} autres quêtes
              </p>
            )}
          </div>
        </div>

        {/* Play Button */}
        <div className="p-4 lg:p-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowJourneyPath(!showJourneyPath)}
            className="w-full py-3 lg:py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-xl font-bold text-white text-sm lg:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            data-testid="continue-button"
          >
            <Play className="w-5 h-5" /> {showJourneyPath ? 'FERMER PARCOURS' : 'CONTINUER'}
          </motion.button>
        </div>
      </motion.aside>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENU PRINCIPAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-4 lg:p-6 xl:p-8 pb-24 lg:pb-8 overflow-auto">
        
        {/* Journey Path Toggle */}
        {showJourneyPath && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <JourneyPath
              userName={user.firstName}
              completedSteps={journeyCompletedSteps}
              totalPoints={currentXp}
              onStepComplete={handleStepComplete}
              onNavigate={handleJourneyNavigate}
              onUserNameChange={onUserNameChange}
              isEnfantMode={true}
            />
          </motion.div>
        )}

        {/* Tanaka Hero */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-3xl overflow-hidden mb-6"
          data-testid="tanaka-hero"
        >
          {/* Background with blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600" />
          <div className="absolute inset-0 bg-[url('/images/tanaka/portrait.png')] bg-cover bg-center opacity-20 blur-sm" />
          
          <div className="relative z-10 p-5 lg:p-8 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
            <img 
              src={TANAKA_IMAGE}
              alt="Maître Tanaka"
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
            />
            <div className="flex-1 text-center lg:text-left">
              <p className="text-amber-200 text-xs lg:text-sm font-medium">🎭 Ton Sensei personnel</p>
              <h1 className="text-2xl lg:text-4xl font-black text-white mt-1 lg:mt-2">Maître Tanaka</h1>
              <p className="text-white/80 mt-2 lg:mt-3 max-w-xl text-sm lg:text-base">
                &quot;La vraie victoire est la victoire sur soi-même. Continue ton chemin, jeune Samouraï !&quot;
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleListenTanaka}
                disabled={isPlayingTanaka}
                className="mt-3 lg:mt-4 px-5 lg:px-6 py-2 lg:py-3 bg-white/20 hover:bg-white/30 disabled:opacity-70 disabled:cursor-wait backdrop-blur-sm rounded-xl text-white font-medium flex items-center gap-2 transition-colors mx-auto lg:mx-0"
                data-testid="listen-tanaka"
              >
                <Volume2 className={`w-4 h-4 lg:w-5 lg:h-5 ${isPlayingTanaka ? 'animate-pulse' : ''}`} />
                {isPlayingTanaka ? 'Lecture en cours…' : 'Écouter le message'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          <Link href={`/${locale}/${sport}/dojo-virtuel`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 lg:p-6 cursor-pointer shadow-xl shadow-purple-500/30 group h-full"
              data-testid="card-dojo-virtuel"
            >
              <Castle className="w-8 h-8 lg:w-10 lg:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-bold text-white mt-3 lg:mt-4">Dojo Virtuel</h3>
              <p className="text-white/70 mt-1 text-sm">11 mini-jeux éducatifs</p>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            </motion.div>
          </Link>
          
          <Link href={`/${locale}/${sport}/techniques`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl p-5 lg:p-6 cursor-pointer shadow-xl shadow-cyan-500/30 group h-full"
              data-testid="card-techniques"
            >
              <Scroll className="w-8 h-8 lg:w-10 lg:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-bold text-white mt-3 lg:mt-4">Techniques</h3>
              <p className="text-white/70 mt-1 text-sm">206+ mouvements</p>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            </motion.div>
          </Link>
          
          <Link href={`/${locale}/${sport}/trophees`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 lg:p-6 cursor-pointer shadow-xl shadow-amber-500/30 group h-full"
              data-testid="card-trophees"
            >
              <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-bold text-white mt-3 lg:mt-4">Trophées</h3>
              <p className="text-white/70 mt-1 text-sm">{badgesCount} badges débloqués</p>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            </motion.div>
          </Link>

          {/* NOUVELLE CARTE: Les Ceintures */}
          <Link href={`/${locale}/${sport}/ceintures`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 lg:p-6 cursor-pointer shadow-xl shadow-emerald-500/30 group h-full relative overflow-hidden"
              data-testid="card-ceintures"
            >
              {/* Décorations ceintures */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-40">
                <div className="w-2 h-6 bg-white rounded-full" />
                <div className="w-2 h-6 bg-yellow-300 rounded-full" />
                <div className="w-2 h-6 bg-orange-400 rounded-full" />
                <div className="w-2 h-6 bg-green-400 rounded-full" />
                <div className="w-2 h-6 bg-blue-400 rounded-full" />
              </div>
              <Medal className="w-8 h-8 lg:w-10 lg:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-bold text-white mt-3 lg:mt-4">🥋 Les Ceintures</h3>
              <p className="text-white/70 mt-1 text-sm">Progression de grade</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">🎯</span>
                <span className="text-white/90 text-xs font-medium">Objectif : {currentBelt?.nextGrade || '5e Kyu'}</span>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-3"
              />
            </motion.div>
          </Link>

          {/* NOUVELLE CARTE: L'Histoire de l'Aïkido */}
          <Link href={`/${locale}/${sport}/histoire-aikido`}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-5 lg:p-6 cursor-pointer shadow-xl shadow-rose-500/30 group h-full relative overflow-hidden"
              data-testid="card-histoire"
            >
              {/* Kanji décoratif */}
              <div className="absolute top-2 right-3 text-4xl font-bold text-white/10">道</div>
              <Compass className="w-8 h-8 lg:w-10 lg:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg lg:text-xl font-bold text-white mt-3 lg:mt-4">📜 L'Histoire</h3>
              <p className="text-white/70 mt-1 text-sm">O'Sensei & l'Aïkido</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">🏯</span>
                <span className="text-white/90 text-xs font-medium">Découvre les origines !</span>
              </div>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-3"
              />
            </motion.div>
          </Link>
        </div>

        {/* 7 Vertus Full */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-5 lg:p-6 border border-purple-500/30"
          data-testid="seven-virtues"
        >
          <h3 className="text-lg lg:text-xl font-bold text-white mb-2">🎭 Les 7 Vertus du Budo</h3>
          <p className="text-slate-400 text-xs lg:text-sm mb-4 lg:mb-5">Clique sur une vertu pour découvrir son secret ! 🔮</p>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 lg:gap-3">
            {VIRTUES_CONFIG.map((virtue, idx) => {
              const level = virtueProgress[virtue.id] || Math.floor(Math.random() * 5);
              return (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedVirtue(virtue)}
                  className={`bg-gradient-to-br ${virtue.gradient} rounded-xl p-2 lg:p-3 text-center cursor-pointer shadow-lg hover:shadow-xl hover:shadow-${virtue.color}/30 transition-shadow`}
                  data-testid={`virtue-${virtue.id}`}
                >
                  <span className="text-xl lg:text-3xl font-bold text-white">{virtue.kanji}</span>
                  <p className="text-white/80 text-[10px] lg:text-xs mt-1 font-medium hidden md:block">{virtue.name}</p>
                  <div className="mt-1 lg:mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full" 
                      style={{ width: `${(level / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-white/60 text-[8px] lg:text-[10px] mt-1">Lv.{level}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Modal Explication Vertu Enfantine */}
        <AnimatePresence>
          {selectedVirtue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedVirtue(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full border-2 border-${selectedVirtue.color.replace('bg-', '')}/50 shadow-2xl`}
              >
                {/* Header avec Kanji */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedVirtue.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-4xl font-bold text-white">{selectedVirtue.kanji}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedVirtue.name}</h3>
                      <p className="text-white/60 text-sm">{selectedVirtue.emoji} {selectedVirtue.childExplanation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVirtue(null)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>

                {/* Animal Gardien */}
                <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl">
                  <span className="text-3xl">{selectedVirtue.animal}</span>
                  <p className="text-white/80 text-sm">
                    <span className="font-bold">Animal Gardien :</span> Cet animal représente cette vertu !
                  </p>
                </div>

                {/* Explication */}
                <div className="mb-5">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {selectedVirtue.childDetails}
                  </p>
                </div>

                {/* Exemples */}
                <div className="mb-5">
                  <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Comment pratiquer cette vertu ?
                  </h4>
                  <ul className="space-y-2">
                    {selectedVirtue.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                        <span className="text-lg">⭐</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton Fermer */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedVirtue(null)}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${selectedVirtue.gradient} text-white font-bold text-sm shadow-lg`}
                >
                  J'ai compris ! 🎯
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Mes Trophées - Badges à collectionner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 backdrop-blur-xl rounded-3xl p-5 lg:p-6 border border-amber-500/30 mb-6"
          data-testid="trophees-section"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-white flex items-center gap-2">
                🏆 Mes Trophées
              </h3>
              <p className="text-amber-200/70 text-xs lg:text-sm">Collectionne tous les badges de samouraï !</p>
            </div>
            <Link href={`/${locale}/${sport}/trophees`} className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
              Voir tout →
            </Link>
          </div>
          
          {/* Badges Grid */}
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {/* Badges débloqués */}
            {[
              { id: 'premier_pas', name: 'Premier Pas', emoji: '👣', unlocked: true, desc: 'Premier cours terminé' },
              { id: 'salut_parfait', name: 'Salut Parfait', emoji: '🙇', unlocked: true, desc: 'Maîtrise du salut' },
              { id: 'chuteur', name: 'Maître Chuteur', emoji: '🌪️', unlocked: badgesCount >= 3, desc: '10 chutes réussies' },
              { id: 'assidu', name: 'Assidu', emoji: '📅', unlocked: currentStreak >= 7, desc: 'Série de 7 jours' },
              { id: 'technique_10', name: 'Apprenti', emoji: '📚', unlocked: completedTechniquesCount >= 10, desc: '10 techniques apprises' },
              { id: 'vertueux', name: 'Vertueux', emoji: '⭐', unlocked: Object.keys(virtueProgress).length >= 3, desc: '3 vertus pratiquées' },
              { id: 'explorateur', name: 'Explorateur', emoji: '🗺️', unlocked: false, desc: 'Visite toutes les sections' },
              { id: 'sensei_ami', name: "Ami du Sensei", emoji: '🎭', unlocked: false, desc: 'Écoute 10 messages de Tanaka' },
            ].map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: badge.unlocked ? 1.1 : 1.02, y: badge.unlocked ? -5 : 0 }}
                className={`relative rounded-xl p-3 text-center transition-all ${
                  badge.unlocked 
                    ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border border-amber-400/50 cursor-pointer' 
                    : 'bg-slate-800/50 border border-slate-700/50 opacity-50'
                }`}
                title={badge.desc}
              >
                <span className={`text-2xl lg:text-3xl ${badge.unlocked ? '' : 'grayscale'}`}>
                  {badge.unlocked ? badge.emoji : '🔒'}
                </span>
                <p className={`text-[9px] lg:text-[10px] mt-1 font-medium truncate ${
                  badge.unlocked ? 'text-amber-200' : 'text-slate-500'
                }`}>
                  {badge.name}
                </p>
                {badge.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Progression */}
          <div className="mt-4 bg-slate-800/50 rounded-xl p-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Progression des badges</span>
              <span className="text-amber-400 font-bold">{badgesCount}/8</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(badgesCount / 8) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
              />
            </div>
            <p className="text-center text-slate-500 text-[10px] mt-2">
              🎯 Continue à t'entraîner pour débloquer plus de badges !
            </p>
          </div>
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <Link href={`/${locale}/${sport}/ceintures`}>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer" data-testid="quick-ceintures">
              <p className="text-slate-400 text-xs">Grade actuel</p>
              <p className="text-white font-bold mt-1">{currentBelt?.grade || '6e Kyu'}</p>
            </div>
          </Link>
          <Link href={`/${locale}/${sport}/vertus`}>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-colors cursor-pointer" data-testid="quick-vertus">
              <p className="text-slate-400 text-xs">Vertus maîtrisées</p>
              <p className="text-white font-bold mt-1">{Object.keys(virtueProgress).length || 0}/7</p>
            </div>
          </Link>
          <Link href={`/${locale}/${sport}/progression`}>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer" data-testid="quick-progression">
              <p className="text-slate-400 text-xs">Quêtes complétées</p>
              <p className="text-white font-bold mt-1">{completedCount}/{dailyChallenges.length}</p>
            </div>
          </Link>
          <Link href={`/${locale}/${sport}/profil`}>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors cursor-pointer" data-testid="quick-profil">
              <p className="text-slate-400 text-xs">Niveau</p>
              <p className="text-white font-bold mt-1">Niveau {currentLevel}</p>
            </div>
          </Link>
        </motion.div>

      </main>
    </div>
  );
};

export default JuniorDashboard;
