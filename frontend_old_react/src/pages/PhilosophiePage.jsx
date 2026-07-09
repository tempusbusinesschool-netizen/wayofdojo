/**
 * 🧘 PAGE PHILOSOPHIE — Les Enseignements de Maître Tanaka
 * 
 * Section dédiée à la dimension philosophique de l'Aïkido
 * Adaptée aux enfants (Jeune Ninja) et aux adultes (Ninja Confirmé)
 * 
 * "En aïkido, on ne combat pas l'autre.
 * On apprend à bien se tenir dans le mouvement du monde."
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Waves, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Heart,
  Wind,
  Mountain,
  Circle,
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import {
  PHILOSOPHIE_PHASES,
  PHILOSOPHIE_DEPLACEMENTS,
  PHILOSOPHIE_TECHNIQUES,
  PHILOSOPHIE_FINAUX,
  TANAKA_SYNTHESE
} from '@/constants/aikidoPhilosophie';

/**
 * Composant de carte philosophique
 */
const PhilosophyCard = ({ 
  title, 
  icon: Icon, 
  metaphore, 
  tanaka, 
  essence,
  audience,
  color = 'amber',
  expandable = true
}) => {
  const [expanded, setExpanded] = useState(false);
  const { speak, speaking } = useTanakaVoice();

  const colorClasses = {
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
  };

  const iconColorClasses = {
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-800/50 ${iconColorClasses[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg">{title}</span>
                {essence && (
                  <p className="text-sm font-normal text-slate-400 mt-0.5">{essence}</p>
                )}
              </div>
            </div>
            {expandable && (
              <button 
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Métaphore */}
          <div className="flex items-start gap-2 mb-4">
            <Waves className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
            <p className="text-blue-200 text-sm italic">{metaphore}</p>
          </div>

          {/* Parole de Tanaka (toujours visible) */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🧘</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-amber-400 text-sm font-semibold">Maître Tanaka</p>
                  <button
                    onClick={() => speak(tanaka)}
                    disabled={speaking}
                    className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
                    title="Écouter"
                  >
                    <Volume2 className={`w-4 h-4 ${speaking ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  </button>
                </div>
                <p className="text-white text-sm leading-relaxed">« {tanaka} »</p>
              </div>
            </div>
          </div>

          {/* Contenu expandable */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-700"
              >
                <p className="text-slate-300 text-sm">
                  {audience === 'enfant' 
                    ? "Retiens cette leçon, jeune ninja. Elle t'accompagnera tout au long de ton chemin."
                    : "Ce principe du budō se pratique sur le tatami comme dans la vie quotidienne."
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Section des 3 phases
 */
const PhasesSection = ({ audience }) => {
  const phases = [
    { 
      key: 'phase1', 
      title: 'Phase 1 — L\'Entrée', 
      icon: ArrowRight, 
      color: 'blue',
      data: PHILOSOPHIE_PHASES.phase1
    },
    { 
      key: 'phase2', 
      title: 'Phase 2 — La Technique', 
      icon: Circle, 
      color: 'amber',
      data: PHILOSOPHIE_PHASES.phase2
    },
    { 
      key: 'phase3', 
      title: 'Phase 3 — Le Final', 
      icon: Shield, 
      color: 'green',
      data: PHILOSOPHIE_PHASES.phase3
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Les 3 Phases du Mouvement</h2>
        <p className="text-slate-400">
          {audience === 'enfant'
            ? "Chaque technique se décompose en trois moments. Comme un voyage !"
            : "Toute technique d'Aïkido suit une structure en trois temps, reflet du cycle naturel de l'action."
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <PhilosophyCard
              title={phase.title}
              icon={phase.icon}
              metaphore={phase.data[audience]?.metaphore}
              tanaka={phase.data[audience]?.tanaka}
              essence={phase.data.principe}
              audience={audience}
              color={phase.color}
              expandable={false}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Section des déplacements
 */
const DeplacementsSection = ({ audience }) => {
  const deplacements = [
    { id: 'irimi', icon: ArrowRight, color: 'blue' },
    { id: 'tenkan', icon: Circle, color: 'purple' },
    { id: 'irimi_tenkan', icon: Wind, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Les Entrées (Tai Sabaki)</h2>
        <p className="text-slate-400">
          {audience === 'enfant'
            ? "Comment tu te déplaces quand quelqu'un vient vers toi ?"
            : "L'entrée est le choix intérieur du pratiquant face au réel."
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {deplacements.map((dep, index) => {
          const data = PHILOSOPHIE_DEPLACEMENTS[dep.id];
          return (
            <motion.div
              key={dep.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <PhilosophyCard
                title={data.nom}
                icon={dep.icon}
                metaphore={data[audience]?.metaphore}
                tanaka={data[audience]?.tanaka}
                essence={data.essence}
                audience={audience}
                color={dep.color}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Section des techniques principales
 */
const TechniquesSection = ({ audience }) => {
  const [selectedCategory, setSelectedCategory] = useState('immobilisations');
  
  const categories = {
    immobilisations: {
      title: 'Immobilisations',
      icon: Shield,
      techniques: ['ikkyo', 'nikyo', 'sankyo', 'yonkyo', 'gokyo']
    },
    projections: {
      title: 'Projections',
      icon: Wind,
      techniques: ['shiho_nage', 'irimi_nage', 'kote_gaeshi', 'kokyu_nage', 'tenchi_nage']
    }
  };

  const currentCategory = categories[selectedCategory];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Les Techniques</h2>
        <p className="text-slate-400">
          {audience === 'enfant'
            ? "Chaque technique a sa propre sagesse. Découvre-les !"
            : "Le cœur du mouvement — où le conflit se transforme en harmonie."
          }
        </p>
      </div>

      {/* Sélecteur de catégorie */}
      <div className="flex justify-center gap-4 mb-6">
        {Object.entries(categories).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${selectedCategory === key
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }
            `}
          >
            <cat.icon className="w-5 h-5" />
            {cat.title}
          </button>
        ))}
      </div>

      {/* Techniques de la catégorie */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="wait">
          {currentCategory.techniques.map((techId, index) => {
            const data = PHILOSOPHIE_TECHNIQUES[techId];
            if (!data) return null;
            
            return (
              <motion.div
                key={techId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <PhilosophyCard
                  title={data.nom}
                  icon={selectedCategory === 'immobilisations' ? Shield : Wind}
                  metaphore={data[audience]?.metaphore}
                  tanaka={data[audience]?.tanaka}
                  essence={data.essence}
                  audience={audience}
                  color={selectedCategory === 'immobilisations' ? 'green' : 'blue'}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * Introduction de Maître Tanaka
 */
const TanakaIntroduction = ({ audience }) => {
  const { speak, speaking } = useTanakaVoice();
  const synthese = TANAKA_SYNTHESE[audience];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 mb-12"
    >
      {/* Décoration de fond */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        {/* Avatar de Tanaka */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full flex items-center justify-center border-2 border-amber-500/30">
            <span className="text-6xl">🧘</span>
          </div>
        </div>
        
        {/* Message */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">
            {audience === 'enfant' ? 'Bienvenue, Jeune Ninja' : 'Les Enseignements du Budō'}
          </h1>
          <p className="text-amber-400 font-medium mb-4">Maître Tanaka</p>
          <p className="text-lg text-slate-300 leading-relaxed mb-4">
            « {synthese.ouverture} »
          </p>
          <Button
            onClick={() => speak(synthese.ouverture)}
            disabled={speaking}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            <Volume2 className={`w-4 h-4 mr-2 ${speaking ? 'animate-pulse' : ''}`} />
            {speaking ? 'Écoute...' : 'Écouter Maître Tanaka'}
          </Button>
        </div>
      </div>

      {/* Citation centrale */}
      <div className="mt-8 text-center">
        <blockquote className="text-xl italic text-blue-200 border-l-4 border-blue-500 pl-4 inline-block text-left">
          {audience === 'enfant'
            ? "Quand quelqu'un pousse fort, tu apprends à guider comme l'eau."
            : "En aïkido, on ne combat pas l'autre. On apprend à bien se tenir dans le mouvement du monde."
          }
        </blockquote>
      </div>
    </motion.div>
  );
};

/**
 * Page principale de la philosophie
 */
const PhilosophiePage = ({ isChildMode = true }) => {
  const [audience, setAudience] = useState(isChildMode ? 'enfant' : 'adulte');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Sélecteur d'audience */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-xl p-1 inline-flex">
            <button
              onClick={() => setAudience('enfant')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                audience === 'enfant'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🥷 Jeune Ninja
            </button>
            <button
              onClick={() => setAudience('adulte')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                audience === 'adulte'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🥋 Ninja Confirmé
            </button>
          </div>
        </div>

        {/* Introduction */}
        <TanakaIntroduction audience={audience} />

        {/* Onglets de contenu */}
        <Tabs defaultValue="phases" className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full max-w-lg mx-auto bg-slate-800">
            <TabsTrigger value="phases" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Les 3 Phases
            </TabsTrigger>
            <TabsTrigger value="deplacements" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Les Entrées
            </TabsTrigger>
            <TabsTrigger value="techniques" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              Les Techniques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phases">
            <PhasesSection audience={audience} />
          </TabsContent>

          <TabsContent value="deplacements">
            <DeplacementsSection audience={audience} />
          </TabsContent>

          <TabsContent value="techniques">
            <TechniquesSection audience={audience} />
          </TabsContent>
        </Tabs>

        {/* Citation de fermeture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <p className="text-amber-400 font-medium mb-2">Maître Tanaka</p>
            <p className="text-xl text-white italic">
              « {TANAKA_SYNTHESE[audience].fermeture} »
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PhilosophiePage;
export { PhilosophiePage, TanakaIntroduction, PhilosophyCard };
