import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Lock, CheckCircle2, Play, Star, 
  Sparkles, Target, Trophy, Gift, Flame, Rocket,
  BookOpen, Users, Award, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

/**
 * JourneyPath - Parcours de jeu ludique et guidé pour les nouveaux utilisateurs
 * 4 étapes progressives pour découvrir l'application
 */

const JOURNEY_STEPS = [
  {
    id: 1,
    slug: 'bienvenue',
    title: 'Bienvenue !',
    subtitle: 'Découvre ton espace',
    emoji: '👋',
    icon: Rocket,
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/40',
    unlockCondition: 'always', // Toujours débloqué
    xpReward: 10,
    description: 'Bienvenue dans ton aventure Aikido ! Ici tu vas apprendre, progresser et devenir un vrai Ninja.',
    actions: [
      { label: 'Explorer le tableau de bord', type: 'navigate', target: 'dashboard' },
    ],
    tips: [
      '🎯 Ton objectif : gagner des points en pratiquant',
      '📊 Ici tu vois ta progression en temps réel',
      '🔥 Plus tu pratiques, plus tu montes de grade !'
    ]
  },
  {
    id: 2,
    slug: 'defis',
    title: 'Mes Défis',
    subtitle: 'Relève les défis quotidiens',
    emoji: '🎯',
    icon: Target,
    gradient: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/40',
    unlockCondition: 'step_1_completed',
    xpReward: 20,
    description: 'Chaque jour, tu as des défis à relever ! Complète-les pour gagner des points et progresser.',
    actions: [
      { label: 'Voir mes défis', type: 'navigate', target: 'defis' },
    ],
    tips: [
      '⭐ Des défis variés à compléter chaque jour',
      '👨‍👩‍👧 Tes parents peuvent valider tes défis',
      '🏆 Gagne des points à chaque défi validé !'
    ]
  },
  {
    id: 3,
    slug: 'vertus',
    title: 'Les 7 Vertus',
    subtitle: 'Cultive les valeurs du Ninja',
    emoji: '☯️',
    icon: Heart,
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/40',
    unlockCondition: 'step_2_completed',
    xpReward: 25,
    description: 'L\'Aikido, c\'est plus que des techniques ! Découvre les 7 vertus qui font un vrai Ninja.',
    actions: [
      { label: 'Découvrir les vertus', type: 'navigate', target: 'vertus' },
    ],
    tips: [
      '🙏 Respect, Courage, Bienveillance...',
      '💪 Chaque vertu te donne des super-pouvoirs',
      '🌟 Monte de niveau dans chaque vertu !'
    ]
  },
  {
    id: 4,
    slug: 'progression',
    title: 'Ma Progression',
    subtitle: 'Suis ton évolution',
    emoji: '📈',
    icon: Trophy,
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/40',
    unlockCondition: 'step_3_completed',
    xpReward: 30,
    description: 'Tu as découvert les bases ! Maintenant, suis ta progression et monte de ceinture !',
    actions: [
      { label: 'Voir ma progression', type: 'navigate', target: 'profil' },
    ],
    tips: [
      '🥋 Ta ceinture évolue avec tes points',
      '📊 Suis tes statistiques détaillées',
      '👑 Deviens un Maître Ninja !'
    ]
  }
];

