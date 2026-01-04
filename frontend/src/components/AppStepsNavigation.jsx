import React from 'react';
import { User, Target, Swords, Sparkles, BookOpen } from 'lucide-react';

/**
 * AppStepsNavigation - Blocs carrés présentant les étapes de l'application
 * Affiché uniquement pour les utilisateurs connectés en haut de page
 */
const AppStepsNavigation = ({ onStepClick, activeStep = null }) => {
  const steps = [
    {
      id: 'profil',
      icon: User,
      label: 'Mon Profil',
      emoji: '🥷',
      description: 'Ceinture & Stats',
      gradient: 'from-emerald-500 to-teal-600',
      hoverGradient: 'hover:from-emerald-400 hover:to-teal-500',
      shadowColor: 'shadow-emerald-500/30'
    },
    {
      id: 'defis',
      icon: Target,
      label: 'Défis du Jour',
      emoji: '🎯',
      description: '5 défis quotidiens',
      gradient: 'from-pink-500 to-rose-600',
      hoverGradient: 'hover:from-pink-400 hover:to-rose-500',
      shadowColor: 'shadow-pink-500/30'
    },
    {
      id: 'techniques',
      icon: Swords,
      label: 'Techniques',
      emoji: '🥋',
      description: 'Par grade KYU',
      gradient: 'from-cyan-500 to-blue-600',
      hoverGradient: 'hover:from-cyan-400 hover:to-blue-500',
      shadowColor: 'shadow-cyan-500/30'
    },
    {
      id: 'vertus',
      icon: Sparkles,
      label: 'Les Vertus',
      emoji: '☯️',
      description: '7 super-pouvoirs',
      gradient: 'from-violet-500 to-purple-600',
      hoverGradient: 'hover:from-violet-400 hover:to-purple-500',
      shadowColor: 'shadow-violet-500/30'
    },
    {
      id: 'histoire',
      icon: BookOpen,
      label: 'Histoire',
      emoji: '📜',
      description: 'Hakama & O Sensei',
      gradient: 'from-amber-500 to-orange-600',
      hoverGradient: 'hover:from-amber-400 hover:to-orange-500',
      shadowColor: 'shadow-amber-500/30'
    }
  ];

  const handleClick = (stepId) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
    
    // Scroll vers la section correspondante
    const scrollTargets = {
      'profil': 'user-dashboard-blocks',
      'defis': 'progression-tunnel',
      'techniques': 'accordion-entrainement',
      'vertus': 'bloc3-valeurs',
      'histoire': 'accordion-histoire'
    };
    
    const targetId = scrollTargets[stepId];
    if (targetId) {
      const element = document.querySelector(`[data-testid="${targetId}"]`) || 
                      document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="mb-6" data-testid="app-steps-navigation">
      {/* Titre de la section */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-2xl">🗺️</span>
        <h2 className="text-lg font-bold text-white">Mon Parcours Ninja</h2>
        <span className="text-2xl">🗺️</span>
      </div>
      
      {/* Grille des étapes */}
      <div className="grid grid-cols-5 gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => handleClick(step.id)}
              data-testid={`step-${step.id}`}
              className={`
                relative group
                aspect-square
                bg-gradient-to-br ${step.gradient} ${step.hoverGradient}
                rounded-2xl
                p-3
                flex flex-col items-center justify-center
                transition-all duration-300
                hover:scale-105 hover:-translate-y-1
                shadow-lg ${step.shadowColor}
                hover:shadow-xl
                border-2 ${isActive ? 'border-white' : 'border-transparent'}
                cursor-pointer
              `}
            >
              {/* Numéro d'étape */}
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              
              {/* Emoji principal */}
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                {step.emoji}
              </span>
              
              {/* Label */}
              <span className="text-white font-bold text-xs text-center leading-tight">
                {step.label}
              </span>
              
              {/* Description (visible au hover sur desktop) */}
              <span className="text-white/70 text-[10px] text-center hidden sm:block mt-0.5">
                {step.description}
              </span>
              
              {/* Indicateur actif */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Ligne de progression entre les étapes */}
      <div className="hidden sm:flex items-center justify-center mt-3 px-8">
        <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 via-pink-500 via-cyan-500 via-violet-500 to-amber-500 rounded-full opacity-50" />
      </div>
      
      {/* Message d'aide */}
      <p className="text-center text-slate-400 text-xs mt-3">
        👆 Clique sur une étape pour y accéder directement !
      </p>
    </div>
  );
};

export default AppStepsNavigation;
