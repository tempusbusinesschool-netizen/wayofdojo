'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, Heart, Flame, Star, ChevronRight, BookOpen, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BUSHIDO_VIRTUES } from '@/data/aikido/histoire';
import { TanakaWelcome, TANAKA_MESSAGES } from '@/components/TanakaWelcome';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE LES 7 VERTUS DU BUSHIDO
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function VertusPage() {
  const router = useRouter();
  const [selectedVirtue, setSelectedVirtue] = useState<string | null>(null);
  const [completedVirtues, setCompletedVirtues] = useState<string[]>([]);

  const handleMarkComplete = (virtueId: string) => {
    setCompletedVirtues(prev => 
      prev.includes(virtueId) 
        ? prev.filter(v => v !== virtueId)
        : [...prev, virtueId]
    );
  };

  const selectedVirtueData = BUSHIDO_VIRTUES.find(v => v.id === selectedVirtue);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Message d'accueil Tanaka */}
      <TanakaWelcome
        sectionId="vertus"
        sectionTitle={TANAKA_MESSAGES['vertus'].title}
        message={TANAKA_MESSAGES['vertus'].message}
        emoji={TANAKA_MESSAGES['vertus'].emoji}
        variant="full"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              ☯️ Les 7 Vertus du Bushido
            </h1>
            <p className="text-sm text-slate-400">Le code d'honneur des guerriers</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-900/30 to-purple-900/20 rounded-3xl p-8 border border-violet-700/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl">
              ☯️
            </div>
            <div>
              <h2 className="text-2xl font-bold">武士道 — Bushidō</h2>
              <p className="text-violet-300">La Voie du Guerrier</p>
            </div>
          </div>
          
          <p className="text-slate-300 leading-relaxed mb-6">
            Le <strong className="text-violet-300">Bushidō</strong> (武士道) est le code d'honneur des samouraïs, 
            un ensemble de valeurs morales qui guidaient la vie des guerriers japonais. 
            Ces sept vertus forment le pilier de l'éthique martiale et continuent d'inspirer 
            la pratique de l'Aïkido aujourd'hui.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {BUSHIDO_VIRTUES.map((virtue) => (
                <div 
                  key={virtue.id}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-slate-900"
                  style={{ backgroundColor: virtue.color }}
                >
                  {virtue.icon}
                </div>
              ))}
            </div>
            <div className="text-sm text-slate-400">
              {completedVirtues.length} / 7 vertus explorées
            </div>
          </div>
        </motion.section>

        {/* Barre de progression */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              Progression Bushidō
            </span>
            <span className="text-violet-400 font-bold">
              {Math.round((completedVirtues.length / 7) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedVirtues.length / 7) * 100}%` }}
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Grille des 7 vertus */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {BUSHIDO_VIRTUES.map((virtue, index) => {
            const isCompleted = completedVirtues.includes(virtue.id);
            const isSelected = selectedVirtue === virtue.id;

            return (
              <motion.div
                key={virtue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedVirtue(virtue.id)}
                className={`rounded-2xl p-5 cursor-pointer transition-all border-2 ${
                  isSelected 
                    ? 'border-white/50 shadow-lg' 
                    : isCompleted
                    ? 'border-emerald-500/50'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
                style={{ 
                  background: `linear-gradient(135deg, ${virtue.color}20, ${virtue.color}05)` 
                }}
              >
                {/* Badge complété */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{virtue.icon}</div>
                  <div 
                    className="text-4xl font-bold mb-1"
                    style={{ color: virtue.color }}
                  >
                    {virtue.kanji}
                  </div>
                  <div className="text-white font-bold">{virtue.romaji}</div>
                  <div className="text-slate-400 text-sm">{virtue.name}</div>
                </div>

                <div className="text-slate-500 text-xs text-center mb-3">
                  {virtue.meaning}
                </div>

                <div className="flex items-center justify-center">
                  <span 
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${virtue.color}30`, color: virtue.color }}
                  >
                    Découvrir
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal détail vertu */}
        <AnimatePresence>
          {selectedVirtueData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedVirtue(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Header coloré */}
                <div 
                  className="p-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${selectedVirtueData.color}, ${selectedVirtueData.color}80)` 
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                        {selectedVirtueData.icon}
                      </div>
                      <div>
                        <div className="text-4xl font-bold text-white">{selectedVirtueData.kanji}</div>
                        <div className="text-white/90 font-bold">{selectedVirtueData.romaji} — {selectedVirtueData.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVirtue(null)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Signification
                    </h3>
                    <p className="text-white">{selectedVirtueData.meaning}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Description
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{selectedVirtueData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Application en Aïkido
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{selectedVirtueData.application}</p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-700 flex gap-3">
                    <Button
                      onClick={() => handleMarkComplete(selectedVirtueData.id)}
                      className={`flex-1 ${
                        completedVirtues.includes(selectedVirtueData.id)
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {completedVirtues.includes(selectedVirtueData.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Maîtrisé !
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Marquer comme compris
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedVirtue(null)}
                      className="border-slate-600 hover:bg-slate-800"
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section inspirante */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="text-4xl mb-4">🎎</div>
          <h3 className="text-xl font-bold mb-3">Le Bushidō dans votre pratique</h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">
            Ces sept vertus ne sont pas de simples concepts historiques. Elles sont le fondement 
            d'une pratique martiale authentique et d'une vie équilibrée. Chaque fois que vous 
            entrez sur le tatami, vous avez l'opportunité de cultiver ces qualités.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => router.push('/fr/aikido/dojo')}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
            >
              Retour au Dojo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
