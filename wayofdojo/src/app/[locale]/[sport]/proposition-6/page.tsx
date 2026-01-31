'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, ChevronRight, Play, Volume2, ArrowRight } from 'lucide-react';

/**
 * PROPOSITION 6: HORIZONTAL SECTIONS (Style Netflix/Spotify)
 * Sections horizontales avec scroll, catégorisées
 */
export default function Proposition6Page() {
  const categories = [
    {
      title: 'Continuer l\'apprentissage',
      items: [
        { emoji: '📚', title: 'Techniques', subtitle: '15% complété', color: 'from-cyan-500 to-blue-600', progress: 15 },
        { emoji: '🎮', title: 'Quiz Vertus', subtitle: '2/7 réussis', color: 'from-purple-500 to-pink-600', progress: 28 },
        { emoji: '🥋', title: 'Ukemi', subtitle: 'Chutes', color: 'from-orange-500 to-red-600', progress: 0 },
      ]
    },
    {
      title: 'Dojo Virtuel',
      items: [
        { emoji: '🎯', title: 'Memory Sensei', subtitle: 'Mémoire', color: 'from-emerald-500 to-teal-600' },
        { emoji: '⚡', title: 'Rythme du Dojo', subtitle: 'Réflexes', color: 'from-yellow-500 to-amber-600' },
        { emoji: '🧩', title: 'Quête Vertus', subtitle: 'Puzzle', color: 'from-indigo-500 to-purple-600' },
        { emoji: '🎨', title: 'Kanji Master', subtitle: 'Calligraphie', color: 'from-pink-500 to-rose-600' },
        { emoji: '🏃', title: 'Ninja Run', subtitle: 'Agilité', color: 'from-cyan-500 to-blue-600' },
      ]
    },
    {
      title: 'Ma progression',
      items: [
        { emoji: '🎖️', title: 'Ceintures', subtitle: '6e Kyu actuel', color: 'from-slate-600 to-slate-700' },
        { emoji: '☯️', title: '7 Vertus', subtitle: '2/7 acquises', color: 'from-indigo-500 to-purple-600' },
        { emoji: '🏆', title: 'Trophées', subtitle: '2 badges', color: 'from-amber-500 to-orange-600' },
        { emoji: '📊', title: 'Statistiques', subtitle: 'Cette semaine', color: 'from-blue-500 to-cyan-600' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header fixe */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/fr/aikido/dojo" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          
          <h1 className="text-lg font-bold text-white">PROPOSITION 6: Horizontal Scroll</h1>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 text-sm">
              <Star className="w-4 h-4" /> 150
            </span>
            <span className="flex items-center gap-1 text-orange-400 text-sm">
              <Flame className="w-4 h-4" /> 3
            </span>
            <img src="/images/tanaka/portrait.png" alt="Profil" className="w-9 h-9 rounded-full border-2 border-amber-500/50" />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-72 md:h-80 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-orange-900/60 to-amber-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="flex items-center gap-8">
            <motion.img 
              src="/images/tanaka/portrait.png" 
              alt="Tanaka"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-amber-500/50 shadow-2xl"
            />
            <div>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-amber-400 font-medium"
              >
                Ton guide personnel
              </motion.p>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-black text-white mt-1"
              >
                Maître Tanaka
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 mt-2 max-w-md text-sm md:text-base"
              >
                &quot;La voie du guerrier ne se mesure pas en victoires, mais en sagesse acquise.&quot;
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 mt-4"
              >
                <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-colors">
                  <Play className="w-4 h-4" /> Reprendre
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-colors">
                  <Volume2 className="w-4 h-4" /> Écouter
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Sections horizontales */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {categories.map((category, catIndex) => (
          <motion.section
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + catIndex * 0.1 }}
          >
            {/* Titre section */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{category.title}</h3>
              <button className="text-amber-400 text-sm hover:underline flex items-center gap-1">
                Voir tout <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scroll horizontal */}
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`flex-shrink-0 w-44 md:w-52 bg-gradient-to-br ${item.color} rounded-2xl p-4 cursor-pointer shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <h4 className="text-white font-bold mt-3">{item.title}</h4>
                  <p className="text-white/70 text-sm">{item.subtitle}</p>
                  
                  {item.progress !== undefined && (
                    <div className="mt-3">
                      <div className="bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-white h-full rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-900/50 border-t border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-2xl">🐣</span>
              <p className="text-white font-bold mt-1">6e Kyu</p>
              <p className="text-slate-500 text-xs">Grade actuel</p>
            </div>
            <div>
              <span className="text-2xl">⭐</span>
              <p className="text-amber-400 font-bold mt-1">150 XP</p>
              <p className="text-slate-500 text-xs">Points totaux</p>
            </div>
            <div>
              <span className="text-2xl">🔥</span>
              <p className="text-orange-400 font-bold mt-1">3 jours</p>
              <p className="text-slate-500 text-xs">Série actuelle</p>
            </div>
            <div>
              <span className="text-2xl">🏆</span>
              <p className="text-purple-400 font-bold mt-1">2</p>
              <p className="text-slate-500 text-xs">Trophées</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
