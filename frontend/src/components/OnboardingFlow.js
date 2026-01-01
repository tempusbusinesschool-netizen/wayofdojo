import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Swords, BookOpen, User, Building2 } from "lucide-react";

const ONBOARDING_SCREENS = [
  {
    id: 1,
    title: "Bienvenue dans ton parcours Ninja.",
    icon: "🥷",
    content: (
      <div className="text-center space-y-4">
        <p className="text-slate-300 text-lg">
          Un espace personnel pour réviser, progresser et donner du sens à ta pratique,
        </p>
        <p className="text-amber-400 font-semibold text-lg">
          à ton rythme, sans pression, sans évaluation.
        </p>
      </div>
    ),
    gradient: "from-amber-500/20 via-slate-900 to-slate-900"
  },
  {
    id: 2,
    title: "Ce que fait l'application",
    icon: "📚",
    subtitle: "Ici, tu ne passes pas d'examen.\nTu construis ta régularité.",
    content: (
      <div className="space-y-4">
        <ul className="space-y-3 text-left">
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            Révise les techniques que tu pratiques déjà
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            Suis ta progression personnelle
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            Cultive les valeurs de l'aïkido
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-emerald-400">✓</span>
            Reste connecté à ta pratique, même hors du dojo
          </li>
        </ul>
        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <p className="text-blue-300 text-sm italic">
            L'application est un outil de révision et de motivation,<br/>
            elle ne remplace pas l'enseignement de ton professeur.
          </p>
        </div>
      </div>
    ),
    gradient: "from-blue-500/20 via-slate-900 to-slate-900"
  },
  {
    id: 3,
    title: "Ton parcours Ninja est unique.",
    icon: "🎯",
    content: (
      <div className="space-y-4">
        <ul className="space-y-3 text-left">
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-purple-400">◆</span>
            Organisation claire par niveaux indicatifs
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-purple-400">◆</span>
            Journal personnel de pratique
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-purple-400">◆</span>
            Objectifs, régularité, constance
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-purple-400">◆</span>
            Défis communautaires non compétitifs
          </li>
        </ul>
        <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 text-center">
          <p className="text-purple-300 font-semibold">
            Aucune comparaison.<br/>
            Aucune validation officielle.<br/>
            <span className="text-amber-400">Seulement ton chemin.</span>
          </p>
        </div>
      </div>
    ),
    gradient: "from-purple-500/20 via-slate-900 to-slate-900"
  },
  {
    id: 4,
    title: "Clubs & Dojos",
    icon: "🏯",
    subtitle: "Les clubs utilisent l'application autrement.",
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">Les dojos disposent d'un espace dédié pour :</p>
        <ul className="space-y-2 text-left ml-4">
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-cyan-400">•</span>
            gérer leur groupe,
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-cyan-400">•</span>
            suivre l'engagement collectif,
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <span className="text-cyan-400">•</span>
            animer la vie du club.
          </li>
        </ul>
        <div className="mt-6 p-4 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-300 text-sm">
            👉 Les parcours individuels et les espaces dojo sont indépendants.
          </p>
        </div>
      </div>
    ),
    gradient: "from-cyan-500/20 via-slate-900 to-slate-900"
  }
];

function OnboardingFlow({ isOpen, onClose, onComplete }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const screen = ONBOARDING_SCREENS[currentScreen];
  const isLastScreen = currentScreen === ONBOARDING_SCREENS.length - 1;
  const isFirstScreen = currentScreen === 0;
  
  const handleNext = () => {
    if (isLastScreen) {
      onComplete();
    } else {
      setCurrentScreen(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
    if (!isFirstScreen) {
      setCurrentScreen(prev => prev - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-lg bg-gradient-to-b ${screen.gradient} border-2 border-slate-700 text-white p-0 overflow-hidden`}>
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-6">
          {ONBOARDING_SCREENS.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentScreen
                  ? 'w-8 bg-amber-400'
                  : idx < currentScreen
                  ? 'bg-amber-400/50'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="px-8 py-6">
          {/* Icon */}
          <div className="text-center mb-4">
            <span className="text-6xl">{screen.icon}</span>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            {screen.title}
          </h2>
          
          {/* Subtitle */}
          {screen.subtitle && (
            <p className="text-center text-slate-400 mb-6 whitespace-pre-line">
              {screen.subtitle}
            </p>
          )}
          
          {/* Main content */}
          <div className="mb-8">
            {screen.content}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <div>
            {!isFirstScreen ? (
              <Button
                variant="ghost"
                onClick={handlePrev}
                className="text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-300"
              >
                Passer
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-6"
          >
            {isLastScreen ? (
              <>Découvrir les offres</>              
            ) : (
              <>Suivant <ChevronRight className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OnboardingFlow;
