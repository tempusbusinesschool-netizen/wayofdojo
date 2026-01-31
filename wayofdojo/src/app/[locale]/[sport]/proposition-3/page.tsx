'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Gamepad2, Trophy, Star, Shield, Award, BarChart3, Flame, ChevronRight, Lock } from 'lucide-react';
import { SpiralConnector } from '@/components/animations/SpiralConnector';

/**
 * PROPOSITION 3: Layout CARTE DU MONDE / AVENTURE
 * Style jeu vidéo avec chemin sinueux et étapes comme des "niveaux"
 */
export default function Proposition3Page() {
  const blocks = [
    { id: 1, title: 'Techniques', subtitle: '206+ mouvements', emoji: '📚', color: 'from-cyan-500 to-blue-600', unlocked: true, completed: false },
    { id: 2, title: 'Dojo Virtuel', subtitle: 'Jeux & Validations', emoji: '🎮', color: 'from-purple-500 to-pink-600', unlocked: true, completed: false },
    { id: 3, title: 'Ma Pratique', subtitle: 'Mon carnet', emoji: '🥋', color: 'from-orange-500 to-red-600', unlocked: false, completed: false },
    { id: 4, title: 'Progression', subtitle: 'Ceintures', emoji: '🌟', color: 'from-yellow-500 to-amber-600', unlocked: false, completed: false },
    { id: 5, title: '7 Vertus', subtitle: 'Qualités', emoji: '☯️', color: 'from-indigo-500 to-purple-600', unlocked: false, completed: false },
    { id: 6, title: 'Ceintures', subtitle: 'Grades', emoji: '🎖️', color: 'from-emerald-500 to-teal-600', unlocked: false, completed: false },
    { id: 7, title: 'Trophées', subtitle: 'Badges', emoji: '🏆', color: 'from-amber-500 to-orange-600', unlocked: false, completed: false },
    { id: 8, title: 'Stats', subtitle: 'Semaine', emoji: '📊', color: 'from-blue-500 to-cyan-600', unlocked: false, completed: false },
  ];

  // Positions en zigzag pour le chemin
  const positions = [
    { x: 15, y: 10 },
    { x: 55, y: 15 },
    { x: 25, y: 30 },
    { x: 65, y: 35 },
    { x: 20, y: 50 },
    { x: 60, y: 55 },
    { x: 30, y: 70 },
    { x: 70, y: 75 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 p-4 overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-4">
        <Link href="/fr/aikido/demo-spirales" className="inline-flex items-center gap-2 text-amber-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour aux propositions
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold text-white">PROPOSITION 3: Carte Aventure</h1>
          <div className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm">Mode Jeune Samouraï</div>
        </div>
      </div>

      {/* Stats Bar flottant */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-sm rounded-full px-6 py-2 border border-amber-500/30 shadow-xl"
      >
        <div className="flex items-center gap-4">
          <img src="/images/tanaka/portrait.png" alt="Tanaka" className="w-10 h-10 rounded-full border-2 border-amber-500" />
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold flex items-center gap-1"><Star className="w-4 h-4" /> 150</span>
            <span className="text-orange-400 font-bold flex items-center gap-1"><Flame className="w-4 h-4" /> 3j</span>
            <span className="text-white/80 text-sm">6e Kyu</span>
          </div>
        </div>
      </motion.div>

      {/* Carte du monde */}
      <div className="relative max-w-5xl mx-auto mt-16" style={{ height: '600px' }}>
        {/* Fond de carte stylisé */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-orange-900/30 rounded-3xl border border-amber-500/20 overflow-hidden">
          {/* Motif de fond */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Chemin sinueux SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M 15 12 Q 35 5, 55 17 T 25 32 T 65 37 T 20 52 T 60 57 T 30 72 T 70 77"
            stroke="url(#pathGradient)"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Blocs comme des "niveaux" */}
        {blocks.map((block, index) => {
          const pos = positions[index];
          
          return (
            <motion.div
              key={block.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.15, type: "spring" }}
              className="absolute cursor-pointer group"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Halo pour niveau actif */}
              {block.unlocked && !block.completed && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${block.color} blur-xl`}
                  style={{ margin: '-10px' }}
                />
              )}

              {/* Carte du niveau */}
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                className={`relative w-24 h-24 rounded-2xl ${
                  block.unlocked 
                    ? `bg-gradient-to-br ${block.color}` 
                    : 'bg-slate-800/80'
                } shadow-xl flex flex-col items-center justify-center border-4 ${
                  block.unlocked ? 'border-white/30' : 'border-slate-700'
                }`}
              >
                {/* Numéro */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-black text-slate-900 shadow-lg">
                  {block.id}
                </div>

                {/* Contenu */}
                {block.unlocked ? (
                  <>
                    <span className="text-3xl mb-1">{block.emoji}</span>
                    <span className="text-white text-xs font-bold text-center px-1">{block.title}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-slate-500" />
                    <span className="text-slate-500 text-xs mt-1">Verrouillé</span>
                  </>
                )}

                {/* Badge complété */}
                {block.completed && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </motion.div>

              {/* Tooltip */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-3 py-1 rounded-lg text-xs whitespace-nowrap">
                <span className="text-white">{block.subtitle}</span>
              </div>
            </motion.div>
          );
        })}

        {/* Tanaka en position de départ */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute"
          style={{ left: '5%', top: '8%' }}
        >
          <div className="relative">
            <img src="/images/tanaka/portrait.png" alt="Tanaka" className="w-16 h-16 rounded-full border-4 border-amber-500 shadow-xl" />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 px-2 py-1 rounded-lg text-xs font-bold text-slate-900"
            >
              DÉPART
            </motion.div>
          </div>
        </motion.div>

        {/* Château / Objectif final */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute"
          style={{ right: '5%', bottom: '10%' }}
        >
          <div className="text-center">
            <span className="text-5xl">🏯</span>
            <p className="text-amber-400 text-xs font-bold mt-1">MAÎTRISE</p>
          </div>
        </motion.div>
      </div>

      {/* Légende */}
      <div className="max-w-3xl mx-auto mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-500 to-blue-600" />
          <span className="text-white/60">Débloqué</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-700" />
          <span className="text-white/60">Verrouillé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-white/60">Complété</span>
        </div>
      </div>
    </div>
  );
}
