/**
 * 🥋 DOJO LOGBOOK DIALOG - Carnet d'entraînement au Dojo
 * 
 * Étape 4 du parcours : L'enfant note les exercices qu'il a faits au vrai dojo.
 * C'est une AUTO-VALIDATION par l'utilisateur (honnêteté).
 * 
 * Ce composant était précédemment intégré dans VirtualDojo sous l'onglet "Entraînement Dojo".
 * Il a été extrait pour créer une étape distincte dans le parcours utilisateur.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Star, Sparkles, Volume2, VolumeX, X
} from 'lucide-react';
import { playTanakaPhrase, getPhraseText } from '@/services/tanakaVoiceService';

// Image de Maître Tanaka
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

/**
 * Liste des exercices au dojo réel avec points Ki
 */
const DOJO_EXERCISES = [
  { 
    id: 'salut', 
    name: 'Salut au dojo', 
    emoji: '🙏', 
    ki: 10,
    description: 'Tu as salué en entrant et en sortant du tatami',
    encouragement: 'Le respect commence par le salut !'
  },
  { 
    id: 'echauffement', 
    name: 'Échauffement', 
    emoji: '🔥', 
    ki: 15,
    description: 'Tu as bien préparé ton corps avant de pratiquer',
    encouragement: 'Un corps bien échauffé est prêt à apprendre !'
  },
  { 
    id: 'ukemi', 
    name: 'Chutes (Ukemi)', 
    emoji: '🔄', 
    ki: 20,
    description: 'Tu as pratiqué les roulades avant ou arrière',
    encouragement: 'Savoir chuter, c\'est savoir se protéger !'
  },
  { 
    id: 'tai_sabaki', 
    name: 'Déplacements', 
    emoji: '🦶', 
    ki: 20,
    description: 'Tu as travaillé tes déplacements (Tai Sabaki)',
    encouragement: 'Bien se déplacer, c\'est la base de tout !'
  },
  { 
    id: 'technique', 
    name: 'Technique avec partenaire', 
    emoji: '🤝', 
    ki: 25,
    description: 'Tu as pratiqué une technique avec un partenaire',
    encouragement: 'Ensemble, on progresse mieux !'
  },
  { 
    id: 'attention', 
    name: 'Bien écouté le cours', 
    emoji: '👂', 
    ki: 15,
    description: 'Tu as été attentif aux explications',
    encouragement: 'L\'écoute est la clé de l\'apprentissage !'
  },
  { 
    id: 'aide', 
    name: 'Aidé un camarade', 
    emoji: '💝', 
    ki: 20,
    description: 'Tu as aidé quelqu\'un pendant le cours',
    encouragement: 'La bienveillance te rend plus fort !'
  },
  { 
    id: 'rangement', 
    name: 'Rangement du dojo', 
    emoji: '🧹', 
    ki: 10,
    description: 'Tu as participé au rangement après le cours',
    encouragement: 'Prendre soin du dojo, c\'est respecter la pratique !'
  }
];

/**
 * DojoLogbookDialog - Carnet de pratique au dojo
 */
