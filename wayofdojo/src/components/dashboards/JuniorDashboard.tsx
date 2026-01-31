'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, CheckCircle2, Circle, Star, Volume2, Play, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import DailyChallengeWidget from '@/components/DailyChallengeWidget';
import JourneyPath from '@/components/JourneyPath';
import { SpiralDivider } from '@/components/animations/SpiralConnector';
import { VIRTUES_GAMIFICATION } from '@/constants/virtuesGamification';

// ⚠️ IMAGE OFFICIELLE DE TANAKA - VERROUILLÉE - NE JAMAIS CHANGER
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorDashboard - Dashboard pour les "Jeune Samouraï" (enfants < 14 ans)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Layout: BENTO GRID (Style iOS Widgets)
 * Grille asymétrique moderne avec cartes de tailles variées
 * Animations spirales entre les sections
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentLevel,
  currentStreak,
  currentBelt,
  completedChallenges,
  processingChallenge,
  onCompleteChallenge,
  onNavigate,
  onUserNameChange,
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

  // Statistiques de la semaine (utilisé dans la section défis)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        onUserNameChange={onUserNameChange}
        isEnfantMode={true}
      />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BENTO GRID - Layout iOS Widgets */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[90px] md:auto-rows-[100px]">
        
        {/* HERO - Maître Tanaka (grande carte) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-4 md:col-span-3 row-span-2 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-4 md:p-5 relative overflow-hidden cursor-pointer group"
          data-testid="bento-tanaka"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-amber-200/80 text-xs md:text-sm font-medium">Ton guide personnel</p>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">Maître Tanaka</h2>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <p className="text-white/80 text-xs md:text-sm italic hidden md:block">&quot;Chaque jour est une nouvelle opportunité d&apos;apprendre.&quot;</p>
                <button className="mt-2 md:mt-3 bg-white/20 hover:bg-white/30 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-white text-xs md:text-sm font-medium flex items-center gap-2 transition-colors">
                  <Volume2 className="w-3 h-3 md:w-4 md:h-4" /> Écouter
                </button>
              </div>
              <img 
                src={TANAKA_IMAGE}
                alt="Maître Tanaka" 
                className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats XP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 md:col-span-1 row-span-1 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-3 md:p-4 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          data-testid="bento-xp"
        >
          <Star className="w-5 h-5 md:w-6 md:h-6 text-white mb-1" />
          <span className="text-xl md:text-2xl font-black text-white">{currentXp}</span>
          <span className="text-white/70 text-[10px] md:text-xs">XP Total</span>
        </motion.div>

        {/* Stats Série */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2 md:col-span-1 row-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-3 md:p-4 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
          data-testid="bento-streak"
        >
          <Flame className="w-5 h-5 md:w-6 md:h-6 text-white mb-1" />
          <span className="text-xl md:text-2xl font-black text-white">{currentStreak}</span>
          <span className="text-white/70 text-[10px] md:text-xs">Jours série</span>
        </motion.div>

        {/* Grade actuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-4 md:col-span-1 row-span-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-3 md:p-4 flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform"
          data-testid="bento-grade"
        >
          <span className="text-2xl md:text-3xl">{currentBelt?.animalSpirit || '🐣'}</span>
          <div>
            <span className="text-white font-bold block text-sm md:text-base">{currentBelt?.grade || '6e Kyu'}</span>
            <span className="text-slate-400 text-[10px] md:text-xs">{currentBelt?.name || 'Rokkyu'}</span>
          </div>
        </motion.div>

        {/* Techniques - Grande carte */}
        <Link href={`/${locale}/${sport}/techniques`} className="col-span-4 md:col-span-2 row-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.02 }}
            className="h-full bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-4 md:p-5 cursor-pointer group hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
            data-testid="bento-techniques"
          >
            <div className="flex items-start justify-between mb-3 md:mb-4">
              <span className="text-3xl md:text-4xl">📚</span>
              <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Techniques</h3>
            <p className="text-cyan-200/70 text-xs md:text-sm mt-1">206+ mouvements à découvrir</p>
            <div className="mt-3 md:mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (currentXp / 10))}%` }} />
            </div>
            <p className="text-white/60 text-[10px] md:text-xs mt-2">{Math.min(100, Math.floor(currentXp / 10))}% complété</p>
          </motion.div>
        </Link>

        {/* Dojo Virtuel */}
        <Link href={`/${locale}/${sport}/dojo-virtuel`} className="col-span-2 row-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="h-full bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl p-4 md:p-5 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/20 transition-all"
            data-testid="bento-dojo-virtuel"
          >
            <span className="text-3xl md:text-4xl">🎮</span>
            <h3 className="text-base md:text-lg font-bold text-white mt-2 md:mt-3">Dojo Virtuel</h3>
            <p className="text-purple-200/70 text-xs md:text-sm mt-1">11 mini-jeux</p>
            <button className="mt-3 md:mt-4 bg-white/20 hover:bg-white/30 w-full py-1.5 md:py-2 rounded-xl text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <Play className="w-3 h-3 md:w-4 md:h-4" /> Jouer
            </button>
          </motion.div>
        </Link>

        {/* Ma Pratique */}
        <Link href={`/${locale}/${sport}/carnet`} className="col-span-2 row-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.05 }}
            className="h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-3 md:p-4 cursor-pointer"
            data-testid="bento-pratique"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🥋</span>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">Ma Pratique</h3>
                <p className="text-orange-200/70 text-[10px] md:text-xs">Carnet de dojo</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Ma Progression */}
        <Link href={`/${locale}/${sport}/progression`} className="col-span-2 row-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 md:p-4 cursor-pointer"
            data-testid="bento-progression"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🌟</span>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">Progression</h3>
                <p className="text-emerald-200/70 text-[10px] md:text-xs">Ceintures & Vertus</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* 7 Vertus */}
        <Link href={`/${locale}/${sport}/vertus`} className="col-span-2 row-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.05 }}
            className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-3 md:p-4 cursor-pointer"
            data-testid="bento-vertus"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">☯️</span>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">7 Vertus</h3>
                <p className="text-indigo-200/70 text-[10px] md:text-xs">Qualités du Ninja</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Ceintures */}
        <Link href={`/${locale}/${sport}/ceintures`} className="col-span-2 row-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="h-full bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-3 md:p-4 cursor-pointer"
            data-testid="bento-ceintures"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🎖️</span>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">Ceintures</h3>
                <p className="text-slate-300/70 text-[10px] md:text-xs">Monte de grade</p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Trophées */}
        <Link href={`/${locale}/${sport}/trophees`} className="col-span-2 row-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileHover={{ scale: 1.05 }}
            className="h-full bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-3 md:p-4 cursor-pointer relative overflow-hidden"
            data-testid="bento-trophees"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xl md:text-2xl">🏆</span>
              <div>
                <h3 className="text-white font-bold text-sm md:text-base">Trophées</h3>
                <p className="text-amber-200/70 text-[10px] md:text-xs">{user.gamification.badges?.length || 0} badges</p>
              </div>
            </div>
            {(user.gamification.badges?.length || 0) > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">NEW</div>
            )}
          </motion.div>
        </Link>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPIRALE DE TRANSITION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <SpiralDivider color="amber" />

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
      {/* SPIRALE DE TRANSITION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <SpiralDivider color="emerald" />

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
                      {VIRTUES_GAMIFICATION[selectedVirtue].messages?.[1]}
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
