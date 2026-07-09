'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Flame, Trophy, Star, BookOpen, Target } from 'lucide-react';
import { JuniorPageLayout } from '@/components/layouts/JuniorPageLayout';
import Link from 'next/link';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JuniorProfilPage - Page de profil version enfantine
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface JuniorProfilPageProps {
  userName?: string;
  userXp?: number;
  userLevel?: number;
  userStreak?: number;
  userGrade?: string;
  userBadges?: string[];
  completedTechniques?: number;
  totalTrainingDays?: number;
}

// Configuration des grades avec animaux
const GRADES_CONFIG: Record<string, { label: string; animal: string; color: string }> = {
  '6e_kyu': { label: '6e Kyu', animal: '🐣', color: 'from-slate-100 to-white' },
  '5e_kyu': { label: '5e Kyu', animal: '🐥', color: 'from-yellow-400 to-amber-400' },
  '4e_kyu': { label: '4e Kyu', animal: '🦊', color: 'from-orange-400 to-orange-600' },
  '3e_kyu': { label: '3e Kyu', animal: '🐢', color: 'from-green-400 to-green-600' },
  '2e_kyu': { label: '2e Kyu', animal: '🐬', color: 'from-blue-400 to-blue-600' },
  '1er_kyu': { label: '1er Kyu', animal: '🦅', color: 'from-amber-600 to-amber-800' },
  '1er_dan': { label: '1er Dan', animal: '🐉', color: 'from-slate-800 to-black' },
};

export const JuniorProfilPage: React.FC<JuniorProfilPageProps> = ({
  userName = 'Jeune Samouraï',
  userXp = 150,
  userLevel = 2,
  userStreak = 5,
  userGrade = '6e_kyu',
  userBadges = ['premier_pas', 'salut_parfait'],
  completedTechniques = 8,
  totalTrainingDays = 15,
}) => {
  const params = useParams();
  const locale = params.locale as string;
  const sport = params.sport as string;

  const gradeConfig = GRADES_CONFIG[userGrade] || GRADES_CONFIG['6e_kyu'];
  
  // Calcul XP pour le prochain niveau
  const xpForNextLevel = userLevel * 200;
  const xpProgress = (userXp % 200) / 200 * 100;

  return (
    <JuniorPageLayout
      locale={locale}
      sport={sport}
      title="Mon Profil"
      subtitle="Voici ton parcours de samouraï ! 🥷"
      emoji="👤"
      userName={userName}
      userXp={userXp}
      userLevel={userLevel}
      userStreak={userStreak}
    >
      {/* Carte de profil principale */}
      <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-purple-400/30 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradeConfig.color} flex items-center justify-center shadow-xl border-4 border-white/30`}>
            <span className="text-6xl">{gradeConfig.animal}</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="font-black text-slate-900">Nv.{userLevel}</span>
          </div>
        </div>

        {/* Nom */}
        <h2 className="text-3xl font-black text-white mb-1">{userName}</h2>
        <p className="text-white/70">{gradeConfig.label} - Ceinture</p>

        {/* Barre d'XP */}
        <div className="mt-4 max-w-xs mx-auto">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/70">XP</span>
            <span className="text-yellow-400 font-bold">{userXp} / {xpForNextLevel}</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            />
          </div>
          <p className="text-white/60 text-xs mt-1">
            Encore {xpForNextLevel - userXp} XP pour le niveau {userLevel + 1} !
          </p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-500/80 to-red-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-orange-400/30"
        >
          <Flame className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">{userStreak}</p>
          <p className="text-white/70 text-sm">Jours de suite</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-yellow-500/80 to-amber-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-yellow-400/30"
        >
          <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">{userBadges.length}</p>
          <p className="text-white/70 text-sm">Badges</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-cyan-500/80 to-blue-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-cyan-400/30"
        >
          <BookOpen className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">{completedTechniques}</p>
          <p className="text-white/70 text-sm">Techniques</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-xl rounded-2xl p-4 text-center border border-green-400/30"
        >
          <Target className="w-8 h-8 text-white mx-auto mb-2" />
          <p className="text-3xl font-black text-white">{totalTrainingDays}</p>
          <p className="text-white/70 text-sm">Entraînements</p>
        </motion.div>
      </div>

      {/* Badges récents */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 mb-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            🏆 Mes derniers badges
          </h3>
          <Link href={`/${locale}/${sport}/trophees`} className="text-yellow-400 text-sm hover:text-yellow-300">
            Voir tout →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'premier_pas', emoji: '👣', name: 'Premier Pas' },
            { id: 'salut_parfait', emoji: '🙇', name: 'Salut Parfait' },
            { id: 'chuteur', emoji: '🤸', name: 'Maître Chuteur' },
          ].map((badge) => {
            const isUnlocked = userBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isUnlocked 
                    ? 'bg-yellow-500/30 border border-yellow-400/50' 
                    : 'bg-slate-700/50 border border-slate-600/50 opacity-50'
                }`}
              >
                <span className={`text-2xl ${!isUnlocked && 'grayscale'}`}>
                  {isUnlocked ? badge.emoji : '🔒'}
                </span>
                <span className={`font-medium text-sm ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prochains objectifs */}
      <div className="bg-gradient-to-br from-indigo-600/80 to-violet-600/80 backdrop-blur-xl rounded-3xl p-5 border border-indigo-400/30">
        <h3 className="text-white font-bold flex items-center gap-2 mb-4">
          🎯 Tes prochains objectifs
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <div className="w-10 h-10 bg-yellow-500/30 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Atteindre le niveau {userLevel + 1}</p>
              <p className="text-white/60 text-sm">Plus que {xpForNextLevel - userXp} XP !</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <div className="w-10 h-10 bg-orange-500/30 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Série de 7 jours</p>
              <p className="text-white/60 text-sm">Plus que {7 - userStreak} jours !</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Apprendre 10 techniques</p>
              <p className="text-white/60 text-sm">Plus que {10 - completedTechniques} techniques !</p>
            </div>
          </div>
        </div>
      </div>
    </JuniorPageLayout>
  );
};

export default JuniorProfilPage;
