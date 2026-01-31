'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Flame } from 'lucide-react';

/**
 * PROPOSITION 1: Layout en CERCLE / ROUE
 * Les blocs sont disposés en cercle autour d'un hub central (Tanaka)
 */
export default function Proposition1Page() {
  const blocks = [
    { id: 1, title: 'Techniques', subtitle: '206+ mouvements', color: 'from-cyan-500 to-blue-600', emoji: '📚', angle: 0 },
    { id: 2, title: 'Dojo Virtuel', subtitle: 'Jeux & Validations', color: 'from-purple-500 to-pink-600', emoji: '🎮', angle: 45 },
    { id: 3, title: 'Ma Pratique', subtitle: 'Mon carnet', color: 'from-orange-500 to-red-600', emoji: '🥋', angle: 90 },
    { id: 4, title: 'Progression', subtitle: 'Ceintures', color: 'from-yellow-500 to-amber-600', emoji: '🌟', angle: 135 },
    { id: 5, title: '7 Vertus', subtitle: 'Qualités Ninja', color: 'from-indigo-500 to-purple-600', emoji: '☯️', angle: 180 },
    { id: 6, title: 'Ceintures', subtitle: 'Monte de grade', color: 'from-emerald-500 to-teal-600', emoji: '🎖️', angle: 225 },
    { id: 7, title: 'Trophées', subtitle: '2 badges', color: 'from-amber-500 to-orange-600', emoji: '🏆', angle: 270 },
    { id: 8, title: 'Stats', subtitle: 'Cette semaine', color: 'from-blue-500 to-cyan-600', emoji: '📊', angle: 315 },
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
          <h1 className="text-2xl font-bold text-white">PROPOSITION 1: Layout Cercle / Roue</h1>
          <div className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm">Mode Jeune Samouraï</div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-6 bg-slate-900/50 rounded-full px-6 py-3 border border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐣</span>
            <span className="text-white font-bold">6e Kyu</span>
          </div>
          <div className="h-6 w-px bg-amber-500/30" />
          <div className="flex items-center gap-2 text-amber-400">
            <Star className="w-4 h-4" />
            <span className="font-bold">150 XP</span>
          </div>
          <div className="h-6 w-px bg-amber-500/30" />
          <div className="flex items-center gap-2 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="font-bold">3 jours</span>
          </div>
        </div>
      </div>

      {/* Cercle Principal */}
      <div className="relative max-w-4xl mx-auto" style={{ height: '500px' }}>
        {/* Centre - Tanaka */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-amber-400/50">
            <img src="/images/tanaka/portrait.png" alt="Tanaka" className="w-28 h-28 rounded-full object-cover" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-amber-400 font-bold text-sm">Maître Tanaka</p>
            <p className="text-white/60 text-xs">Ton guide</p>
          </div>
        </motion.div>

        {/* Blocs en cercle */}
        {blocks.map((block, index) => {
          const radius = 200;
          const angleRad = (block.angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;

          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute left-1/2 top-1/2 cursor-pointer group"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              {/* Ligne de connexion vers le centre */}
              <div 
                className="absolute w-px bg-gradient-to-b from-amber-500/50 to-transparent"
                style={{
                  height: radius - 60,
                  transformOrigin: 'top center',
                  transform: `rotate(${block.angle + 90}deg)`,
                  left: '50%',
                  top: '50%'
                }}
              />
              
              <motion.div
                whileHover={{ scale: 1.15 }}
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${block.color} flex flex-col items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
              >
                <span className="text-2xl">{block.emoji}</span>
                <span className="text-white text-xs font-bold mt-1">{block.title}</span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Spirale décorative au centre */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="w-[450px] h-[450px] rounded-full border border-amber-500/20 border-dashed"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-amber-400/60 text-sm">Cliquez sur un bloc pour accéder à la section</p>
      </div>
    </div>
  );
}
