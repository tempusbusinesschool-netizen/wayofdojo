'use client';

import { motion } from 'framer-motion';
import { MusashiQuote } from '@/data/musashi/quotes';

interface MusashiQuoteCardProps {
  quote: MusashiQuote;
  variant?: 'default' | 'compact' | 'featured';
  showChapter?: boolean;
}

export function MusashiQuoteCard({ quote, variant = 'default', showChapter = false }: MusashiQuoteCardProps) {
  const chapterColors = {
    terre: 'from-amber-600 to-amber-800',
    eau: 'from-blue-600 to-blue-800',
    feu: 'from-red-600 to-red-800',
    vent: 'from-cyan-600 to-cyan-800',
    vide: 'from-purple-600 to-purple-800',
  };

  const chapterNames = {
    terre: '地 Terre',
    eau: '水 Eau',
    feu: '火 Feu',
    vent: '風 Vent',
    vide: '空 Vide',
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-xl bg-slate-800/50 border border-slate-700"
      >
        <p className="text-slate-300 text-sm italic">&ldquo;{quote.french}&rdquo;</p>
        <p className="text-slate-500 text-xs mt-1">— Musashi</p>
      </motion.div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-6"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 text-[120px] font-bold text-slate-800/30 leading-none select-none">
          武
        </div>
        
        {showChapter && (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${chapterColors[quote.chapter]} mb-4`}>
            {chapterNames[quote.chapter]}
          </div>
        )}
        
        <div className="relative z-10">
          <p className="text-2xl font-bold text-amber-400 mb-2 font-serif">
            {quote.japanese}
          </p>
          <p className="text-sm text-slate-400 mb-4 italic">
            {quote.romaji}
          </p>
          <p className="text-xl text-white font-medium leading-relaxed">
            &ldquo;{quote.french}&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <span className="text-lg">⚔️</span>
            </div>
            <div>
              <p className="text-white font-semibold">Miyamoto Musashi</p>
              <p className="text-slate-400 text-xs">五輪書 - Le Traité des Cinq Roues</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-sm"
    >
      {showChapter && (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${chapterColors[quote.chapter]} mb-3`}>
          {chapterNames[quote.chapter]}
        </div>
      )}
      
      <p className="text-lg font-bold text-amber-400 mb-1">
        {quote.japanese}
      </p>
      <p className="text-xs text-slate-500 mb-3 italic">
        {quote.romaji}
      </p>
      <p className="text-white text-base leading-relaxed">
        &ldquo;{quote.french}&rdquo;
      </p>
      <p className="text-slate-500 text-sm mt-3 text-right">
        — Musashi, {chapterNames[quote.chapter]}
      </p>
    </motion.div>
  );
}

export default MusashiQuoteCard;
