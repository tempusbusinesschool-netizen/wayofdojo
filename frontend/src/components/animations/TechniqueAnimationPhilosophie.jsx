/**
 * 🥋 ANIMATION TECHNIQUE AVEC PHILOSOPHIE - Zone Enfants & Adultes
 * 
 * Affiche les phases d'une technique d'Aïkido avec illustrations
 * et les enseignements philosophiques de Maître Tanaka.
 * 
 * 3 Phases : Entrée → Technique → Final
 * Chaque phase est accompagnée d'une parole de sagesse adaptée.
 * 
 * ⚠️ Ces animations sont un aide-mémoire.
 * C'est au dojo avec l'enseignant que l'on apprend vraiment les techniques.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { 
  PHILOSOPHIE_PHASES, 
  PHILOSOPHIE_TECHNIQUES, 
  PHILOSOPHIE_DEPLACEMENTS,
  PHILOSOPHIE_FINAUX,
  getTanakaParole 
} from '@/constants/aikidoPhilosophie';

// Données des techniques avec leurs phases illustrées et philosophie
const TECHNIQUES_ANIMEES = {
  ikkyo: {
    id: 'ikkyo',
    name: 'Ikkyo',
    kanji: '一教',
    description: 'Première technique de contrôle',
    combinaison: {
      attaque: 'ai_hanmi_katate_dori',
      deplacement: 'irimi',
      technique: 'ikkyo',
      direction: 'omote',
      final: 'ikkyo_osae',
      finalType: 'immobilisation'
    },
    phases: [
      {
        id: 1,
        phaseKey: 'phase1',
        name: 'Entrée',
        nameTechnique: 'Ai Hanmi Katate Dori + Irimi',
        description: 'Uke saisit le poignet. Tori entre directement.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/67e95d5ef1131a62271c664426a120ff576d7ae9d5597c60503be703c62d23b4.png',
        duration: 5000
      },
      {
        id: 2,
        phaseKey: 'phase2',
        name: 'Technique',
        nameTechnique: 'Ikkyo Omote',
        description: 'Contrôle du coude et du poignet, redirection vers l\'avant.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/9272a2c5596834006483bd12abb8b9b9f4f00db73464326e6aac073d999a0a44.png',
        duration: 5000
      },
      {
        id: 3,
        phaseKey: 'phase3',
        name: 'Final',
        nameTechnique: 'Ikkyo Osae',
        description: 'Immobilisation au sol, contrôle protecteur.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/db1cc880645e66c9061d3a1c418213f0874945ef0c4e9ab89020b3458d12921f.png',
        duration: 5000
      }
    ]
  },
  shiho_nage: {
    id: 'shiho_nage',
    name: 'Shiho Nage',
    kanji: '四方投げ',
    description: 'Projection des quatre directions',
    combinaison: {
      attaque: 'ai_hanmi_katate_dori',
      deplacement: 'tenkan',
      technique: 'shiho_nage',
      direction: 'ura',
      final: 'ushiro_ukemi',
      finalType: 'chute'
    },
    phases: [
      {
        id: 1,
        phaseKey: 'phase1',
        name: 'Entrée',
        nameTechnique: 'Ai Hanmi Katate Dori + Tenkan',
        description: 'Uke saisit le poignet. Tori pivote.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/67e95d5ef1131a62271c664426a120ff576d7ae9d5597c60503be703c62d23b4.png',
        duration: 5000
      },
      {
        id: 2,
        phaseKey: 'phase2',
        name: 'Technique',
        nameTechnique: 'Shiho Nage Ura',
        description: 'Projection par rotation du bras vers l\'arrière.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/9272a2c5596834006483bd12abb8b9b9f4f00db73464326e6aac073d999a0a44.png',
        duration: 5000
      },
      {
        id: 3,
        phaseKey: 'phase3',
        name: 'Final',
        nameTechnique: 'Ushiro Ukemi',
        description: 'Uke chute en arrière, protégé.',
        image: 'https://static.prod-images.emergentagent.com/jobs/51455b90-90be-4e38-bbca-dc798741648e/images/db1cc880645e66c9061d3a1c418213f0874945ef0c4e9ab89020b3458d12921f.png',
        duration: 5000
      }
    ]
  }
};

/**
 * Récupère les paroles de Tanaka pour une phase donnée
 */
