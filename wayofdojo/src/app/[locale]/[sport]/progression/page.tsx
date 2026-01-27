'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Star, Target, Trophy,
  CheckCircle2, Lock, Sparkles, Users,
  ChevronRight, ChevronDown, BookOpen, Flame, 
  Clock, Swords, Shield, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import MaitreTanaka from '@/components/MaitreTanaka';
import { AIKIDO_BELTS, getBeltByKey, getNextBelt, BELT_ORDER } from '@/constants/aikidoBelts';
import { TECHNIQUES_BY_KYU, getTechniqueCountByKyu, KYU_ORDER } from '@/constants/techniquesByKyu';
import GRADES_DAN from '@/data/aikido/grades/dan';

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

// Types pour la nouvelle section Dan
interface GradeDanDisplay {
  id: string;
  nom: string;
  nom_japonais: string;
  kanji: string;
  description: string;
  duree_minimale: string;
  techniques_requises: string[];
  competences_evaluees: string[];
  couleurBorder: string;
}

// Mapping des grades Dan avec couleurs distinctives
const DAN_GRADES_DISPLAY: GradeDanDisplay[] = GRADES_DAN.map((grade, index) => ({
  id: grade.id,
  nom: grade.nom,
  nom_japonais: grade.nom_japonais,
  kanji: grade.nom_japonais,
  description: grade.description,
  duree_minimale: grade.duree_minimale || '',
  techniques_requises: grade.techniques_requises,
  competences_evaluees: grade.competences_evaluees,
  couleurBorder: [
    'border-slate-500',      // Shodan
    'border-amber-600',      // Nidan
    'border-red-600',        // Sandan
    'border-purple-600',     // Yondan
    'border-emerald-500',    // Godan
    'border-sky-400',        // Rokudan
    'border-rose-400'        // Nanadan
  ][index] || 'border-slate-500'
}));

