'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, ChevronRight, Home, BookOpen, Gamepad2, Trophy, Settings } from 'lucide-react';
import { useState } from 'react';

/**
 * PROPOSITION 5: SIDEBAR + CONTENU (Style App Desktop/Mobile)
 * Navigation claire avec sidebar et contenu principal
 */
export default function Proposition5Page() {
  const [activeSection, setActiveSection] = useState('accueil');

  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Home, emoji: '🏠' },
    { id: 'techniques', label: 'Techniques', icon: BookOpen, emoji: '📚' },
    { id: 'dojo', label: 'Dojo Virtuel', icon: Gamepad2, emoji: '🎮' },
    { id: 'pratique', label: 'Ma Pratique', icon: BookOpen, emoji: '🥋' },
    { id: 'progression', label: 'Progression', icon: Star, emoji: '🌟' },
    { id: 'vertus', label: '7 Vertus', icon: Star, emoji: '☯️' },
    { id: 'ceintures', label: 'Ceintures', icon: Trophy, emoji: '🎖️' },
    { id: 'trophees', label: 'Trophées', icon: Trophy, emoji: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col"
      >
        {/* Logo / Profil */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <img 
              src="/images/tanaka/portrait.png" 
              alt="Tanaka" 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50"
            />
            <div>
              <p className="text-white font-bold">Way of Dojo</p>
              <p className="text-amber-400 text-sm">6e Kyu • 150 XP</p>
            </div>
          </div>
          
          {/* Stats mini */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4" /> 150
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" /> 3j
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="font-medium">{item.label}</span>
              {activeSection === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </button>
        </div>
      </motion.aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/fr/aikido/dojo" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-4">
              <ArrowLeft className="w-4 h-4" /> Retour au dojo actuel
            </Link>
            <h1 className="text-2xl font-bold text-white">PROPOSITION 5: Sidebar Navigation</h1>
            <p className="text-slate-500">Style Application Desktop/Mobile</p>
          </div>

          {/* Hero Tanaka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-600/20 via-orange-600/30 to-amber-600/20 rounded-3xl p-6 mb-6 border border-amber-500/20"
          >
            <div className="flex items-center gap-6">
              <motion.img 
                src="/images/tanaka/portrait.png" 
                alt="Tanaka"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-500/30"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Bonjour, jeune ninja !</h2>
                <p className="text-amber-200/80 mt-1">
                  &quot;Chaque technique maîtrisée est un pas vers la sagesse. Continue ton entraînement !&quot;
                </p>
                <p className="text-slate-400 text-sm mt-2">— Maître Tanaka</p>
              </div>
            </div>
          </motion.div>

          {/* Grille de contenu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Carte Techniques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">📚</span>
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs text-white">206+</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-4">Techniques</h3>
              <p className="text-cyan-200/70 text-sm mt-1">Découvre les mouvements de l&apos;Aïkido</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 bg-white/10 rounded-full h-2 mr-4">
                  <div className="bg-white h-full rounded-full" style={{ width: '15%' }} />
                </div>
                <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Carte Dojo Virtuel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:shadow-purple-500/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">🎮</span>
                <span className="bg-white/20 px-2 py-1 rounded-lg text-xs text-white">11 jeux</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-4">Dojo Virtuel</h3>
              <p className="text-purple-200/70 text-sm mt-1">Jeux et validations interactives</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-white/60 text-sm">Prêt à jouer ?</span>
                <ChevronRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Carte Ma Pratique */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all group"
            >
              <span className="text-3xl">🥋</span>
              <h3 className="text-lg font-bold text-white mt-3">Ma Pratique</h3>
              <p className="text-orange-200/70 text-sm">Carnet de dojo personnel</p>
            </motion.div>

            {/* Carte Progression */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all group"
            >
              <span className="text-3xl">🌟</span>
              <h3 className="text-lg font-bold text-white mt-3">Ma Progression</h3>
              <p className="text-emerald-200/70 text-sm">Ceintures & Vertus acquises</p>
            </motion.div>
          </div>

          {/* Section Trophées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-slate-900/50 rounded-2xl p-5 border border-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">🏆 Derniers trophées</h3>
              <button className="text-amber-400 text-sm hover:underline">Voir tout</button>
            </div>
            <div className="flex gap-4">
              <div className="bg-amber-500/20 rounded-xl p-4 text-center flex-1">
                <span className="text-3xl">🥋</span>
                <p className="text-white text-sm mt-2 font-medium">Premier pas</p>
                <p className="text-slate-400 text-xs">Inscrit au dojo</p>
              </div>
              <div className="bg-cyan-500/20 rounded-xl p-4 text-center flex-1">
                <span className="text-3xl">📖</span>
                <p className="text-white text-sm mt-2 font-medium">Curieux</p>
                <p className="text-slate-400 text-xs">5 techniques vues</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 text-center flex-1 opacity-50">
                <span className="text-3xl">🔒</span>
                <p className="text-slate-400 text-sm mt-2 font-medium">???</p>
                <p className="text-slate-500 text-xs">À débloquer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
