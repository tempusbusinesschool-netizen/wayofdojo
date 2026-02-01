'use client';

import { motion } from 'framer-motion';
import { 
  Home, BookOpen, Gamepad2, Trophy, Target, User, Settings,
  ChevronRight, Star, Flame, Volume2
} from 'lucide-react';
import { useState } from 'react';

/**
 * PROPOSITION 1 : SIDEBAR NINJA
 * ══════════════════════════════════════════════════════════════════
 * Bandeau latéral gauche avec icônes et navigation verticale
 * Style : Sombre avec accents dorés, inspiré des dojos traditionnels
 * ══════════════════════════════════════════════════════════════════
 */

const TANAKA_IMAGE = "/images/tanaka/portrait.png";

const menuItems = [
  { icon: Home, label: 'Dojo', active: true, color: 'from-amber-500 to-orange-600' },
  { icon: BookOpen, label: 'Techniques', active: false, color: 'from-cyan-500 to-blue-600' },
  { icon: Gamepad2, label: 'Mini-jeux', active: false, color: 'from-purple-500 to-pink-600' },
  { icon: Trophy, label: 'Trophées', active: false, color: 'from-emerald-500 to-green-600' },
  { icon: Target, label: 'Défis', active: false, color: 'from-rose-500 to-red-600' },
  { icon: User, label: 'Profil', active: false, color: 'from-slate-500 to-slate-600' },
];

const virtues = [
  { kanji: '礼', name: 'Respect', color: 'bg-red-500' },
  { kanji: '勇', name: 'Courage', color: 'bg-orange-500' },
  { kanji: '克', name: 'Maîtrise', color: 'bg-yellow-500' },
  { kanji: '謙', name: 'Humilité', color: 'bg-green-500' },
  { kanji: '仁', name: 'Bienveillance', color: 'bg-blue-500' },
  { kanji: '注', name: 'Attention', color: 'bg-indigo-500' },
  { kanji: '責', name: 'Responsabilité', color: 'bg-purple-500' },
];

export default function PropositionSidebar1() {
  const [_hoveredMenu, setHoveredMenu] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR GAUCHE - Navigation verticale avec icônes */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 md:w-72 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-amber-500/20 flex flex-col"
      >
        {/* Logo */}
        <div className="p-4 md:p-6 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-xl md:text-2xl">🥋</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black text-white">WayofDojo</h1>
              <p className="text-xs text-amber-400">Jeune Samouraï</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <motion.button
              key={idx}
              onHoverStart={() => setHoveredMenu(idx)}
              onHoverEnd={() => setHoveredMenu(null)}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                item.active 
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5 md:w-6 md:h-6 mx-auto md:mx-0" />
              <span className="hidden md:block font-medium">{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4 ml-auto hidden md:block" />}
            </motion.button>
          ))}
        </nav>

        {/* User Profile Mini */}
        <div className="p-4 border-t border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
              K
            </div>
            <div className="hidden md:block flex-1">
              <p className="text-white font-medium text-sm">Kenji</p>
              <p className="text-amber-400 text-xs">6e Kyu • 150 XP</p>
            </div>
            <Settings className="w-5 h-5 text-slate-500 hidden md:block" />
          </div>
        </div>
      </motion.aside>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENU PRINCIPAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        
        {/* Header avec Tanaka */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-amber-200 text-sm">Bonjour, Kenji ! 👋</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Ton Dojo t&apos;attend</h2>
              <p className="text-white/80 mt-2 max-w-md">Continue ton parcours vers la maîtrise de l&apos;Aïkido avec Maître Tanaka.</p>
              <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 transition-colors">
                <Volume2 className="w-4 h-4" /> Écouter Tanaka
              </button>
            </div>
            <img 
              src={TANAKA_IMAGE}
              alt="Maître Tanaka" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
            />
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Star, value: '150', label: 'XP Total', gradient: 'from-yellow-500 to-amber-600' },
            { icon: Flame, value: '3', label: 'Jours série', gradient: 'from-orange-500 to-red-600' },
            { icon: Trophy, value: '2', label: 'Badges', gradient: 'from-emerald-500 to-green-600' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx }}
              className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-center`}
            >
              <stat.icon className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-white/70 text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Techniques Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-5 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <span className="text-4xl">📚</span>
            <h3 className="text-xl font-bold text-white mt-3">Techniques</h3>
            <p className="text-cyan-200/70 text-sm mt-1">206+ mouvements à découvrir</p>
            <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full w-[15%]" />
            </div>
            <p className="text-white/60 text-xs mt-2">15% complété</p>
          </motion.div>

          {/* Dojo Virtuel Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-3xl p-5 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <span className="text-4xl">🎮</span>
            <h3 className="text-xl font-bold text-white mt-3">Dojo Virtuel</h3>
            <p className="text-purple-200/70 text-sm mt-1">11 mini-jeux éducatifs</p>
            <button className="mt-4 bg-white/20 hover:bg-white/30 w-full py-2 rounded-xl text-white text-sm font-medium transition-colors">
              ▶ Jouer maintenant
            </button>
          </motion.div>
        </div>

        {/* 7 Vertus */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-5"
        >
          <h3 className="text-xl font-bold text-white mb-4">🎭 Les 7 Vertus du Budo</h3>
          <div className="grid grid-cols-7 gap-2">
            {virtues.map((virtue, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span className="text-2xl block">{virtue.kanji}</span>
                <p className="text-white text-[10px] mt-1 hidden md:block">{virtue.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
