'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, ChevronRight, Play, Volume2 } from 'lucide-react';

/**
 * PROPOSITION 4: BENTO GRID (Style iOS/Widgets)
 * Grille asymétrique moderne avec des cartes de tailles variées
 */
export default function Proposition4Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      {/* Header compact */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link href="/fr/aikido/dojo" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">PROPOSITION 4: Bento Grid</h1>
          <span className="text-slate-500 text-sm">Style iOS Widgets</span>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[100px]">
        
        {/* HERO - Tanaka (grande carte) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-4 md:col-span-3 row-span-2 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-5 relative overflow-hidden cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-amber-200/80 text-sm font-medium">Ton guide personnel</p>
              <h2 className="text-2xl font-black text-white mt-1">Maître Tanaka</h2>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/80 text-sm italic">&quot;Chaque jour est une nouvelle opportunité d&apos;apprendre.&quot;</p>
                <button className="mt-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-colors">
                  <Volume2 className="w-4 h-4" /> Écouter
                </button>
              </div>
              <img 
                src="/images/tanaka/portrait.png" 
                alt="Tanaka" 
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-2 md:col-span-1 row-span-1 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <Star className="w-6 h-6 text-white mb-1" />
          <span className="text-2xl font-black text-white">150</span>
          <span className="text-white/70 text-xs">XP Total</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="col-span-2 md:col-span-1 row-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform"
        >
          <Flame className="w-6 h-6 text-white mb-1" />
          <span className="text-2xl font-black text-white">3</span>
          <span className="text-white/70 text-xs">Jours série</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-4 md:col-span-1 row-span-1 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="text-3xl">🐣</span>
          <div>
            <span className="text-white font-bold block">6e Kyu</span>
            <span className="text-slate-400 text-xs">Rokkyu</span>
          </div>
        </motion.div>

        {/* Techniques - Grande carte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="col-span-4 md:col-span-2 row-span-2 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-5 cursor-pointer group hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-4xl">📚</span>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-xl font-bold text-white">Techniques</h3>
          <p className="text-cyan-200/70 text-sm mt-1">206+ mouvements à découvrir</p>
          <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full" style={{ width: '15%' }} />
          </div>
          <p className="text-white/60 text-xs mt-2">15% complété</p>
        </motion.div>

        {/* Dojo Virtuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 row-span-2 bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl p-5 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/20 transition-all"
        >
          <span className="text-4xl">🎮</span>
          <h3 className="text-lg font-bold text-white mt-3">Dojo Virtuel</h3>
          <p className="text-purple-200/70 text-sm mt-1">11 mini-jeux</p>
          <button className="mt-4 bg-white/20 hover:bg-white/30 w-full py-2 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <Play className="w-4 h-4" /> Jouer
          </button>
        </motion.div>

        {/* Ma Pratique */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="col-span-2 row-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥋</span>
            <div>
              <h3 className="text-white font-bold">Ma Pratique</h3>
              <p className="text-orange-200/70 text-xs">Carnet de dojo</p>
            </div>
          </div>
        </motion.div>

        {/* Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 row-span-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div>
              <h3 className="text-white font-bold">Progression</h3>
              <p className="text-emerald-200/70 text-xs">Ceintures & Vertus</p>
            </div>
          </div>
        </motion.div>

        {/* 7 Vertus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="col-span-2 row-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">☯️</span>
            <div>
              <h3 className="text-white font-bold">7 Vertus</h3>
              <p className="text-indigo-200/70 text-xs">Qualités du Ninja</p>
            </div>
          </div>
        </motion.div>

        {/* Ceintures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-2 row-span-1 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <div>
              <h3 className="text-white font-bold">Ceintures</h3>
              <p className="text-slate-300/70 text-xs">Monte de grade</p>
            </div>
          </div>
        </motion.div>

        {/* Trophées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="col-span-2 row-span-1 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h3 className="text-white font-bold">Trophées</h3>
              <p className="text-amber-200/70 text-xs">2 badges gagnés</p>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">NEW</div>
        </motion.div>

      </div>
    </div>
  );
}