export default function ProgressionPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [showDanGrades, setShowDanGrades] = useState(false);
  const [expandedDan, setExpandedDan] = useState<string | null>(null);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const currentBelt = getBeltByKey(user.grade);
  const nextBelt = getNextBelt(currentBelt);
  const _isJeuneSamourai = user.profile === 'jeune_samourai';
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
  const isDanHolder = currentGradeIndex >= 6; // Shodan or above

  // Calculate overall progress
  const totalTechniques = gradeProgress.reduce((sum, g) => sum + g.totalTech, 0);
  const totalCompleted = gradeProgress.reduce((sum, g) => sum + g.completedCount, 0);
  const overallProgress = totalTechniques > 0 ? Math.round((totalCompleted / totalTechniques) * 100) : 0;

  // XP to next level
  const xpProgress = Math.min(100, (user.gamification.xp % 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/${locale}/${sport}/dojo`} className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30"
            >
              <Target className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-white">Ma Progression</span>
              <p className="text-xs text-amber-400">
                Parcours de {user.firstName}
              </p>
            </div>
          </Link>

          <Link href={`/${locale}/${sport}/dojo`}>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 border bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Belt Display */}
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className={`w-28 h-28 rounded-2xl flex items-center justify-center text-5xl shadow-2xl bg-gradient-to-br ${currentBelt.gradient} border-4 border-white/20`}
                style={{ boxShadow: `0 0 40px ${currentBelt.color}40` }}
              >
                {currentBelt.emoji}
              </motion.div>
              {/* Level badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border-2 border-slate-900">
                <span className="text-white font-bold text-sm">N{user.gamification.level}</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                {currentBelt.name}
              </h1>
              <p className="text-lg text-amber-400">
                {currentBelt.grade}
              </p>
              <p className="text-slate-400 text-sm mt-2 max-w-md">{currentBelt.message}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-black text-amber-400">{user.gamification.xp}</div>
                <div className="text-xs text-slate-500">XP Total</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5" />
                  {user.gamification.streak}
                </div>
                <div className="text-xs text-slate-500">Streak</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-black text-cyan-400">{totalCompleted}</div>
                <div className="text-xs text-slate-500">Techniques</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="text-2xl font-black text-emerald-400">{overallProgress}%</div>
                <div className="text-xs text-slate-500">Progression</div>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Prochain niveau</span>
              <span className="text-amber-400">{user.gamification.xp % 100} / 100 XP</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
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
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Prochain Objectif
            </h2>
            <div className="rounded-xl p-4 border bg-slate-800/30 border-slate-700/50 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${nextBelt.gradient} border-2 border-white/20`}
                >
                  {nextBelt.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{nextBelt.name}</h3>
                  <p className="text-slate-500 text-sm">{nextBelt.grade}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* GRADES KYU Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Grades Kyu
            <span className="text-slate-500 text-sm font-normal ml-2">(Ceintures de couleur)</span>
          </h2>
          
          <div className="space-y-3">
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
                  transition={{ delay: 0.1 + index * 0.03 }}
                  onClick={() => !isLocked && setSelectedGrade(selectedGrade === beltKey ? null : beltKey)}
                  className={`relative cursor-pointer ${isLocked ? 'opacity-50' : ''}`}
                >
                  <div className={`
                    flex items-center gap-4 p-4 rounded-xl transition-all
                    ${isCurrent 
                      ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/50 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                      : isCompleted
                        ? 'bg-slate-800/30 border border-emerald-500/30 hover:bg-slate-800/50'
                        : 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/40'
                    }
                  `}>
                    {/* Belt circle */}
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                        isCurrent 
                          ? `bg-gradient-to-br ${belt.gradient} ring-2 ring-white/30` 
                          : isCompleted 
                            ? `bg-gradient-to-br ${belt.gradient}` 
                            : 'bg-slate-700'
                      }`}
                      style={isCurrent ? { boxShadow: `0 0 15px ${belt.color}50` } : {}}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <span className="text-lg">{belt.emoji}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {belt.name}
                        </h3>
                        <span className="text-slate-500 text-sm">({belt.grade})</span>
                        {isCurrent && <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />}
                      </div>
                      
                      {/* Progress bar */}
                      {progress && !isLocked && (
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.progress}%` }}
                              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
                              className={`h-full rounded-full ${
                                isCompleted 
                                  ? 'bg-emerald-500' 
                                  : `bg-gradient-to-r ${belt.gradient}`
                              }`}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{progress.completedCount}/{progress.totalTech}</span>
                        </div>
                      )}
                    </div>

                    {/* Status icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <Trophy className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ChevronRight className={`w-5 h-5 ${selectedGrade === beltKey ? 'rotate-90' : ''} transition-transform text-slate-500`} />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedGrade === beltKey && !isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 ml-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                          <p className="text-slate-400 text-sm mb-3">{belt.funMessage}</p>
                          
                          {belt.symbolicRole && (
                            <div className="mb-3 p-3 rounded-lg bg-slate-900/50">
                              <div className="text-xs text-slate-500 mb-1">Rôle symbolique</div>
                              <div className="text-white font-medium">{belt.symbolicRole.name}</div>
                              <div className="text-sm text-slate-400">{belt.symbolicRole.intention}</div>
                            </div>
                          )}

                          <Link href={`/${locale}/${sport}/techniques?grade=${beltKey}`}>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Voir les techniques
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* GRADES DAN Section - Version graphique adulte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowDanGrades(!showDanGrades)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Grades Dan
              <span className="text-slate-500 text-sm font-normal ml-2">(Ceintures noires)</span>
            </h2>
            <motion.div
              animate={{ rotate: showDanGrades ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="p-1 rounded-lg group-hover:bg-slate-800 transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showDanGrades && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  {DAN_GRADES_DISPLAY.map((grade, index) => {
                    const isDanCompleted = isDanHolder && currentGradeIndex > (6 + index);
                    const isDanCurrent = isDanHolder && currentGradeIndex === (6 + index);
                    const isDanLocked = !isDanHolder || currentGradeIndex < (6 + index);

                    return (
                      <motion.div
                        key={grade.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={isDanLocked && !isDanHolder ? 'opacity-60' : ''}
                      >
                        <div
                          onClick={() => setExpandedDan(expandedDan === grade.id ? null : grade.id)}
                          className={`
                            flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all
                            ${isDanCurrent 
                              ? 'bg-gradient-to-r from-slate-800 to-slate-700/50 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                              : isDanCompleted
                                ? 'bg-slate-800/30 border border-emerald-500/30 hover:bg-slate-800/50'
                                : 'bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/40'
                            }
                          `}
                        >
                          {/* Dan belt indicator */}
                          <div 
                            className={`
                              w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0
                              bg-slate-900 border-4 ${grade.couleurBorder}
                            `}
                          >
                            <span className="text-white font-bold text-xs">{grade.kanji}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold ${isDanLocked ? 'text-slate-400' : 'text-white'}`}>
                                {grade.nom}
                              </h3>
                              <span className="text-slate-500 text-sm">({grade.nom_japonais})</span>
                              {isDanCurrent && <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />}
                              {isDanCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                              {isDanLocked && <Lock className="w-4 h-4 text-slate-500" />}
                            </div>
                            <p className={`text-sm line-clamp-1 ${isDanLocked ? 'text-slate-500' : 'text-slate-400'}`}>
                              {grade.description}
                            </p>
                          </div>

                          {/* Expand icon */}
                          <ChevronRight className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${expandedDan === grade.id ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {expandedDan === grade.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 ml-4 p-5 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                {/* Durée */}
                                <div className="flex items-center gap-2 text-sm mb-4">
                                  <Clock className="w-4 h-4 text-cyan-400" />
                                  <span className="text-slate-400">Durée minimale:</span>
                                  <span className="text-white">{grade.duree_minimale}</span>
                                </div>

                                {/* Techniques requises */}
                                <div className="mb-4">
                                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <Swords className="w-4 h-4 text-red-400" />
                                    Techniques requises
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {grade.techniques_requises.map((tech, idx) => (
                                      <span 
                                        key={idx}
                                        className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md border border-slate-600/50"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {/* Compétences évaluées */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-purple-400" />
                                    Compétences évaluées
                                  </h4>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                    {grade.competences_evaluees.map((comp, idx) => (
                                      <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                                        <Star className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                                        {comp}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showDanGrades && (
            <p className="text-sm text-slate-500 flex items-center gap-2 p-3 bg-slate-800/20 rounded-lg">
              <Info className="w-4 h-4" />
              Cliquez pour découvrir les 7 grades Dan (Shodan à Nanadan)
            </p>
          )}
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
              className="p-5 rounded-xl border bg-slate-800/30 border-slate-700/50 hover:border-emerald-500/30 transition-colors"
            >
              <BookOpen className="w-8 h-8 mb-3 text-emerald-400" />
              <h3 className="text-white font-bold">Techniques</h3>
              <p className="text-slate-500 text-sm">{totalCompleted}/{totalTechniques} maîtrisées</p>
            </motion.div>
          </Link>

          <Link href={`/${locale}/${sport}/dojo-virtuel`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl border bg-slate-800/30 border-slate-700/50 hover:border-purple-500/30 transition-colors"
            >
              <Users className="w-8 h-8 mb-3 text-purple-400" />
              <h3 className="text-white font-bold">Dojo Virtuel</h3>
              <p className="text-slate-500 text-sm">S'entraîner en jouant</p>
            </motion.div>
          </Link>
        </motion.div>
      </main>

      {/* Maître Tanaka */}
      <MaitreTanaka 
        isJeuneSamourai={false}
        messages={[
          `${user.firstName}, ton parcours est exemplaire.`,
          currentBelt.encouragement,
          "La voie du guerrier est un chemin sans fin.",
          "Chaque technique maîtrisée éclaire ta progression.",
        ]}
      />
    </div>
  );
}