const getPhilosophyForPhase = (technique, phaseKey, audience) => {
  const combinaison = technique.combinaison;
  
  if (phaseKey === 'phase1') {
    const deplacement = PHILOSOPHIE_DEPLACEMENTS[combinaison.deplacement];
    return {
      metaphore: PHILOSOPHIE_PHASES.phase1[audience]?.metaphore,
      tanaka: deplacement?.[audience]?.tanaka || PHILOSOPHIE_PHASES.phase1[audience]?.tanaka
    };
  }
  
  if (phaseKey === 'phase2') {
    const tech = PHILOSOPHIE_TECHNIQUES[combinaison.technique];
    return {
      metaphore: PHILOSOPHIE_PHASES.phase2[audience]?.metaphore,
      tanaka: tech?.[audience]?.tanaka || PHILOSOPHIE_PHASES.phase2[audience]?.tanaka
    };
  }
  
  if (phaseKey === 'phase3') {
    const finalType = combinaison.finalType;
    const final = PHILOSOPHIE_FINAUX[finalType];
    return {
      metaphore: PHILOSOPHIE_PHASES.phase3[audience]?.metaphore,
      tanaka: final?.[audience]?.tanaka || PHILOSOPHIE_PHASES.phase3[audience]?.tanaka
    };
  }
  
  return { metaphore: '', tanaka: '' };
};

/**
 * Composant d'affichage de la philosophie
 */
