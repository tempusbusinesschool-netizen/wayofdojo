'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Swords, BookMarked, Joystick, Award, Zap, UserCircle2,
  Menu, X, Moon, Bell
} from 'lucide-react';
import { useState } from 'react';

/**
 * PROPOSITION 2 : SIDEBAR DOJO ZEN
 * ══════════════════════════════════════════════════════════════════
 * Bandeau latéral épuré avec style minimaliste japonais
 * Style : Blanc cassé / Beige avec touches de noir et rouge
 * Sidebar rétractable au clic
 * ══════════════════════════════════════════════════════════════════
 */

const TANAKA_IMAGE = "/images/tanaka/portrait.png";

const menuItems = [
  { icon: Swords, label: 'Mon Dojo', emoji: '🏯', active: true },
  { icon: BookMarked, label: 'Techniques', emoji: '📖', active: false },
  { icon: Joystick, label: 'Jeux', emoji: '🎮', active: false },
  { icon: Award, label: 'Grades', emoji: '🥋', active: false },
  { icon: Zap, label: 'Défis', emoji: '⚡', active: false },
  { icon: UserCircle2, label: 'Profil', emoji: '👤', active: false },
];

const progressSteps = [
  { step: 1, label: 'Mon Profil', completed: true },
  { step: 2, label: 'Techniques', completed: false },
  { step: 3, label: 'Dojo Virtuel', completed: false },
  { step: 4, label: 'Ma Pratique', completed: false },
  { step: 5, label: 'Progression', completed: false },
  { step: 6, label: 'Trophées', completed: false },
];

export default function PropositionSidebar2() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [_activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex">
      
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR GAUCHE - Style Zen / Minimaliste */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 backdrop-blur-xl border-r border-amber-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">道</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-800">WayofDojo</h1>
                    <p className="text-xs text-red-600 font-medium">武道の道</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Profile Card */}
            <div className="p-4">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-3">
                  <img 
                    src={TANAKA_IMAGE}
                    alt="Avatar"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">Kenji</p>
                    <p className="text-sm text-amber-700">6e Kyu • Rokkyu</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">150 XP</span>
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">🔥 3j</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Navigation</p>
              {menuItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'text-slate-600 hover:bg-amber-100'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-amber-200">
              <div className="flex items-center justify-around">
                <button className="p-3 hover:bg-amber-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-slate-500" />
                </button>
                <button className="p-3 hover:bg-amber-100 rounded-xl transition-colors">
                  <Moon className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENU PRINCIPAL */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        
        {/* Toggle Sidebar Button */}
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <Menu className="w-6 h-6 text-slate-700" />
          </motion.button>
        )}

        {/* Tanaka Welcome */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-amber-200/50 mb-6 border border-amber-200"
        >
          <div className="flex items-center gap-6">
            <img 
              src={TANAKA_IMAGE}
              alt="Maître Tanaka"
              className="w-20 h-20 rounded-2xl object-cover border-4 border-amber-200 shadow-lg"
            />
            <div className="flex-1">
              <p className="text-amber-600 text-sm font-medium">Message de Maître Tanaka</p>
              <h2 className="text-2xl font-black text-slate-800 mt-1">&quot;Bienvenue au Dojo, Kenji !&quot;</h2>
              <p className="text-slate-600 mt-2">Chaque jour est une nouvelle opportunité d&apos;apprendre et de progresser sur la Voie.</p>
            </div>
            <button className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg shadow-red-500/30 hover:shadow-xl transition-shadow">
              🔊 Écouter
            </button>
          </div>
        </motion.div>

        {/* Progress Path */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-amber-200/50 mb-6 border border-amber-200"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">📍 Progression du parcours</h3>
          <div className="flex items-center justify-between">
            {progressSteps.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step.completed
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.completed ? '✓' : step.step}
                </motion.div>
                {idx < progressSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${
                    step.completed ? 'bg-emerald-400' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            {progressSteps.map((step, idx) => (
              <p key={idx} className="text-[10px] text-slate-500 text-center flex-1">{step.label}</p>
            ))}
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { emoji: '📚', title: 'Techniques', desc: '206+ mouvements', color: 'from-cyan-400 to-blue-500' },
            { emoji: '🎮', title: 'Dojo Virtuel', desc: '11 mini-jeux', color: 'from-purple-400 to-pink-500' },
            { emoji: '🏆', title: 'Trophées', desc: '2 badges', color: 'from-amber-400 to-orange-500' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white cursor-pointer shadow-lg`}
            >
              <span className="text-4xl">{card.emoji}</span>
              <h4 className="text-lg font-bold mt-3">{card.title}</h4>
              <p className="text-white/70 text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 7 Vertus */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 shadow-xl shadow-amber-200/50 border border-amber-200"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">🎭 Les 7 Vertus du Budo</h3>
          <div className="grid grid-cols-7 gap-3">
            {[
              { kanji: '礼', name: 'Respect', bg: 'bg-red-100 hover:bg-red-200' },
              { kanji: '勇', name: 'Courage', bg: 'bg-orange-100 hover:bg-orange-200' },
              { kanji: '克', name: 'Maîtrise', bg: 'bg-yellow-100 hover:bg-yellow-200' },
              { kanji: '謙', name: 'Humilité', bg: 'bg-green-100 hover:bg-green-200' },
              { kanji: '仁', name: 'Bienveillance', bg: 'bg-blue-100 hover:bg-blue-200' },
              { kanji: '注', name: 'Attention', bg: 'bg-indigo-100 hover:bg-indigo-200' },
              { kanji: '責', name: 'Responsabilité', bg: 'bg-purple-100 hover:bg-purple-200' },
            ].map((v, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -3 }}
                className={`${v.bg} rounded-xl p-3 text-center cursor-pointer transition-colors border border-slate-200`}
              >
                <span className="text-3xl font-bold text-slate-700">{v.kanji}</span>
                <p className="text-xs text-slate-600 mt-1 font-medium">{v.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
