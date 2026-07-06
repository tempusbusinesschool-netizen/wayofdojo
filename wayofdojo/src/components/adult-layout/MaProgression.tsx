'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MaProgression - Timeline des ceintures selon le visuel de référence
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

const BELTS = [
  { grade: '6e Kyu', name: 'Blanche', color: 'bg-white', borderColor: 'border-white', textColor: 'text-white' },
  { grade: '5e Kyu', name: 'Jaune', color: 'bg-yellow-400', borderColor: 'border-yellow-400', textColor: 'text-yellow-400' },
  { grade: '4e Kyu', name: 'Orange', color: 'bg-orange-500', borderColor: 'border-orange-500', textColor: 'text-orange-500' },
  { grade: '3e Kyu', name: 'Verte', color: 'bg-green-500', borderColor: 'border-green-500', textColor: 'text-green-500' },
  { grade: '2e Kyu', name: 'Bleue', color: 'bg-blue-500', borderColor: 'border-blue-500', textColor: 'text-blue-500' },
  { grade: '1er Kyu', name: 'Marron', color: 'bg-amber-700', borderColor: 'border-amber-700', textColor: 'text-amber-700' },
  { grade: '1er Dan', name: 'Noire', color: 'bg-slate-900', borderColor: 'border-slate-900', textColor: 'text-slate-400' },
];

export const MaProgression: React.FC<MaProgressionProps> = ({
  xp,
  maxXp = 400,
  xpGainedThisWeek = 85,
  currentGrade,
  locale,
  sport,
}) => {
  const nextReward = maxXp > xp ? maxXp - xp + xp : maxXp + 100;
  const currentIndex = BELTS.findIndex(b => b.grade === currentGrade);

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

      <div className="bg-[#0d1628] rounded-2xl p-5">
        {/* Timeline des ceintures */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
          {BELTS.map((belt, index) => {
            const isActive = belt.grade === currentGrade;
            const isPast = index < currentIndex;
            const isFuture = index > currentIndex;
            
            return (
              <div key={belt.grade} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col items-center ${isFuture ? 'opacity-40' : ''}`}
                >
                  {/* Cercle de la ceinture */}
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-[#0d1628]' 
                        : ''
                    } ${isPast || isActive ? belt.color : 'bg-slate-700'}`}
                  >
                    {(isPast || isActive) && (
                      <span className="text-lg">🥋</span>
                    )}
                    {isFuture && (
                      <span className="text-slate-500 text-xs font-bold">?</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-[10px] mt-2 font-medium whitespace-nowrap ${
                    isActive ? 'text-orange-400' : isPast ? belt.textColor : 'text-slate-500'
                  }`}>
                    {belt.grade}
                  </span>
                </motion.div>
                
                {/* Ligne de connexion */}
                {index < BELTS.length - 1 && (
                  <div className={`w-6 lg:w-10 h-0.5 mx-1 ${
                    index < currentIndex ? 'bg-green-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Stats XP */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="text-slate-500 text-xs mb-1">XP actuelle</div>
            <div className="text-white font-bold">{xp}/{maxXp}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 text-xs mb-1">Cette semaine</div>
            <div className="text-green-400 font-bold">+{xpGainedThisWeek} XP</div>
          </div>
          <div className="text-center">
            <div className="text-slate-500 text-xs mb-1">Prochaine récompense</div>
            <div className="text-amber-400 font-bold">{nextReward} XP</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MaProgression;
