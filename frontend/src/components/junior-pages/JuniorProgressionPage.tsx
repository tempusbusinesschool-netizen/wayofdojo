'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { TrendingUp, Star, Award, BookOpen, Flame, Trophy } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';
import Link from 'next/link';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorProgressionPage - Page de progression version enfantine
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface JuniorProgressionPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  userGrade?: string;
  weeklyProgress?: number[];
  recentAchievements?: { name: string; emoji: string; date: string }[];
}

// Configuration des grades
const GRADES = [
  { id: '6e_kyu', label: '6e Kyu', color: 'from-slate-100 to-white', emoji: '⬜', xpRequired: 0 },
  { id: '5e_kyu', label: '5e Kyu', color: 'from-yellow-400 to-amber-400', emoji: '💛', xpRequired: 500 },
  { id: '4e_kyu', label: '4e Kyu', color: 'from-orange-400 to-orange-600', emoji: '🧡', xpRequired: 1200 },
  { id: '3e_kyu', label: '3e Kyu', color: 'from-green-400 to-green-600', emoji: '💚', xpRequired: 2000 },
  { id: '2e_kyu', label: '2e Kyu', color: 'from-blue-400 to-blue-600', emoji: '💙', xpRequired: 3000 },
  { id: '1er_kyu', label: '1er Kyu', color: 'from-amber-600 to-amber-800', emoji: '🤎', xpRequired: 4500 },
  { id: '1er_dan', label: '1er Dan', color: 'from-slate-800 to-black', emoji: '🖤', xpRequired: 6000 },
];

export const JuniorProgressionPage: React.FC<JuniorProgressionPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 350,
  userLevel = 2,
  userStreak = 5,
  userGrade = '6e_kyu',
  weeklyProgress = [30, 45, 20, 60, 50, 0, 40],
  recentAchievements = [
    { name: 'Technique Mae Ukemi', emoji: '🤸', date: 'Aujourd\'hui' },
    { name: 'Badge Salut Parfait', emoji: '🙇', date: 'Hier' },
    { name: 'Série de 5 jours', emoji: '🔥', date: 'Il y a 2 jours' },
  ],
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  // Trouver le grade actuel et le suivant
  const currentGradeIndex = GRADES.findIndex(g => g.id === userGrade);
  const currentGrade = GRADES[currentGradeIndex] || GRADES[0];
  const nextGrade = GRADES[currentGradeIndex + 1];
  
  // Calcul progression vers le prochain grade
  const xpForCurrentGrade = currentGrade.xpRequired;
  const xpForNextGrade = nextGrade?.xpRequired || currentGrade.xpRequired + 1000;
  const progressToNextGrade = ((userXp - xpForCurrentGrade) / (xpForNextGrade - xpForCurrentGrade)) * 100;

  // Jours de la semaine
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const maxProgress = Math.max(...weeklyProgress);

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Ma Progression"
      subtitle="Regarde comme tu as grandi ! 📈"
      emoji="🚀"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Progression vers le prochain grade */}
      <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentGrade.color} flex items-center justify-center shadow-xl border-2 border-white/30`}>
              <span className="text-3xl">{currentGrade.emoji}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentGrade.label}</h3>
              <p className="text-white/70">Ta ceinture actuelle</p>
            </div>
          </div>
          {nextGrade && (
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${nextGrade.color} flex items-center justify-center shadow-xl border-2 border-white/30 opacity-70`}>
                <span className="text-3xl">{nextGrade.emoji}</span>
              </div>
            </div>
          )}
        </div>

        {nextGrade && (
          <>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Progression vers {nextGrade.label}</span>
              <span className="text-yellow-400 font-bold">{userXp} / {xpForNextGrade} XP</span>
            </div>
            <div className="h-5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNextGrade, 100)}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-2">
              Plus que {xpForNextGrade - userXp} XP pour la prochaine ceinture ! 💪
            </p>
          </>
        )}
      </div>

      {/* Graphique de la semaine */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-white/20">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          📊 Cette semaine
        </h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyProgress.map((progress, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${maxProgress > 0 ? (progress / maxProgress) * 100 : 0}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full rounded-t-lg ${
                  progress > 0 
                    ? 'bg-gradient-to-t from-orange-500 to-yellow-400' 
                    : 'bg-white/10'
                }`}
                style={{ minHeight: progress > 0 ? '8px' : '4px' }}
              />
              <span className="text-white/70 text-xs mt-2">{days[index]}</span>
              {progress > 0 && (
                <span className="text-yellow-400 text-xs font-bold">+{progress}</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="text-white/60 text-sm">
            Total cette semaine : <span className="text-yellow-400 font-bold">{weeklyProgress.reduce((a, b) => a + b, 0)} XP</span>
          </span>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500/80 to-red-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-orange-400/30"
        >
          <Flame className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">{userStreak}</p>
          <p className="text-white/70 text-sm">Jours de suite 🔥</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/80 to-amber-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-yellow-400/30"
        >
          <Star className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">Nv.{userLevel}</p>
          <p className="text-white/70 text-sm">Ton niveau ⭐</p>
        </motion.div>
      </div>

      {/* Dernières réussites */}
      <div className="bg-gradient-to-br from-cyan-600/80 to-blue-600/80 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-cyan-400/30">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          🎉 Tes dernières réussites
        </h3>
        <div className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-white/10 rounded-xl p-3"
            >
              <span className="text-3xl">{achievement.emoji}</span>
              <div className="flex-1">
                <p className="text-white font-medium">{achievement.name}</p>
                <p className="text-white/60 text-xs">{achievement.date}</p>
              </div>
              <Award className="w-5 h-5 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 gap-4">
        <Link href={`/${locale}/${sport}/techniques`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 cursor-pointer"
          >
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-white font-medium">Techniques</p>
            <p className="text-white/60 text-xs">Continue à apprendre !</p>
          </motion.div>
        </Link>
        <Link href={`/${locale}/${sport}/trophees`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20 cursor-pointer"
          >
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white font-medium">Trophées</p>
            <p className="text-white/60 text-xs">Voir tes badges</p>
          </motion.div>
        </Link>
      </div>
    </JuniorPageLayout>
  );
};

export default JuniorProgressionPage;
