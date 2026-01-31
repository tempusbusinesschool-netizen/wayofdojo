'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Gamepad2, BookOpen, Trophy, Star, Shield, Award, BarChart3 } from 'lucide-react';
import { SpiralConnector, SpiralDivider } from '@/components/animations/SpiralConnector';

/**
 * Page de démonstration des animations spirales
 */
export default function DemoSpiralesPage() {
  // Simulation des blocs du dashboard
  const blocks = [
    { id: 1, title: 'Techniques', subtitle: 'Apprends les mouvements', icon: BookOpen, color: 'from-cyan-500 to-blue-600', emoji: '📚' },
    { id: 2, title: 'Dojo Virtuel', subtitle: 'Jeux & Validations', icon: Gamepad2, color: 'from-purple-500 to-pink-600', emoji: '🎮' },
    { id: 3, title: 'Ma Pratique', subtitle: 'Mon carnet de dojo', icon: BookOpen, color: 'from-orange-500 to-red-600', emoji: '🥋' },
    { id: 4, title: 'Ma Progression', subtitle: 'Ceintures & Vertus', icon: Star, color: 'from-yellow-500 to-amber-600', emoji: '🌟' },
    { id: 5, title: 'Les 7 Vertus', subtitle: 'Les qualités du Ninja', icon: Shield, color: 'from-indigo-500 to-purple-600', emoji: '☯️' },
    { id: 6, title: 'Les Ceintures', subtitle: 'Monte de grade', icon: Award, color: 'from-emerald-500 to-teal-600', emoji: '🎖️' },
    { id: 7, title: 'Trophées', subtitle: '2 badges', icon: Trophy, color: 'from-amber-500 to-orange-600', emoji: '🏆' },
    { id: 8, title: 'Cette semaine', subtitle: '3 entraînements', icon: BarChart3, color: 'from-blue-500 to-cyan-600', emoji: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link 
          href="/fr/aikido/dojo"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dojo
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          <Sparkles className="inline w-8 h-8 text-amber-400 mr-2" />
          Démonstration - Animation Spirale
        </h1>
        <p className="text-slate-400">
          Voici l&apos;animation spirale qui sera placée entre chaque bloc du parcours.
        </p>
      </div>

      {/* Section 1: Spirales isolées */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-white mb-4">1. Variantes de spirales</h2>
        
        <div className="grid grid-cols-3 gap-6 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Default</p>
            <div className="bg-slate-900 rounded-xl p-4">
              <SpiralConnector variant="default" color="amber" size="lg" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Glow</p>
            <div className="bg-slate-900 rounded-xl p-4">
              <SpiralConnector variant="glow" color="emerald" size="lg" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Dashed</p>
            <div className="bg-slate-900 rounded-xl p-4">
              <SpiralConnector variant="dashed" color="cyan" size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Spirale Divider */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-xl font-bold text-white mb-4">2. Diviseur avec spirale</h2>
        
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 space-y-4">
          <p className="text-slate-400 text-sm">Couleur Amber</p>
          <SpiralDivider color="amber" />
          
          <p className="text-slate-400 text-sm">Couleur Emerald</p>
          <SpiralDivider color="emerald" />
          
          <p className="text-slate-400 text-sm">Couleur Cyan</p>
          <SpiralDivider color="cyan" />
          
          <p className="text-slate-400 text-sm">Couleur Purple</p>
          <SpiralDivider color="purple" />
        </div>
      </div>

      {/* Section 3: Blocs avec spirales */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">3. Blocs avec spirales entre eux</h2>
        
        <div className="space-y-0">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {/* Bloc */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${block.color} rounded-2xl p-4 shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">{block.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{block.title}</h3>
                    <p className="text-white/70 text-sm">{block.subtitle}</p>
                  </div>
                </div>
              </motion.div>

              {/* Spirale entre les blocs (sauf après le dernier) */}
              {index < blocks.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.05 }}
                  className="flex justify-center py-1"
                >
                  <SpiralConnector 
                    variant="glow" 
                    color={['amber', 'emerald', 'cyan', 'purple', 'orange', 'pink', 'amber'][index % 7]} 
                    size="md" 
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message de confirmation */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-2xl p-6">
          <p className="text-amber-400 font-semibold">
            💫 Confirmez-vous cette animation pour l&apos;intégrer entre les blocs du dashboard ?
          </p>
        </div>
      </div>
    </div>
  );
}
