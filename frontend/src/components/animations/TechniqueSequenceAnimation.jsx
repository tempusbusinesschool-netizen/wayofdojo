/**
 * 🥋 ANIMATION TECHNIQUE SÉQUENTIELLE - Zone Enfants
 * 
 * Affiche les phases d'une technique d'Aïkido avec illustrations manga/cartoon
 * Animation continue : Entrée → Placement → Final
 * 
 * ⚠️ Ces animations sont un aide-mémoire.
 * C'est au dojo avec l'enseignant que l'enfant apprend vraiment les techniques.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';

// Données des techniques avec leurs phases illustrées
// Illustrations stylisées et génériques - aucune reproduction d'enseignant réel
const TECHNIQUES_DATA = {
  ikkyo: {
    id: 'ikkyo',
    name: 'Ikkyo',
    kanji: '一教',
    description: 'Première technique de contrôle',
    category: 'Katame Waza',
    disclaimer: 'Support de reconnaissance post-dojo uniquement',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        description: 'Tori se positionne face à Uke qui initie le contact',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/e09d21ff31d1eaf3c248f072bfbb36009269b51d5b029bed63946ab515fd11c2.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Placement',
        description: 'Redirection au niveau du coude et du poignet',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/7f50ad7bbedb77928758b255da22de49e67d7bc605617ab31dda39618654ddc5.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Final',
        description: 'Immobilisation au sol, contrôle sécurisé',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/7ea7516b5f884f879be4abfa910f9d7d8f8a8ce465cf29dd270755cbc2d867c3.png',
        duration: 3000
      }
    ]
  }
};

/**
 * Composant principal d'animation de technique
 */
const TechniqueSequenceAnimation = ({ 
  techniqueId = 'ikkyo',
  autoPlay = true,
  showControls = true,
  size = 'lg'
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const technique = TECHNIQUES_DATA[techniqueId];
  const phases = technique?.phases || [];

  // Animation automatique
  useEffect(() => {
    if (!isPlaying || !technique) return;

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, phases[currentPhase]?.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentPhase, isPlaying, phases, technique]);

  // Préchargement des images
  useEffect(() => {
    if (!technique) return;
    
    phases.forEach((phase) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [phase.id]: true }));
      };
      img.src = phase.image;
    });
  }, [phases, technique]);

  if (!technique) {
    return <div className="text-red-400">Technique non trouvée</div>;
  }

  const goToPhase = (index) => {
    setCurrentPhase(index);
  };

  const nextPhase = () => {
    setCurrentPhase((prev) => (prev + 1) % phases.length);
  };

  const prevPhase = () => {
    setCurrentPhase((prev) => (prev - 1 + phases.length) % phases.length);
  };

  const restart = () => {
    setCurrentPhase(0);
    setIsPlaying(true);
  };

  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]'
  };

  return (
    <div className="flex flex-col items-center">
      {/* Zone d'affichage de l'illustration */}
      <div className={`relative ${sizeClasses[size]} bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={phases[currentPhase].image}
              alt={`${technique.name} - ${phases[currentPhase].name}`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay avec le nom de la phase */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-amber-400 text-sm font-bold">
                    Phase {currentPhase + 1}/{phases.length}
                  </span>
                  <h4 className="text-white text-lg font-bold">
                    {phases[currentPhase].name}
                  </h4>
                </div>
                <div className="flex gap-1">
                  {phases.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentPhase ? 'bg-amber-400' : 'bg-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateur de lecture */}
        {isPlaying && (
          <div className="absolute top-3 right-3">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          </div>
        )}
      </div>

      {/* Informations sur la phase */}
      <div className="mt-4 text-center max-w-md">
        <h3 className="text-xl font-bold text-white">
          {technique.name} <span className="text-slate-400">({technique.kanji})</span>
        </h3>
        <p className="text-amber-400 text-sm mt-1">{phases[currentPhase].name}</p>
        <p className="text-slate-400 text-sm mt-2">
          {phases[currentPhase].description}
        </p>
      </div>

      {/* Contrôles */}
      {showControls && (
        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={prevPhase}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            className="border-slate-600 text-slate-300 px-4"
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
            onClick={restart}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            onClick={nextPhase}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Indicateurs de phase cliquables */}
      <div className="flex gap-2 mt-4">
        {phases.map((phase, idx) => (
          <button
            key={phase.id}
            onClick={() => goToPhase(idx)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all
              ${idx === currentPhase 
                ? 'bg-amber-500 text-black' 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }
            `}
          >
            {phase.name}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Modal de démonstration des techniques séquentielles
 */
const TechniqueSequenceDemo = ({ isOpen, onClose }) => {
  const [selectedTechnique, setSelectedTechnique] = useState('ikkyo');

  const techniques = Object.values(TECHNIQUES_DATA);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            Animation des Techniques
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sélecteur de technique */}
          <div className="flex gap-2 justify-center flex-wrap">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnique(tech.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${selectedTechnique === tech.id 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }
                `}
              >
                {tech.name}
              </button>
            ))}
          </div>

          {/* Animation */}
          <div className="flex justify-center">
            <TechniqueSequenceAnimation 
              techniqueId={selectedTechnique}
              autoPlay={true}
              showControls={true}
              size="lg"
            />
          </div>

          {/* Rappel pédagogique */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-amber-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Support de reconnaissance uniquement.</strong> Cette animation stylisée 
                t'aide à te souvenir de ce que tu as vu au dojo. Ce n'est pas un modèle à imiter. 
                Seul ton enseignant peut te montrer la technique correctement.
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { TechniqueSequenceAnimation, TechniqueSequenceDemo, TECHNIQUES_DATA };
export default TechniqueSequenceAnimation;
