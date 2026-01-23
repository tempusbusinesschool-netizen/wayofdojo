'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Sparkles, Trophy, BookOpen, 
  ChevronRight, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TechniqueCelebration, StepTransition, TanakaAnimatedLogo } from '@/components/animations';
import { MusashiQuoteCard } from '@/components/adult-journey';
import { MUSASHI_QUOTES } from '@/data/musashi/quotes';

export default function AnimationsDemoPage() {
  // Animation states
  const [showStepTransition, setShowStepTransition] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stepType, setStepType] = useState<'step_complete' | 'challenge_done' | 'badge_earned'>('challenge_done');
  const [logoVariant, setLogoVariant] = useState<'default' | 'glow' | 'breathing' | 'bounce'>('breathing');
  const [logoSize, setLogoSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [logoActive, setLogoActive] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const triggerStepTransition = (type: 'step_complete' | 'challenge_done' | 'badge_earned') => {
    setStepType(type);
    setShowStepTransition(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TanakaAnimatedLogo size="sm" variant="glow" isActive={true} />
              <div>
                <h1 className="text-xl font-bold text-white">Démonstration des Animations</h1>
                <p className="text-slate-400 text-sm">WayofDojo - Composants visuels</p>
              </div>
            </div>
            <a 
              href="/fr/aikido/dojo" 
              className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
            >
              Retour au Dojo <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Section 1: StepTransition */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">StepTransition</h2>
              <p className="text-slate-400 text-sm">Animation de transition entre étapes avec confettis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerStepTransition('challenge_done')}
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-left"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-white font-bold">Défi Accompli</h3>
              <p className="text-slate-400 text-sm mt-1">challenge_done</p>
              <div className="mt-4 flex items-center gap-2 text-amber-400 text-sm">
                <Play className="w-4 h-4" /> Lancer
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerStepTransition('step_complete')}
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-left"
            >
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-white font-bold">Étape Complète</h3>
              <p className="text-slate-400 text-sm mt-1">step_complete</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                <Play className="w-4 h-4" /> Lancer
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => triggerStepTransition('badge_earned')}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-left"
            >
              <div className="text-3xl mb-3">🏅</div>
              <h3 className="text-white font-bold">Badge Obtenu</h3>
              <p className="text-slate-400 text-sm mt-1">badge_earned</p>
              <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm">
                <Play className="w-4 h-4" /> Lancer
              </div>
            </motion.button>
          </div>

          {/* Code snippet */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`<StepTransition
  isVisible={true}
  stepTitle="Mission accomplie"
  stepEmoji="⚔️"
  actionType="${stepType}"
  xpEarned={30}
  onComplete={() => setShow(false)}
/>`}
            </pre>
          </div>
        </section>

        {/* Section 2: TechniqueCelebration */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">TechniqueCelebration</h2>
              <p className="text-slate-400 text-sm">Célébration de maîtrise d&apos;une technique avec son</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCelebration(true)}
            className="w-full p-8 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-center"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white">Technique Maîtrisée !</h3>
            <p className="text-slate-400 mt-2">Cliquez pour voir la célébration avec confettis et son</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-yellow-400">
              <Play className="w-5 h-5" /> 
              <Volume2 className="w-5 h-5" />
              Lancer l&apos;animation
            </div>
          </motion.button>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`<TechniqueCelebration
  isVisible={true}
  technique={{ 
    name: 'Ikkyo Omote', 
    level: 'maîtrisé' 
  }}
  onClose={() => setShow(false)}
/>`}
            </pre>
          </div>
        </section>

        {/* Section 3: TanakaAnimatedLogo */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              🧙‍♂️
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">TanakaAnimatedLogo</h2>
              <p className="text-slate-400 text-sm">Logo animé du Maître Tanaka avec plusieurs variantes</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Variant selector */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">Variante</h4>
              <div className="flex flex-wrap gap-2">
                {(['default', 'glow', 'breathing', 'bounce'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setLogoVariant(v)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      logoVariant === v 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">Taille</h4>
              <div className="flex flex-wrap gap-2">
                {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setLogoSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      logoSize === s 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="text-white font-semibold mb-3">État actif</h4>
              <button
                onClick={() => setLogoActive(!logoActive)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  logoActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {logoActive ? 'Actif ✓' : 'Inactif'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 flex flex-col items-center justify-center min-h-[200px]">
            <TanakaAnimatedLogo
              size={logoSize}
              variant={logoVariant}
              isActive={logoActive}
              showAura={true}
              onClick={() => setLogoActive(!logoActive)}
            />
            <p className="text-slate-400 text-sm mt-6">Cliquez sur le logo pour toggle l&apos;état actif</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
{`<TanakaAnimatedLogo
  size="${logoSize}"
  variant="${logoVariant}"
  isActive={${logoActive}}
  showAura={true}
  onClick={() => toggle()}
/>`}
            </pre>
          </div>
        </section>

        {/* Section 4: MusashiQuoteCard */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">MusashiQuoteCard</h2>
              <p className="text-slate-400 text-sm">Citations de Miyamoto Musashi avec 3 variantes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Compact */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">variant=&quot;compact&quot;</h4>
              <MusashiQuoteCard quote={MUSASHI_QUOTES[quoteIndex]} variant="compact" />
            </div>

            {/* Default */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">variant=&quot;default&quot;</h4>
              <MusashiQuoteCard quote={MUSASHI_QUOTES[quoteIndex]} variant="default" showChapter />
            </div>

            {/* Featured */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">variant=&quot;featured&quot;</h4>
              <MusashiQuoteCard quote={MUSASHI_QUOTES[quoteIndex]} variant="featured" showChapter />
            </div>
          </div>

          {/* Quote selector */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuoteIndex(Math.max(0, quoteIndex - 1))}
              disabled={quoteIndex === 0}
              className="border-slate-600"
            >
              ← Précédente
            </Button>
            <span className="text-slate-400 text-sm">
              Citation {quoteIndex + 1} / {MUSASHI_QUOTES.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuoteIndex(Math.min(MUSASHI_QUOTES.length - 1, quoteIndex + 1))}
              disabled={quoteIndex === MUSASHI_QUOTES.length - 1}
              className="border-slate-600"
            >
              Suivante →
            </Button>
          </div>
        </section>

        {/* Section 5: Confetti Colors */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              🎊
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Palette de couleurs</h2>
              <p className="text-slate-400 text-sm">Couleurs utilisées pour les confettis et animations</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { color: '#10B981', name: 'Emerald' },
              { color: '#14B8A6', name: 'Teal' },
              { color: '#F59E0B', name: 'Amber' },
              { color: '#EC4899', name: 'Pink' },
              { color: '#8B5CF6', name: 'Violet' },
              { color: '#06B6D4', name: 'Cyan' },
            ].map((c) => (
              <div key={c.color} className="text-center">
                <div 
                  className="w-full h-16 rounded-xl mb-2 shadow-lg"
                  style={{ backgroundColor: c.color }}
                />
                <p className="text-white text-sm font-medium">{c.name}</p>
                <p className="text-slate-500 text-xs font-mono">{c.color}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Animations Modals */}
      <StepTransition
        isVisible={showStepTransition}
        stepTitle={stepType === 'challenge_done' ? 'Défi accompli' : stepType === 'badge_earned' ? 'Badge obtenu' : 'Étape complète'}
        stepEmoji={stepType === 'challenge_done' ? '🎯' : stepType === 'badge_earned' ? '🏅' : '✅'}
        actionType={stepType}
        xpEarned={stepType === 'badge_earned' ? 50 : 30}
        onComplete={() => setShowStepTransition(false)}
      />

      <TechniqueCelebration
        isVisible={showCelebration}
        technique={{ name: 'Ikkyo Omote', nameJp: '一教表', level: 'maîtrisé' }}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
