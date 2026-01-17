import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Lock, CheckCircle2, Play, Star, 
  Sparkles, Target, Trophy, Gift, Flame, Rocket,
  Heart, Volume2, User, Swords, BookOpen, Award,
  MessageCircle, Mic, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { playTanakaPhrase } from '@/services/tanakaVoiceService';
import StepTransition from './StepTransition';

// Image de Maître Tanaka
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * JourneyPath - Parcours de jeu ludique et guidé pour les nouveaux utilisateurs
 * Inclut tous les thèmes de l'application avec Maître Tanaka comme guide interactif
 */

// ═══════════════════════════════════════════════════════════════════════════════
// DÉFINITION DES ÉTAPES DU PARCOURS - Basé sur tous les thèmes de l'application
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 6 ÉTAPES DU PARCOURS INTERACTIF - Pour les utilisateurs CONNECTÉS
// Le parcours guide l'utilisateur étape par étape avec Tanaka comme mentor
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNEY_STEPS = [
  {
    id: 1,
    slug: 'profil',
    title: 'Mon Profil',
    subtitle: 'Crée ton Ninja',
    emoji: '🎭',
    icon: Rocket,
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/40',
    unlockCondition: 'always',
    xpReward: 10,
    description: 'Fais connaissance avec Maître Tanaka et crée ton profil de ninja avec ta ceinture et ton animal gardien !',
    tanakaMessage: "Bienvenue dans mon dojo virtuel ! 🥋 Je suis Maître Tanaka. Ensemble, nous allons découvrir les secrets de l'Aïkido. Ton aventure commence maintenant !",
    tanakaAudioKey: 'welcome',
    actions: [{ label: 'Créer mon profil', type: 'navigate', target: 'profil' }],
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
    tanakaMessage: "Maintenant, passons aux techniques ! Chaque ceinture a ses propres mouvements à maîtriser. Commence par les bases : les déplacements et les chutes. Ensuite, tu apprendras les vraies techniques !",
    tanakaAudioKey: 'step_2_techniques',
    actions: [{ label: 'Voir les techniques', type: 'navigate', target: 'techniques' }],
    tips: ['🦶 Tai Sabaki - Déplacements', '🔄 Ukemi - Chutes', '💪 Ikkyo, Nikyo, Sankyo...', '🌀 Shiho Nage, Irimi Nage...']
  },
  {
    id: 3,
    slug: 'dojo_virtuel',
    title: 'Dojo Virtuel',
    subtitle: 'Jeux & Validations',
    emoji: '🎮',
    icon: Target,
    gradient: 'from-cyan-400 to-blue-500',
    shadowColor: 'shadow-cyan-500/40',
    unlockCondition: 'step_2_completed',
    xpReward: 20,
    description: 'Joue à des jeux pour développer ton calme et ta concentration. Tes parents valident tes réussites !',
    tanakaMessage: "Bienvenue dans le Dojo Virtuel ! Ici, tu vas jouer à des jeux pour développer ton calme et ta concentration. Quand tu termines un jeu, tes parents diront si tout s'est bien passé !",
    tanakaAudioKey: 'step_3_dojo',
    actions: [{ label: 'Entrer dans le Dojo Virtuel', type: 'navigate', target: 'dojo_virtuel' }],
    tips: ['🎮 Jeux de concentration', '🧘 Exercices de calme', '✅ Validations parentales', '✨ Gagne des points']
  },
  {
    id: 4,
    slug: 'carnet_dojo',
    title: 'Mon Carnet',
    subtitle: 'Entraînement au Dojo',
    emoji: '📓',
    icon: BookOpen,
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/40',
    unlockCondition: 'step_3_completed',
    xpReward: 20,
    description: 'Note les exercices que tu as faits au vrai dojo. C\'est toi qui valides ta pratique !',
    tanakaMessage: "Après ton cours au dojo, reviens ici pour noter ce que tu as pratiqué ! C'est ton carnet personnel. Ta parole compte, sois honnête avec toi-même !",
    tanakaAudioKey: 'step_4_carnet',
    actions: [{ label: 'Ouvrir mon carnet', type: 'navigate', target: 'carnet_dojo' }],
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
    actions: [{ label: 'Voir ma progression', type: 'navigate', target: 'ceintures' }],
    tips: ['⭐ Points XP', '🥋 Ma ceinture', '💜 Mes qualités', '🐾 Animaux évoluent']
  },
  {
    id: 6,
    slug: 'trophees',
    title: 'Mes Trophées',
    subtitle: 'Deviens une Légende !',
    emoji: '🏆',
    icon: Trophy,
    gradient: 'from-red-500 to-orange-600',
    shadowColor: 'shadow-red-500/40',
    unlockCondition: 'step_5_completed',
    xpReward: 30,
    description: 'Tu as complété le parcours d\'initiation ! Collectionne les badges, vise le titre de Légende du Dojo !',
    tanakaMessage: "Félicitations, jeune ninja ! Tu as parcouru tout le chemin de l'initiation ! Maintenant, ta véritable aventure commence. Vise le titre de Légende du Dojo ! Je crois en toi !",
    tanakaAudioKey: 'step_6_mastery',
    actions: [{ label: 'Voir mes trophées', type: 'navigate', target: 'trophees' }],
    tips: ['🏆 Badges à collectionner', '👑 Titres spéciaux', '🐉 Dragon légendaire', '🏯 Grand Maître !']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

const JourneyPath = ({ 
  userName = "",
  userEmail = "", // Email de l'utilisateur pour l'accueil
  completedSteps = [],
  currentStep = 1,
  totalPoints = 0,
  onStepClick,
  onStepComplete, // Callback pour marquer une étape comme complétée
  onNavigate,
  onUserNameChange, // Callback pour changer le prénom
  isEnfantMode = true
}) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Ref pour stocker l'audio en cours et éviter les lectures multiples
  const currentAudioRef = useRef(null);
  
  // État pour l'animation de transition entre étapes (sphère)
  const [showStepTransition, setShowStepTransition] = useState(false);
  const [transitionStep, setTransitionStep] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  
  // État pour le dialogue d'introduction de Tanaka
  const [showIntroDialog, setShowIntroDialog] = useState(false);
  const [introStep, setIntroStep] = useState(1); // 1 = présentation, 2 = demande prénom
  const [tempUserName, setTempUserName] = useState('');
  const [tanakaAnimationState, setTanakaAnimationState] = useState('idle'); // idle, talking, waving
  
  // Prénom enregistré (depuis localStorage)
  const [registeredFirstName, setRegisteredFirstName] = useState(() => {
    return localStorage.getItem('aikido_user_firstname') || '';
  });
  
  // Vérifier si c'est la première visite (pas de prénom personnalisé enregistré)
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('aikido_tanaka_intro_seen');
    
    // Afficher le dialogue si l'utilisateur n'a jamais vu l'intro de Tanaka
    if (!hasSeenIntro) {
      const timer = setTimeout(() => {
        setShowIntroDialog(true);
        setTanakaAnimationState('waving');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animation de Tanaka
  useEffect(() => {
    if (tanakaAnimationState === 'talking') {
      const timer = setTimeout(() => setTanakaAnimationState('idle'), 3000);
      return () => clearTimeout(timer);
    }
    if (tanakaAnimationState === 'waving') {
      const timer = setTimeout(() => setTanakaAnimationState('talking'), 1500);
      return () => clearTimeout(timer);
    }
  }, [tanakaAnimationState]);

  // Vérifie si une étape est débloquée
  const isStepUnlocked = (step) => {
    if (step.unlockCondition === 'always') return true;
    const requiredStep = parseInt(step.unlockCondition.replace('step_', '').replace('_completed', ''));
    return completedSteps.includes(requiredStep);
  };

  // Vérifie si une étape est complétée
  const isStepCompleted = (stepId) => completedSteps.includes(stepId);

  // Jouer l'audio de Tanaka (avec protection contre les lectures multiples)
  const playTanakaAudio = async (audioKey) => {
    // Si déjà en cours de lecture, ignorer
    if (isPlayingAudio) return;
    
    // Arrêter l'audio précédent si en cours
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    
    try {
      setIsPlayingAudio(true);
      setTanakaAnimationState('talking');
      
      const result = await playTanakaPhrase(audioKey);
      
      if (result?.audio) {
        currentAudioRef.current = result.audio;
        
        // Configurer le callback de fin AVANT de continuer
        result.audio.onended = () => {
          currentAudioRef.current = null;
          setIsPlayingAudio(false);
          setTanakaAnimationState('idle');
        };
        
        result.audio.onerror = () => {
          currentAudioRef.current = null;
          setIsPlayingAudio(false);
          setTanakaAnimationState('idle');
        };
      } else {
        // Pas d'audio retourné
        setIsPlayingAudio(false);
        setTanakaAnimationState('idle');
      }
    } catch (error) {
      console.error('Error playing Tanaka audio:', error);
      currentAudioRef.current = null;
      setIsPlayingAudio(false);
      setTanakaAnimationState('idle');
    }
  };
  
  // Arrêter l'audio de Tanaka
  const stopTanakaAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    setIsPlayingAudio(false);
    setTanakaAnimationState('idle');
  };
  
  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Jouer l'audio de Tanaka automatiquement quand un dialog d'étape s'ouvre
  useEffect(() => {
    if (showStepDialog && selectedStep && selectedStep.tanakaAudioKey) {
      // Petit délai pour laisser le dialog s'animer
      const timer = setTimeout(() => {
        playTanakaAudio(selectedStep.tanakaAudioKey);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showStepDialog, selectedStep]);

  // Jouer l'audio de bienvenue automatiquement quand l'intro de Tanaka s'affiche
  useEffect(() => {
    if (showIntroDialog && introStep === 1) {
      // Petit délai pour laisser le dialog s'animer
      const timer = setTimeout(() => {
        playTanakaAudio('welcome');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showIntroDialog, introStep]);

  // Valider le prénom
  const handleNameSubmit = () => {
    if (tempUserName.trim()) {
      const firstName = tempUserName.trim();
      // Enregistrer le prénom dans localStorage
      localStorage.setItem('aikido_user_firstname', firstName);
      localStorage.setItem('aikido_tanaka_intro_seen', 'true');
      setRegisteredFirstName(firstName);
      
      if (onUserNameChange) {
        onUserNameChange(firstName);
      }
      setShowIntroDialog(false);
      setTanakaAnimationState('idle');
      // Ne pas rejouer l'audio welcome ici - évite la répétition
      // L'enfant a déjà entendu le message d'accueil
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

  // Navigue vers une section AVEC animation de transition sphère
  const handleAction = (action) => {
    // Fermer le dialogue d'abord
    setShowStepDialog(false);
    
    // Pour l'étape 1 (profil), on laisse le parent gérer le flux d'onboarding
    // Le formulaire d'onboarding déclenchera la transition après validation
    if (selectedStep && selectedStep.id === 1 && !isStepCompleted(1) && action.target === 'profil') {
      // Passer directement au parent sans transition - il ouvrira le formulaire d'onboarding
      if (onNavigate && action.type === 'navigate') {
        onNavigate(action.target);
      }
      return;
    }
    
    // Pour l'étape 2 (techniques), ouvrir directement les fiches par Kyu
    if (selectedStep && selectedStep.id === 2 && action.target === 'techniques') {
      // Passer directement au parent - il ouvrira les fiches techniques
      if (onNavigate && action.type === 'navigate') {
        onNavigate(action.target);
      }
      return;
    }
    
    // Si une étape est sélectionnée et non complétée, lancer la transition
    if (selectedStep && !isStepCompleted(selectedStep.id)) {
      // Sauvegarder l'action pour l'exécuter après la transition
      setPendingAction(action);
      setTransitionStep(selectedStep);
      setShowStepTransition(true);
    } else {
      // Étape déjà complétée ou pas d'étape, naviguer directement
      if (onNavigate && action.type === 'navigate') {
        onNavigate(action.target);
      }
    }
  };

  // Callback appelé quand l'animation de transition est terminée
  const handleTransitionComplete = () => {
    // Marquer l'étape comme complétée
    if (transitionStep && onStepComplete && !isStepCompleted(transitionStep.id)) {
      onStepComplete(transitionStep.id);
    }
    
    // Cacher la transition après un court délai
    setTimeout(() => {
      setShowStepTransition(false);
      setTransitionStep(null);
      
      // Exécuter l'action de navigation si elle existe
      if (pendingAction && onNavigate && pendingAction.type === 'navigate') {
        onNavigate(pendingAction.target);
      }
      setPendingAction(null);
    }, 300);
  };

  // Réinitialiser le parcours (pour les tests)
  const handleResetJourney = () => {
    if (window.confirm('⚠️ Réinitialiser le parcours ?\n\nCela va effacer ta progression et te ramener à l\'étape 1.\n\nContinuer ?')) {
      // Effacer les données du localStorage
      localStorage.removeItem('aikido_journey_completed_steps');
      localStorage.removeItem('aikido_tanaka_intro_seen');
      localStorage.removeItem('aikido_user_firstname');
      
      // Recharger la page pour réinitialiser l'état
      window.location.reload();
    }
  };

  // Trouver l'étape actuelle (première non complétée)
  const currentActiveStep = JOURNEY_STEPS.find(step => !isStepCompleted(step.id)) || JOURNEY_STEPS[JOURNEY_STEPS.length - 1];
  const allCompleted = completedSteps.length >= JOURNEY_STEPS.length;
  
  // Nom à afficher : UNIQUEMENT le prénom enregistré (demandé par Tanaka)
  const displayName = registeredFirstName || localStorage.getItem('aikido_user_firstname') || 'Ninja';

  return (
    <div className="w-full" data-testid="journey-path">
      
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* DIALOGUE D'INTRODUCTION DE TANAKA - Première visite */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showIntroDialog && (
          <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
            <DialogContent className="sm:max-w-lg p-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-500/50 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Tanaka animé - Header fixe */}
              <div className="relative bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 p-6 text-center flex-shrink-0">
                <motion.div
                  animate={{
                    scale: tanakaAnimationState === 'waving' ? [1, 1.05, 1] : 1,
                    rotate: tanakaAnimationState === 'waving' ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.5, repeat: tanakaAnimationState === 'waving' ? 3 : 0 }}
                  className="relative inline-block"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl shadow-amber-500/40">
                    <img 
                      src={TANAKA_IMAGE} 
                      alt="Maître Tanaka" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Indicateur de parole */}
                  {tanakaAnimationState === 'talking' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-amber-400 mt-4">Maître Tanaka</h2>
                <p className="text-amber-200/70 text-sm">Ton guide sur la Voie de l&apos;Aïkido</p>
              </div>

              {/* Contenu scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                {introStep === 1 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-amber-500/30">
                      {/* Message de bienvenue */}
                      <p className="text-emerald-400 font-bold text-lg mb-3">
                        &quot;Bienvenue jeune Ninja ! 🥋&quot;
                      </p>
                      <p className="text-white/80 mt-2 text-sm sm:text-base">
                        Je suis <span className="text-amber-400 font-bold">Maître Tanaka</span>, et je serai ton guide sur la Voie de l&apos;Aïkido.
                      </p>
                      <p className="text-white/80 mt-2 text-sm sm:text-base">
                        Ensemble, nous allons découvrir les secrets des grands maîtres, les 7 vertus magiques, et tu deviendras un vrai ninja !&quot;
                      </p>
                    </div>
                    
                    {/* Bouton Écouter Tanaka */}
                    <Button
                      onClick={() => {
                        playTanakaAudio('welcome');
                        setTanakaAnimationState('talking');
                      }}
                      disabled={isPlayingAudio}
                      variant="outline"
                      className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/20 py-3"
                    >
                      <Volume2 className={`w-5 h-5 mr-2 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                      {isPlayingAudio ? '🔊 Tanaka parle...' : '🔊 Réécouter Maître Tanaka'}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        // Passer à l'étape suivante sans rejouer l'audio
                        setIntroStep(2);
                      }}
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
                      <p className="text-white text-base sm:text-lg leading-relaxed">
                        &quot;Très bien ! Mais dis-moi...
                      </p>
                      <p className="text-amber-400 font-bold text-lg sm:text-xl mt-3 text-center">
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
                        className="bg-slate-800 border-amber-500/50 text-white text-lg py-6 text-center placeholder:text-slate-500"
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
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* GROS BLOC DE DÉMARRAGE - Étape actuelle avec Tanaka animé */}
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
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 drop-shadow-lg"
              >
                {allCompleted ? `Bravo ${displayName} !` : currentActiveStep.title}
              </motion.h2>

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

            {/* MAÎTRE TANAKA ANIMÉ */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex-shrink-0 relative"
            >
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl scale-110" />
              
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: tanakaAnimationState === 'talking' ? [0, -2, 2, 0] : 0,
                }}
                transition={{ 
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 0.3, repeat: tanakaAnimationState === 'talking' ? Infinity : 0 }
                }}
                className="relative"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-amber-400/50 shadow-2xl shadow-amber-500/30">
                  <img 
                    src={TANAKA_IMAGE} 
                    alt="Maître Tanaka" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-4 py-1 rounded-full font-bold text-sm whitespace-nowrap shadow-lg">
                  Maître Tanaka
                </div>

                {/* Indicateur audio */}
                {isPlayingAudio && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-2"
                  >
                    <Volume2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Message de Tanaka - Encadré Orange/Ambre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-2 border-amber-400/50 shadow-lg shadow-amber-500/20"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-amber-400">
                <img src={TANAKA_IMAGE} alt="Maître Tanaka" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-amber-300 font-bold text-base sm:text-lg">Maître Tanaka</span>
                  <button
                    onClick={() => playTanakaAudio(currentActiveStep.tanakaAudioKey || 'welcome')}
                    disabled={isPlayingAudio}
                    className="flex items-center gap-1.5 bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 px-3 py-1 rounded-full text-sm transition-all disabled:opacity-50"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                    <span className="hidden sm:inline">{isPlayingAudio ? 'Écoute...' : 'Écouter'}</span>
                  </button>
                </div>
                <p className="text-white text-sm sm:text-base italic leading-relaxed">
                  "{displayName}, {allCompleted 
                    ? `tu as parcouru tout le chemin de l'initiation ! Ta véritable aventure de Ninja commence maintenant ! 🥋✨`
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
      <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
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

      {/* Bouton Réinitialiser le parcours (pour les tests) */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleResetJourney}
          className="flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs sm:text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
          data-testid="reset-journey-btn"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser le parcours</span>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* GRILLE DES 6 ÉTAPES - AVEC GROS NUMÉROS */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {JOURNEY_STEPS.map((step, index) => {
          const unlocked = isStepUnlocked(step);
          const completed = isStepCompleted(step.id);
          const isCurrent = currentActiveStep.id === step.id && !completed;

          return (
            <motion.button
              key={step.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleStepClick(step)}
              disabled={!unlocked}
              data-testid={`journey-step-${step.slug}`}
              className={`
                relative group aspect-square rounded-2xl sm:rounded-3xl p-3 sm:p-4
                flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
                ${unlocked 
                  ? `bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadowColor} border-2 border-white/20 hover:border-white/40 hover:scale-105 hover:-translate-y-2 cursor-pointer`
                  : 'bg-slate-800/50 border-2 border-slate-700 cursor-not-allowed opacity-60'
                }
                ${isCurrent ? 'ring-4 ring-white/50 ring-offset-2 ring-offset-slate-900' : ''}
              `}
            >
              {/* GROS NUMÉRO EN HAUT À GAUCHE */}
              <div className={`absolute top-2 left-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                ${unlocked ? 'bg-white/30 backdrop-blur-sm' : 'bg-slate-700'}`}
              >
                <span className={`text-2xl sm:text-3xl font-black ${unlocked ? 'text-white drop-shadow-lg' : 'text-slate-500'}`}>
                  {step.id}
                </span>
              </div>

              {/* Icône de statut en haut à droite */}
              <div className="absolute top-2 right-2">
                {completed ? (
                  <div className="bg-emerald-500 rounded-full p-1.5">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : !unlocked ? (
                  <div className="bg-slate-600 rounded-full p-1.5">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                ) : isCurrent ? (
                  <div className="bg-amber-500 rounded-full p-1.5 animate-pulse">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                ) : null}
              </div>

              {/* Emoji principal */}
              <span className={`text-4xl sm:text-5xl mb-2 ${!unlocked ? 'grayscale opacity-50' : ''} group-hover:scale-110 transition-transform`}>
                {step.emoji}
              </span>

              {/* Titre */}
              <span className={`font-bold text-center text-sm sm:text-base ${unlocked ? 'text-white' : 'text-slate-500'}`}>
                {step.title}
              </span>

              {/* Sous-titre */}
              <span className={`text-center text-[10px] sm:text-xs mt-0.5 ${unlocked ? 'text-white/70' : 'text-slate-600'}`}>
                {step.subtitle}
              </span>

              {/* Badge XP */}
              {unlocked && !completed && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-900 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5" />
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

      {/* Barre de progression avec les 6 étapes */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between gap-1">
          {JOURNEY_STEPS.map((step, idx) => {
            const completed = isStepCompleted(step.id);
            const isCurrent = currentActiveStep.id === step.id && !completed;
            return (
              <div 
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-all ${
                  completed 
                    ? 'bg-emerald-500' 
                    : isCurrent 
                      ? 'bg-amber-500 animate-pulse' 
                      : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>
        <p className="text-center text-slate-400 text-xs mt-2">
          {completedSteps.length} / {JOURNEY_STEPS.length} étapes complétées
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* DIALOG DE DÉTAIL D'UNE ÉTAPE */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showStepDialog && selectedStep && (
          <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
            <DialogContent className="sm:max-w-lg p-0 bg-slate-900 border-slate-700 overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header fixe */}
              <div className={`bg-gradient-to-r ${selectedStep.gradient} p-6 relative flex-shrink-0`}>
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
                
                <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  +{selectedStep.xpReward} XP
                </div>
              </div>

              {/* Contenu scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                {/* Message de Tanaka */}
                <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-4 border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                      <img src={TANAKA_IMAGE} alt="Maître Tanaka" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-400 font-semibold text-sm">Maître Tanaka</span>
                        <button
                          onClick={() => playTanakaAudio(selectedStep.tanakaAudioKey)}
                          disabled={isPlayingAudio}
                          className="text-amber-400/70 hover:text-amber-300 transition-colors disabled:opacity-50"
                        >
                          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                      <p className="text-amber-100 text-sm leading-relaxed italic">
                        &quot;{displayName}, {selectedStep.tanakaMessage}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300">{selectedStep.description}</p>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Ce que tu vas découvrir :
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
              </div>

              {/* Bouton d'action fixe en bas */}
              <div className="p-4 border-t border-slate-700 bg-slate-900 flex-shrink-0">
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
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      {/* ANIMATION DE TRANSITION SPHÈRE - Entre chaque étape complétée */}
      {/* ═══════════════════════════════════════════════════════════════════════════════════ */}
      <StepTransition
        isVisible={showStepTransition}
        stepNumber={transitionStep?.id || 1}
        stepTitle={transitionStep?.title || ''}
        stepEmoji={transitionStep?.emoji || '🎯'}
        userName={displayName}
        actionType={
          transitionStep?.id === 1 ? 'profile_created' :
          transitionStep?.id === 2 ? 'technique_learned' :
          transitionStep?.id === 3 ? 'dojo_entered' :
          transitionStep?.id === 4 ? 'challenge_done' :
          transitionStep?.id === 5 ? 'badge_earned' :
          'step_complete'
        }
        xpEarned={transitionStep?.xpReward || 0}
        onComplete={handleTransitionComplete}
      />
    </div>
  );
};

export default JourneyPath;
