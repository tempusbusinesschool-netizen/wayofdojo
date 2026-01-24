'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, CheckCircle2, Circle, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import UserDashboardBlocks from '@/components/UserDashboardBlocks';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';
import JourneyPath from '@/components/JourneyPath';
import { VIRTUES_GAMIFICATION } from '@/constants/virtuesGamification';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorDashboard - Dashboard pour les "Jeune Samouraï" (enfants < 14 ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Migré depuis aikido@game - Structure en 6 étapes guidées avec JourneyPath
 * Intègre le parcours interactif de Maître Tanaka
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
}

// Défis quotidiens par vertu
const DAILY_CHALLENGES_BASE = [
  { id: 'respect_salut', title: '🙇 Salut Parfait', desc: 'Faire un salut sincère', xp: 10, virtue: 'respect' },
  { id: 'courage_chute', title: '🌪️ Maître des Chutes', desc: 'Tomber sans crainte', xp: 15, virtue: 'courage' },
  { id: 'attention_ecoute', title: '👂 Oreilles Attentives', desc: 'Écouter le sensei', xp: 10, virtue: 'attention' },
  { id: 'responsabilite_rangement', title: '🧹 Gardien du Tatami', desc: 'Aider à ranger', xp: 15, virtue: 'responsabilite' },
  { id: 'maitrise_repetition', title: '💪 Technique du Jour', desc: 'Répéter une technique', xp: 20, virtue: 'maitrise' },
  { id: 'bienveillance_aide', title: '🤝 Bon Partenaire', desc: 'Aider un débutant', xp: 15, virtue: 'bienveillance' },
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
}) => {
  // État pour les vertus sélectionnées
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);
  
  // Étapes du parcours complétées (stockées dans localStorage côté client)
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
  const totalXpToday = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);
  
  // Progression des vertus
  const virtueProgress = user.gamification.virtuesProgress || {};

  // Statistiques de la semaine
  const weeklyStats = {
    trainings: 3,
    techniques: completedCount,
    xpGained: currentXp,
    streakDays: currentStreak,
  };

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

  return (
    <div className="space-y-6" data-testid="junior-dashboard">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION PRINCIPALE : JOURNEY PATH - Le parcours guidé en 6 étapes */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <JourneyPath
        userName={user.firstName}
        completedSteps={journeyCompletedSteps}
        totalPoints={currentXp}
        onStepComplete={handleStepComplete}
        onNavigate={handleJourneyNavigate}
        isEnfantMode={true}
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BLOC PROFIL - Statistiques principales */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserDashboardBlocks
          userName={user.firstName}
          statistics={{
            overall_progress: Math.min(100, (currentXp / 10) || 0),
            mastered_techniques: user.gamification.completedTechniques?.length || 0,
            practiced_techniques: Math.floor((user.gamification.completedTechniques?.length || 0) * 1.5),
            in_progress_techniques: completedCount,
          }}
          currentBelt={currentBelt}
          totalPoints={currentXp}
          xp={currentXp}
          level={currentLevel}
          streak={currentStreak}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* GRILLE DES 8 BLOCS RAPIDES - Accès aux fonctionnalités principales */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* BLOC 1 - Techniques */}
        <Link href={`/${locale}/${sport}/techniques`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-techniques"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">1</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">📚</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Techniques</h3>
              <p className="text-white/80 text-xs sm:text-sm">Apprends les mouvements</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 2 - Dojo Virtuel */}
        <Link href={`/${locale}/${sport}/dojo-virtuel`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-dojo-virtuel"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">2</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">🎮</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Dojo Virtuel</h3>
              <p className="text-white/80 text-xs sm:text-sm">Jeux & Validations</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 3 - Ma Pratique */}
        <Link href={`/${locale}/${sport}/carnet`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-carnet"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">3</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">🥋</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Ma Pratique</h3>
              <p className="text-white/80 text-xs sm:text-sm">Mon carnet de dojo</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 4 - Ma Progression */}
        <Link href={`/${locale}/${sport}/progression`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-progression"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">4</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">🌟</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Ma Progression</h3>
              <p className="text-white/80 text-xs sm:text-sm">Ceintures & Vertus</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 5 - Les 7 Vertus */}
        <Link href={`/${locale}/${sport}/vertus`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-vertus"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">5</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">☯️</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Les 7 Vertus</h3>
              <p className="text-white/80 text-xs sm:text-sm">Les qualités du Ninja</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 6 - Les Ceintures */}
        <Link href={`/${locale}/${sport}/ceintures`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-ceintures"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">6</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">🎖️</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Les Ceintures</h3>
              <p className="text-white/80 text-xs sm:text-sm">Monte de grade</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 7 - Trophées */}
        <Link href={`/${locale}/${sport}/trophees`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
              bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg shadow-yellow-500/40
              border-2 border-white/20 cursor-pointer"
            data-testid="bloc-trophees"
          >
            <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <span className="text-xl sm:text-2xl font-black text-white">7</span>
            </div>
            <div className="mt-10 sm:mt-12">
              <span className="text-4xl sm:text-5xl">🏆</span>
              <h3 className="font-black text-white text-lg sm:text-xl mt-2">Trophées</h3>
              <p className="text-white/80 text-xs sm:text-sm">{user.gamification.badges?.length || 0} badges</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.div>
        </Link>

        {/* BLOC 8 - Stats de la semaine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.03, y: -5 }}
          className="relative group rounded-2xl p-4 sm:p-5 min-h-[160px] sm:min-h-[180px] overflow-hidden
            bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg shadow-rose-500/40
            border-2 border-white/20"
          data-testid="bloc-stats"
        >
          <div className="absolute top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-black text-white">8</span>
          </div>
          <div className="mt-10 sm:mt-12">
            <span className="text-4xl sm:text-5xl">📊</span>
            <h3 className="font-black text-white text-lg sm:text-xl mt-2">Cette semaine</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-center">
                <p className="text-xl font-black text-white">{weeklyStats.trainings}</p>
                <p className="text-white/70 text-[10px]">Entraîn.</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-white flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4" />{currentStreak}
                </p>
                <p className="text-white/70 text-[10px]">Jours</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION DÉFIS DU JOUR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-pink-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎯 Défi du jour
          </h2>
          <span className="text-sm text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
            +{totalXpToday} XP gagnés
          </span>
        </div>
        <DailyChallengeWidget locale={locale} sport={sport} />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION MINI-DÉFIS DU BUDO */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🔥 Mini-défis du Budo
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
              {completedCount}/{dailyChallenges.length} complétés
            </span>
            <span className="text-sm font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">
              +{totalXpToday} XP
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-slate-700 rounded-full mb-5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / dailyChallenges.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => !challenge.completed && !processingChallenge && onCompleteChallenge(challenge.id, challenge.virtue, challenge.xp)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                challenge.completed
                  ? 'bg-emerald-500/20 border-emerald-500/50'
                  : processingChallenge === challenge.id
                    ? 'bg-amber-500/20 border-amber-500/50 animate-pulse'
                    : 'bg-slate-800/50 border-slate-700 hover:border-amber-500/50 hover:bg-amber-900/20'
              }`}
              data-testid={`challenge-${challenge.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {challenge.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </motion.div>
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${challenge.completed ? 'text-emerald-400' : 'text-white'}`}>
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-slate-400">{challenge.desc}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      VIRTUES_GAMIFICATION[challenge.virtue]?.bgColor || 'bg-slate-700'
                    } ${VIRTUES_GAMIFICATION[challenge.virtue]?.borderColor || 'border-slate-600'} border`}>
                      {VIRTUES_GAMIFICATION[challenge.virtue]?.emoji} {VIRTUES_GAMIFICATION[challenge.virtue]?.name}
                    </span>
                  </div>
                </div>
                <div className={`text-xl font-black ${challenge.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {challenge.completed ? '✓' : `+${challenge.xp}`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 VERTUS DU BUDO */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 border border-amber-500/30"
      >
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          🎭 Les 7 Vertus du Budo
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          Clique sur une vertu pour en apprendre plus
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {Object.values(VIRTUES_GAMIFICATION).map((virtue, index) => {
            const progress = virtueProgress[virtue.id] || 0;
            return (
              <motion.div
                key={virtue.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                onClick={() => setSelectedVirtue(selectedVirtue === virtue.id ? null : virtue.id)}
                className={`text-center p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedVirtue === virtue.id
                    ? `bg-gradient-to-br ${virtue.gradient} border-white/30 shadow-lg`
                    : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
                }`}
                data-testid={`virtue-${virtue.id}`}
              >
                <motion.div 
                  className="text-4xl mb-2"
                  animate={{ rotate: selectedVirtue === virtue.id ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {virtue.emoji}
                </motion.div>
                <p className="text-sm font-bold text-white">{virtue.name}</p>
                <p className="text-xs text-slate-400">{virtue.kanji}</p>
                
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.75 + index * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${virtue.gradient}`}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">{progress}%</p>
              </motion.div>
            );
          })}
        </div>

        {/* Expanded Virtue Details */}
        <AnimatePresence>
          {selectedVirtue && VIRTUES_GAMIFICATION[selectedVirtue] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-5"
            >
              <div className={`p-5 rounded-2xl border bg-gradient-to-br ${VIRTUES_GAMIFICATION[selectedVirtue].gradient}/20 ${VIRTUES_GAMIFICATION[selectedVirtue].borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className="text-6xl">
                    {VIRTUES_GAMIFICATION[selectedVirtue].animal?.evolutions?.[0]?.emoji || VIRTUES_GAMIFICATION[selectedVirtue].emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {VIRTUES_GAMIFICATION[selectedVirtue].name}
                      <span className="text-sm font-normal text-slate-400">
                        ({VIRTUES_GAMIFICATION[selectedVirtue].kanji} - {VIRTUES_GAMIFICATION[selectedVirtue].romaji})
                      </span>
                    </h3>
                    <p className="text-slate-300 mt-2">
                      {VIRTUES_GAMIFICATION[selectedVirtue].messages?.[1] || VIRTUES_GAMIFICATION[selectedVirtue].description}
                    </p>
                    
                    {/* Daily challenges for this virtue */}
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-white mb-2">Défis disponibles :</p>
                      <div className="flex flex-wrap gap-2">
                        {VIRTUES_GAMIFICATION[selectedVirtue].dailyChallenges?.slice(0, 3).map((challenge) => (
                          <span 
                            key={challenge.id}
                            className="text-xs px-3 py-1.5 bg-white/10 rounded-full text-white"
                          >
                            {challenge.emoji} {challenge.name} (+{challenge.xp} XP)
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JuniorDashboard;
