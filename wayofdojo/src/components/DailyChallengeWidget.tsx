/**
 * 🎯 DAILY CHALLENGE WIDGET - Widget de défi quotidien
 * 
 * Affiche le défi du jour avec progression et récompenses
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Flame, Gift, Trophy, 
  CheckCircle2, ChevronRight, Sparkles,
  Calendar, Zap
} from 'lucide-react';
import Link from 'next/link';

interface DailyChallengeData {
  challenge: {
    id: string;
    type: string;
    title: string;
    description: string;
    emoji: string;
    category: string;
    target: number;
    xpReward: number;
    bonusXp: number;
    streakBonusXp: number;
    totalXp: number;
  };
  progress: {
    current: number;
    target: number;
    percentage: number;
    isCompleted: boolean;
  };
  streak: {
    current: number;
    bonusPercentage: number;
    recentCompleted: number;
  };
  isWeekend: boolean;
}

interface DailyChallengeWidgetProps {
  locale: string;
  sport: string;
  compact?: boolean;
}

export default function DailyChallengeWidget({ locale, sport, compact = false }: DailyChallengeWidgetProps) {
  const [data, setData] = useState<DailyChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<{ totalXp: number } | null>(null);

  const fetchChallenge = useCallback(async () => {
    const token = localStorage.getItem('wayofdojo_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/next-api/gamification/daily-challenge', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result);
        }
      }
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const completeChallenge = async () => {
    if (!data || data.progress.isCompleted || data.progress.percentage < 100) return;
    
    setCompleting(true);
    const token = localStorage.getItem('wayofdojo_token');
    
    try {
      const response = await fetch('/next-api/gamification/daily-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setReward(result.rewards);
          setShowReward(true);
          setTimeout(() => {
            setShowReward(false);
            fetchChallenge(); // Refresh data
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-slate-800/50 rounded-2xl border border-slate-700 animate-pulse`}>
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-slate-700 rounded-full w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-slate-800/50 rounded-2xl border border-slate-700`}>
        <p className="text-slate-400 text-center">Connectez-vous pour voir votre défi quotidien</p>
      </div>
    );
  }

  const { challenge, progress, streak, isWeekend } = data;
  const canComplete = progress.percentage >= 100 && !progress.isCompleted;

  // Version compacte pour la sidebar ou petits espaces
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{challenge.emoji}</span>
          <span className="text-amber-400 font-bold text-sm">{challenge.title}</span>
          {isWeekend && <span className="text-xs bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded">2x XP</span>}
        </div>
        <p className="text-slate-300 text-xs mb-2 line-clamp-1">{challenge.description}</p>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            className={`h-full rounded-full ${progress.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-slate-400">{progress.current}/{progress.target}</span>
          <span className="text-xs text-amber-400">+{challenge.totalXp} XP</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Reward Animation */}
      <AnimatePresence>
        {showReward && reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 p-8 rounded-3xl border-2 border-amber-500/50 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-black text-amber-400 mb-2">DÉFI COMPLÉTÉ !</h3>
              <p className="text-white text-xl font-bold">+{reward.totalXp} XP</p>
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-2xl"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border ${
          progress.isCompleted 
            ? 'bg-emerald-900/20 border-emerald-500/30' 
            : 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30'
        }`}
      >
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl">
                {progress.isCompleted ? '✅' : challenge.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
                  {isWeekend && (
                    <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 text-xs rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 2x XP
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Défi du jour
                </p>
              </div>
            </div>
            
            {/* Streak badge */}
            {streak.current > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 rounded-full">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold text-sm">{streak.current}j</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-white mb-4">{challenge.description}</p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Progression</span>
              <span className={progress.isCompleted ? 'text-emerald-400' : 'text-amber-400'}>
                {progress.current}/{progress.target}
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  progress.isCompleted 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
              />
            </div>
          </div>

          {/* Rewards section */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300 text-sm">Récompense</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-amber-400 font-bold">+{challenge.xpReward} XP</span>
              {challenge.bonusXp > 0 && (
                <span className="text-orange-400">+{challenge.bonusXp} weekend</span>
              )}
              {streak.bonusPercentage > 0 && (
                <span className="text-red-400">+{streak.bonusPercentage}% streak</span>
              )}
            </div>
          </div>

          {/* Action button */}
          {progress.isCompleted ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Défi complété !</span>
            </div>
          ) : canComplete ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={completeChallenge}
              disabled={completing}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {completing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Validation...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Réclamer la récompense
                </>
              )}
            </motion.button>
          ) : (
            <Link href={`/${locale}/${sport}/mouvements`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Target className="w-5 h-5" />
                Continuer le défi
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Link>
          )}

          {/* Streak info */}
          {streak.current > 0 && (
            <p className="text-center text-slate-400 text-xs mt-3">
              🔥 {streak.current} jours de suite ! Continue pour +{streak.bonusPercentage}% XP
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
}
