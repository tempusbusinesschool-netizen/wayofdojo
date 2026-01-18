/**
 * 🥋 ANIMATION TECHNIQUE SÉQUENTIELLE - Zone Enfants
 * 
 * Affiche les phases d'une technique d'Aïkido avec illustrations manga/cartoon
 * Animation continue : Entrée → Contrôle → Final/Projection
 * 
 * ⚠️ Ces animations sont un aide-mémoire.
 * C'est au dojo avec l'enseignant que l'enfant apprend vraiment les techniques.
 * 
 * Techniques disponibles :
 * - Ikkyo (1ère immobilisation)
 * - Nikyo (2ème immobilisation)
 * - Sankyo (3ème immobilisation)
 * - Irimi Nage (Projection en entrant)
 * - Shiho Nage (Projection 4 directions)
 * - Kote Gaeshi (Retournement du poignet)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info, X } from 'lucide-react';

/**
 * 📚 BASE DE DONNÉES DES TECHNIQUES AVEC ILLUSTRATIONS
 * Chaque technique a 3 phases : Entrée → Contrôle → Final/Projection
 */
const TECHNIQUES_DATA = {
  // ═══════════════════════════════════════════════════════════════════════════
  // IKKYO - Première immobilisation (一教)
  // ═══════════════════════════════════════════════════════════════════════════
  ikkyo: {
    id: 'ikkyo',
    name: 'Ikkyo',
    kanji: '一教',
    meaning: 'Premier enseignement',
    description: 'Première technique de contrôle - Immobilisation par le coude et le poignet',
    category: 'Katame Waza (Immobilisation)',
    kyu: '5e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Tori reçoit l\'attaque (shomen uchi) et entre sur le côté',
        tip: 'Entre sur le côté de Uke, jamais face à l\'attaque',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/eff458337d2e9e4f0fced4478378b125665152134870e28607f9d630d7b0a97d.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Osae',
        description: 'Contrôle du coude et du poignet, guide Uke vers le sol',
        tip: 'Le coude de Uke reste plié, guide en cercle vers le bas',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/2ab24714f7d429a0775479d0bcfdea91695c663e583623010b0520fc5e52c593.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Immobilisation',
        japanese: 'Osae Waza',
        description: 'Uke est face au sol, bras contrôlé et étendu',
        tip: 'Reste en posture stable, contrôle le poignet et le coude',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/f40334e6b46687e8f5afa923984430e69fa50bfa477bdc69ef8d505051091820.png',
        duration: 3000
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NIKYO - Deuxième immobilisation (二教)
  // ═══════════════════════════════════════════════════════════════════════════
  nikyo: {
    id: 'nikyo',
    name: 'Nikyo',
    kanji: '二教',
    meaning: 'Deuxième enseignement',
    description: 'Deuxième technique de contrôle - Clé de poignet vers l\'intérieur',
    category: 'Katame Waza (Immobilisation)',
    kyu: '4e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Uke saisit le poignet de Tori (katate dori)',
        tip: 'Accepte la saisie, reste détendu',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/3004cf1a0372bcbd9e5f27d5878cabd92b1eb20f783c7a638799b11186fec715.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Nikyo',
        description: 'Rotation du poignet de Uke vers l\'intérieur',
        tip: 'Tourne le poignet en spirale, le coude reste près du corps',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/f1aedc5be317457212bfb6aa3010b3b751fd8d26fc05c304aa24e7eec4df1c47.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Immobilisation',
        japanese: 'Osae Waza',
        description: 'Uke est contrôlé au sol par la clé de poignet',
        tip: 'Maintiens la pression sur le poignet, reste stable',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/a740b3f9ef0e5895d448f3bdbbc642ecef43fe285847b9e7f8eaf1eb8267dcdf.png',
        duration: 3000
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SANKYO - Troisième immobilisation (三教)
  // ═══════════════════════════════════════════════════════════════════════════
  sankyo: {
    id: 'sankyo',
    name: 'Sankyo',
    kanji: '三教',
    meaning: 'Troisième enseignement',
    description: 'Troisième technique de contrôle - Rotation spirale du bras',
    category: 'Katame Waza (Immobilisation)',
    kyu: '4e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Uke saisit le poignet, Tori commence le mouvement rotatif',
        tip: 'Tourne en spirale dès le contact',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/0ff2f7db0e9fd1e54979383ddd9575725b1f3a4a0f123993ef35067512e1f4eb.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Sankyo',
        description: 'Le bras de Uke est tourné en spirale vers le haut',
        tip: 'Uke monte sur la pointe des pieds à cause de la rotation',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/a7d8edf1799be7c2302a1f954638ea70e2ec25ca1b831d174e08a87898bd9952.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Immobilisation',
        japanese: 'Osae Waza',
        description: 'Uke est face au sol, bras en spirale contrôlé',
        tip: 'Garde le contrôle de la spirale jusqu\'au sol',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/676b720838a12c3a875ea37a1c3912fda4602ed286af8532389652303c65bca6.png',
        duration: 3000
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IRIMI NAGE - Projection en entrant (入身投げ)
  // ═══════════════════════════════════════════════════════════════════════════
  irimi_nage: {
    id: 'irimi_nage',
    name: 'Irimi Nage',
    kanji: '入身投げ',
    meaning: 'Projection en entrant',
    description: 'Projection par entrée profonde - Le corps entre derrière Uke',
    category: 'Nage Waza (Projection)',
    kyu: '5e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Tori entre profondément sur le côté/derrière Uke',
        tip: 'Entre au plus près de Uke, comme pour le dépasser',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/fd58b9eb28772df3cc15dbabbd8b46762646086996202beb3e8a7853c78a7442.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Kuzushi',
        description: 'Tori déséquilibre Uke en le guidant en cercle',
        tip: 'Guide Uke avec ton centre (hara), pas avec les bras',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/02dba46ef5df2f6f69f028cdf306e4de953483aedb3efa7e532cf321eab5a8b0.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Projection',
        japanese: 'Nage',
        description: 'Uke est projeté vers l\'arrière par le mouvement d\'entrée',
        tip: 'Continue le mouvement circulaire, Uke tombe naturellement',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/83ecef9cdf6c1e35da89d1458f5fa4755adcfece1952b8a310dffa1468bacaf9.png',
        duration: 3000
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SHIHO NAGE - Projection 4 directions (四方投げ)
  // ═══════════════════════════════════════════════════════════════════════════
  shiho_nage: {
    id: 'shiho_nage',
    name: 'Shiho Nage',
    kanji: '四方投げ',
    meaning: 'Projection quatre directions',
    description: 'Projection par rotation du bras au-dessus de la tête',
    category: 'Nage Waza (Projection)',
    kyu: '3e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Uke saisit le poignet, Tori lève le bras',
        tip: 'Lève ton bras comme pour saluer le ciel',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/054dbbbdfe9cab252c139788607f2fcca1e7e63eed9f83aa02c6cf3c70235e69.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Tenkan',
        description: 'Tori tourne sous le bras de Uke en grand cercle',
        tip: 'Passe sous le bras comme sous une arche',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/14435e90501df8f326178eaa28c5dd3d7a399c3e2e934bc8af64af27e158b177.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Projection',
        japanese: 'Nage',
        description: 'Uke est projeté en arrière, bras contrôlé',
        tip: 'Projette vers le bas et l\'arrière, garde le contrôle du poignet',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/7497a1aedb526fb18bf9f1f5a5ed4d8b58d7a08e72fd9a19fe703a7a9f20feaf.png',
        duration: 3000
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KOTE GAESHI - Retournement du poignet (小手返)
  // ═══════════════════════════════════════════════════════════════════════════
  kote_gaeshi: {
    id: 'kote_gaeshi',
    name: 'Kote Gaeshi',
    kanji: '小手返',
    meaning: 'Retournement du poignet',
    description: 'Projection par rotation externe du poignet de Uke',
    category: 'Nage Waza (Projection)',
    kyu: '2e KYU',
    phases: [
      {
        id: 1,
        name: 'Entrée',
        japanese: 'Irimi',
        description: 'Tori reçoit l\'attaque et saisit la main de Uke',
        tip: 'Saisis la main de Uke, pouce sur le dos de sa main',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/1a065401fb944e19b407bc623ac0ecf41d974dced46eac31a5202370e0cfd0ee.png',
        duration: 3000
      },
      {
        id: 2,
        name: 'Contrôle',
        japanese: 'Kote Gaeshi',
        description: 'Rotation du poignet de Uke vers l\'extérieur',
        tip: 'Tourne le poignet comme si tu ouvrais une porte',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/acf6b9321e80aa0ed2a692b7461545e8578a224fb67af149781319bd9de5060f.png',
        duration: 3000
      },
      {
        id: 3,
        name: 'Projection',
        japanese: 'Nage',
        description: 'Uke fait une chute (ukemi) en se retournant',
        tip: 'Continue la rotation, Uke doit chuter pour protéger son poignet',
        image: 'https://static.prod-images.emergentagent.com/jobs/a3c6276a-ca96-465d-8b64-30d3aca91f29/images/03d792d817cf7c621ed3294ec58e28585b435f39f89e13334e268b1e76f26491.png',
        duration: 3000
      }
    ]
  }
};

// Liste des techniques pour le sélecteur
export const AVAILABLE_TECHNIQUES = Object.values(TECHNIQUES_DATA).map(t => ({
  id: t.id,
  name: t.name,
  kanji: t.kanji,
  kyu: t.kyu,
  category: t.category
}));

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

  // Reset quand la technique change
  useEffect(() => {
    setCurrentPhase(0);
    setIsPlaying(autoPlay);
  }, [techniqueId, autoPlay]);

  if (!technique) {
    return <div className="text-red-400">Technique non trouvée: {techniqueId}</div>;
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
                    Phase {currentPhase + 1}/{phases.length} • {phases[currentPhase].japanese}
                  </span>
                  <h4 className="text-white text-lg font-bold">
                    {phases[currentPhase].name}
                  </h4>
                </div>
                <div className="flex gap-1">
                  {phases.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToPhase(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentPhase 
                          ? 'bg-amber-400 scale-125' 
                          : 'bg-slate-600 hover:bg-slate-500'
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

      {/* Informations sur la technique et la phase */}
      <div className="mt-4 text-center max-w-md">
        <h3 className="text-xl font-bold text-white">
          {technique.name} <span className="text-slate-400">({technique.kanji})</span>
        </h3>
        <p className="text-cyan-400 text-xs mt-1">{technique.meaning} • {technique.kyu}</p>
        <p className="text-amber-400 text-sm mt-2 font-medium">{phases[currentPhase].name}</p>
        <p className="text-slate-400 text-sm mt-1">
          {phases[currentPhase].description}
        </p>
        {/* Conseil pédagogique */}
        <div className="mt-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-2">
          <p className="text-emerald-300 text-xs flex items-center gap-1 justify-center">
            <Info className="w-3 h-3" />
            <span className="font-medium">Conseil :</span> {phases[currentPhase].tip}
          </p>
        </div>
      </div>

      {/* Contrôles */}
      {showControls && (
        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={prevPhase}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            size="sm"
            className={`border-slate-600 ${isPlaying ? 'text-amber-400' : 'text-slate-300'} hover:bg-slate-700`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            onClick={restart}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            onClick={nextPhase}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Rappel pédagogique */}
      <p className="mt-4 text-slate-500 text-xs text-center max-w-xs">
        ⚠️ Ces illustrations sont un aide-mémoire. C'est au dojo avec ton enseignant que tu apprends vraiment !
      </p>
    </div>
  );
};

/**
 * Dialog de démonstration avec sélecteur de technique
 */
export const TechniqueSequenceDemo = ({ isOpen, onClose }) => {
  const [selectedTechnique, setSelectedTechnique] = useState('ikkyo');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 p-0 overflow-hidden max-h-[95vh]">
        <DialogHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              🥋 Animation des Techniques
            </DialogTitle>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto">
          {/* Sélecteur de technique */}
          <div className="mb-6">
            <label className="text-slate-400 text-sm mb-2 block">Choisis une technique :</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_TECHNIQUES.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechnique(tech.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedTechnique === tech.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">{tech.name}</div>
                  <div className="text-xs opacity-70">{tech.kanji}</div>
                  <div className="text-xs opacity-50 mt-1">{tech.kyu}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Animation */}
          <TechniqueSequenceAnimation 
            techniqueId={selectedTechnique}
            autoPlay={true}
            showControls={true}
            size="lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniqueSequenceAnimation;
