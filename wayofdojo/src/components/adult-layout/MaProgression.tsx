'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy, Gift } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Timeline des ceintures avec visuels EXACTS de l'image fournie
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

// Couleurs des ceintures selon l'image de référence
const BELTS = [
  { grade: '6e Kyu', color: '#FFFFFF', darkColor: '#E5E7EB', name: 'Blanche' },
  { grade: '5e Kyu', color: '#EAB308', darkColor: '#CA8A04', name: 'Jaune' },
  { grade: '4e Kyu', color: '#F97316', darkColor: '#EA580C', name: 'Orange' },
  { grade: '3e Kyu', color: '#22C55E', darkColor: '#16A34A', name: 'Verte' },
  { grade: '2e Kyu', color: '#3B82F6', darkColor: '#2563EB', name: 'Bleue' },
  { grade: '1er Kyu', color: '#A16207', darkColor: '#854D0E', name: 'Marron' },
  { grade: '1er Dan', color: '#374151', darkColor: '#1F2937', name: 'Noire' },
];

// Icône de ceinture EXACTE selon l'image fournie par l'utilisateur
// Ceinture style kimono avec noeud et pans qui descendent
const BeltIcon = ({ color, darkColor, isActive }: { color: string; darkColor: string; isActive: boolean }) => (
  <svg viewBox="0 0 70 90" className="w-full h-full">
    {/* Fond ovale sombre */}
    <ellipse 
      cx="35" 
      cy="45" 
      rx="32" 
      ry="42" 
      fill="#0c1929"
      stroke={isActive ? '#F97316' : '#1e3a5f'}
      strokeWidth={isActive ? 3 : 1.5}
    />
    
    {/* Effet de brillance sur le fond pour grade actif */}
    {isActive && (
      <ellipse 
        cx="35" 
        cy="45" 
        rx="30" 
        ry="40" 
        fill="none"
        stroke="#F97316"
        strokeWidth="1"
        opacity="0.3"
      />
    )}
    
    {/* ═══ CEINTURE ═══ */}
    
    {/* Partie haute - Col du kimono / haut de la ceinture */}
    <path 
      d="M 22 25 
         C 22 18, 35 14, 35 14
         C 35 14, 48 18, 48 25
         L 46 34
         C 40 31, 30 31, 24 34
         Z"
      fill={color}
      stroke={darkColor}
      strokeWidth="1"
    />
    
    {/* Noeud central */}
    <rect 
      x="29" 
      y="32" 
      width="12" 
      height="10" 
      rx="2" 
      fill={color}
      stroke={darkColor}
      strokeWidth="1"
    />
    
    {/* Détail du noeud - ligne centrale */}
    <line x1="35" y1="33" x2="35" y2="41" stroke={darkColor} strokeWidth="1" opacity="0.5" />
    
    {/* Pan gauche de la ceinture */}
    <path 
      d="M 24 42
         L 18 68
         C 17 72, 20 75, 24 75
         L 32 75
         C 35 75, 35 72, 34 68
         L 29 42
         Z"
      fill={color}
      stroke={darkColor}
      strokeWidth="1"
    />
    
    {/* Pan droit de la ceinture */}
    <path 
      d="M 41 42
         L 36 68
         C 35 72, 35 75, 38 75
         L 46 75
         C 50 75, 53 72, 52 68
         L 46 42
         Z"
      fill={color}
      stroke={darkColor}
      strokeWidth="1"
    />
    
    {/* Reflets / brillance sur la ceinture */}
    <ellipse cx="35" cy="37" rx="4" ry="2" fill="rgba(255,255,255,0.25)" />
    <path d="M 21 50 L 23 65" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
    <path d="M 47 50 L 49 65" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Losange connecteur
const Diamond = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 mx-1">
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
        {/* Background pagode subtile */}
        <div className="absolute right-4 top-4 w-28 h-28 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 120" fill="none" className="w-full h-full">
            <path d="M50 5 L85 25 L80 30 L90 35 L50 55 L10 35 L20 30 L15 25 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <path d="M50 30 L75 45 L70 50 L80 55 L50 70 L20 55 L30 50 L25 45 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <path d="M50 55 L65 65 L60 70 L70 75 L50 85 L30 75 L40 70 L35 65 Z" stroke="#8B5CF6" strokeWidth="1"/>
            <rect x="45" y="85" width="10" height="15" stroke="#8B5CF6" strokeWidth="1"/>
          </svg>
        </div>

        {/* Timeline des ceintures */}
        <div className="relative mb-6 pt-10">
          <div className="flex items-end justify-start">
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
                        <div className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md whitespace-nowrap shadow-lg">
                          Tu es ici !
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rotate-45"></div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Ceinture avec effet lumineux pour grade actif */}
                    <div className={`
                      relative w-14 h-[72px]
                      ${isActive ? 'z-10' : isFuture ? 'opacity-40' : ''}
                      transition-all duration-300
                    `}>
                      {/* Halo lumineux orange pour grade actif */}
                      {isActive && (
                        <>
                          <div className="absolute -inset-3 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute -inset-1 bg-orange-400/20 rounded-full blur-md"></div>
                        </>
                      )}
                      
                      <BeltIcon 
                        color={belt.color} 
                        darkColor={belt.darkColor}
                        isActive={isActive}
                      />
                    </div>
                    
                    {/* Label du grade */}
                    <span className={`
                      text-[10px] mt-1 font-medium whitespace-nowrap
                      ${isActive 
                        ? 'text-orange-400 font-bold bg-orange-500/20 px-2 py-0.5 rounded' 
                        : isFuture 
                          ? 'text-slate-600' 
                          : 'text-slate-400'}
                    `}>
                      {belt.grade}
                    </span>
                  </motion.div>
                  
                  {/* Ligne + Losange */}
                  {index < BELTS.length - 1 && (
                    <div className="flex items-center pb-5">
                      <div className="w-3 h-px bg-slate-600"></div>
                      <Diamond filled={index < currentIndex} />
                      <div className="w-3 h-px bg-slate-600"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stats XP */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          {/* XP actuelle */}
          <div className="bg-slate-800/60 rounded-xl p-4 min-w-[160px]">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-slate-400 text-sm">XP actuelle</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xl font-bold text-white">{xp}</span>
              <span className="text-slate-500 text-sm">/ {maxXp}</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Prochain palier */}
          <div className="bg-slate-800/60 rounded-xl p-4 min-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-sm">Prochain palier : {nextMilestone} XP</span>
            </div>
            <div className="text-white text-sm">
              Encore <span className="text-orange-400 font-bold">{xpToNextMilestone} XP</span> à gagner !
            </div>
          </div>

          {/* Prochaine récompense */}
          <div className="bg-slate-800/60 rounded-xl p-4 flex items-center gap-3 min-w-[180px]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-slate-400 text-sm">Prochaine récompense</span>
              </div>
              <div className="text-white text-sm">
                À <span className="text-amber-400 font-bold">{nextMilestone} XP</span>
              </div>
            </div>
            {/* Coffre */}
            <div className="w-10 h-10">
              <svg viewBox="0 0 50 45" className="w-full h-full">
                <defs>
                  <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D97706"/>
                    <stop offset="100%" stopColor="#92400E"/>
                  </linearGradient>
                </defs>
                <rect x="5" y="18" width="40" height="24" rx="3" fill="url(#chestGrad)" stroke="#78350F" strokeWidth="2"/>
                <path d="M5 18 Q25 6 45 18" fill="#F59E0B" stroke="#D97706" strokeWidth="1"/>
                <rect x="20" y="22" width="10" height="10" rx="2" fill="#FBBF24" stroke="#F59E0B"/>
                <circle cx="25" cy="27" r="2" fill="#92400E"/>
                <circle cx="40" cy="12" r="3" fill="#FDE68A" opacity="0.9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaProgression;
