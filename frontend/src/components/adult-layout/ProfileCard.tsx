'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, BookOpen, Pencil } from 'lucide-react';
import Image from 'next/image';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ProfileCard - Carte profil selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface ProfileCardProps {
  userName: string;
  xp: number;
  maxXp?: number;
  streak: number;
  badgesCount: number;
  techniquesCount: number;
  locale: string;
  sport: string;
  currentGrade?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  xp,
  maxXp = 400,
  streak,
  badgesCount,
  techniquesCount,
  currentGrade = '6e Kyu',
}) => {
  const nextPalier = maxXp - xp;
  const xpProgress = Math.min((xp / maxXp) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0d1628] rounded-2xl overflow-hidden"
      data-testid="profile-card"
    >
      {/* Avatar et nom */}
      <div className="p-5 pb-4 text-center relative">
        {/* Avatar avec bouton éditer */}
        <div className="relative inline-block mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-slate-600 bg-gradient-to-br from-cyan-400 to-blue-500 mx-auto">
            <Image
              src="/images/avatars/default-adult.png"
              alt={userName}
              width={96}
              height={96}
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          {/* Bouton éditer */}
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center border-2 border-[#0d1628] transition-colors">
            <Pencil className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Nom */}
        <h3 className="text-xl font-bold text-white mb-2">{userName}</h3>
        
        {/* Badge grade */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30">
          <span className="text-orange-400 text-lg">⛩️</span>
          <span className="text-orange-400 font-semibold text-sm">{currentGrade}</span>
        </div>
      </div>

      {/* Barre XP */}
      <div className="px-5 pb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">XP</span>
          <span className="text-white text-sm font-semibold">{xp} / {maxXp}</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
          />
        </div>
        <p className="text-slate-500 text-xs mt-2">
          Prochain palier : <span className="text-slate-300">{nextPalier} XP</span>
        </p>
      </div>

      {/* Stats en ligne */}
      <div className="grid grid-cols-3 border-t border-white/5">
        <div className="p-4 text-center border-r border-white/5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-bold text-white">{streak}</div>
          <div className="text-[10px] text-slate-500 leading-tight">Série de<br/>jours</div>
        </div>
        <div className="p-4 text-center border-r border-white/5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{badgesCount}</div>
          <div className="text-[10px] text-slate-500 leading-tight">Badges<br/>obtenus</div>
        </div>
        <div className="p-4 text-center">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mx-auto mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{techniquesCount}</div>
          <div className="text-[10px] text-slate-500 leading-tight">Techniques<br/>apprises</div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
