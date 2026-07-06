'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VertusSection - Les 7 vertus du Budo selon le visuel de référence
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface VertusSectionProps {
  locale: string;
  sport: string;
}

const VERTUS = [
  { id: 'rei', kanji: '礼', name: 'Respect', color: 'from-red-500 to-red-700' },
  { id: 'yu', kanji: '勇', name: 'Courage', color: 'from-orange-500 to-orange-700' },
  { id: 'makoto', kanji: '誠', name: 'Honnêteté', color: 'from-amber-400 to-yellow-600' },
  { id: 'ken', kanji: '謙', name: 'Humilité', color: 'from-slate-200 to-slate-400' },
  { id: 'jisei', kanji: '自制', name: 'Contrôle', color: 'from-cyan-400 to-cyan-600' },
  { id: 'yu2', kanji: '友', name: 'Amitié', color: 'from-blue-500 to-blue-700' },
  { id: 'nin', kanji: '忍', name: 'Persévérance', color: 'from-purple-500 to-purple-700' },
];

export const VertusSection: React.FC<VertusSectionProps> = ({
  locale,
  sport,
}) => {
  return (
    <section data-testid="vertus-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Les 7 vertus du Budo</h3>
        <Link 
          href={`/${locale}/${sport}/vertus`}
          className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
        >
          Découvrir
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {VERTUS.map((vertu, index) => (
          <motion.div
            key={vertu.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/${locale}/${sport}/vertus`}>
              <div 
                className={`aspect-square rounded-xl bg-gradient-to-br ${vertu.color} p-2 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform shadow-lg`}
                data-testid={`vertu-${vertu.id}`}
              >
                <span className="text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
                  {vertu.kanji}
                </span>
                <span className="text-[9px] lg:text-[10px] text-white/90 mt-1 font-medium">
                  {vertu.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default VertusSection;
