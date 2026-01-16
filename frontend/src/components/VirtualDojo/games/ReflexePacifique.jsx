/**
 * 🧠 RÉFLEXE PACIFIQUE
 * 
 * Serious game d'intelligence émotionnelle
 * Face à des situations imprévues, l'enfant doit choisir
 * la réponse la plus sage (pas de réaction automatique)
 * 
 * AVEC VOIX TTS DE MAÎTRE TANAKA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, X, RotateCcw, Clock, CheckCircle2, XCircle, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice, TANAKA_GAME_MESSAGES } from '@/hooks/useTanakaVoice';

// Scénarios de situations
const SCENARIOS = [
  {
    id: 1,
    situation: "Un camarade se moque de toi devant tout le monde.",
    emoji: "😠",
    options: [
      { text: "Tu te moques de lui aussi", isCorrect: false, feedback: "La moquerie appelle la moquerie. Ce n'est pas la voie de l'harmonie." },
      { text: "Tu respires profondément et l'ignores calmement", isCorrect: true, feedback: "Excellent ! Ne pas réagir à la provocation montre ta maîtrise intérieure." },
      { text: "Tu vas te plaindre au professeur", isCorrect: false, feedback: "C'est une option, mais d'abord essaie de gérer la situation toi-même." },
      { text: "Tu pleures", isCorrect: false, feedback: "Tes émotions sont valides, mais tu peux apprendre à les canaliser." }
    ],
    theme: "Gestion de la colère"
  },
  {
    id: 2,
    situation: "Tu tombes pendant un exercice devant les autres.",
    emoji: "😨",
    options: [
      { text: "Tu rougis et ne veux plus continuer", isCorrect: false, feedback: "Tomber fait partie de l'apprentissage. Ne laisse pas la honte te paralyser." },
      { text: "Tu blâmes le sol ou quelqu'un d'autre", isCorrect: false, feedback: "Accuser les autres ne t'aide pas à progresser." },
      { text: "Tu te relèves en souriant et tu recommences", isCorrect: true, feedback: "Parfait ! L'échec est le meilleur professeur. Se relever avec le sourire, c'est l'esprit du Budoka !" },
      { text: "Tu te mets en colère contre toi-même", isCorrect: false, feedback: "Sois bienveillant avec toi-même. Chaque chute est une leçon." }
    ],
    theme: "Acceptation de l'échec"
  },
  {
    id: 3,
    situation: "Un plus petit que toi te bouscule par accident.",
    emoji: "💥",
    options: [
      { text: "Tu le pousses plus fort en retour", isCorrect: false, feedback: "La force ne doit jamais être utilisée pour blesser les plus faibles." },
      { text: "Tu lui dis \"Pas grave !\" et tu l'aides s'il est tombé", isCorrect: true, feedback: "Excellent ! L'Aïkido enseigne à protéger, même celui qui nous attaque." },
      { text: "Tu l'ignores et tu t'en vas", isCorrect: false, feedback: "Tu pourrais lui montrer de la compassion." },
      { text: "Tu lui fais peur pour qu'il ne recommence pas", isCorrect: false, feedback: "La peur n'enseigne rien de bon." }
    ],
    theme: "Bienveillance"
  },
  {
    id: 4,
    situation: "Tu vois un camarade tricher à un jeu.",
    emoji: "🕵️",
    options: [
      { text: "Tu le dénonces fort devant tout le monde", isCorrect: false, feedback: "L'humilier publiquement n'est pas respectueux." },
      { text: "Tu triches aussi pour être à égalité", isCorrect: false, feedback: "Deux erreurs ne font pas une vérité." },
      { text: "Tu lui parles en privé pour comprendre pourquoi", isCorrect: true, feedback: "Sage décision ! Comprendre avant de juger, c'est la voie du respect." },
      { text: "Tu ne dis rien et tu gardes ta rancœur", isCorrect: false, feedback: "Garder les choses en soi peut créer de l'amertume." }
    ],
    theme: "Respect et communication"
  },
  {
    id: 5,
    situation: "Tu as très peur de faire une démonstration devant les parents.",
    emoji: "😰",
    options: [
      { text: "Tu inventes une excuse pour ne pas participer", isCorrect: false, feedback: "Fuir la peur la renforce." },
      { text: "Tu acceptes ta peur et tu fais de ton mieux", isCorrect: true, feedback: "Le courage n'est pas l'absence de peur, mais agir malgré elle. Bravo !" },
      { text: "Tu blâmes les autres de te mettre dans cette situation", isCorrect: false, feedback: "Accuser ne change pas la situation." },
      { text: "Tu fais exprès de mal faire pour qu'on ne te demande plus", isCorrect: false, feedback: "Tu mérites de montrer tes vrais talents !" }
    ],
    theme: "Courage"
  },
  {
    id: 6,
    situation: "Un ami te demande de l'aide alors que tu voulais jouer seul.",
    emoji: "🤝",
    options: [
      { text: "Tu refuses sèchement", isCorrect: false, feedback: "Tu peux refuser poliment, mais considère d'abord l'autre." },
      { text: "Tu l'aides avec le sourire, ton jeu peut attendre", isCorrect: true, feedback: "L'entraide est une valeur fondamentale du Budo. Bien joué !" },
      { text: "Tu fais semblant de ne pas l'avoir entendu", isCorrect: false, feedback: "Ignorer un ami n'est pas respectueux." },
      { text: "Tu l'aides mais tu te plains tout le temps", isCorrect: false, feedback: "Aider à contrecœur n'est pas vraiment aider." }
    ],
    theme: "Entraide"
  },
  {
    id: 7,
    situation: "Tu réussis mieux qu'un ami à un exercice et il est triste.",
    emoji: "🏆",
    options: [
      { text: "Tu te vantes de ta réussite", isCorrect: false, feedback: "L'humilité est une vertu du Budo." },
      { text: "Tu l'encourages et lui proposes de l'aider", isCorrect: true, feedback: "Parfait ! Partager son succès pour élever les autres, c'est l'esprit du vrai guerrier." },
      { text: "Tu minimises ta réussite pour ne pas le blesser", isCorrect: false, feedback: "Tu peux être fier de toi tout en étant bienveillant." },
      { text: "Tu ignores sa tristesse", isCorrect: false, feedback: "L'empathie est importante entre amis." }
    ],
    theme: "Humilité et empathie"
  },
  {
    id: 8,
    situation: "Quelqu'un dit du mal d'un ami absent.",
    emoji: "🗣️",
    options: [
      { text: "Tu participes aux critiques", isCorrect: false, feedback: "Parler mal des absents n'est pas honorable." },
      { text: "Tu défends ton ami ou tu changes de sujet", isCorrect: true, feedback: "Excellent ! La loyauté envers ses amis est une grande qualité." },
      { text: "Tu écoutes sans rien dire", isCorrect: false, feedback: "Le silence peut être perçu comme un accord." },
      { text: "Tu vas tout répéter à ton ami", isCorrect: false, feedback: "Cela peut créer plus de conflits." }
    ],
    theme: "Loyauté"
  }
];

const ReflexePacifique = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  // Initialiser les scénarios une fois avec useMemo
  const initialScenarios = useMemo(() => {
    return [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 5);
  }, []);
  
  const [gameState, setGameState] = useState('intro');
  const [score, setScore] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [scenarios, setScenarios] = useState(initialScenarios);
  
  // Ref pour éviter les appels setState dans useEffect
  const timeoutHandledRef = useRef(false);

  // Handler pour passer au scénario suivant - défini en premier
  const goToNextScenario = useCallback(() => {
    if (currentScenarioIndex + 1 >= scenarios.length) {
      setGameState('success');
      setScore(prev => prev + correctAnswers * 10);
      tanakaSpeak(`${userName || 'Jeune ninja'}, tu as terminé l'épreuve ! Tu as fait preuve de sagesse dans ${correctAnswers} situations sur ${scenarios.length}.`);
    } else {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setTimeLeft(15);
    }
  }, [currentScenarioIndex, scenarios.length, correctAnswers, userName, tanakaSpeak]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return;
    
    if (timeLeft <= 0) {
      // Timeout inline pour éviter dépendance circulaire
      tanakaSpeak("Le temps est écoulé ! En situation réelle, il faut parfois prendre des décisions rapidement, mais avec sagesse.");
      setShowFeedback(true);
      setSelectedOption(-1);
      setTimeout(() => goToNextScenario(), 3000);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameState, showFeedback, goToNextScenario, tanakaSpeak]);

  const handleOptionSelect = (optionIndex) => {
    if (showFeedback) return;
    
    const option = scenarios[currentScenarioIndex].options[optionIndex];
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    
    if (option.isCorrect) {
      const points = 20 + Math.floor(timeLeft * 2);
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      tanakaSpeak(option.feedback);
    } else {
      tanakaSpeak(option.feedback);
    }
    
    setTimeout(() => {
      goToNextScenario();
    }, 4000);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCorrectAnswers(0);
    setCurrentScenarioIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(15);
    tanakaSpeak(`${userName || 'Jeune ninja'}, tu vas être confronté à des situations de la vie. Réfléchis bien avant de répondre. La précipitation est l'ennemie de la sagesse.`);
  };

  const restartGame = () => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 5);
    setScenarios(shuffled);
    setGameState('intro');
  };

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="relative">
      {/* Intro */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.span 
              className="text-6xl block mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🧠
            </motion.span>
            <h2 className="text-2xl font-bold text-white mb-4">Réflexe Pacifique</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Face à des situations de la vie, choisis la réponse la plus sage.
              <br/><br/>
              <strong className="text-amber-400">⚠️ Tu as 15 secondes par situation !</strong>
              <br/>
              Réfléchis vite, mais choisis bien.
            </p>
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-8 py-3"
            >
              <Brain className="w-5 h-5 mr-2" />
              Commencer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jeu */}
      {gameState === 'playing' && currentScenario && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-slate-400 text-sm">Score</span>
                <p className="text-xl font-bold">{score}</p>
              </div>
              <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
                <span className="text-emerald-400 text-sm">✅ {correctAnswers}/{scenarios.length}</span>
              </div>
            </div>
            
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-500/30 animate-pulse' : 'bg-slate-700'
            }`}>
              <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400' : 'text-slate-400'}`} />
              <span className={`font-bold text-lg ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-400">
              <X className="w-4 h-4 mr-1" /> Quitter
            </Button>
          </div>

          {/* Progression */}
          <div className="flex gap-2">
            {scenarios.map((_, idx) => (
              <div 
                key={idx}
                className={`flex-1 h-2 rounded-full ${
                  idx < currentScenarioIndex ? 'bg-emerald-500' :
                  idx === currentScenarioIndex ? 'bg-amber-500' :
                  'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Situation */}
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 rounded-2xl p-6 border border-amber-500/30"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{currentScenario.emoji}</span>
              <div>
                <span className="text-amber-400 text-sm font-medium">{currentScenario.theme}</span>
                <p className="text-white text-lg mt-1">{currentScenario.situation}</p>
              </div>
            </div>

            <p className="text-amber-200 text-sm mb-4">Que fais-tu ?</p>

            {/* Options */}
            <div className="space-y-3">
              {currentScenario.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = option.isCorrect;
                
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showFeedback}
                    whileHover={!showFeedback ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback ? { scale: 0.98 } : {}}
                    className={`
                      w-full p-4 rounded-xl text-left transition-all flex items-center gap-3
                      ${showFeedback 
                        ? isCorrect 
                          ? 'bg-emerald-500/30 border-2 border-emerald-500'
                          : isSelected 
                            ? 'bg-red-500/30 border-2 border-red-500'
                            : 'bg-slate-800/50 border border-slate-700 opacity-50'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-white flex-1">{option.text}</span>
                    
                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && selectedOption !== null && selectedOption >= 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl ${
                  currentScenario.options[selectedOption]?.isCorrect
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
                }`}
              >
                <p className="text-white">
                  {currentScenario.options[selectedOption]?.feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Victoire */}
      <AnimatePresence>
        {gameState === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.span 
              className="text-7xl block mb-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              🧘
            </motion.span>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Sagesse Acquise !</h2>
            <p className="text-slate-300 mb-4">
              Tu as fait preuve de réflexion et de maîtrise émotionnelle.
            </p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-amber-400 text-3xl font-bold">{score} points</p>
              <p className="text-cyan-400">+{Math.round(score / 10)} Ki</p>
              <p className="text-emerald-400 text-sm mt-2">
                {correctAnswers}/{scenarios.length} bonnes réponses
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.round(score / 10))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Terminer
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReflexePacifique;
