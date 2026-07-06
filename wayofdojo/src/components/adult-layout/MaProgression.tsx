'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy, Gift } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Timeline des ceintures EXACT selon le visuel de référence
 * Ceintures style kimono avec noeud dans fond ovale sombre
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface MaProgressionProps {
  xp: number;
  maxXp?: number;
  xpGainedThisWeek?: number;
  currentGrade: string;
  locale: string;
  sport: string;
}

// Couleurs des ceintures exactes selon le visuel de référence
const BELTS = [
  { grade: '6e Kyu', color: '#FFFFFF', name: 'Blanche' },
  { grade: '5e Kyu', color: '#EAB308', name: 'Jaune' },
  { grade: '4e Kyu', color: '#F97316', name: 'Orange' },
  { grade: '3e Kyu', color: '#22C55E', name: 'Verte' },
  { grade: '2e Kyu', color: '#3B82F6', name: 'Bleue' },
  { grade: '1er Kyu', color: '#A16207', name: 'Marron' },
  { grade: '1er Dan', color: '#1F2937', name: 'Noire', borderColor: '#4B5563' },
];

// Icône de ceinture EXACTE selon l'image de référence
const BeltIcon = ({ color, isActive, borderColor }: { color: string; isActive: boolean; borderColor?: string }) => (
  <svg viewBox="0 0 80 100" className="w-full h-full drop-shadow-lg">
    {/* Fond ovale sombre */}
    <ellipse 
      cx="40" 
      cy="50" 
      rx="35" 
      ry="45" 
      fill="#0f172a"
      stroke={isActive ? '#F97316' : (borderColor || '#334155')}
      strokeWidth={isActive ? 3 : 1.5}
    />
    
    {/* Ceinture - partie haute (col du kimono) */}
    <path 
      d="M 25 28 
         C 25 22, 40 18, 40 18
         C 40 18, 55 22, 55 28
         L 52 38
         C 46 35, 34 35, 28 38
         Z"
      fill={color}
      stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'}
      strokeWidth="1"
    />
    
    {/* Noeud central de la ceinture */}
    <rect 
      x="34" 
      y="36" 
      width="12" 
      height="10" 
      rx="2" 
      fill={color}
      stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'}
      strokeWidth="1"
    />
    
    {/* Pan gauche de la ceinture */}
    <path 
      d="M 28 46
         L 22 72
         C 21 76, 24 78, 28 78
         L 36 78
         C 38 78, 38 76, 37 72
         L 34 46
         Z"
      fill={color}
      stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'}
      strokeWidth="1"
    />
    
    {/* Pan droit de la ceinture */}
    <path 
      d="M 46 46
         L 43 72
         C 42 76, 42 78, 44 78
         L 52 78
         C 56 78, 59 76, 58 72
         L 52 46
         Z"
      fill={color}
      stroke={color === '#FFFFFF' ? '#D1D5DB' : 'rgba(0,0,0,0.3)'}
      strokeWidth="1"
    />
    
    {/* Reflet/brillance sur le noeud */}
    <ellipse 
      cx="40" 
      cy="40" 
      rx="3" 
      ry="2" 
      fill="rgba(255,255,255,0.3)"
    />
  </svg>
);

// Losange connecteur entre les ceintures
const Diamond = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5">
    <path 
      d="M6 0 L12 6 L6 12 L0 6 Z" 
      fill={filled ? '#F97316' : '#374151'}
    />
  </svg>
);

