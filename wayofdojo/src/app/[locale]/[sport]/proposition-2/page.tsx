'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, ChevronDown, Play, BookOpen } from 'lucide-react';
import { SpiralConnector } from '@/components/animations/SpiralConnector';

/**
 * PROPOSITION 2: Layout TIMELINE VERTICALE
 * Parcours en escalier avec progression visuelle de haut en bas
 */
export default function Proposition2Page() {
  const blocks = [
    { id: 1, title: 'Techniques', subtitle: '206+ mouvements', emoji: '📚', color: 'from-cyan-500 to-blue-600', progress: 15 },
    { id: 2, title: 'Dojo Virtuel', subtitle: 'Jeux & Validations', emoji: '🎮', color: 'from-purple-500 to-pink-600', progress: 0 },
    { id: 3, title: 'Ma Pratique', subtitle: 'Mon carnet de dojo', emoji: '🥋', color: 'from-orange-500 to-red-600', progress: 0 },
    { id: 4, title: 'Ma Progression', subtitle: 'Ceintures & Vertus', emoji: '🌟', color: 'from-yellow-500 to-amber-600', progress: 0 },
    { id: 5, title: 'Les 7 Vertus', subtitle: 'Les qualités du Ninja', emoji: '☯️', color: 'from-indigo-500 to-purple-600', progress: 0 },
    { id: 6, title: 'Les Ceintures', subtitle: 'Monte de grade', emoji: '🎖️', color: 'from-emerald-500 to-teal-600', progress: 0 },
    { id: 7, title: 'Trophées', subtitle: '2 badges', emoji: '🏆', color: 'from-amber-500 to-orange-600', progress: 0 },
    { id: 8, title: 'Cette semaine', subtitle: '3 entraînements', emoji: '📊', color: 'from-blue-500 to-cyan-600', progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-950 p-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link href="/fr/aikido/demo-spirales" className="inline-flex items-center gap-2 text-amber-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Retour aux propositions
        </Link>
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-2xl font-bold text-white">PROPOSITION 2: Timeline Verticale</h1>
          <div className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm">Mode Jeune Samouraï</div>
        </div>
      </div>

      {/* Hero Section avec Tanaka */}
      <div className="max-w-3xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-600/30 via-orange-600/40 to-amber-600/30 rounded-3xl p-6 border border-amber-500/30"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src="/images/tanaka/portrait.png" alt="Tanaka" className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-500/50" />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1">
                <Play className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-amber-400 font-bold text-lg">Maître Tanaka</p>
              <p className="text-white/80 text-sm mt-1">&quot;Continue ton parcours, jeune ninja ! Chaque étape te rapproche de la maîtrise.&quot;</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="bg-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-sm flex items-center gap-1">
                  <Star className="w-3 h-3" /> 150 XP
                </span>
                <span className="bg-orange-500/20 px-3 py-1 rounded-full text-orange-400 text-sm flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 3 jours
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white text-sm">6e Kyu</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto relative">
        {/* Ligne centrale */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-emerald-500 to-cyan-500 rounded-full" />

        {blocks.map((block, index) => {
          const isLeft = index % 2 === 0;
          
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative mb-4"
            >
              {/* Point sur la timeline */}
              <div className="absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${block.color} border-4 border-amber-950 shadow-lg`}
                />
              </div>

              {/* Numéro d'étape */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-black text-slate-900">
                {block.id}
              </div>

              {/* Carte */}
              <div className="ml-16">
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className={`bg-gradient-to-r ${block.color} rounded-2xl p-4 shadow-lg cursor-pointer`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                      <span className="text-3xl">{block.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{block.title}</h3>
                      <p className="text-white/70 text-sm">{block.subtitle}</p>
                      {block.progress > 0 && (
                        <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${block.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/50 rotate-[-90deg]" />
                  </div>
                </motion.div>
              </div>

              {/* Spirale entre les blocs */}
              {index < blocks.length - 1 && (
                <div className="ml-16 flex justify-center py-1">
                  <SpiralConnector variant="glow" color={['amber', 'emerald', 'cyan', 'purple', 'orange', 'pink', 'amber'][index % 7]} size="sm" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