const PhilosophyDisplay = ({ philosophy, audience, isVisible }) => {
  if (!isVisible || !philosophy?.tanaka) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`
        mt-4 p-4 rounded-xl border
        ${audience === 'enfant' 
          ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/30' 
          : 'bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-600/30'
        }
      `}
    >
      {/* Métaphore */}
      <p className={`text-sm italic mb-3 ${audience === 'enfant' ? 'text-blue-200' : 'text-slate-300'}`}>
        🌊 {philosophy.metaphore}
      </p>
      
      {/* Parole de Tanaka */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🧘</span>
        </div>
        <div>
          <p className="text-amber-400 text-xs font-semibold mb-1">Maître Tanaka</p>
          <p className={`text-sm ${audience === 'enfant' ? 'text-white' : 'text-slate-200'}`}>
            « {philosophy.tanaka} »
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant principal d'animation de technique avec philosophie
 */
const TechniqueAnimationPhilosophie = ({ 
  techniqueId = 'ikkyo',
  audience = 'enfant',
  autoPlay = true,
  showControls = true,
  showPhilosophy = true,
  enableVoice = false,
  size = 'lg'
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [voiceEnabled, setVoiceEnabled] = useState(enableVoice);
  const [philosophyVisible, setPhilosophyVisible] = useState(showPhilosophy);
  
  const { speak, speaking, stopSpeaking } = useTanakaVoice();

  const technique = TECHNIQUES_ANIMEES[techniqueId];
  const phases = technique?.phases || [];

  // Philosophie de la phase actuelle
  const currentPhilosophy = useMemo(() => {
    if (!technique || !phases[currentPhase]) return null;
    return getPhilosophyForPhase(technique, phases[currentPhase].phaseKey, audience);
  }, [technique, currentPhase, audience, phases]);

  // Animation automatique
  useEffect(() => {
    if (!isPlaying || !technique) return;

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, phases[currentPhase]?.duration || 5000);

    return () => clearTimeout(timer);
  }, [currentPhase, isPlaying, phases, technique]);

  // Lecture vocale à chaque changement de phase
  useEffect(() => {
    if (voiceEnabled && currentPhilosophy?.tanaka && isPlaying) {
      speak(currentPhilosophy.tanaka);
    }
  }, [currentPhase, voiceEnabled, isPlaying]);

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
    if (speaking) stopSpeaking();
  };

  const nextPhase = () => {
    setCurrentPhase((prev) => (prev + 1) % phases.length);
    if (speaking) stopSpeaking();
  };

  const prevPhase = () => {
    setCurrentPhase((prev) => (prev - 1 + phases.length) % phases.length);
    if (speaking) stopSpeaking();
  };

  const restart = () => {
    setCurrentPhase(0);
    setIsPlaying(true);
    if (speaking) stopSpeaking();
  };

  const toggleVoice = () => {
    if (voiceEnabled && speaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const sizeClasses = {
    sm: 'w-64 h-64',
    md: 'w-80 h-80',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]'
  };

  const phaseColors = {
    phase1: 'from-blue-500 to-cyan-500',
    phase2: 'from-amber-500 to-orange-500',
    phase3: 'from-green-500 to-emerald-500'
  };

  return (
    <div className="flex flex-col items-center">
      {/* En-tête avec nom et kanji */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white">
          {technique.name} <span className="text-slate-400">({technique.kanji})</span>
        </h3>
        <p className="text-slate-400 text-sm">{technique.description}</p>
      </div>

      {/* Zone d'affichage de l'illustration */}
      <div className={`relative ${sizeClasses[size]} bg-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={phases[currentPhase].image}
              alt={`${technique.name} - ${phases[currentPhase].name}`}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay avec le nom de la phase */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`
                    text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${phaseColors[phases[currentPhase].phaseKey]}
                  `}>
                    Phase {currentPhase + 1} — {phases[currentPhase].name}
                  </span>
                  <h4 className="text-white text-lg font-bold mt-2">
                    {phases[currentPhase].nameTechnique}
                  </h4>
                  <p className="text-slate-300 text-sm">
                    {phases[currentPhase].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateur de lecture et voix */}
        <div className="absolute top-3 right-3 flex gap-2">
          {speaking && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-8 h-8 bg-amber-500/80 rounded-full flex items-center justify-center"
            >
              <Volume2 className="w-4 h-4 text-white" />
            </motion.div>
          )}
          {isPlaying && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          )}
        </div>

        {/* Indicateurs de phase */}
        <div className="absolute top-3 left-3 flex gap-1">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentPhase 
                  ? `bg-gradient-to-r ${phaseColors[phase.phaseKey]} shadow-lg` 
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Philosophie de Maître Tanaka */}
      <AnimatePresence mode="wait">
        {philosophyVisible && (
          <PhilosophyDisplay 
            key={currentPhase}
            philosophy={currentPhilosophy} 
            audience={audience}
            isVisible={philosophyVisible}
          />
        )}
      </AnimatePresence>

      {/* Contrôles */}
      {showControls && (
        <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
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

          <div className="w-px h-6 bg-slate-700 mx-2" />

          <Button
            onClick={toggleVoice}
            variant="outline"
            size="sm"
            className={`border-slate-600 ${voiceEnabled ? 'text-amber-400' : 'text-slate-300'}`}
            title={voiceEnabled ? 'Désactiver la voix' : 'Activer la voix'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>

          <Button
            onClick={() => setPhilosophyVisible(!philosophyVisible)}
            variant="outline"
            size="sm"
            className={`border-slate-600 ${philosophyVisible ? 'text-blue-400' : 'text-slate-300'}`}
            title={philosophyVisible ? 'Masquer la philosophie' : 'Afficher la philosophie'}
          >
            <BookOpen className="w-4 h-4" />
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
                ? `bg-gradient-to-r ${phaseColors[phase.phaseKey]} text-white shadow-lg` 
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }
            `}
          >
            {phase.name}
          </button>
        ))}
      </div>

      {/* Rappel pédagogique */}
      <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 max-w-md">
        <p className="text-amber-200 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {audience === 'enfant' 
              ? "Ces illustrations sont un aide-mémoire. C'est au dojo avec ton enseignant que tu apprends vraiment les techniques."
              : "Ces animations illustrent les principes fondamentaux. La pratique au dojo reste essentielle pour une compréhension corporelle."
            }
          </span>
        </p>
      </div>
    </div>
  );
};

/**
 * Modal de démonstration avec philosophie
 */
const TechniquePhilosophieDemo = ({ isOpen, onClose, audience = 'enfant' }) => {
  const [selectedTechnique, setSelectedTechnique] = useState('ikkyo');

  const techniques = Object.values(TECHNIQUES_ANIMEES);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-slate-900 border-slate-700 max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            {audience === 'enfant' ? 'Apprends avec Maître Tanaka' : 'Les Techniques et leur Philosophie'}
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
                {tech.name} ({tech.kanji})
              </button>
            ))}
          </div>

          {/* Animation avec philosophie */}
          <div className="flex justify-center">
            <TechniqueAnimationPhilosophie 
              techniqueId={selectedTechnique}
              audience={audience}
              autoPlay={true}
              showControls={true}
              showPhilosophy={true}
              enableVoice={false}
              size="lg"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { 
  TechniqueAnimationPhilosophie, 
  TechniquePhilosophieDemo, 
  TECHNIQUES_ANIMEES,
  getPhilosophyForPhase 
};
export default TechniqueAnimationPhilosophie;
