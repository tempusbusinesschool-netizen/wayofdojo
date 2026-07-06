'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, BookOpen, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ADULT_RANKS, getRankByXp } from '@/data/musashi/journey';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ProfileCard - Carte profil utilisateur compacte
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface ProfileCardProps {
  userName: string;
  xp: number;
  streak: number;
  badgesCount: number;
  techniquesCount: number;
  locale: string;
  sport: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  userName,
  xp,
  streak,
  badgesCount,
  techniquesCount,
  locale,
  sport,
}) => {
  const currentRank = getRankByXp(xp);
  const nextRank = ADULT_RANKS[ADULT_RANKS.findIndex(r => r.id === currentRank.id) + 1];
  
  const xpProgress = nextRank 
    ? Math.min(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100, 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0d1b31] rounded-2xl border border-white/10 overflow-hidden"
      data-testid="profile-card"
    >
      {/* En-tête avec avatar et rang */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-4">
          {/* Avatar avec halo */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-2xl border-2 border-orange-500/50 shadow-lg">
              {currentRank.icon}
            </div>
            <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-md -z-10" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{userName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl">{currentRank.icon}</span>
              <span className="text-amber-400 font-semibold">{currentRank.name}</span>
              <span className="text-slate-500 text-sm">{currentRank.nameJp}</span>
            </div>
          </div>
        </div>

        {/* Description du rang */}
        <p className="text-slate-400 text-xs mt-3 italic">
          "{currentRank.description}"
        </p>

        {/* Badge grade */}
        {currentRank.kyu && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
              Grade : {currentRank.kyu}
            </span>
          </div>
        )}
      </div>

      {/* Progression XP */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-xs">XP</span>
          <span className="text-amber-400 text-sm font-semibold">
            {xp} / {nextRank?.minXp || xp}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
          />
        </div>
        {nextRank && (
          <p className="text-slate-500 text-xs mt-2">
            Prochain palier : <span className="text-slate-300">{nextRank.minXp - xp} XP</span>
          </p>
        )}
      </div>

      {/* Stats compactes */}
      <div className="grid grid-cols-3 divide-x divide-white/5">
        <div className="p-3 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{streak}</div>
          <div className="text-[10px] text-slate-500">Série</div>
        </div>
        <div className="p-3 text-center">
          <Trophy className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{badgesCount}</div>
          <div className="text-[10px] text-slate-500">Badges</div>
        </div>
        <div className="p-3 text-center">
          <BookOpen className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-white">{techniquesCount}</div>
          <div className="text-[10px] text-slate-500">Techniques</div>
        </div>
      </div>

      {/* Lien vers profil complet */}
      <Link 
        href={`/${locale}/${sport}/profil`}
        className="block p-3 text-center text-slate-400 hover:text-orange-400 hover:bg-white/5 transition-colors text-sm border-t border-white/5"
      >
        Voir mon profil complet
        <ChevronRight className="w-4 h-4 inline ml-1" />
      </Link>
    </motion.div>
  );
};

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TanakaCompactCard - Carte compacte Maître Tanaka
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface TanakaCompactCardProps {
  onClick?: () => void;
}

export const TanakaCompactCard: React.FC<TanakaCompactCardProps> = ({
  onClick,
}) => {
  const quotes = [
    "La vraie victoire est la victoire sur soi-même.",
    "Chaque jour est une nouvelle occasion d'apprendre.",
    "La patience est la clé de la maîtrise.",
    "L'harmonie naît de la pratique constante.",
  ];
  
  const quote = quotes[new Date().getHours() % quotes.length];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-[#0d1b31] rounded-2xl border border-white/10 p-4"
      data-testid="tanaka-compact-card"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-2xl border border-orange-500/30">
          🧘
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">Maître Tanaka</h4>
          <p className="text-slate-500 text-xs">Ton Sensei personnel</p>
        </div>
      </div>
      
      <p className="text-slate-400 text-xs italic mb-3 line-clamp-2">
        « {quote} »
      </p>
      
      <button
        onClick={onClick}
        className="w-full text-center text-orange-400 hover:text-orange-300 text-xs font-medium py-2 rounded-lg hover:bg-orange-500/10 transition-colors"
      >
        Voir son message →
      </button>
    </motion.div>
  );
};

export default ProfileCard;
