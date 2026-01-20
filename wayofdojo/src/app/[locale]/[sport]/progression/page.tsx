'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Target, Trophy, TrendingUp,
  Award, CheckCircle2, Lock, Sparkles,
  ChevronRight, BookOpen, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import { AIKIDO_BELTS, getBeltByKey, getNextBelt, BELT_ORDER } from '@/constants/aikidoBelts';
import { TECHNIQUES_BY_KYU, getTechniqueCountByKyu, KYU_ORDER } from '@/constants/techniquesByKyu';

interface User {
  firstName: string;
  grade: string;
  profile: string;
  gamification: {
    xp: number;
    level: number;
    streak: number;
    completedTechniques: string[];
  };
}

export default function ProgressionPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('wayofdojo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push(`/${locale}/${sport}/login`);
    }
    setLoading(false);
  }, [locale, sport, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const currentBelt = getBeltByKey(user.grade);
  const nextBelt = getNextBelt(currentBelt);
  const isJeuneNinja = user.profile === 'jeune_ninja';
  const completedTechniques = user.gamification.completedTechniques || [];

  // Calculate progress for each grade
  const gradeProgress = KYU_ORDER.map(kyuId => {
    const totalTech = getTechniqueCountByKyu(kyuId);
    const program = TECHNIQUES_BY_KYU[kyuId];
    let completedCount = 0;
    
    program?.categories.forEach(cat => {
      cat.techniques.forEach(tech => {
        if (completedTechniques.includes(tech.id)) {
          completedCount++;
        }
      });
    });

    return {
      kyuId,
      totalTech,
      completedCount,
      progress: totalTech > 0 ? Math.round((completedCount / totalTech) * 100) : 0,
    };
  });

  // Find current grade index
  const currentGradeIndex = BELT_ORDER.findIndex(b => b === user.grade);

  // Calculate overall progress
  const totalTechniques = gradeProgress.reduce((sum, g) => sum + g.totalTech, 0);
  const totalCompleted = gradeProgress.reduce((sum, g) => sum + g.completedCount, 0);
  const overallProgress = totalTechniques > 0 ? Math.round((totalCompleted / totalTechniques) * 100) : 0;

  // XP to next level
  const xpProgress = Math.min(100, (user.gamification.xp % 100));

  return (
    <div className={`min-h-screen ${isJeuneNinja 
      ? 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950' 
      : 'bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${
        isJeuneNinja 
          ? 'bg-amber-900/80 border-amber-500/20' 
          : 'bg-emerald-900/80 border-emerald-500/20'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}/${sport}/dojo`} className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                isJeuneNinja 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30' 
                  : 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-500/30'
              }`}
            >
              <Target className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">Ma Progression</span>
              <p className={`text-xs ${isJeuneNinja ? 'text-amber-300' : 'text-emerald-300'}`}>
                Parcours de {user.firstName}
              </p>
            </div>
          </Link>

          <Link href={`/${locale}/${sport}/dojo`}>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 border mb-8 ${
            isJeuneNinja 
              ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border-amber-500/30' 
              : 'bg-gradient-to-br from-emerald-600/20 to-green-600/20 border-emerald-500/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Belt Display */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl ${
                `bg-gradient-to-br ${currentBelt.gradient}`
              }`}
              style={{ boxShadow: `0 0 60px ${currentBelt.color}40` }}
            >
              {currentBelt.emoji}
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-white mb-1">
                {currentBelt.name}
              </h1>
              <p className={`text-lg ${isJeuneNinja ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentBelt.grade}
              </p>
              <p className="text-slate-400 text-sm mt-2">{currentBelt.message}</p>
              
              {/* Animal Spirit */}
              <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
                <span className="text-3xl">{currentBelt.animalSpirit}</span>
                <span className="text-white font-semibold">{currentBelt.animalName}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-amber-400">{user.gamification.xp}</div>
                <div className="text-xs text-slate-400">XP Total</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-cyan-400">{user.gamification.level}</div>
                <div className="text-xs text-slate-400">Niveau</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-orange-400 flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6" />
                  {user.gamification.streak}
                </div>
                <div className="text-xs text-slate-400">Streak</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-3xl font-black text-emerald-400">{overallProgress}%</div>
                <div className="text-xs text-slate-400">Progression</div>
              </div>
            </div>
          </div>

          {/* XP Progress to next level */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Prochain niveau</span>
              <span className="text-amber-400">{user.gamification.xp % 100} / 100 XP</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Next Belt Goal */}
        {nextBelt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Prochain Objectif
            </h2>
            <div className={`rounded-2xl p-5 border ${
              isJeuneNinja 
                ? 'bg-amber-900/20 border-amber-700/50' 
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="flex items-center gap-4">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${nextBelt.gradient}`}
                >
                  {nextBelt.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{nextBelt.name}</h3>
                  <p className="text-slate-400 text-sm">{nextBelt.grade}</p>
                  <p className="text-emerald-400 text-sm mt-1">{nextBelt.encouragement}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Belt Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Parcours des Ceintures
          </h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-700 rounded-full" />
            
            {/* Belt stages */}
            <div className="space-y-4">
              {BELT_ORDER.map((beltKey, index) => {
                const belt = AIKIDO_BELTS[beltKey];
                const isCompleted = index < currentGradeIndex;
                const isCurrent = index === currentGradeIndex;
                const isLocked = index > currentGradeIndex;
                const progress = gradeProgress.find(g => g.kyuId === beltKey);

                return (
                  <motion.div
                    key={beltKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => !isLocked && setSelectedGrade(selectedGrade === beltKey ? null : beltKey)}
                    className={`relative pl-20 cursor-pointer ${isLocked ? 'opacity-50' : ''}`}
                  >
                    {/* Belt circle */}
                    <div 
                      className={`absolute left-4 w-9 h-9 rounded-full flex items-center justify-center text-xl z-10 ${
                        isCurrent 
                          ? `bg-gradient-to-br ${belt.gradient} ring-4 ring-white/30` 
                          : isCompleted 
                            ? `bg-gradient-to-br ${belt.gradient}` 
                            : 'bg-slate-700'
                      }`}
                      style={isCurrent ? { boxShadow: `0 0 20px ${belt.color}60` } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <span className="text-sm">{belt.emoji}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`rounded-2xl p-4 transition-all ${
                      isCurrent 
                        ? `bg-gradient-to-r ${belt.gradient}/20 border-2 border-white/20` 
                        : isCompleted 
                          ? 'bg-emerald-500/10 border border-emerald-500/30' 
                          : 'bg-slate-800/30 border border-slate-700/50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {belt.name}
                          </h3>
                          <p className="text-slate-500 text-sm">{belt.grade}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {progress && (
                            <div className="text-right">
                              <div className={`text-sm font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {progress.completedCount}/{progress.totalTech}
                              </div>
                              <div className="text-xs text-slate-500">techniques</div>
                            </div>
                          )}
                          
                          {isCurrent && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <Sparkles className="w-5 h-5 text-amber-400" />
                            </motion.div>
                          )}
                          
                          {isCompleted && (
                            <Trophy className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      {progress && !isLocked && (
                        <div className="mt-3">
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full rounded-full ${
                                isCompleted 
                                  ? 'bg-emerald-500' 
                                  : `bg-gradient-to-r ${belt.gradient}`
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Expanded details */}
                      <AnimatePresence>
                        {selectedGrade === beltKey && !isLocked && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                              <p className="text-slate-400 text-sm mb-3">{belt.funMessage}</p>
                              
                              {belt.symbolicRole && (
                                <div className="mb-3 p-3 rounded-xl bg-white/5">
                                  <div className="text-xs text-slate-500 mb-1">Rôle symbolique</div>
                                  <div className="text-white font-semibold">{belt.symbolicRole.name}</div>
                                  <div className="text-sm text-slate-400">{belt.symbolicRole.intention}</div>
                                </div>
                              )}

                              <Link href={`/${locale}/${sport}/techniques?grade=${beltKey}`}>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={`w-full ${isCurrent ? 'border-white/30 text-white' : 'border-slate-600 text-slate-300'}`}
                                >
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Voir les techniques
                                </Button>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href={`/${locale}/${sport}/techniques`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border ${
                isJeuneNinja 
                  ? 'bg-amber-900/30 border-amber-700/50 hover:border-amber-500/50' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
              }`}
            >
              <BookOpen className={`w-8 h-8 mb-3 ${isJeuneNinja ? 'text-amber-400' : 'text-emerald-400'}`} />
              <h3 className="text-white font-bold">Techniques</h3>
              <p className="text-slate-400 text-sm">{totalCompleted}/{totalTechniques} maîtrisées</p>
            </motion.div>
          </Link>

          <Link href={`/${locale}/${sport}/badges`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border ${
                isJeuneNinja 
                  ? 'bg-amber-900/30 border-amber-700/50 hover:border-amber-500/50' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
              }`}
            >
              <Award className={`w-8 h-8 mb-3 ${isJeuneNinja ? 'text-amber-400' : 'text-violet-400'}`} />
              <h3 className="text-white font-bold">Badges</h3>
              <p className="text-slate-400 text-sm">{user.gamification.completedTechniques?.length || 0} obtenus</p>
            </motion.div>
          </Link>
        </motion.div>
      </main>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isJeuneNinja={isJeuneNinja}
        messages={[
          `${user.firstName}, ton parcours est impressionnant !`,
          currentBelt.encouragement,
          "Chaque technique maîtrisée te rapproche du but.",
          "La progression est un voyage, pas une destination.",
        ]}
      />
    </div>
  );
}
