'use client';

import { motion } from 'framer-motion';
import { 
  Castle, Scroll, Sparkles, Medal, Flame, Compass,
  ChevronDown, Volume2, Play
} from 'lucide-react';
import { useState } from 'react';

/**
 * PROPOSITION 3 : SIDEBAR RPG / GAMIFICATION
 * ══════════════════════════════════════════════════════════════════
 * Bandeau latéral style jeu vidéo RPG avec progression verticale
 * Style : Sombre avec néons et effets gaming
 * Sidebar avec stats du personnage et quêtes actives
 * ══════════════════════════════════════════════════════════════════
 */

const TANAKA_IMAGE = "/images/tanaka/portrait.png";

const quests = [
  { id: 1, name: 'Salut Parfait', xp: 10, emoji: '🙇', completed: true },
  { id: 2, name: 'Maître des Chutes', xp: 15, emoji: '🌪️', completed: false },
  { id: 3, name: 'Technique du Jour', xp: 20, emoji: '💪', completed: false },
];

const skills = [
  { name: 'Respect', level: 3, maxLevel: 10, color: 'bg-red-500' },
  { name: 'Courage', level: 2, maxLevel: 10, color: 'bg-orange-500' },
  { name: 'Maîtrise', level: 1, maxLevel: 10, color: 'bg-yellow-500' },
  { name: 'Bienveillance', level: 4, maxLevel: 10, color: 'bg-blue-500' },
];

export default function PropositionSidebar3() {
  const [expandedQuest, setExpandedQuest] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR GAUCHE - Style RPG Gaming */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-purple-500/30 flex flex-col"
      >
        {/* Character Card */}
        <div className="p-5 border-b border-purple-500/30">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl" />
            
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-amber-500/30">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={TANAKA_IMAGE}
                    alt="Avatar"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-slate-900">
                    5
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-black text-white text-lg">Kenji</p>
                  <p className="text-amber-400 text-sm">Jeune Samouraï</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">6e Kyu</span>
                    <span className="text-amber-400">•</span>
                    <span className="text-xs text-amber-400">🐣 Rokkyu</span>
                  </div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">XP</span>
                  <span className="text-amber-400 font-bold">150 / 300</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '50%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full"
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <Flame className="w-4 h-4 text-orange-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">3</p>
                  <p className="text-slate-500 text-[10px]">Série</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <Medal className="w-4 h-4 text-amber-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">2</p>
                  <p className="text-slate-500 text-[10px]">Badges</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-2 text-center">
                  <Scroll className="w-4 h-4 text-cyan-500 mx-auto" />
                  <p className="text-white font-bold text-sm mt-1">15</p>
                  <p className="text-slate-500 text-[10px]">Techniques</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills / Vertus */}
        <div className="p-5 border-b border-purple-500/30">
          <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Vertus du Budo
          </h3>
          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{skill.name}</span>
                  <span className="text-purple-400">Lv.{skill.level}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`h-full ${skill.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quests */}
        <div className="flex-1 p-5 overflow-auto">
          <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" /> Quêtes Actives
          </h3>
          <div className="space-y-2">
            {quests.map((quest) => (
              <motion.div
                key={quest.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setExpandedQuest(expandedQuest === quest.id ? null : quest.id)}
                className={`rounded-xl p-3 cursor-pointer transition-all ${
                  quest.completed 
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{quest.emoji}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${quest.completed ? 'text-emerald-400' : 'text-white'}`}>
                      {quest.name}
                    </p>
                    <p className="text-xs text-slate-400">+{quest.xp} XP</p>
                  </div>
                  {quest.completed ? (
                    <span className="text-emerald-400 text-xl">✓</span>
                  ) : (
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedQuest === quest.id ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Play Button */}
        <div className="p-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
          >
            <Play className="w-5 h-5" /> CONTINUER
          </motion.button>
        </div>
      </motion.aside>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENU PRINCIPAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        
        {/* Tanaka Hero */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-3xl overflow-hidden mb-6"
        >
          {/* Background with blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600" />
          <div className="absolute inset-0 bg-[url('/images/tanaka/portrait.png')] bg-cover bg-center opacity-20 blur-sm" />
          
          <div className="relative z-10 p-8 flex items-center gap-8">
            <img 
              src={TANAKA_IMAGE}
              alt="Maître Tanaka"
              className="w-32 h-32 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
            />
            <div className="flex-1">
              <p className="text-amber-200 text-sm font-medium">🎭 Ton Sensei personnel</p>
              <h1 className="text-4xl font-black text-white mt-2">Maître Tanaka</h1>
              <p className="text-white/80 mt-3 max-w-xl">
                &quot;La vraie victoire est la victoire sur soi-même. Continue ton chemin, jeune Samouraï !&quot;
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-medium flex items-center gap-2 transition-colors"
              >
                <Volume2 className="w-5 h-5" /> Écouter le message
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { 
              icon: Castle, 
              title: 'Dojo Virtuel', 
              desc: '11 mini-jeux éducatifs', 
              gradient: 'from-purple-600 to-pink-600',
              glow: 'shadow-purple-500/30'
            },
            { 
              icon: Scroll, 
              title: 'Techniques', 
              desc: '206+ mouvements', 
              gradient: 'from-cyan-600 to-blue-600',
              glow: 'shadow-cyan-500/30'
            },
            { 
              icon: Medal, 
              title: 'Trophées', 
              desc: '2 badges débloqués', 
              gradient: 'from-amber-500 to-orange-600',
              glow: 'shadow-amber-500/30'
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 cursor-pointer shadow-xl ${card.glow} group`}
            >
              <card.icon className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mt-4">{card.title}</h3>
              <p className="text-white/70 mt-1">{card.desc}</p>
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            </motion.div>
          ))}
        </div>

        {/* 7 Vertus Full */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-2">🎭 Les 7 Vertus du Budo</h3>
          <p className="text-slate-400 text-sm mb-5">Maîtrise ces qualités pour devenir un vrai Samouraï</p>
          
          <div className="grid grid-cols-7 gap-3">
            {[
              { kanji: '礼', name: 'Respect', gradient: 'from-red-500 to-red-600', level: 3 },
              { kanji: '勇', name: 'Courage', gradient: 'from-orange-500 to-orange-600', level: 2 },
              { kanji: '克', name: 'Maîtrise', gradient: 'from-yellow-500 to-yellow-600', level: 1 },
              { kanji: '謙', name: 'Humilité', gradient: 'from-green-500 to-green-600', level: 0 },
              { kanji: '仁', name: 'Bienveillance', gradient: 'from-blue-500 to-blue-600', level: 4 },
              { kanji: '注', name: 'Attention', gradient: 'from-indigo-500 to-indigo-600', level: 2 },
              { kanji: '責', name: 'Responsabilité', gradient: 'from-purple-500 to-purple-600', level: 1 },
            ].map((virtue, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className={`bg-gradient-to-br ${virtue.gradient} rounded-xl p-3 text-center cursor-pointer shadow-lg`}
              >
                <span className="text-3xl font-bold text-white">{virtue.kanji}</span>
                <p className="text-white/80 text-xs mt-1 font-medium">{virtue.name}</p>
                <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${(virtue.level / 5) * 100}%` }}
                  />
                </div>
                <p className="text-white/60 text-[10px] mt-1">Lv.{virtue.level}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
