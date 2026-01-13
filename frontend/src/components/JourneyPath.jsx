import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Lock, CheckCircle2, Play, Star, 
  Sparkles, Target, Trophy, Gift, Flame, Rocket,
  Heart, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { playTanakaPhrase } from '@/services/tanakaVoiceService';

// Image de Maître Tanaka
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * JourneyPath - Parcours de jeu ludique et guidé pour les nouveaux utilisateurs
 * 4 étapes progressives pour découvrir l'application
 * Guidé par Maître Tanaka !
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
    unlockCondition: 'always',
    xpReward: 10,
    description: 'Bienvenue dans ton aventure Aikido ! Ici tu vas apprendre, progresser et devenir un vrai Ninja.',
    tanakaMessage: "Bienvenue dans mon dojo virtuel, jeune ninja ! 🥋 Je suis Maître Tanaka et je serai ton guide sur la Voie de l'Aïkido. Ensemble, nous allons découvrir les secrets des grands maîtres !",
    tanakaAudioKey: 'welcome',
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
    tanakaMessage: "Ho ho ho ! Les défis quotidiens sont le cœur de ton entraînement, jeune ninja ! Chaque défi accompli te rapproche de la maîtrise. N'oublie pas : la persévérance est la clé ! 💪",
    tanakaAudioKey: 'encouragement',
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
    tanakaMessage: "Ah, les 7 Vertus du Ninja... 🙏 Ce sont les piliers de notre art ! Le Respect, la Persévérance, la Maîtrise de soi, l'Humilité, la Bienveillance, l'Attention et la Responsabilité. Médite sur ces valeurs, jeune disciple !",
    tanakaAudioKey: 'wisdom',
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
    tanakaMessage: "Félicitations, jeune ninja ! 🎉 Tu as parcouru tout le chemin de l'initiation ! Maintenant, ta véritable aventure commence. Regarde ta progression grandir et vise la ceinture noire ! Je crois en toi ! 🥋✨",
    tanakaAudioKey: 'congratulations',
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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Vérifie si une étape est débloquée
  const isStepUnlocked = (step) => {
    if (step.unlockCondition === 'always') return true;
    const requiredStep = parseInt(step.unlockCondition.replace('step_', '').replace('_completed', ''));
    return completedSteps.includes(requiredStep);
  };

  // Vérifie si une étape est complétée
  const isStepCompleted = (stepId) => completedSteps.includes(stepId);

  // Jouer l'audio de Tanaka
  const playTanakaAudio = async (audioKey) => {
    if (isPlayingAudio) return;
    try {
      setIsPlayingAudio(true);
      const result = await playTanakaPhrase(audioKey);
      if (result?.audio) {
        result.audio.onended = () => setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(false);
      }
    } catch (error) {
      console.error('Error playing Tanaka audio:', error);
      setIsPlayingAudio(false);
    }
  };

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

  // Trouver l'étape actuelle (première non complétée)
  const currentActiveStep = JOURNEY_STEPS.find(step => !isStepCompleted(step.id)) || JOURNEY_STEPS[JOURNEY_STEPS.length - 1];
  const allCompleted = completedSteps.length >= JOURNEY_STEPS.length;

  return (
    <div className="w-full" data-testid="journey-path">
      
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* GROS BLOC DE DÉMARRAGE - Étape actuelle avec Tanaka */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden rounded-3xl mb-8 ${
          allCompleted 
            ? 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600' 
            : `bg-gradient-to-br ${currentActiveStep.gradient}`
        } shadow-2xl`}
      >
        {/* Effets de fond */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            {/* GROS NUMÉRO D'ÉTAPE */}
            <div className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                {/* Cercle avec numéro */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center shadow-2xl">
                  {allCompleted ? (
                    <div className="text-center">
                      <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto" />
                      <span className="text-white text-xs font-bold">TERMINÉ</span>
                    </div>
                  ) : (
                    <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-lg">
                      {currentActiveStep.id}
                    </span>
                  )}
                </div>
                
                {/* Badge XP */}
                {!allCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg"
                  >
                    <Star className="w-4 h-4" />
                    +{currentActiveStep.xpReward} XP
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge étape */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full mb-3"
              >
                <span className="text-white/90 text-sm font-semibold">
                  {allCompleted ? '🎉 Parcours Complété !' : `Étape ${currentActiveStep.id} sur ${JOURNEY_STEPS.length}`}
                </span>
              </motion.div>

              {/* Titre */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 drop-shadow-lg"
              >
                {allCompleted ? 'Bravo ' + userName + ' !' : currentActiveStep.title}
              </motion.h2>

              {/* Sous-titre */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-lg sm:text-xl mb-4"
              >
                {allCompleted 
                  ? 'Tu as complété tout le parcours d\'initiation ! 🏆' 
                  : currentActiveStep.subtitle}
              </motion.p>

              {/* Bouton d'action */}
              {!allCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => handleStepClick(currentActiveStep)}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Commencer cette étape
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* MAÎTRE TANAKA */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex-shrink-0 relative"
            >
              {/* Cercle lumineux derrière Tanaka */}
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl scale-110" />
              
              <div className="relative">
                {/* Portrait de Tanaka */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-amber-400/50 shadow-2xl shadow-amber-500/30">
                  <img 
                    src={TANAKA_IMAGE} 
                    alt="Maître Tanaka" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-5xl">🥋</div>';
                    }}
                  />
                </div>
                
                {/* Badge Maître Tanaka */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-4 py-1 rounded-full font-bold text-sm whitespace-nowrap shadow-lg">
                  Maître Tanaka
                </div>
              </div>
            </motion.div>
          </div>

          {/* Message de Tanaka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/50">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.outerHTML = '<div class="w-full h-full bg-amber-500 flex items-center justify-center text-lg">🥋</div>'; }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-amber-300 font-semibold text-sm">Maître Tanaka dit :</span>
                  <button
                    onClick={() => playTanakaAudio(currentActiveStep.tanakaAudioKey || 'welcome')}
                    disabled={isPlayingAudio}
                    className="text-amber-300/70 hover:text-amber-200 transition-colors disabled:opacity-50"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
                <p className="text-white/90 text-sm sm:text-base italic leading-relaxed">
                  "{allCompleted 
                    ? `Félicitations ${userName} ! Tu as parcouru tout le chemin de l'initiation ! Ta véritable aventure de Ninja commence maintenant ! 🥋✨`
                    : currentActiveStep.tanakaMessage}"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* BARRE DE PROGRESSION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-violet-500/30 mb-3"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 font-semibold text-sm">Ton Parcours en {JOURNEY_STEPS.length} étapes</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </motion.div>
        </div>
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

      {/* Grille des étapes - 4 colonnes sur desktop, 2 sur mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
            <DialogContent className="sm:max-w-lg p-0 bg-slate-900 border-slate-700 overflow-hidden">
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
                
                {/* Message de Maître Tanaka */}
                {selectedStep.tanakaMessage && (
                  <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-4 border border-amber-500/30">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                        <img 
                          src={TANAKA_IMAGE} 
                          alt="Maître Tanaka" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl">🥋</div>';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber-400 font-semibold text-sm">Maître Tanaka</span>
                          <button
                            onClick={() => playTanakaAudio(selectedStep.tanakaAudioKey)}
                            disabled={isPlayingAudio}
                            className="text-amber-400/70 hover:text-amber-300 transition-colors disabled:opacity-50"
                            title="Écouter"
                          >
                            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                          </button>
                        </div>
                        <p className="text-amber-100 text-sm leading-relaxed italic">
                          "{selectedStep.tanakaMessage}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