const DojoLogbookDialog = ({ 
  isOpen, 
  onClose, 
  userName = '',
  onRefreshData = null
}) => {
  // État pour les exercices validés aujourd'hui
  const [completedDojoExercises, setCompletedDojoExercises] = useState(() => {
    const saved = localStorage.getItem('aikido_dojo_exercises_today');
    if (saved) {
      const data = JSON.parse(saved);
      // Reset si c'est un nouveau jour
      const today = new Date().toDateString();
      if (data.date === today) {
        return data.exercises || [];
      }
    }
    return [];
  });

  // Points Ki totaux
  const [totalKi, setTotalKi] = useState(() => {
    const saved = localStorage.getItem('aikido_dojo_progress');
    if (saved) {
      const data = JSON.parse(saved);
      return data.totalKi || 0;
    }
    return 0;
  });

  // Message de Tanaka
  const [tanakaMessage, setTanakaMessage] = useState('');
  const [isTanakaSpeaking, setIsTanakaSpeaking] = useState(false);

  // Message d'accueil de Tanaka
  useEffect(() => {
    if (isOpen) {
      const displayName = userName || 'jeune ninja';
      const completedCount = completedDojoExercises.length;
      
      if (completedCount === 0) {
        setTanakaMessage(
          `Bienvenue dans ton Carnet de Dojo, ${displayName} ! 🥋\n\n` +
          `Après ton cours au vrai dojo, reviens ici pour noter ce que tu as fait.\n\n` +
          `C'est ton carnet personnel, ta parole compte. Sois honnête avec toi-même !`
        );
      } else if (completedCount < DOJO_EXERCISES.length) {
        setTanakaMessage(
          `Super ${displayName} ! Tu as déjà noté ${completedCount} exercice${completedCount > 1 ? 's' : ''} ! 🌟\n\n` +
          `Continue à remplir ton carnet. Chaque exercice compte !`
        );
      } else {
        setTanakaMessage(
          `Bravo ${displayName} ! 🏆\n\n` +
          `Journée complète ! Tu as noté tous tes exercices. Je suis fier de toi !`
        );
      }
      setIsTanakaSpeaking(true);
      setTimeout(() => setIsTanakaSpeaking(false), 3000);
    }
  }, [isOpen, userName, completedDojoExercises.length]);

  // Valider un exercice
  const handleValidateDojoExercise = (exerciseId) => {
    const exercise = DOJO_EXERCISES.find(e => e.id === exerciseId);
    if (!exercise || completedDojoExercises.includes(exerciseId)) return;
    
    const newCompleted = [...completedDojoExercises, exerciseId];
    setCompletedDojoExercises(newCompleted);
    
    // Sauvegarder avec la date du jour
    const today = new Date().toDateString();
    localStorage.setItem('aikido_dojo_exercises_today', JSON.stringify({
      date: today,
      exercises: newCompleted
    }));
    
    // Ajouter les points Ki
    const newKi = totalKi + exercise.ki;
    setTotalKi(newKi);
    
    // Sauvegarder la progression totale
    const saved = localStorage.getItem('aikido_dojo_progress');
    const progressData = saved ? JSON.parse(saved) : { completedGames: [], gameScores: {}, totalKi: 0 };
    progressData.totalKi = newKi;
    localStorage.setItem('aikido_dojo_progress', JSON.stringify(progressData));
    
    // Message de Tanaka
    setTanakaMessage(`${exercise.encouragement} +${exercise.ki} points de Ki ! 🌟`);
    setIsTanakaSpeaking(true);
    setTimeout(() => setIsTanakaSpeaking(false), 3000);

    // Rafraîchir les données si callback disponible
    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Calculer la progression du jour
  const todayProgress = {
    completed: completedDojoExercises.length,
    total: DOJO_EXERCISES.length,
    percent: Math.round((completedDojoExercises.length / DOJO_EXERCISES.length) * 100),
    kiEarned: completedDojoExercises.reduce((sum, id) => {
      const ex = DOJO_EXERCISES.find(e => e.id === id);
      return sum + (ex?.ki || 0);
    }, 0)
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30 p-0 overflow-hidden" data-testid="dojo-logbook-dialog">
        <VisuallyHidden>
          <DialogTitle>Mon Club - Mon Carnet</DialogTitle>
          <DialogDescription>Note les exercices que tu as faits au vrai dojo</DialogDescription>
        </VisuallyHidden>

        {/* HEADER - Maître Tanaka Coach */}
        <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 p-4 border-b border-amber-500/30">
          <div className="flex items-start gap-4">
            {/* Avatar Tanaka */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ 
                y: [0, -4, 0],
                rotate: isTanakaSpeaking ? [0, -2, 2, 0] : 0
              }}
              transition={{ 
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0.3, repeat: isTanakaSpeaking ? Infinity : 0 }
              }}
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-amber-400 shadow-lg shadow-amber-500/30">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1"
                animate={isTanakaSpeaking ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isTanakaSpeaking ? Infinity : 0 }}
              >
                <Volume2 className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            {/* Message de Tanaka */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                  🥋 Mon Club
                </h2>
                <div className="flex items-center gap-4">
                  {/* Points de Ki */}
                  <div className="flex items-center gap-2 bg-cyan-500/20 px-3 py-1 rounded-full">
                    <span className="text-cyan-400 text-lg">✨</span>
                    <span className="text-cyan-300 font-bold">{totalKi} Ki</span>
                  </div>
                </div>
              </div>
              
              {/* Bulle de message */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-amber-500/30 relative">
                <div className="absolute -left-2 top-3 w-3 h-3 bg-slate-800/80 border-l border-b border-amber-500/30 transform rotate-45" />
                <p className="text-amber-100 text-sm leading-relaxed whitespace-pre-line">
                  {tanakaMessage}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENU - Mon Carnet de Dojo */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-slate-900/50 rounded-2xl p-4 sm:p-6 border-2 border-amber-500/40 shadow-xl">
            
            {/* ACCROCHE LUDIQUE */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 mb-4">
                <span className="text-4xl">📓</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Mon Carnet de Dojo
              </h3>
              <p className="text-amber-200 text-sm sm:text-base max-w-md mx-auto">
                Après ton cours au dojo, raconte ce que tu as fait !<br/>
                <span className="text-amber-400 font-medium">C'est toi qui notes ta pratique. 🌟</span>
              </p>
            </div>

            {/* PROGRESSION DU JOUR */}
            <div className="bg-slate-800/60 rounded-xl p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 text-sm font-medium">Ta journée au dojo</span>
                <span className="text-amber-400 font-bold">
                  +{todayProgress.kiEarned} Ki gagnés
                </span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${todayProgress.percent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{todayProgress.completed} exercice{todayProgress.completed > 1 ? 's' : ''} noté{todayProgress.completed > 1 ? 's' : ''}</span>
                <span>{todayProgress.percent}% complété</span>
              </div>
            </div>

            {/* LISTE DES EXERCICES - Cartes visuelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {DOJO_EXERCISES.map((exercise) => {
                const isCompleted = completedDojoExercises.includes(exercise.id);
                
                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      relative rounded-xl p-4 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border-2 border-emerald-500/50' 
                        : 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800/80'
                      }
                    `}
                    data-testid={`exercise-card-${exercise.id}`}
                  >
                    {/* Badge "Fait !" */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Fait !
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      {/* Emoji de l'exercice */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                        ${isCompleted 
                          ? 'bg-emerald-500/30' 
                          : 'bg-amber-500/20'
                        }
                      `}>
                        {exercise.emoji}
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm mb-1 ${isCompleted ? 'text-emerald-300' : 'text-white'}`}>
                          {exercise.name}
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-2">
                          {exercise.description}
                        </p>
                        
                        {/* ACTION ENFANT - Bouton de validation */}
                        {!isCompleted ? (
                          <Button
                            onClick={() => handleValidateDojoExercise(exercise.id)}
                            size="sm"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs h-8"
                            data-testid={`validate-exercise-${exercise.id}`}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Je l'ai fait au dojo ! (+{exercise.ki} Ki)
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                            <Trophy className="w-4 h-4" />
                            <span>+{exercise.ki} Ki gagnés !</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* MESSAGE D'ENCOURAGEMENT */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
              {todayProgress.completed === 0 ? (
                <p className="text-amber-200 text-sm">
                  🥋 <strong>Après ton cours au dojo</strong>, reviens ici pour noter ce que tu as fait !<br/>
                  <span className="text-slate-400">C'est ton carnet personnel, ta parole compte.</span>
                </p>
              ) : todayProgress.completed < DOJO_EXERCISES.length ? (
                <p className="text-amber-200 text-sm">
                  🌟 <strong>Super, tu as déjà noté {todayProgress.completed} exercice{todayProgress.completed > 1 ? 's' : ''} !</strong><br/>
                  <span className="text-slate-400">Continue à remplir ton carnet de dojo.</span>
                </p>
              ) : (
                <p className="text-emerald-300 text-sm">
                  🏆 <strong>Bravo, journée complète !</strong><br/>
                  <span className="text-emerald-400/80">Tu as noté tous tes exercices. Maître Tanaka est fier de toi !</span>
                </p>
              )}
            </div>

            {/* RAPPEL PÉDAGOGIQUE */}
            <p className="text-center text-slate-500 text-xs mt-4">
              💡 L'application t'aide à te souvenir de ta pratique.<br/>
              Le vrai apprentissage se fait au dojo, avec ton corps et tes partenaires !
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DojoLogbookDialog;