const JourneyPath = ({ 
  userName = "Ninja",
  completedSteps = [], // Array of completed step IDs
  currentStep = 1,     // Current active step
  totalPoints = 0,
  onStepClick,         // Callback when user clicks a step
  onNavigate,          // Callback to navigate to a section
  isEnfantMode = true  // Mode enfant ou adulte
}) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepDialog, setShowStepDialog] = useState(false);

  // Vérifie si une étape est débloquée
  const isStepUnlocked = (step) => {
    if (step.unlockCondition === 'always') return true;
    const requiredStep = parseInt(step.unlockCondition.replace('step_', '').replace('_completed', ''));
    return completedSteps.includes(requiredStep);
  };

  // Vérifie si une étape est complétée
  const isStepCompleted = (stepId) => completedSteps.includes(stepId);

  // Ouvre le dialogue d'une étape
  const handleStepClick = (step) => {
    if (isStepUnlocked(step)) {
      setSelectedStep(step);
      setShowStepDialog(true);
      if (onStepClick) onStepClick(step);
    }
  };

  // Navigue vers une section
  const handleAction = (action) => {
    setShowStepDialog(false);
    if (onNavigate && action.type === 'navigate') {
      onNavigate(action.target);
    }
  };

  return (
    <div className="w-full" data-testid="journey-path">
      {/* Titre de section */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-amber-500/30 mb-3"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-amber-300 font-semibold text-sm">Ton Parcours Ninja</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Par où commencer, {userName} ? 🤔
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Suis ce chemin étape par étape pour devenir un vrai Maître Ninja ! 
          Chaque étape te rapporte des points XP ⭐
        </p>
      </div>

      {/* Barre de progression globale */}
      <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            Progression du parcours
          </span>
          <span className="text-amber-400 font-bold">
            {completedSteps.length} / {JOURNEY_STEPS.length} étapes
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.length / JOURNEY_STEPS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-full"
          />
        </div>
      </div>

      {/* Grille des étapes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {JOURNEY_STEPS.map((step, index) => {
          const unlocked = isStepUnlocked(step);
          const completed = isStepCompleted(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleStepClick(step)}
              disabled={!unlocked}
              data-testid={`journey-step-${step.slug}`}
              className={`
                relative group
                aspect-square
                rounded-2xl sm:rounded-3xl
                p-3 sm:p-4
                flex flex-col items-center justify-center
                transition-all duration-300
                overflow-hidden
                ${unlocked 
                  ? `bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadowColor} border-2 border-white/20 hover:border-white/40 hover:scale-105 hover:-translate-y-2 cursor-pointer`
                  : 'bg-slate-800/50 border-2 border-slate-700 cursor-not-allowed opacity-60'
                }
                ${isCurrent && !completed ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-slate-900' : ''}
              `}
            >
              {/* Badge de statut */}
              <div className="absolute top-2 right-2">
                {completed ? (
                  <div className="bg-emerald-500 rounded-full p-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                ) : !unlocked ? (
                  <div className="bg-slate-600 rounded-full p-1">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                ) : isCurrent ? (
                  <div className="bg-amber-500 rounded-full p-1 animate-pulse">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                ) : null}
              </div>

              {/* Numéro d'étape */}
              <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${unlocked ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-500'}`}
              >
                {step.id}
              </div>

              {/* Emoji principal */}
              <span className={`text-4xl sm:text-5xl mb-2 ${!unlocked ? 'grayscale opacity-50' : ''} group-hover:scale-110 transition-transform`}>
                {step.emoji}
              </span>

              {/* Titre */}
              <span className={`font-bold text-center text-xs sm:text-sm ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                {step.title}
              </span>

              {/* Sous-titre */}
              <span className={`text-center text-[10px] sm:text-xs mt-0.5 ${unlocked ? 'text-white/70' : 'text-slate-600'}`}>
                {step.subtitle}
              </span>

              {/* Points XP */}
              {unlocked && !completed && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-500/80 text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  +{step.xpReward} XP
                </div>
              )}

              {/* Effet de brillance au hover */}
              {unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Ligne de connexion entre les étapes (desktop) */}
      <div className="hidden lg:flex items-center justify-center mt-4 px-8">
        <div className="flex-1 h-2 bg-gradient-to-r from-emerald-500 via-pink-500 via-amber-500 via-violet-500 via-cyan-500 to-red-500 rounded-full opacity-60" />
      </div>

      {/* Message d'encouragement */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 bg-gradient-to-r from-violet-600/10 via-pink-600/10 to-amber-600/10 rounded-xl p-4 border border-violet-500/20"
      >
        {completedSteps.length === 0 ? (
          <p className="text-violet-300 font-medium">
            🚀 Clique sur l'étape <strong className="text-emerald-400">1. Bienvenue</strong> pour commencer ton aventure !
          </p>
        ) : completedSteps.length < JOURNEY_STEPS.length ? (
          <p className="text-violet-300 font-medium">
            💪 Super {userName} ! Continue ton parcours, tu es à <strong className="text-amber-400">{Math.round((completedSteps.length / JOURNEY_STEPS.length) * 100)}%</strong> !
          </p>
        ) : (
          <p className="text-emerald-300 font-medium">
            🎉 Félicitations {userName} ! Tu as complété tout le parcours ! Tu es prêt pour l'aventure ! 🏆
          </p>
        )}
      </motion.div>

      {/* Dialog de détail d'une étape */}
      <AnimatePresence>
        {showStepDialog && selectedStep && (
          <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
            <DialogContent className="sm:max-w-md p-0 bg-slate-900 border-slate-700 overflow-hidden">
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${selectedStep.gradient} p-6 relative`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">{selectedStep.emoji}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-white text-xs font-bold">
                        Étape {selectedStep.id}
                      </span>
                      {isStepCompleted(selectedStep.id) && (
                        <span className="bg-emerald-500 px-2 py-0.5 rounded-full text-white text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Complété
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedStep.title}</h2>
                    <p className="text-white/70 text-sm">{selectedStep.subtitle}</p>
                  </div>
                </div>
                
                {/* Récompense XP */}
                <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  +{selectedStep.xpReward} XP
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-4">
                <p className="text-slate-300">{selectedStep.description}</p>

                {/* Tips */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Ce que tu vas apprendre :
                  </h3>
                  <ul className="space-y-2">
                    {selectedStep.tips.map((tip, idx) => (
                      <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selectedStep.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleAction(action)}
                      className={`w-full bg-gradient-to-r ${selectedStep.gradient} hover:opacity-90 text-white font-bold py-3`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyPath;
