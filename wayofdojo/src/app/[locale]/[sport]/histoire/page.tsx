'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Quote, Star, BookOpen, Users, ChevronRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  OSENSEI, 
  HISTORICAL_FIGURES, 
  AIKIDO_TIMELINE, 
  AIKIDO_MEANING 
} from '@/data/aikido/histoire';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PAGE HISTOIRE DE L'AÏKIDO
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function HistoirePage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null);
  const [activeQuote, setActiveQuote] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
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
              📜 L'Histoire de l'Aïkido
            </h1>
            <p className="text-sm text-slate-400">O'Sensei et la création de la Voie de l'Harmonie</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Section: Signification du nom */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 rounded-3xl p-8 border border-amber-700/30 overflow-hidden">
            {/* Fond décoratif */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] font-bold">
                {AIKIDO_MEANING.full}
              </div>
            </div>

            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-5xl">{AIKIDO_MEANING.full}</span>
                <span className="text-amber-400">Aïkido</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {AIKIDO_MEANING.breakdown.map((part, index) => (
                  <motion.div
                    key={part.kanji}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 text-center"
                  >
                    <div className="text-6xl font-bold mb-2 text-amber-400">{part.kanji}</div>
                    <div className="text-xl font-bold text-white">{part.reading}</div>
                    <div className="text-amber-300 font-medium mb-3">{part.meaning}</div>
                    <p className="text-slate-400 text-sm">{part.explanation}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-amber-600/30">
                <p className="text-center text-lg italic text-amber-200">
                  "{AIKIDO_MEANING.fullMeaning}"
                </p>
                <p className="text-center text-slate-400 mt-4 text-sm max-w-3xl mx-auto">
                  {AIKIDO_MEANING.philosophy}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section: O'Sensei */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/50">
              {/* Image officielle de Tanaka - VERROUILLÉE */}
              <img 
                src="/images/tanaka/portrait.png" 
                alt="Maître Tanaka" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">O'Sensei — Le Fondateur</h2>
              <p className="text-slate-400">{OSENSEI.name} ({OSENSEI.birthYear}-{OSENSEI.deathYear})</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Biographie */}
            <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Biographie
              </h3>
              <div className="prose prose-invert prose-sm max-w-none">
                {OSENSEI.biography.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Citations */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-amber-400" />
                  Paroles du Maître
                </h3>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeQuote}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-2xl text-amber-400 font-japanese text-center">
                      {OSENSEI.quotes[activeQuote].japanese}
                    </div>
                    {OSENSEI.quotes[activeQuote].romaji && (
                      <div className="text-slate-500 text-center text-sm italic">
                        {OSENSEI.quotes[activeQuote].romaji}
                      </div>
                    )}
                    <div className="text-white text-center font-medium">
                      "{OSENSEI.quotes[activeQuote].french}"
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-2 mt-6">
                  {OSENSEI.quotes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveQuote(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === activeQuote 
                          ? 'bg-amber-400 w-6' 
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Héritage */}
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Héritage
                </h3>
                <ul className="space-y-3">
                  {OSENSEI.legacy.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-400 text-xs">{idx + 1}</span>
                      </div>
                      <span className="text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section: Chronologie */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-400" />
            Chronologie de l'Aïkido
          </h2>

          <div className="relative">
            {/* Ligne centrale */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-amber-500/50 hidden lg:block" />

            <div className="space-y-8">
              {AIKIDO_TIMELINE.map((period, index) => (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`lg:grid lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}
                >
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div 
                      className={`rounded-2xl p-6 border cursor-pointer transition-all ${
                        selectedPeriod === period.id 
                          ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                          : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                      onClick={() => setSelectedPeriod(selectedPeriod === period.id ? null : period.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: period.color }}
                          />
                          <div>
                            <h3 className="font-bold text-lg">{period.name}</h3>
                            <p className="text-slate-500 text-sm">{period.japaneseName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-bold">{period.startYear} - {period.endYear}</div>
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-4">{period.description}</p>

                      <AnimatePresence>
                        {selectedPeriod === period.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-700 pt-4 mt-4"
                          >
                            <h4 className="font-semibold text-sm text-amber-400 mb-3">Événements clés</h4>
                            <ul className="space-y-2">
                              {period.keyEvents.map((event, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm">
                                  <span className="text-amber-500 font-mono font-bold min-w-[50px]">{event.year}</span>
                                  <span className="text-slate-300">{event.event}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Section: Autres figures */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-amber-400" />
            Figures Historiques
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HISTORICAL_FIGURES.filter(f => f.id !== 'osensei').map((figure) => (
              <motion.div
                key={figure.id}
                whileHover={{ scale: 1.02 }}
                className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                  selectedFigure === figure.id
                    ? 'bg-slate-800 border-amber-500/50'
                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                }`}
                onClick={() => setSelectedFigure(selectedFigure === figure.id ? null : figure.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold">{figure.name}</h3>
                    <p className="text-amber-400 text-sm">{figure.title}</p>
                  </div>
                </div>

                <p className="text-slate-500 text-xs mb-2">
                  {figure.birthYear} - {figure.deathYear || 'Présent'} • {figure.birthPlace}
                </p>

                <AnimatePresence>
                  {selectedFigure === figure.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-700 pt-3 mt-3"
                    >
                      <p className="text-slate-400 text-sm mb-3">{figure.biography}</p>
                      {figure.quotes[0] && (
                        <div className="bg-slate-800/50 rounded-lg p-3 text-sm italic text-amber-200">
                          "{figure.quotes[0].french}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-end mt-2">
                  <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${
                    selectedFigure === figure.id ? 'rotate-90' : ''
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA retour */}
        <div className="text-center pt-8 pb-16">
          <Button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-bold"
          >
            <Heart className="w-4 h-4 mr-2" />
            Continuer ma pratique
          </Button>
        </div>
      </div>
    </div>
  );
}
