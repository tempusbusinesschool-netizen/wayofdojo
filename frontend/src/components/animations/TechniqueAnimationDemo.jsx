/**
 * 🎬 DÉMO - Animations de techniques d'Aïkido
 * 
 * Page de démonstration des animations disponibles
 * pour les fiches techniques de la zone enfants.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Info } from 'lucide-react';
import { TechniqueAnimation } from './TechniqueAnimation';

const TechniqueAnimationDemo = ({ isOpen, onClose }) => {
  const [selectedTechnique, setSelectedTechnique] = useState('tai_sabaki');
  const [isPlaying, setIsPlaying] = useState(true);

  const techniques = [
    { 
      id: 'tai_sabaki', 
      name: 'Tai Sabaki', 
      kanji: '体捌き',
      description: 'Déplacement du corps. Pivot de 90° pour esquiver.',
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'irimi', 
      name: 'Irimi', 
      kanji: '入身',
      description: 'Entrée directe. Avancer vers le partenaire.',
      color: 'from-emerald-500 to-teal-600'
    },
    { 
      id: 'tenkan', 
      name: 'Tenkan', 
      kanji: '転換',
      description: 'Rotation. Pivot de 180° pour rediriger.',
      color: 'from-purple-500 to-violet-600'
    },
  ];

  const currentTechnique = techniques.find(t => t.id === selectedTechnique);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            Animations des Techniques
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélecteur de technique */}
          <div className="flex gap-2 justify-center">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnique(tech.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${selectedTechnique === tech.id 
                    ? `bg-gradient-to-r ${tech.color} text-white shadow-lg` 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {tech.name}
              </button>
            ))}
          </div>

          {/* Zone d'animation */}
          <div className="flex flex-col items-center">
            <motion.div
              key={selectedTechnique}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700"
            >
              <TechniqueAnimation 
                type={selectedTechnique} 
                size="lg" 
                autoPlay={isPlaying}
                showLabel={false}
              />
            </motion.div>

            {/* Infos technique */}
            <div className="mt-4 text-center">
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${currentTechnique?.color} bg-clip-text text-transparent`}>
                {currentTechnique?.name}
              </h3>
              <p className="text-slate-500 text-lg">{currentTechnique?.kanji}</p>
              <p className="text-slate-400 text-sm mt-2 max-w-md">
                {currentTechnique?.description}
              </p>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Lecture
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                setIsPlaying(false);
                setTimeout(() => setIsPlaying(true), 100);
              }}
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rejouer
            </Button>
          </div>

          {/* Note pédagogique */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Rappel :</strong> Ces animations sont un aide-mémoire. 
                C'est au dojo avec ton enseignant que tu apprends vraiment les techniques.
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniqueAnimationDemo;
