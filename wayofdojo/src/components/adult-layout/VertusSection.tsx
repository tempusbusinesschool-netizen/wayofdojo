'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VertusSection - Les 7 vertus du Budo - VERSION ADULTE
 * Style: Kanji japonais élégants sur fonds colorés premium
 * ═══════════════════════════════════════════════════════════════════════════════
 */

interface VertusSectionProps {
  locale: string;
  sport: string;
}

// Les 7 Vertus avec leurs Kanji japonais authentiques
const VERTUS = [
  { 
    id: 'gi', 
    name: 'Gi',
    meaning: 'Justice',
    kanji: '義',
    bgColor: 'bg-gradient-to-br from-red-600 to-red-800',
  },
  { 
    id: 'yu', 
    name: 'Yū',
    meaning: 'Courage',
    kanji: '勇',
    bgColor: 'bg-gradient-to-br from-orange-500 to-orange-700',
  },
  { 
    id: 'jin', 
    name: 'Jin',
    meaning: 'Bienveillance',
    kanji: '仁',
    bgColor: 'bg-gradient-to-br from-amber-500 to-amber-700',
  },
  { 
    id: 'rei', 
    name: 'Rei',
    meaning: 'Respect',
    kanji: '礼',
    bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
  },
  { 
    id: 'makoto', 
    name: 'Makoto',
    meaning: 'Sincérité',
    kanji: '誠',
    bgColor: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
  },
  { 
    id: 'meiyo', 
    name: 'Meiyo',
    meaning: 'Honneur',
    kanji: '名誉',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
  },
  { 
    id: 'chugi', 
    name: 'Chūgi',
    meaning: 'Loyauté',
    kanji: '忠義',
    bgColor: 'bg-gradient-to-br from-purple-600 to-purple-800',
  },
];

export const VertusSection: React.FC<VertusSectionProps> = ({
  locale,
  sport,
}) => {
  return (
    <section data-testid="vertus-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Les 7 Vertus du Bushido</h3>
          <p className="text-slate-400 text-xs">Le code d'honneur des guerriers</p>
        </div>
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
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/${locale}/${sport}/vertus`}>
              <div 
                className={`
                  aspect-square rounded-xl ${vertu.bgColor} 
                  p-2 flex flex-col items-center justify-center text-center 
                  transition-all duration-200 
                  shadow-lg hover:shadow-xl border border-white/10
                  relative overflow-hidden
                `}
                data-testid={`vertu-${vertu.id}`}
              >
                {/* Cercle de fond subtil */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-20 h-20 rounded-full bg-white"></div>
                </div>
                
                {/* Kanji japonais */}
                <span className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg relative z-10" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                  {vertu.kanji}
                </span>
                
                {/* Nom japonais */}
                <span className="text-[8px] lg:text-[10px] text-white/90 font-medium mt-1 relative z-10">
                  {vertu.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Légende discrète */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[9px] text-slate-500">
        {VERTUS.map((v) => (
          <span key={v.id}>{v.name}: {v.meaning}</span>
        ))}
      </div>
    </section>
  );
};

export default VertusSection;