export const MaProgression: React.FC<MaProgressionProps> = ({
  xp,
  maxXp = 400,
  currentGrade,
  locale,
  sport,
}) => {
  const currentIndex = BELTS.findIndex(b => b.grade === currentGrade);
  const progressPercent = (xp / maxXp) * 100;
  const nextMilestone = 250;
  const xpToNextMilestone = Math.max(0, nextMilestone - xp);

  return (
    <section data-testid="ma-progression" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-xl">🥋</span>
          <h3 className="text-lg font-semibold text-white">Ma progression de ceinture</h3>
        </div>
        <Link 
          href={`/${locale}/${sport}/ceintures`}
          className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
        >
          Voir le programme
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Conteneur principal */}
      <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1e3a] to-[#1a1040] rounded-2xl p-6 relative overflow-hidden">
        {/* Background pagode japonaise subtile */}
        <div className="absolute right-4 top-4 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 120" fill="none" className="w-full h-full">
            <path d="M50 0 L90 25 L85 30 L95 35 L50 60 L5 35 L15 30 L10 25 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <path d="M50 30 L80 50 L75 55 L85 60 L50 80 L15 60 L25 55 L20 50 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <path d="M50 60 L70 75 L65 80 L75 85 L50 100 L25 85 L35 80 L30 75 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <rect x="45" y="100" width="10" height="20" stroke="#8B5CF6" strokeWidth="1"/>
          </svg>
        </div>

        {/* Timeline des ceintures - ALIGNÉE À GAUCHE */}
        <div className="relative mb-8 pt-12">
          <div className="flex items-end justify-start gap-1">
            {BELTS.map((belt, index) => {
              const isActive = belt.grade === currentGrade;
              const isFuture = index > currentIndex;
              
              return (
                <React.Fragment key={belt.grade}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Bulle "Tu es ici !" */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 z-20"
                      >
                        <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                          Tu es ici !
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rotate-45"></div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Conteneur ceinture avec effet lumineux */}
                    <div className={`
                      relative w-16 h-20
                      ${isActive ? 'z-10' : isFuture ? 'opacity-40' : ''}
                      transition-all duration-300
                    `}>
                      {/* Effet lumineux orange pour grade actuel */}
                      {isActive && (
                        <>
                          <div className="absolute -inset-2 bg-orange-500/40 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-md"></div>
                        </>
                      )}
                      
                      <BeltIcon 
                        color={belt.color} 
                        isActive={isActive}
                        borderColor={(belt as typeof BELTS[number] & { borderColor?: string }).borderColor}
                      />
                    </div>
                    
                    {/* Label du grade */}
                    <span className={`
                      text-[11px] mt-1 font-medium whitespace-nowrap
                      ${isActive 
                        ? 'text-orange-400 font-bold bg-orange-500/20 px-2 py-0.5 rounded' 
                        : isFuture 
                          ? 'text-slate-600' 
                          : 'text-slate-400'}
                    `}>
                      {belt.grade}
                    </span>
                  </motion.div>
                  
                  {/* Ligne + Losange entre les ceintures */}
                  {index < BELTS.length - 1 && (
                    <div className="flex items-center pb-6 mx-0.5">
                      <div className="w-4 h-px bg-slate-600"></div>
                      <Diamond filled={index < currentIndex} />
                      <div className="w-4 h-px bg-slate-600"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stats XP - Alignées à gauche */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          {/* XP actuelle */}
          <div className="bg-slate-800/60 rounded-xl p-4 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-slate-400 text-sm">XP actuelle</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-white">{xp}</span>
              <span className="text-slate-500">/ {maxXp}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Prochain palier */}
          <div className="bg-slate-800/60 rounded-xl p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Prochain palier : {nextMilestone} XP</span>
            </div>
            <div className="text-white text-sm">
              Encore <span className="text-orange-400 font-bold">{xpToNextMilestone} XP</span> à gagner !
            </div>
          </div>

          {/* Prochaine récompense avec coffre */}
          <div className="bg-slate-800/60 rounded-xl p-4 flex items-center gap-4 min-w-[200px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Prochaine récompense</span>
              </div>
              <div className="text-white text-sm">
                À <span className="text-amber-400 font-bold">{nextMilestone} XP</span>
              </div>
            </div>
            {/* Coffre au trésor */}
            <div className="w-12 h-12">
              <svg viewBox="0 0 50 45" className="w-full h-full">
                <defs>
                  <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D97706"/>
                    <stop offset="100%" stopColor="#92400E"/>
                  </linearGradient>
                </defs>
                <rect x="5" y="18" width="40" height="24" rx="3" fill="url(#chestGrad)" stroke="#78350F" strokeWidth="2"/>
                <path d="M5 18 Q25 6 45 18" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
                <rect x="20" y="22" width="10" height="10" rx="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
                <circle cx="25" cy="27" r="2" fill="#92400E"/>
                <circle cx="40" cy="12" r="4" fill="#FDE68A" opacity="0.9"/>
                <circle cx="36" cy="8" r="2" fill="#FEF3C7" opacity="0.7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaProgression;
