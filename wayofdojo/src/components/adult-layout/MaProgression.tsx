'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Gift } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Timeline des ceintures EXACT selon le visuel de référence
 * - Timeline horizontale avec cercles colorés et icônes ceintures
 * - Barre de progression XP
 * - Stats avec icônes (graphique tendance, cadeau)
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

// Ceintures avec leurs couleurs exactes selon le visuel
const BELTS = [
  { grade: '6e Kyu', name: 'Blanche', color: '#FFA500', bgColor: 'bg-orange-500', textColor: 'text-orange-400' },
  { grade: '5e Kyu', name: 'Jaune', color: '#8B4513', bgColor: 'bg-amber-700', textColor: 'text-amber-600' },
  { grade: '4e Kyu', name: 'Orange', color: '#22C55E', bgColor: 'bg-green-500', textColor: 'text-green-500' },
  { grade: '3e Kyu', name: 'Verte', color: '#3B82F6', bgColor: 'bg-blue-500', textColor: 'text-blue-500' },
  { grade: '2e Kyu', name: 'Bleue', color: '#8B5CF6', bgColor: 'bg-purple-500', textColor: 'text-purple-500' },
  { grade: '1er Kyu', name: 'Marron', color: '#EF4444', bgColor: 'bg-red-500', textColor: 'text-red-500' },
  { grade: '1er Dan', name: 'Noire', color: '#1F2937', bgColor: 'bg-gray-800', textColor: 'text-gray-400' },
];

// Icône de ceinture stylisée
const BeltIcon = ({ color, isActive, isFuture }: { color: string; isActive: boolean; isFuture: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`w-6 h-6 ${isFuture ? 'opacity-30' : ''}`}
    fill={isFuture ? '#4B5563' : color}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    {isActive && (
      <circle cx="12" cy="12" r="3" fill={color} />
    )}
  </svg>
);

export const MaProgression: React.FC<MaProgressionProps> = ({
  xp,
  maxXp = 400,
  xpGainedThisWeek = 85,
  currentGrade,
  locale,
  sport,
}) => {
  const nextReward = 250;
  const currentIndex = BELTS.findIndex(b => b.grade === currentGrade);
  const progressPercent = (xp / maxXp) * 100;

  return (
    <section data-testid="ma-progression" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Ma progression</h3>
        <Link 
          href={`/${locale}/${sport}/ceintures`}
          className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
        >
          Voir le programme
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-[#0d1628] rounded-2xl p-6">
        {/* Timeline des ceintures */}
        <div className="relative mb-6">
          {/* Ligne de fond */}
          <div className="absolute top-6 left-6 right-6 h-1 bg-slate-700/50 rounded-full" />
          
          {/* Ligne de progression */}
          <div 
            className="absolute top-6 left-6 h-1 bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((currentIndex / (BELTS.length - 1)) * 100, 100)}%` }}
          />
          
          {/* Cercles des ceintures */}
          <div className="relative flex items-center justify-between">
            {BELTS.map((belt, index) => {
              const isActive = belt.grade === currentGrade;
              const isPast = index < currentIndex;
              const isFuture = index > currentIndex;
              
              return (
                <motion.div
                  key={belt.grade}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex flex-col items-center"
                >
                  {/* Cercle avec icône ceinture */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 border-2
                      ${isActive 
                        ? `${belt.bgColor} border-white shadow-lg shadow-orange-500/30` 
                        : isPast 
                          ? `${belt.bgColor} border-transparent opacity-80`
                          : 'bg-slate-800 border-slate-700'
                      }
                    `}
                  >
                    <BeltIcon color={isActive || isPast ? '#FFFFFF' : belt.color} isActive={isActive} isFuture={isFuture} />
                  </div>
                  
                  {/* Label du grade */}
                  <span className={`text-xs mt-2 font-medium whitespace-nowrap ${
                    isActive ? belt.textColor : isFuture ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {belt.grade}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Barre de progression XP */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Progression vers le prochain grade</span>
            <span className="text-white font-medium">{xp} / {maxXp} XP</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 rounded-full"
            />
          </div>
        </div>

        {/* Stats XP */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {/* XP cette semaine */}
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-slate-400 text-xs">Cette semaine</div>
              <div className="text-green-400 text-lg font-bold">+{xpGainedThisWeek} XP</div>
            </div>
          </div>

          {/* Prochaine récompense */}
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-slate-400 text-xs">Prochain palier</div>
              <div className="text-amber-400 text-lg font-bold">{nextReward} XP</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaProgression;
