import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  ChevronRight, ChevronLeft, X, Sparkles, Target, Trophy, 
  Flame, Star, CheckCircle2, HelpCircle, Lightbulb, Rocket
} from 'lucide-react';

/**
 * GuidedTour - Système de guidage interactif pour les utilisateurs
 * Fenêtres modales qui expliquent chaque section de l'application
 */

// Étapes du tutoriel
const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue sur Aikido@Game ! 🥋',
    emoji: '👋',
    content: (
      <div className="space-y-4">
        <p className="text-lg">
          Félicitations pour ton inscription ! Tu es maintenant un <strong className="text-emerald-400">Jeune Ninja</strong> prêt à commencer son aventure.
        </p>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-300">
            Ce guide va t'expliquer comment utiliser l'application pour progresser et devenir un <strong className="text-amber-400">Maître de l'Aïkido</strong> !
          </p>
        </div>
        <div className="flex justify-center gap-4 text-4xl">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🥋</span>
          <span className="animate-bounce" style={{ animationDelay: '100ms' }}>⭐</span>
          <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🏆</span>
        </div>
      </div>
    ),
    gradient: 'from-violet-600 to-purple-600'
  },
  {
    id: 'dashboard',
    title: 'Ton Tableau de Bord 📊',
    emoji: '📊',
    content: (
      <div className="space-y-4">
        <p>
          C'est ici que tu peux voir ta <strong className="text-cyan-400">progression</strong> en temps réel :
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-600/20 rounded-lg p-3 border border-emerald-500/30">
            <Trophy className="w-6 h-6 text-emerald-400 mb-1" />
            <p className="text-sm font-bold text-emerald-400">Progression</p>
            <p className="text-xs text-slate-400">Techniques que tu maîtrises parfaitement</p>
          </div>
          <div className="bg-cyan-600/20 rounded-lg p-3 border border-cyan-500/30">
            <Target className="w-6 h-6 text-cyan-400 mb-1" />
            <p className="text-sm font-bold text-cyan-400">Techniques enseignées au Dojo</p>
            <p className="text-xs text-slate-400">Techniques que tu as déjà travaillées</p>
          </div>
          <div className="bg-violet-600/20 rounded-lg p-3 border border-violet-500/30">
            <Sparkles className="w-6 h-6 text-violet-400 mb-1" />
            <p className="text-sm font-bold text-violet-400">En cours</p>
            <p className="text-xs text-slate-400">Techniques en apprentissage</p>
          </div>
          <div className="bg-amber-600/20 rounded-lg p-3 border border-amber-500/30">
            <Star className="w-6 h-6 text-amber-400 mb-1" />
            <p className="text-sm font-bold text-amber-400">Points</p>
            <p className="text-xs text-slate-400">Tes points gagnés</p>
          </div>
        </div>
      </div>
    ),
    gradient: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'challenges',
    title: 'Les Défis du Jour 🎯',
    emoji: '🎯',
    content: (
      <div className="space-y-4">
        <p>
          Chaque jour, tu as <strong className="text-pink-400">5 défis</strong> à relever pour gagner des points !
        </p>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☯️</span>
            <div>
              <p className="font-bold text-white">Défis des Vertus</p>
              <p className="text-xs text-slate-400">Respect, Courage, Bienveillance...</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥋</span>
            <div>
              <p className="font-bold text-white">Défis Techniques</p>
              <p className="text-xs text-slate-400">Tai Sabaki, Chutes, Mouvements...</p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-600/20 rounded-lg p-3 border border-emerald-500/30 text-center">
          <p className="text-emerald-300 font-bold">
            💡 Clique sur "J'ai fait !" quand tu as terminé un défi
          </p>
        </div>
      </div>
    ),
    gradient: 'from-pink-600 to-rose-600'
  },
  {
    id: 'validation',
    title: 'Validation par les Parents ✅',
    emoji: '👨‍👩‍👧',
    content: (
      <div className="space-y-4">
        <p>
          Quand tu cliques sur <strong className="text-amber-400">"J'ai fait !"</strong>, tes parents reçoivent une notification pour <strong className="text-emerald-400">valider</strong> ton défi.
        </p>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">1️⃣</span>
                <p className="text-sm text-white">Tu fais le défi au dojo</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">2️⃣</span>
                <p className="text-sm text-white">Tu cliques "J'ai fait !"</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">3️⃣</span>
                <p className="text-sm text-amber-400">En attente de validation...</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">4️⃣</span>
                <p className="text-sm text-emerald-400">Parents valident ✅ = Points gagnés !</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    gradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'progression',
    title: 'Ta Progression 📈',
    emoji: '🚀',
    content: (
      <div className="space-y-4">
        <p>
          Plus tu gagnes de <strong className="text-amber-400">points</strong>, plus tu progresses vers le <strong className="text-cyan-400">prochain grade</strong> !
        </p>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">⚪</span>
                <span className="text-white">6e KYU</span>
              </span>
              <span className="text-slate-400">0 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">🟡</span>
                <span className="text-white">5e KYU</span>
              </span>
              <span className="text-yellow-400">10 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="text-xl">🟠</span>
                <span className="text-white">4e KYU</span>
              </span>
              <span className="text-orange-400">30 pts</span>
            </div>
            <div className="flex items-center justify-between opacity-50">
              <span className="flex items-center gap-2">
                <span className="text-xl">⚫</span>
                <span className="text-white">SHODAN</span>
              </span>
              <span className="text-slate-400">200+ pts</span>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-400 text-sm">
          🐉 Le Dragon Maître t'attend au sommet !
        </p>
      </div>
    ),
    gradient: 'from-amber-600 to-orange-600'
  },
  {
    id: 'ready',
    title: 'Tu es prêt ! 🎉',
    emoji: '🥷',
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">🎊</div>
        <p className="text-lg">
          Tu connais maintenant tout ce qu'il faut pour commencer ton <strong className="text-violet-400">aventure ninja</strong> !
        </p>
        <div className="bg-gradient-to-r from-violet-600/20 via-pink-600/20 to-amber-600/20 rounded-xl p-4 border border-violet-500/30">
          <p className="text-white font-bold mb-2">🎯 Ton premier défi :</p>
          <p className="text-slate-300">
            Complète ton <strong className="text-emerald-400">premier défi du jour</strong> et gagne tes premiers points !
          </p>
        </div>
        <div className="flex justify-center gap-2 text-3xl mt-4">
          <span>💪</span>
          <span>🔥</span>
          <span>⭐</span>
          <span>🏆</span>
          <span>👑</span>
        </div>
      </div>
    ),
    gradient: 'from-violet-600 via-pink-600 to-amber-600'
  }
];

