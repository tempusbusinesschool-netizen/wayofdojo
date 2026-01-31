'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Lock, CheckCircle2, Play, Star, 
  Sparkles, Target, Trophy, Flame,
  Swords, BookOpen, Award
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import StepTransition from './animations/StepTransition';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JourneyPath - Parcours de jeu ludique et guidé pour les utilisateurs CONNECTÉS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STRUCTURE DES 6 ÉTAPES (depuis aikido@game) :
 * 
 * #   Étape           Emoji    Description
 * 1   Mon Profil      🎭       Crée ton Ninja
 * 2   Mes Techniques  📚       Apprends les mouvements  
 * 3   Dojo Virtuel    🎮       Jeux & Validations
 * 4   Ma Pratique     🥋       Mon Carnet de pratique
 * 5   Ma Progression  🌟       Ceintures & Vertus
 * 6   Mes Trophées    🏆       Deviens une Légende !
 */

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE OFFICIELLE DE MAÎTRE TANAKA - VERROUILLÉE
// ═══════════════════════════════════════════════════════════════════════════════
// ⚠️ NE JAMAIS CHANGER CETTE IMAGE - TOUJOURS UTILISER /images/tanaka/portrait.png
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

// Composant réutilisable pour l'avatar de Tanaka
const TanakaAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  return (
    <img 
      src={TANAKA_IMAGE} 
      alt="Maître Tanaka" 
      className={`${sizeClasses[size]} rounded-full object-cover border-2 border-amber-500/50 ${className}`}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6 ÉTAPES DU PARCOURS INTERACTIF
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNEY_STEPS = [
  {
    id: 1,
    slug: 'profil',
    title: 'Mon Profil',
    subtitle: 'Crée ton Ninja',
    emoji: '🎭',
    icon: Sparkles,
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/40',
    unlockCondition: 'always',
    xpReward: 10,
    description: 'Fais connaissance avec Maître Tanaka et crée ton profil de ninja avec ta ceinture et ton animal gardien !',
    tanakaMessage: "Bienvenue dans mon dojo virtuel ! 🥋 Je suis Maître Tanaka. Ensemble, nous allons découvrir les secrets de l'Aïkido. Ton aventure commence maintenant !",
    tanakaAudioKey: 'welcome',
    tips: ['🎯 Découvre ton tableau de bord', '🥋 Ta ceinture actuelle', '🐉 Ton animal gardien']
  },
  {
    id: 2,
    slug: 'techniques',
    title: 'Mes Techniques',
    subtitle: 'Apprends les mouvements',
    emoji: '📚',
    icon: Swords,
    gradient: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-500/40',
    unlockCondition: 'step_1_completed',
    xpReward: 15,
    description: 'Découvre les techniques d\'Aïkido par grade : Tai Sabaki, Ukemi, Ikkyo, Shiho Nage et bien plus !',
    tanakaMessage: "Maintenant, passons aux techniques ! Chaque ceinture a ses propres mouvements à maîtriser. Commence par les bases : les déplacements et les chutes.",
    tanakaAudioKey: 'step_2_techniques',
    tips: ['🦶 Tai Sabaki - Déplacements', '🔄 Ukemi - Chutes', '💪 Ikkyo, Nikyo, Sankyo...', '🌀 Shiho Nage, Irimi Nage...']
  },
  {
    id: 3,
    slug: 'dojo_virtuel',
    title: 'Dojo Virtuel',
    subtitle: 'Jeux & Validations',
    emoji: '🎮',
    icon: Target,
    gradient: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/40',
    unlockCondition: 'step_2_completed',
    xpReward: 20,
    description: 'Joue à des jeux pour développer ton calme et ta concentration. Tes parents valident tes réussites !',
    tanakaMessage: "Bienvenue dans le Dojo Virtuel ! Ici, tu vas jouer à des jeux pour développer ton calme et ta concentration. Quand tu termines un jeu, tes parents diront si tout s'est bien passé !",
    tanakaAudioKey: 'step_3_dojo',
    tips: ['🎮 Jeux de concentration', '🧘 Exercices de calme', '✅ Validations parentales', '✨ Gagne des points']
  },
  {
    id: 4,
    slug: 'carnet_dojo',
    title: 'Ma Pratique',
    subtitle: 'Mon Carnet de pratique',
    emoji: '🥋',
    icon: BookOpen,
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/40',
    unlockCondition: 'step_3_completed',
    xpReward: 20,
    description: 'Note les exercices que tu as faits au vrai dojo. C\'est toi qui valides ta pratique !',
    tanakaMessage: "Après ton cours au dojo, reviens ici pour noter ce que tu as pratiqué ! C'est ton carnet personnel. Ta parole compte, sois honnête avec toi-même !",
    tanakaAudioKey: 'step_4_carnet',
    tips: ['🥋 Note tes exercices', '🙏 Salut au dojo', '🔄 Chutes pratiquées', '🤝 Techniques avec partenaire']
  },
  {
    id: 5,
    slug: 'progression',
    title: 'Ma Progression',
    subtitle: 'Ceintures & Vertus',
    emoji: '🌟',
    icon: Award,
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/40',
    unlockCondition: 'step_4_completed',
    xpReward: 25,
    description: 'Gagne des points XP, fais évoluer tes vertus et tes animaux gardiens ! Monte de ceinture !',
    tanakaMessage: "Tu progresses vite ! Chaque point XP te rapproche de la prochaine ceinture. Continue comme ça et tu deviendras un vrai maître !",
    tanakaAudioKey: 'step_5_progress',
    tips: ['⭐ Points XP', '🥋 Ma ceinture', '💜 Mes qualités', '🐾 Animaux évoluent']
  },
  {
    id: 6,
    slug: 'trophees',
    title: 'Mes Trophées',
    subtitle: 'Deviens une Légende !',
    emoji: '🏆',
    icon: Trophy,
    gradient: 'from-yellow-500 to-amber-600',
    shadowColor: 'shadow-yellow-500/40',
    unlockCondition: 'step_5_completed',
    xpReward: 30,
    description: 'Tu as complété le parcours d\'initiation ! Collectionne les badges, vise le titre de Légende du Dojo !',
    tanakaMessage: "Félicitations, jeune ninja ! Tu as parcouru tout le chemin de l'initiation ! Maintenant, ta véritable aventure commence. Vise le titre de Légende du Dojo !",
    tanakaAudioKey: 'step_6_mastery',
    tips: ['🏆 Badges à collectionner', '👑 Titres spéciaux', '🐉 Dragon légendaire', '🏯 Grand Maître !']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════
interface JourneyPathProps {
  userName?: string;
  completedSteps?: number[];
  totalPoints?: number;
  onStepClick?: (step: typeof JOURNEY_STEPS[0]) => void;
  onStepComplete?: (stepId: number) => void;
  onNavigate?: (target: string) => void;
  onUserNameChange?: (name: string) => void;
  isEnfantMode?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export const JourneyPath: React.FC<JourneyPathProps> = ({
  userName = "",
  completedSteps = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalPoints = 0,
  onStepClick,
  onStepComplete,
  onNavigate,
  onUserNameChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEnfantMode = true
}) => {
  const [selectedStep, setSelectedStep] = useState<typeof JOURNEY_STEPS[0] | null>(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [showStepTransition, setShowStepTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState<typeof JOURNEY_STEPS[0] | null>(null);
  
  // État pour le dialogue d'introduction de Tanaka
  const [showIntroDialog, setShowIntroDialog] = useState(false);
  const [introStep, setIntroStep] = useState(1);
  const [tempUserName, setTempUserName] = useState('');
  const [tanakaAnimating, setTanakaAnimating] = useState(false);
  
  // Prénom enregistré
  const [registeredFirstName, setRegisteredFirstName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('aikido_user_firstname') || '';
    }
    return '';
  });

  // Vérifier si c'est la première visite
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenIntro = localStorage.getItem('aikido_tanaka_intro_seen');
      if (!hasSeenIntro) {
        const timer = setTimeout(() => {
          setShowIntroDialog(true);
          setTanakaAnimating(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Animation de Tanaka
  useEffect(() => {
    if (tanakaAnimating) {
      const timer = setTimeout(() => setTanakaAnimating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [tanakaAnimating]);

  // Vérifie si une étape est débloquée
  const isStepUnlocked = (step: typeof JOURNEY_STEPS[0]) => {
    if (step.unlockCondition === 'always') return true;
    const requiredStep = parseInt(step.unlockCondition.replace('step_', '').replace('_completed', ''));
    return completedSteps.includes(requiredStep);
  };

  // Vérifie si une étape est complétée
  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);

  // Valider le prénom
  const handleNameSubmit = () => {
    if (tempUserName.trim()) {
      const firstName = tempUserName.trim();
      localStorage.setItem('aikido_user_firstname', firstName);
      localStorage.setItem('aikido_tanaka_intro_seen', 'true');
      setRegisteredFirstName(firstName);
      
      if (onUserNameChange) {
        onUserNameChange(firstName);
      }
      setShowIntroDialog(false);
    }
  };

  // Ouvre le dialogue d'une étape
  const handleStepClick = (step: typeof JOURNEY_STEPS[0]) => {
    if (isStepUnlocked(step)) {
      setSelectedStep(step);
      setShowStepDialog(true);
      if (onStepClick) onStepClick(step);
    }
  };

  // Navigue vers une section avec animation de transition
  const handleAction = (target: string) => {
    setShowStepDialog(false);
    
    if (selectedStep && !isStepCompleted(selectedStep.id)) {
      setTransitionStep(selectedStep);
      setShowStepTransition(true);
      
      // IMPORTANT: Timeout de sécurité pour garantir que l'animation se termine
      // même si onComplete ne se déclenche pas correctement
      const safetyTimeout = setTimeout(() => {
        setShowStepTransition(false);
        if (onStepComplete) onStepComplete(selectedStep.id);
        if (onNavigate) onNavigate(target);
      }, 3000); // 3s = légèrement plus que la durée de l'animation (2.5s)
      
      // Stocker le timeout pour pouvoir l'annuler si onComplete se déclenche normalement
      return () => clearTimeout(safetyTimeout);
    } else {
      if (onNavigate) onNavigate(target);
    }
  };

  // Trouver l'étape actuelle
  const currentActiveStep = JOURNEY_STEPS.find(step => !isStepCompleted(step.id)) || JOURNEY_STEPS[JOURNEY_STEPS.length - 1];
  const allCompleted = completedSteps.length >= JOURNEY_STEPS.length;
  const displayName = registeredFirstName || userName || 'Ninja';

  return (
    <div className="w-full space-y-6" data-testid="journey-path">
      
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* DIALOGUE D'INTRODUCTION DE TANAKA - Première visite */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showIntroDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header avec Tanaka - Image officielle VERROUILLÉE */}
              <div className="relative bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 p-6 text-center">
                <motion.div
                  animate={{
                    scale: tanakaAnimating ? [1, 1.05, 1] : 1,
                    rotate: tanakaAnimating ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5, repeat: tanakaAnimating ? 3 : 0 }}
                  className="mb-2 flex justify-center"
                >
                  <img 
                    src={TANAKA_IMAGE} 
                    alt="Maître Tanaka" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/50 shadow-lg"
                  />
                </motion.div>
                <h2 className="text-2xl font-bold text-amber-400">Maître Tanaka</h2>
                <p className="text-amber-200/70 text-sm">Ton guide sur la Voie de l&apos;Aïkido</p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {introStep === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
                      <p className="text-emerald-400 font-bold text-lg mb-3">
                        &quot;Bienvenue jeune Ninja ! 🥋&quot;
                      </p>
                      <p className="text-white/80 text-sm">
                        Je suis <span className="text-amber-400 font-bold">Maître Tanaka</span>, et je serai ton guide sur la Voie de l&apos;Aïkido.
                      </p>
                      <p className="text-white/80 mt-2 text-sm">
                        Ensemble, nous allons découvrir les secrets des grands maîtres, les 7 vertus magiques, et tu deviendras un vrai ninja !&quot;
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => setIntroStep(2)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-4"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Enchanté, Maître Tanaka !
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
                      <p className="text-white text-lg">
                        &quot;Très bien ! Mais dis-moi...
                      </p>
                      <p className="text-amber-400 font-bold text-xl mt-3 text-center">
                        Quel est ton prénom ? 🤔&quot;
                      </p>
                      <p className="text-slate-400 text-sm mt-2 text-center">
                        (Je l&apos;utiliserai pour te parler)
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="Entre ton prénom ici..."
                        value={tempUserName}
                        onChange={(e) => setTempUserName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                        className="bg-slate-800 border-amber-500/50 text-white text-lg py-6 text-center"
                        autoFocus
                      />
                      <Button
                        onClick={handleNameSubmit}
                        disabled={!tempUserName.trim()}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 disabled:opacity-50"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        C&apos;est parti, Maître Tanaka !
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* GROS BLOC DE DÉMARRAGE - Étape actuelle avec Tanaka */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-3xl ${
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

        <div className="relative p-5 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            {/* GROS NUMÉRO D'ÉTAPE */}
            <div className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center shadow-2xl">
                  {allCompleted ? (
                    <div className="text-center">
                      <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-white mx-auto" />
                      <span className="text-white text-xs font-bold">TERMINÉ</span>
                    </div>
                  ) : (
                    <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg">
                      {currentActiveStep.id}
                    </span>
                  )}
                </div>
                
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

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-4xl font-black text-white mb-2 drop-shadow-lg"
              >
                {allCompleted ? `Bravo ${displayName} !` : currentActiveStep.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/80 text-base sm:text-xl mb-4"
              >
                {allCompleted 
                  ? 'Tu as complété tout le parcours d\'initiation ! 🏆' 
                  : currentActiveStep.subtitle}
              </motion.p>

              {!allCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={() => handleStepClick(currentActiveStep)}
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-white/90 font-bold text-base sm:text-lg px-6 py-5 rounded-2xl shadow-xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Commencer cette étape
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* MAÎTRE TANAKA ANIMÉ */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex-shrink-0 relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center"
              >
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-amber-500/50 shadow-xl"
                />
              </motion.div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap shadow-lg">
                Maître Tanaka
              </div>
            </motion.div>
          </div>

          {/* Message de Tanaka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-5 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 backdrop-blur-sm rounded-2xl p-4 border-2 border-amber-400/50"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-300 font-bold">Maître Tanaka</span>
                </div>
                <p className="text-white text-sm italic">
                  &quot;{displayName}, {allCompleted 
                    ? `tu as parcouru tout le chemin de l'initiation ! Ta véritable aventure de Ninja commence maintenant ! 🥋✨`
                    : currentActiveStep.tanakaMessage}&quot;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* BARRE DE PROGRESSION */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
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
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full"
          />
        </div>
        {/* Indicateurs des étapes */}
        <div className="flex justify-between mt-3">
          {JOURNEY_STEPS.map((step) => (
            <div 
              key={step.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                isStepCompleted(step.id)
                  ? 'bg-emerald-500 text-white'
                  : isStepUnlocked(step)
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-500'
              }`}
            >
              {isStepCompleted(step.id) ? <CheckCircle2 className="w-4 h-4" /> : step.id}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* GRILLE DES 6 ÉTAPES */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {JOURNEY_STEPS.map((step, index) => {
          const unlocked = isStepUnlocked(step);
          const completed = isStepCompleted(step.id);
          // Note: step.icon is available but we use emoji for visual consistency

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={unlocked ? { scale: 1.03, y: -5 } : {}}
              onClick={() => unlocked && handleStepClick(step)}
              className={`
                relative rounded-2xl p-4 sm:p-5 min-h-[140px] sm:min-h-[160px] overflow-hidden cursor-pointer
                ${unlocked 
                  ? `bg-gradient-to-br ${step.gradient} ${step.shadowColor} shadow-lg border-2 border-white/20 hover:border-white/50` 
                  : 'bg-slate-800/50 border-2 border-slate-700'
                }
                transition-all
              `}
            >
              {/* Numéro */}
              <div className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center ${
                completed ? 'bg-emerald-500' : unlocked ? 'bg-white/30' : 'bg-slate-700'
              }`}>
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : unlocked ? (
                  <span className="text-lg font-black text-white">{step.id}</span>
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Badge XP */}
              {unlocked && !completed && (
                <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  +{step.xpReward} XP
                </div>
              )}

              {/* Contenu */}
              <div className="mt-10">
                <span className={`text-3xl sm:text-4xl ${!unlocked && 'opacity-40'}`}>{step.emoji}</span>
                <h3 className={`font-bold text-base sm:text-lg mt-2 ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                  {step.title}
                </h3>
                <p className={`text-xs sm:text-sm mt-0.5 ${unlocked ? 'text-white/70' : 'text-slate-600'}`}>
                  {step.subtitle}
                </p>
              </div>

              {/* Overlay pour les étapes verrouillées */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px]">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-slate-500 mx-auto mb-1" />
                    <p className="text-slate-500 text-xs">Termine l&apos;étape {step.id - 1}</p>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* DIALOGUE D'ÉTAPE */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showStepDialog && selectedStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowStepDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${selectedStep.gradient} p-5`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                    <span className="text-3xl">{selectedStep.emoji}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      Étape {selectedStep.id} : {selectedStep.title}
                    </h3>
                    <p className="text-white/70">{selectedStep.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5 space-y-4">
                {/* Message de Tanaka */}
                <div className="bg-amber-500/20 rounded-xl p-4 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <img 
                      src={TANAKA_IMAGE} 
                      alt="Maître Tanaka" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/50 flex-shrink-0"
                    />
                    <div>
                      <p className="text-amber-400 font-bold text-sm mb-1">Maître Tanaka dit :</p>
                      <p className="text-white text-sm italic">&quot;{selectedStep.tanakaMessage}&quot;</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm">{selectedStep.description}</p>

                {/* Tips */}
                <div className="grid grid-cols-2 gap-2">
                  {selectedStep.tips.map((tip, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-2 text-center">
                      <p className="text-white text-xs">{tip}</p>
                    </div>
                  ))}
                </div>

                {/* Bouton d'action */}
                <Button
                  onClick={() => handleAction(selectedStep.slug)}
                  className={`w-full bg-gradient-to-r ${selectedStep.gradient} text-white font-bold py-4 rounded-xl`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isStepCompleted(selectedStep.id) ? 'Revoir cette section' : 'Commencer !'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation de transition */}
      {showStepTransition && transitionStep && (
        <StepTransition
          isVisible={showStepTransition}
          stepNumber={transitionStep.id}
          stepTitle={transitionStep.title}
          stepEmoji={transitionStep.emoji}
          userName={displayName}
          actionType="step_complete"
          xpEarned={transitionStep.xpReward}
          onComplete={() => setShowStepTransition(false)}
        />
      )}
    </div>
  );
};

export default JourneyPath;
