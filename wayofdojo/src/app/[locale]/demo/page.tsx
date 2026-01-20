'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ChevronRight, Play, Sparkles, Lock, UserPlus,
  Swords, Target, BookOpen, Award, Star, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Données de démonstration pour les techniques
const demoTechniques = [
  {
    id: 'ikkyo',
    name: 'Ikkyo',
    japanese: '一教',
    grade: '6e Kyu',
    category: 'Immobilisations',
    description: 'Première technique d\'immobilisation. Ikkyo est la base de toutes les immobilisations en Aïkido.',
    keyPoints: [
      'Entrer dans la sphère de l\'adversaire (irimi)',
      'Contrôler le coude et le poignet',
      'Guider vers le sol avec une spirale descendante',
      'Immobiliser avec une pression sur le coude'
    ],
    attacks: ['Katate dori', 'Shomen uchi', 'Yokomen uchi'],
    videoPlaceholder: '🥋'
  },
  {
    id: 'shiho-nage',
    name: 'Shiho Nage',
    japanese: '四方投げ',
    grade: '5e Kyu',
    category: 'Projections',
    description: 'Projection dans les quatre directions. Technique fondamentale utilisant une rotation du poignet.',
    keyPoints: [
      'Saisir le poignet de l\'adversaire',
      'Lever le bras au-dessus de la tête',
      'Pivoter avec le corps entier',
      'Projeter en direction opposée'
    ],
    attacks: ['Katate dori', 'Ryote dori', 'Yokomen uchi'],
    videoPlaceholder: '🌀'
  },
  {
    id: 'irimi-nage',
    name: 'Irimi Nage',
    japanese: '入身投げ',
    grade: '4e Kyu',
    category: 'Projections',
    description: 'Projection en entrant. On entre profondément dans l\'espace de l\'adversaire pour le projeter.',
    keyPoints: [
      'Entrer profondément (irimi)',
      'Déséquilibrer vers l\'arrière',
      'Guider la tête avec le bras',
      'Projeter avec une extension vers l\'avant'
    ],
    attacks: ['Shomen uchi', 'Yokomen uchi', 'Tsuki'],
    videoPlaceholder: '💨'
  }
];

// Données de démonstration pour les défis
const demoChallenges = [
  {
    id: 'salut-parfait',
    name: 'Salut Parfait',
    emoji: '🙇',
    xp: 10,
    type: 'Quotidien',
    description: 'Le salut (rei) est fondamental en Aïkido. Il exprime le respect envers le dojo.',
    steps: [
      'Se tenir debout, pieds joints',
      'Incliner le buste à 30° environ',
      'Garder le dos droit, regard vers le bas',
      'Revenir lentement à la position initiale'
    ],
    tips: 'Un salut sincère vient du cœur, pas seulement du corps.'
  },
  {
    id: 'ukemi-mae',
    name: 'Maître des Chutes Avant',
    emoji: '🔄',
    xp: 20,
    type: 'Hebdomadaire',
    description: 'Mae ukemi (chute avant) est essentielle pour pratiquer en sécurité.',
    steps: [
      'Partir d\'une position accroupie',
      'Tendre un bras en arc de cercle',
      'Rouler sur le bras, l\'épaule et le dos',
      'Se relever en position stable'
    ],
    tips: 'Garde le menton rentré pour protéger ta tête.'
  },
  {
    id: 'vocabulaire-japonais',
    name: 'Parole du Samouraï',
    emoji: '🗣️',
    xp: 15,
    type: 'Quotidien',
    description: 'Apprendre le vocabulaire japonais de l\'Aïkido.',
    steps: [
      'Apprendre à compter de 1 à 10 en japonais',
      'Mémoriser les noms des attaques de base',
      'Connaître les termes du dojo',
      'Pratiquer la prononciation correcte'
    ],
    tips: 'Répète les mots à voix haute pendant tes trajets !'
  }
];

// Données de démonstration pour les vertus
const demoVirtues = [
  {
    id: 'respect',
    name: 'Respect',
    kanji: '礼',
    romaji: 'Rei',
    animal: '🦁',
    animalName: 'Le Lion Noble',
    color: 'from-yellow-400 to-amber-500',
    description: 'Le respect est la première vertu du Bushido.',
    examples: [
      'Saluer en entrant et sortant du dojo',
      'Remercier son partenaire après chaque technique',
      'Prendre soin de son keikogi (tenue)'
    ],
    quote: 'Sans respect, il n\'y a pas d\'harmonie possible.'
  },
  {
    id: 'courage',
    name: 'Courage',
    kanji: '勇',
    romaji: 'Yu',
    animal: '🐯',
    animalName: 'Le Tigre Brave',
    color: 'from-orange-400 to-red-500',
    description: 'Le courage n\'est pas l\'absence de peur, mais la capacité d\'agir malgré elle.',
    examples: [
      'Demander à un sempai de pratiquer',
      'Accepter d\'être uke pour une démonstration',
      'Persévérer même quand c\'est difficile'
    ],
    quote: 'Le courage, c\'est avancer malgré la peur.'
  },
  {
    id: 'maitrise',
    name: 'Maîtrise de soi',
    kanji: '克',
    romaji: 'Kokufuku',
    animal: '🐢',
    animalName: 'La Tortue Sage',
    color: 'from-green-400 to-emerald-500',
    description: 'La maîtrise de soi permet de contrôler ses émotions et ses réactions.',
    examples: [
      'Respirer calmement pendant le keiko',
      'Ne pas s\'énerver si une technique ne marche pas',
      'Accepter les corrections avec humilité'
    ],
    quote: 'La vraie victoire est la victoire sur soi-même.'
  }
];

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoPageLoading />}>
      <DemoPageContent />
    </Suspense>
  );
}

function DemoPageLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl animate-pulse mx-auto">
          🥋
        </div>
        <p className="text-white font-bold mt-4">Chargement...</p>
      </div>
    </div>
  );
}

function DemoPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string || 'fr';
  
  const section = searchParams.get('section') || 'techniques';
  
  const sections = [
    { id: 'techniques', name: 'Techniques', icon: Swords, color: 'from-cyan-500 to-blue-600' },
    { id: 'defis', name: 'Défis', icon: Target, color: 'from-pink-500 to-rose-600' },
    { id: 'vertus', name: 'Les 7 Vertus', icon: Award, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${locale}`}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </Link>
            <Button
              onClick={() => router.push(`/${locale}/aikido/register`)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              S&apos;inscrire
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 rounded-full mb-4"
          >
            <Play className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Démonstration gratuite</span>
          </motion.div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Découvre le contenu de{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Way of Dojo
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Voici 3 exemples concrets de chaque section. Inscris-toi pour accéder à tout le contenu !
          </p>
        </div>
      </section>

      {/* Navigation des sections */}
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === section;
              return (
                <button
                  key={s.id}
                  onClick={() => router.push(`/${locale}/demo?section=${s.id}`)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${s.color} text-white shadow-lg` 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {section === 'techniques' && (
              <motion.div
                key="techniques"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">3 Techniques d&apos;exemple</h2>
                    <p className="text-slate-400 text-sm">Sur les 214+ techniques disponibles</p>
                  </div>
                </div>
                {demoTechniques.map((tech) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl">
                        {tech.videoPlaceholder}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{tech.name}</h3>
                          <span className="text-cyan-300 text-sm">{tech.japanese}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full">{tech.grade}</span>
                          <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full">{tech.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{tech.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        Points clés
                      </h4>
                      <ul className="space-y-1">
                        {tech.keyPoints.map((point, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="text-slate-400 text-xs">Attaques :</span>
                      {tech.attacks.map((attack, i) => (
                        <span key={i} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                          {attack}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {section === 'defis' && (
              <motion.div
                key="defis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">3 Défis d&apos;exemple</h2>
                    <p className="text-slate-400 text-sm">Sur les 25+ défis disponibles</p>
                  </div>
                </div>
                {demoChallenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl">
                        {challenge.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{challenge.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-pink-500/20 text-pink-300 text-xs px-2 py-0.5 rounded-full">{challenge.type}</span>
                          <span className="bg-amber-500 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            +{challenge.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{challenge.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-pink-400" />
                        Comment faire
                      </h4>
                      <ol className="space-y-2">
                        {challenge.steps.map((step, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-pink-500/30 text-pink-300 text-xs flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                      <p className="text-amber-300 text-sm flex items-start gap-2">
                        <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Conseil :</strong> {challenge.tips}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {section === 'vertus' && (
              <motion.div
                key="vertus"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">3 Vertus d&apos;exemple</h2>
                    <p className="text-slate-400 text-sm">Sur les 7 Vertus du Bushido</p>
                  </div>
                </div>
                {demoVirtues.map((virtue) => (
                  <motion.div
                    key={virtue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700"
                  >
                    <div className={`bg-gradient-to-br ${virtue.color} rounded-xl p-4 mb-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{virtue.animal}</span>
                          <div>
                            <h3 className="text-xl font-bold text-white">{virtue.name}</h3>
                            <p className="text-white/80 text-sm">{virtue.animalName}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-4xl font-bold text-white">{virtue.kanji}</span>
                          <p className="text-white/70 text-xs">{virtue.romaji}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-4">{virtue.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        Exemples au quotidien
                      </h4>
                      <ul className="space-y-1">
                        {virtue.examples.map((example, i) => (
                          <li key={i} className="text-slate-400 text-sm flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-xl p-3">
                      <p className="text-white/80 text-sm italic text-center">&quot;{virtue.quote}&quot;</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-semibold">Contenu limité</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Tu veux voir tout le contenu ?
            </h3>
            <p className="text-slate-400 mb-4">
              Inscris-toi gratuitement pour accéder à 214+ techniques, 25+ défis, les 7 vertus complètes !
            </p>
            <Button
              size="lg"
              onClick={() => router.push(`/${locale}/aikido/register`)}
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-xl shadow-amber-500/30"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Créer mon compte Samouraï
            </Button>
            <p className="text-slate-500 text-xs mt-3">C&apos;est gratuit et ça prend 30 secondes !</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
