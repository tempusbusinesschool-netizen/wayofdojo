/**
 * 🎬 ANIMATIONS DEMO VIEWER
 * 
 * Page de visualisation des animations de techniques d'Aïkido
 * Permet de tester et corriger les animations SVG/CSS
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Sparkles, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IkkyoAnimation from '@/components/animations/IkkyoAnimation';

// Liste des animations disponibles
const ANIMATIONS_LIST = [
  {
    id: 'ikkyo',
    name: 'Ikkyo',
    japanese: '一教',
    grade: '6e Kyu',
    description: 'Première immobilisation - Contrôle du coude',
    status: 'ready',
    component: IkkyoAnimation
  },
  {
    id: 'nikyo',
    name: 'Nikyo',
    japanese: '二教',
    grade: '5e Kyu',
    description: 'Deuxième immobilisation - Clé de poignet',
    status: 'planned'
  },
  {
    id: 'sankyo',
    name: 'Sankyo',
    japanese: '三教',
    grade: '4e Kyu',
    description: 'Troisième immobilisation - Torsion spirale',
    status: 'planned'
  },
  {
    id: 'yonkyo',
    name: 'Yonkyo',
    japanese: '四教',
    grade: '3e Kyu',
    description: 'Quatrième immobilisation - Point de pression',
    status: 'planned'
  },
  {
    id: 'shiho_nage',
    name: 'Shiho Nage',
    japanese: '四方投',
    grade: '5e Kyu',
    description: 'Projection dans les quatre directions',
    status: 'planned'
  },
  {
    id: 'irimi_nage',
    name: 'Irimi Nage',
    japanese: '入身投',
    grade: '4e Kyu',
    description: 'Projection par entrée',
    status: 'planned'
  },
  {
    id: 'kote_gaeshi',
    name: 'Kote Gaeshi',
    japanese: '小手返',
    grade: '3e Kyu',
    description: 'Retournement du poignet',
    status: 'planned'
  },
  {
    id: 'tenchi_nage',
    name: 'Tenchi Nage',
    japanese: '天地投',
    grade: '4e Kyu',
    description: 'Projection ciel et terre',
    status: 'planned'
  }
];

/**
 * Carte d'animation dans la grille
 */
const AnimationCard = ({ animation, onSelect, isSelected }) => {
  const statusColors = {
    ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    wip: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    planned: 'bg-slate-500/20 text-slate-400 border-slate-500/50'
  };
  
  const statusLabels = {
    ready: 'Prêt',
    wip: 'En cours',
    planned: 'Planifié'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => animation.status === 'ready' && onSelect(animation)}
      disabled={animation.status !== 'ready'}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected 
          ? 'border-cyan-500 bg-cyan-500/10' 
          : animation.status === 'ready'
            ? 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
            : 'border-slate-700/50 bg-slate-800/30 opacity-60 cursor-not-allowed'
      }`}
      data-testid={`animation-card-${animation.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{animation.japanese}</span>
            <h4 className="font-bold text-white">{animation.name}</h4>
          </div>
          <p className="text-sm text-slate-400 mb-2">{animation.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/50">
              {animation.grade}
            </Badge>
            <Badge variant="outline" className={`text-xs ${statusColors[animation.status]}`}>
              {animation.status === 'ready' && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {statusLabels[animation.status]}
            </Badge>
          </div>
        </div>
        {animation.status === 'ready' && (
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 text-cyan-400" />
          </div>
        )}
      </div>
    </motion.button>
  );
};

/**
 * Composant principal
 */
const AnimationsDemoViewer = () => {
  const [selectedAnimation, setSelectedAnimation] = useState(ANIMATIONS_LIST[0]);
  
  const readyCount = ANIMATIONS_LIST.filter(a => a.status === 'ready').length;
  const totalCount = ANIMATIONS_LIST.length;
  
  return (
    <div className="p-6" data-testid="animations-demo-viewer">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            Animations de Techniques
          </h2>
          <p className="text-slate-400 mt-1">
            Visualisation et test des animations SVG/CSS pour les techniques d'Aïkido
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-2xl font-bold text-emerald-400">{readyCount}</span>
            <span className="text-slate-400 text-sm ml-2">/ {totalCount} prêtes</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des animations */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-400" />
            Techniques disponibles
          </h3>
          
          {ANIMATIONS_LIST.map((animation) => (
            <AnimationCard
              key={animation.id}
              animation={animation}
              isSelected={selectedAnimation?.id === animation.id}
              onSelect={setSelectedAnimation}
            />
          ))}
          
          {/* Info */}
          <Card className="bg-slate-800/30 border-slate-700 mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-400">
                  <p className="mb-2">
                    Ces animations sont des <strong className="text-slate-300">aides visuelles pédagogiques</strong>.
                  </p>
                  <p>
                    L'apprentissage réel des techniques se fait au dojo avec un enseignant qualifié.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Zone de prévisualisation */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-full">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-400 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Prévisualisation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[500px]">
              {selectedAnimation?.component ? (
                <selectedAnimation.component 
                  autoPlay={false} 
                  showControls={true}
                  size="lg"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Sélectionnez une animation pour la prévisualiser</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnimationsDemoViewer;
