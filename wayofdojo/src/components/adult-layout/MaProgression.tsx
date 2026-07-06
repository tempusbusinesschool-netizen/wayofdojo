'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Trophy, Gift } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Timeline des ceintures EXACT selon le visuel de référence
 * - Icônes de ceintures style kimono/gi avec noeud
 * - Grade actuel avec effet lumineux orange et bulle "Tu es ici !"
 * - Losanges entre les ceintures
 * - 3 stats en bas : XP actuelle, Prochain palier, Prochaine récompense
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

// Couleurs des ceintures exactes selon le visuel
const BELTS = [
  { grade: '6e Kyu', color: '#FFFFFF', name: 'Blanche' },  // Blanc
  { grade: '5e Kyu', color: '#FBBF24', name: 'Jaune' },    // Jaune
  { grade: '4e Kyu', color: '#F97316', name: 'Orange' },   // Orange
  { grade: '3e Kyu', color: '#22C55E', name: 'Verte' },    // Vert
  { grade: '2e Kyu', color: '#3B82F6', name: 'Bleue' },    // Bleu
  { grade: '1er Kyu', color: '#92400E', name: 'Marron' },  // Marron
  { grade: '1er Dan', color: '#1F2937', name: 'Noire' },   // Noir
];

// Icône de ceinture style kimono/gi réaliste
const BeltIcon = ({ color, isActive }: { color: string; isActive: boolean }) => (
  <svg viewBox="0 0 60 80" className="w-full h-full">
    {/* Ombre de la ceinture */}
    <ellipse cx="30" cy="65" rx="22" ry="8" fill="rgba(0,0,0,0.3)" />
    
    {/* Corps de la ceinture (forme ovale verticale) */}
    <ellipse cx="30" cy="40" rx="18" ry="30" fill="#1a2744" stroke={isActive ? '#F97316' : '#334155'} strokeWidth="2" />
    
    {/* Partie supérieure de la ceinture nouée */}
    <path 
      d={`M 20 25 
          Q 20 15, 30 15 
          Q 40 15, 40 25
          L 38 35
          Q 30 32, 22 35
          Z`}
      fill={color}
      stroke={color === '#FFFFFF' ? '#E5E7EB' : 'rgba(0,0,0,0.2)'}
      strokeWidth="1"
    />
    
    {/* Noeud central */}
    <rect x="26" y="30" width="8" height="6" rx="1" fill={color} stroke={color === '#FFFFFF' ? '#E5E7EB' : 'rgba(0,0,0,0.2)'} strokeWidth="1" />
    
    {/* Pan gauche de la ceinture */}
    <path 
      d={`M 22 36 
          L 18 55
          Q 17 58, 20 58
          L 26 58
          Q 28 58, 27 55
          L 26 36
          Z`}
      fill={color}
      stroke={color === '#FFFFFF' ? '#E5E7EB' : 'rgba(0,0,0,0.2)'}
      strokeWidth="1"
    />
    
    {/* Pan droit de la ceinture */}
    <path 
      d={`M 34 36 
          L 33 55
          Q 32 58, 34 58
          L 40 58
          Q 43 58, 42 55
          L 38 36
          Z`}
      fill={color}
      stroke={color === '#FFFFFF' ? '#E5E7EB' : 'rgba(0,0,0,0.2)'}
      strokeWidth="1"
    />
  </svg>
);

// Losange entre les ceintures
const Diamond = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 16 16" className="w-3 h-3">
    <path 
      d="M8 0 L16 8 L8 16 L0 8 Z" 
      fill={filled ? '#F97316' : '#4B5563'}
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

      <div className="bg-gradient-to-br from-[#0a1628] via-[#0d1e3a] to-[#1a1040] rounded-2xl p-6 relative overflow-hidden">
        {/* Background pagode japonaise subtile */}
        <div className="absolute right-0 top-0 w-48 h-48 opacity-20">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M50 10 L80 30 L75 35 L85 40 L80 45 L90 50 L50 90 L10 50 L20 45 L15 40 L25 35 L20 30 Z" 
                  stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.5"/>
          </svg>
        </div>

        {/* Timeline des ceintures */}
        <div className="relative mb-8">
          <div className="flex items-end justify-between">
            {BELTS.map((belt, index) => {
              const isActive = belt.grade === currentGrade;
              const _isPast = index < currentIndex;
              const isFuture = index > currentIndex;
              
              return (
                <React.Fragment key={belt.grade}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Bulle "Tu es ici !" pour le grade actuel */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 z-10"
                      >
                        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                          Tu es ici !
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rotate-45"></div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Conteneur de la ceinture avec effet lumineux */}
                    <div className={`
                      relative w-14 h-20 
                      ${isActive ? 'scale-125 z-10' : isFuture ? 'opacity-50' : ''}
                      transition-all duration-300
                    `}>
                      {/* Effet lumineux orange pour le grade actuel */}
                      {isActive && (
                        <div className="absolute inset-0 -m-3">
                          <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                          <div className="absolute inset-2 bg-orange-500/20 rounded-full blur-md"></div>
                        </div>
                      )}
                      
                      <BeltIcon color={belt.color} isActive={isActive} />
                    </div>
                    
                    {/* Label du grade */}
                    <span className={`
                      text-xs mt-3 font-medium whitespace-nowrap
                      ${isActive ? 'text-orange-400 font-bold bg-orange-500/20 px-2 py-1 rounded-md' : 
                        isFuture ? 'text-slate-500' : 'text-slate-400'}
                    `}>
                      {belt.grade}
                    </span>
                  </motion.div>
                  
                  {/* Losange entre les ceintures */}
                  {index < BELTS.length - 1 && (
                    <div className="flex items-center pb-8 px-1">
                      <div className="w-8 h-0.5 bg-slate-700"></div>
                      <Diamond filled={index < currentIndex} />
                      <div className="w-8 h-0.5 bg-slate-700"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Stats XP - 3 colonnes selon le visuel */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          {/* XP actuelle avec barre de progression */}
          <div className="bg-slate-800/50 rounded-xl p-4">
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
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Prochain palier : {nextMilestone} XP</span>
            </div>
            <div className="text-white">
              Encore <span className="text-orange-400 font-bold">{xpToNextMilestone} XP</span> à gagner !
            </div>
          </div>

          {/* Prochaine récompense avec coffre */}
          <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <span className="text-slate-400 text-sm">Prochaine récompense</span>
              </div>
              <div className="text-white">
                À <span className="text-amber-400 font-bold">{nextMilestone} XP</span>
              </div>
            </div>
            {/* Coffre au trésor */}
            <div className="w-14 h-14 relative">
              <svg viewBox="0 0 50 40" className="w-full h-full">
                {/* Corps du coffre */}
                <rect x="5" y="15" width="40" height="22" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="2"/>
                {/* Couvercle du coffre */}
                <path d="M5 15 Q25 5 45 15" fill="#B45309" stroke="#92400E" strokeWidth="2"/>
                {/* Serrure dorée */}
                <rect x="20" y="20" width="10" height="8" rx="1" fill="#FBBF24"/>
                <circle cx="25" cy="24" r="2" fill="#92400E"/>
                {/* Éclat */}
                <circle cx="38" cy="10" r="3" fill="#FBBF24" opacity="0.8"/>
                <circle cx="42" cy="8" r="2" fill="#FDE68A" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaProgression;
