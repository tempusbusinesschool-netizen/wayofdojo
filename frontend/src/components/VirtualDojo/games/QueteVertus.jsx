/**
 * 🛡️ QUÊTE DES 7 VERTUS - Valeurs du Budo
 * 
 * L'enfant collecte les 7 vertus du Bushido en résolvant
 * des énigmes morales et des dilemmes éthiques
 * Développe: Éthique, Réflexion, Valeurs
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Shield, ChevronRight, Star, RotateCcw } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

// Les 7 vertus du Budo
const VIRTUES = [
  { 
    id: 'respect', 
    name: 'Respect', 
    kanji: '礼', 
    emoji: '🙇',
    color: 'from-blue-500 to-cyan-600',
    description: 'Honorer les autres et soi-même'
  },
  { 
    id: 'courage', 
    name: 'Courage', 
    kanji: '勇', 
    emoji: '🦁',
    color: 'from-red-500 to-orange-600',
    description: 'Affronter ses peurs avec bravoure'
  },
  { 
    id: 'maitrise', 
    name: 'Maîtrise', 
    kanji: '克', 
    emoji: '🧘',
    color: 'from-purple-500 to-violet-600',
    description: 'Contrôler ses émotions et actions'
  },
  { 
    id: 'humilite', 
    name: 'Humilité', 
    kanji: '謙', 
    emoji: '🌱',
    color: 'from-green-500 to-emerald-600',
    description: 'Rester modeste face au succès'
  },
  { 
    id: 'bienveillance', 
    name: 'Bienveillance', 
    kanji: '仁', 
    emoji: '💝',
    color: 'from-pink-500 to-rose-600',
    description: 'Aider les autres avec compassion'
  },
  { 
    id: 'attention', 
    name: 'Attention', 
    kanji: '心', 
    emoji: '👁️',
    color: 'from-amber-500 to-yellow-600',
    description: 'Être présent et vigilant'
  },
  { 
    id: 'responsabilite', 
    name: 'Responsabilité', 
    kanji: '責', 
    emoji: '⚖️',
    color: 'from-slate-500 to-slate-700',
    description: 'Assumer ses actes et leurs conséquences'
  },
];

// Dilemmes moraux
const DILEMMAS = [
  {
    id: 1,
    virtue: 'respect',
    situation: "Tu arrives au dojo et tu vois un camarade qui a oublié son salut au Kamiza.",
    choices: [
      { text: "Tu te moques de lui devant les autres", correct: false },
      { text: "Tu lui rappelles discrètement de saluer", correct: true },
      { text: "Tu ne dis rien et ignores la situation", correct: false },
    ],
    explanation: "Le respect, c'est aider les autres à s'améliorer avec gentillesse, pas les humilier."
  },
  {
    id: 2,
    virtue: 'courage',
    situation: "C'est ton premier cours et tu as peur de faire des erreurs devant tout le monde.",
    choices: [
      { text: "Tu restes assis et regardes les autres", correct: false },
      { text: "Tu participes malgré ta peur", correct: true },
      { text: "Tu fais semblant d'être malade pour partir", correct: false },
    ],
    explanation: "Le courage n'est pas l'absence de peur, mais agir malgré elle. C'est en essayant qu'on apprend !"
  },
  {
    id: 3,
    virtue: 'maitrise',
    situation: "Un camarade te pousse sans faire exprès et tu sens la colère monter.",
    choices: [
      { text: "Tu le pousses en retour", correct: false },
      { text: "Tu respires profondément et acceptes ses excuses", correct: true },
      { text: "Tu vas te plaindre au sensei immédiatement", correct: false },
    ],
    explanation: "La maîtrise de soi permet de contrôler ses émotions. Respirer aide à retrouver le calme."
  },
  {
    id: 4,
    virtue: 'humilite',
    situation: "Tu réussis parfaitement une technique et le sensei te félicite devant tout le monde.",
    choices: [
      { text: "Tu te vantes et montres que tu es le meilleur", correct: false },
      { text: "Tu remercies et continues à t'entraîner avec humilité", correct: true },
      { text: "Tu refuses le compliment en disant que ce n'était pas si bien", correct: false },
    ],
    explanation: "L'humilité, c'est accepter les compliments avec gratitude tout en restant modeste."
  },
  {
    id: 5,
    virtue: 'bienveillance',
    situation: "Un nouveau venu semble perdu et ne comprend pas l'exercice.",
    choices: [
      { text: "Tu continues ton exercice sans t'en occuper", correct: false },
      { text: "Tu l'aides gentiment à comprendre", correct: true },
      { text: "Tu appelles le sensei pour qu'il s'en occupe", correct: false },
    ],
    explanation: "La bienveillance nous pousse à aider les autres. Tout le monde a été débutant un jour."
  },
  {
    id: 6,
    virtue: 'attention',
    situation: "Pendant l'explication du sensei, tu entends tes amis rire à côté.",
    choices: [
      { text: "Tu regardes ce qui les fait rire", correct: false },
      { text: "Tu restes concentré sur le sensei", correct: true },
      { text: "Tu leur demandes de se taire bruyamment", correct: false },
    ],
    explanation: "L'attention demande de rester concentré sur l'essentiel, même avec des distractions."
  },
  {
    id: 7,
    virtue: 'responsabilite',
    situation: "Tu fais tomber et abîmes le bokken d'un autre élève par accident.",
    choices: [
      { text: "Tu le remets en place en espérant que personne n'a vu", correct: false },
      { text: "Tu avoues ce qui s'est passé et proposes de le réparer", correct: true },
      { text: "Tu dis que quelqu'un d'autre l'a fait", correct: false },
    ],
    explanation: "La responsabilité, c'est assumer ses erreurs et chercher à les réparer."
  },
];

const QueteVertus = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro');
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [collectedVirtues, setCollectedVirtues] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentDilemma = DILEMMAS[currentDilemmaIndex];

  // Parler avec Tanaka
  const tanakaVoice = useCallback((message) => {
    if (soundEnabled) {
      speak(message);
    }
    if (tanakaSpeak) {
      tanakaSpeak(message);
    }
  }, [soundEnabled, speak, tanakaSpeak]);

  // Démarrer le jeu
  const startGame = () => {
    setGameState('playing');
    setCurrentDilemmaIndex(0);
    setCollectedVirtues([]);
    setScore(0);
    setSelectedChoice(null);
    setShowExplanation(false);
    tanakaVoice("Le Budo repose sur 7 vertus sacrées. À chaque dilemme, fais le choix qui honore ces valeurs !");
  };

  // Sélectionner un choix
  const handleChoice = (choice, index) => {
    if (selectedChoice !== null) return;

    setSelectedChoice(index);
    setIsCorrect(choice.correct);

    if (choice.correct) {
      const virtue = VIRTUES.find(v => v.id === currentDilemma.virtue);
      setCollectedVirtues(prev => [...prev, virtue]);
      setScore(s => s + 100);
      tanakaVoice(`Excellent choix ! Tu as compris la vertu de ${virtue.name} !`);
    } else {
      setScore(s => s + 25); // Points de participation
      tanakaVoice("Ce n'était pas le meilleur choix, mais tu apprendras de cette expérience.");
    }

    setShowExplanation(true);
  };

  // Passer au dilemme suivant
  const nextDilemma = () => {
    setSelectedChoice(null);
    setShowExplanation(false);

    if (currentDilemmaIndex + 1 >= DILEMMAS.length) {
      endGame();
    } else {
      setCurrentDilemmaIndex(i => i + 1);
    }
  };

  // Fin du jeu
  const endGame = () => {
    setGameState('finished');
    const kiEarned = Math.floor(score / 20);

    if (collectedVirtues.length >= 6) {
      tanakaVoice("Magnifique ! Tu as presque toutes les vertus du Budo ! Tu es sur le chemin du vrai guerrier !");
    } else if (collectedVirtues.length >= 4) {
      tanakaVoice("Bien joué ! Tu comprends plusieurs vertus. Continue de réfléchir à tes choix au quotidien.");
    } else {
      tanakaVoice("Les vertus du Budo demandent de la réflexion. Réessaie pour mieux les comprendre !");
    }

    setTimeout(() => onComplete(score, kiEarned), 3000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <div className="text-white">
            <span className="text-2xl font-bold text-slate-300">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Vertus collectées */}
          {VIRTUES.map(virtue => (
            <div
              key={virtue.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                collectedVirtues.some(v => v.id === virtue.id)
                  ? `bg-gradient-to-br ${virtue.color}`
                  : 'bg-slate-700 opacity-40'
              }`}
              title={virtue.name}
            >
              {virtue.emoji}
            </div>
          ))}
        </div>
        
        <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div 
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-slate-600"
        style={{ width: 600, minHeight: 450 }}
      >
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full py-8"
          >
            <span className="text-6xl mb-4">🛡️</span>
            <h2 className="text-2xl font-bold text-white mb-2">Quête des 7 Vertus</h2>
            <p className="text-slate-300 text-center mb-4 max-w-md">
              Le Budo (voie du guerrier) repose sur 7 vertus sacrées.<br/>
              À chaque dilemme, fais le choix qui honore ces valeurs !
            </p>
            
            {/* Afficher les 7 vertus */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {VIRTUES.map(virtue => (
                <div 
                  key={virtue.id}
                  className={`bg-gradient-to-br ${virtue.color} rounded-xl p-3 text-center`}
                >
                  <span className="text-2xl">{virtue.emoji}</span>
                  <p className="text-white text-xs font-bold mt-1">{virtue.name}</p>
                </div>
              ))}
            </div>
            
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Shield className="w-5 h-5 mr-2" />
              Commencer la quête !
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && currentDilemma && (
          <motion.div
            key={currentDilemmaIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Vertu cible */}
            <div className="text-center">
              <span className="text-slate-400 text-sm">Dilemme {currentDilemmaIndex + 1}/{DILEMMAS.length}</span>
              <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${VIRTUES.find(v => v.id === currentDilemma.virtue)?.color} px-4 py-2 rounded-full ml-4`}>
                <span className="text-xl">{VIRTUES.find(v => v.id === currentDilemma.virtue)?.emoji}</span>
                <span className="text-white font-bold">{VIRTUES.find(v => v.id === currentDilemma.virtue)?.name}</span>
              </div>
            </div>

            {/* Situation */}
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <p className="text-white text-lg leading-relaxed text-center">
                {currentDilemma.situation}
              </p>
            </div>

            {/* Choix */}
            <div className="space-y-3">
              {currentDilemma.choices.map((choice, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleChoice(choice, index)}
                  disabled={selectedChoice !== null}
                  whileHover={selectedChoice === null ? { scale: 1.02 } : {}}
                  whileTap={selectedChoice === null ? { scale: 0.98 } : {}}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selectedChoice === null
                      ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'
                      : selectedChoice === index
                        ? choice.correct
                          ? 'bg-emerald-500/30 border-2 border-emerald-500'
                          : 'bg-red-500/30 border-2 border-red-500'
                        : choice.correct && showExplanation
                          ? 'bg-emerald-500/20 border-2 border-emerald-500/50'
                          : 'bg-slate-800/50 border-2 border-slate-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedChoice === index
                        ? choice.correct ? 'bg-emerald-500' : 'bg-red-500'
                        : 'bg-slate-600'
                    }`}>
                      {selectedChoice !== null && selectedChoice === index ? (
                        choice.correct ? '✓' : '✗'
                      ) : (
                        <span className="text-white text-sm">{['A', 'B', 'C'][index]}</span>
                      )}
                    </div>
                    <span className="text-white">{choice.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explication */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${
                    isCorrect 
                      ? 'bg-emerald-500/20 border border-emerald-500/50' 
                      : 'bg-amber-500/20 border border-amber-500/50'
                  }`}
                >
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCorrect ? '✨ Excellent !' : '💡 Réflexion :'}
                  </p>
                  <p className="text-white text-sm">{currentDilemma.explanation}</p>
                  
                  <Button
                    onClick={nextDilemma}
                    className="mt-4 bg-slate-600 hover:bg-slate-500"
                  >
                    {currentDilemmaIndex + 1 >= DILEMMAS.length ? 'Terminer' : 'Continuer'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full py-8"
          >
            <span className="text-6xl mb-4">🎉</span>
            <h2 className="text-3xl font-bold text-white mb-2">Tu as fini le parcours 🎉</h2>
            <p className="text-amber-400 text-lg mb-4">Demande à tes parents de vérifier le jeu avec toi.</p>
            
            {/* Vertus collectées */}
            <div className="flex gap-2 mb-4">
              {collectedVirtues.map(virtue => (
                <motion.div
                  key={virtue.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`bg-gradient-to-br ${virtue.color} rounded-xl p-3 text-center`}
                >
                  <span className="text-2xl">{virtue.emoji}</span>
                  <p className="text-white text-xs font-bold mt-1">{virtue.name}</p>
                </motion.div>
              ))}
            </div>
            
            <p className="text-slate-400 mb-4">{collectedVirtues.length}/7 vertus collectées</p>
            <p className="text-4xl font-bold text-slate-300 mb-2">{score} points</p>
            <p className="text-cyan-400 mb-6">+{Math.floor(score / 20)} Ki gagné !</p>
            
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                setGameState('intro');
                setCurrentQuestionIndex(0);
                setCollectedVirtues([]);
                setScore(0);
              }} variant="outline" className="text-white border-white/30">
                <RotateCcw className="w-4 h-4 mr-2" /> Rejouer cette étape
              </Button>
              <Button 
                onClick={() => onComplete(score, Math.floor(score / 20))}
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
              >
                Continuer
              </Button>
            </div>
            <p className="text-slate-500 text-xs mt-3">Tu peux recommencer pour t'entraîner encore.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QueteVertus;