const GuidedTour = ({ 
  isOpen, 
  onClose, 
  onComplete,
  userName = "Ninja" 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('aikido_tour_completed', 'true');
    setHasSeenTour(true);
    onComplete?.();
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('aikido_tour_completed', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 bg-slate-900 border-slate-700 overflow-hidden">
        {/* Header avec gradient */}
        <div className={`bg-gradient-to-r ${step.gradient} p-6 relative`}>
          {/* Bouton fermer */}
          <button 
            onClick={handleSkip}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Indicateur de progression */}
          <div className="flex gap-1.5 mb-4">
            {TOUR_STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          {/* Titre */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{step.emoji}</span>
            <h2 className="text-xl font-bold text-white">{step.title}</h2>
          </div>
          
          {/* Numéro d'étape */}
          <div className="absolute bottom-3 right-3 bg-black/20 px-2 py-1 rounded-full">
            <span className="text-white/80 text-xs font-bold">
              {currentStep + 1} / {TOUR_STEPS.length}
            </span>
          </div>
        </div>
        
        {/* Contenu */}
        <div className="p-6 text-slate-300">
          {step.content}
        </div>
        
        {/* Footer avec navigation */}
        <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={isFirstStep}
            className="text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </Button>
          
          <Button
            onClick={handleNext}
            className={`bg-gradient-to-r ${step.gradient} hover:opacity-90 text-white font-bold px-6`}
          >
            {isLastStep ? (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                C'est parti !
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * TourTriggerButton - Bouton pour relancer le tutoriel
 */
export const TourTriggerButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    size="sm"
    className="text-slate-400 hover:text-white hover:bg-slate-800"
  >
    <HelpCircle className="w-4 h-4 mr-1" />
    <span className="hidden sm:inline">Aide</span>
  </Button>
);

/**
 * QuickTip - Bulle d'aide contextuelle
 */
export const QuickTip = ({ children, tip, position = 'top' }) => {
  const [showTip, setShowTip] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      {children}
      {showTip && (
        <div className={`absolute ${positionClasses[position]} z-50 animate-fadeIn`}>
          <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-slate-700 max-w-[200px]">
            <Lightbulb className="w-3 h-3 text-amber-400 inline mr-1" />
            {tip}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedTour;
