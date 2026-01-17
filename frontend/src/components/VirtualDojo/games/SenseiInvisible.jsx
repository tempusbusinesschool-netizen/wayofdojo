/**
 * 👂 LE SENSEI INVISIBLE
 * 
 * Jeu audio-guidé
 * L'enfant ferme les yeux et suit les instructions vocales de Maître Tanaka
 * Développe l'attention, la confiance et la visualisation mentale
 * 
 * AVEC VOIX TTS DE MAÎTRE TANAKA
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, X, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useTanakaVoice, TANAKA_GAME_MESSAGES } from '@/hooks/useTanakaVoice';

// Instructions possibles
const INSTRUCTIONS = [
  { id: 'bow', text: 'Salue en t\'inclinant', icon: '🙇', key: 'b', action: 'bow' },
  { id: 'turn_left', text: 'Tourne à gauche', icon: '↩️', key: 'ArrowLeft', action: 'left' },
  { id: 'turn_right', text: 'Tourne à droite', icon: '↪️', key: 'ArrowRight', action: 'right' },
  { id: 'step_forward', text: 'Fais un pas en avant', icon: '⬆️', key: 'ArrowUp', action: 'forward' },
  { id: 'step_back', text: 'Recule d\'un pas', icon: '⬇️', key: 'ArrowDown', action: 'back' },
  { id: 'raise_hands', text: 'Lève les mains', icon: '🙌', key: 'h', action: 'hands' },
  { id: 'breathe', text: 'Respire profondément', icon: '💨', key: ' ', action: 'breathe' },
  { id: 'close_eyes', text: 'Ferme les yeux', icon: '😌', key: 'e', action: 'eyes' },
  { id: 'stand_still', text: 'Reste immobile', icon: '🧍', key: 's', action: 'still' },
  { id: 'guard', text: 'Prends la garde', icon: '🥋', key: 'g', action: 'guard' },
];

// Séquences de difficulté croissante
const SEQUENCES = {
  easy: [
    ['bow', 'breathe', 'bow'],
    ['step_forward', 'step_forward', 'bow'],
    ['turn_left', 'turn_right', 'bow'],
  ],
  medium: [
    ['bow', 'step_forward', 'turn_left', 'step_forward', 'bow'],
    ['breathe', 'raise_hands', 'turn_right', 'step_forward', 'bow'],
    ['guard', 'step_forward', 'turn_left', 'turn_left', 'bow'],
  ],
  hard: [
    ['bow', 'close_eyes', 'step_forward', 'turn_left', 'step_forward', 'turn_right', 'raise_hands', 'bow'],
    ['breathe', 'guard', 'step_forward', 'turn_left', 'step_forward', 'turn_right', 'step_back', 'bow'],
  ]
};

const SenseiInvisible = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  // Hook pour la voix TTS réelle de Tanaka
  const { speak, speaking, stopSpeaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [gameState, setGameState] = useState('intro'); // intro, listening, acting, feedback, success, fail
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showInstruction, setShowInstruction] = useState(false);
  const [playerAction, setPlayerAction] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [eyesClosed, setEyesClosed] = useState(false);
  
  const timeoutRef = useRef(null);

  // Fonction pour parler avec TTS + mise à jour UI
  const tanakaVoice = useCallback((message) => {
    if (soundEnabled) {
      speak(message);
    }
    if (tanakaSpeak) {
      tanakaSpeak(message);
    }
  }, [soundEnabled, speak, tanakaSpeak]);

  // Sélectionner une séquence aléatoire
  const getRandomSequence = useCallback((diff) => {
    const sequences = SEQUENCES[diff];
    return sequences[Math.floor(Math.random() * sequences.length)];
  }, []);

  // Démarrer une nouvelle manche
  const startRound = useCallback(() => {
    const sequence = getRandomSequence(difficulty);
    setCurrentSequence(sequence);
    setCurrentInstructionIndex(0);
    setGameState('listening');
    setShowInstruction(true);
    
    // Annoncer la première instruction
    const instruction = INSTRUCTIONS.find(i => i.id === sequence[0]);
    if (instruction) {
      tanakaVoice(`${userName || 'Jeune ninja'}, écoute bien... ${instruction.text}`);
    }
  }, [difficulty, getRandomSequence, userName, tanakaVoice]);

  // Vérifier l'action du joueur
  const checkAction = useCallback((action) => {
    if (gameState !== 'listening') return;
    
    const expectedInstruction = currentSequence[currentInstructionIndex];
    const instruction = INSTRUCTIONS.find(i => i.id === expectedInstruction);
    
    if (instruction && instruction.action === action) {
      // Bonne réponse
      setIsCorrect(true);
      setPlayerAction(action);
      setScore(prev => prev + 10 * (difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1));
      
      setTimeout(() => {
        setIsCorrect(null);
        setPlayerAction(null);
        
        // Passer à l'instruction suivante
        if (currentInstructionIndex < currentSequence.length - 1) {
          const nextIndex = currentInstructionIndex + 1;
          setCurrentInstructionIndex(nextIndex);
          
          const nextInstruction = INSTRUCTIONS.find(i => i.id === currentSequence[nextIndex]);
          if (nextInstruction) {
            tanakaVoice(nextInstruction.text);
          }
        } else {
          // Séquence terminée !
          setRoundsCompleted(prev => prev + 1);
          
          if (roundsCompleted + 1 >= 3) {
            // Victoire après 3 manches
            setGameState('success');
            tanakaVoice(`Extraordinaire ${userName || 'ninja'} ! Tu as suivi toutes mes instructions parfaitement ! Ton écoute est remarquable !`);
          } else {
            // Manche suivante avec difficulté croissante
            if (roundsCompleted + 1 === 1) setDifficulty('medium');
            if (roundsCompleted + 1 === 2) setDifficulty('hard');
            
            tanakaVoice(`Excellent ! Manche ${roundsCompleted + 2} ! La séquence sera plus longue...`);
            setTimeout(startRound, 2000);
          }
        }
      }, 800);
    } else {
      // Mauvaise réponse
      setIsCorrect(false);
      setPlayerAction(action);
      setMistakes(prev => prev + 1);
      
      if (mistakes + 1 >= 3) {
        setGameState('fail');
        tanakaVoice(`Tu as fait trop d'erreurs, ${userName || 'ninja'}. L'écoute demande de la concentration. Réessaie !`);
      } else {
        tanakaVoice(`Ce n'était pas la bonne action. Concentre-toi et écoute bien.`);
        setTimeout(() => {
          setIsCorrect(null);
          setPlayerAction(null);
          // Répéter l'instruction
          const instruction = INSTRUCTIONS.find(i => i.id === currentSequence[currentInstructionIndex]);
          if (instruction) {
            tanakaVoice(`Je répète : ${instruction.text}`);
          }
        }, 1500);
      }
    }
  }, [gameState, currentSequence, currentInstructionIndex, difficulty, mistakes, roundsCompleted, userName, tanakaVoice, startRound]);

  // Contrôles clavier
  useEffect(() => {
    if (gameState !== 'listening') return;

    const handleKeyDown = (e) => {
      let action = null;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'z':
          action = 'forward';
          break;
        case 'ArrowDown':
        case 's':
          action = 'back';
          break;
        case 'ArrowLeft':
        case 'q':
        case 'a':
          action = 'left';
          break;
        case 'ArrowRight':
        case 'd':
          action = 'right';
          break;
        case 'b':
          action = 'bow';
          break;
        case 'h':
          action = 'hands';
          break;
        case ' ':
          action = 'breathe';
          break;
        case 'e':
          action = 'eyes';
          break;
        case 'g':
          action = 'guard';
          break;
        default:
          return;
      }
      
      e.preventDefault();
      checkAction(action);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, checkAction]);

  const startGame = () => {
    setScore(0);
    setMistakes(0);
    setRoundsCompleted(0);
    setDifficulty('easy');
    tanakaSpeak(`${userName || 'Jeune ninja'}, ferme les yeux et écoute ma voix. Je vais te donner des instructions. Suis-les avec attention.`);
    setTimeout(startRound, 3000);
  };

  const restartGame = () => {
    setGameState('intro');
    setScore(0);
    setMistakes(0);
    setRoundsCompleted(0);
    setDifficulty('easy');
  };

  // Instruction actuelle
  const currentInstruction = currentSequence[currentInstructionIndex] 
    ? INSTRUCTIONS.find(i => i.id === currentSequence[currentInstructionIndex])
    : null;

  return (
    <div className="relative">
      {/* Écran d'intro */}
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
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              👂
            </motion.span>
            <h2 className="text-2xl font-bold text-white mb-4">Le Sensei Invisible</h2>
            <p className="text-slate-300 mb-6 max-w-md mx-auto">
              Ferme les yeux et suis les instructions de Maître Tanaka.
              <br/><br/>
              <strong>🎮 Contrôles :</strong>
              <br/>⬆️⬇️⬅️➡️ = Se déplacer
              <br/>B = Saluer | H = Lever les mains
              <br/>ESPACE = Respirer | G = Garde
              <br/>E = Fermer les yeux
            </p>
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold px-8 py-3"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Commencer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone de jeu */}
      {gameState === 'listening' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-slate-400 text-sm">Score</span>
                <p className="text-xl font-bold">{score}</p>
              </div>
              <div className="bg-purple-500/20 px-3 py-1 rounded-full">
                <span className="text-purple-400 text-sm">
                  Manche {roundsCompleted + 1}/3 • {difficulty === 'easy' ? '🟢 Facile' : difficulty === 'medium' ? '🟡 Moyen' : '🔴 Difficile'}
                </span>
              </div>
              <div className="bg-red-500/20 px-3 py-1 rounded-full">
                <span className="text-red-400 text-sm">❤️ {3 - mistakes}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onExit} className="text-slate-400">
              <X className="w-4 h-4 mr-1" /> Quitter
            </Button>
          </div>

          {/* Zone d'écoute avec feedback visuel */}
          <div className={`
            relative rounded-2xl p-8 text-center transition-all
            ${isCorrect === true ? 'bg-emerald-500/30 border-2 border-emerald-500' :
              isCorrect === false ? 'bg-red-500/30 border-2 border-red-500' :
              'bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-2 border-purple-500/30'}
          `}>
            {/* Animation de "yeux fermés" */}
            {eyesClosed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="absolute inset-0 bg-black rounded-2xl z-10 flex items-center justify-center"
              >
                <span className="text-4xl">😌</span>
                <p className="text-white text-lg ml-3">Les yeux sont fermés...</p>
              </motion.div>
            )}
            
            {/* Instruction actuelle */}
            <motion.div
              key={currentInstruction?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <span className="text-6xl block mb-4">{currentInstruction?.icon}</span>
              <p className="text-white text-xl font-bold">{currentInstruction?.text}</p>
              <p className="text-purple-300 text-sm mt-2">
                Appuie sur la touche correspondante
              </p>
            </motion.div>

            {/* Indicateur de réponse */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="text-8xl">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progression dans la séquence */}
            <div className="flex justify-center gap-2 mt-6">
              {currentSequence.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx < currentInstructionIndex ? 'bg-emerald-500' :
                    idx === currentInstructionIndex ? 'bg-purple-500 animate-pulse' :
                    'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <Button
              onClick={() => checkAction('left')}
              className="bg-slate-700 hover:bg-slate-600 p-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="space-y-2">
              <Button
                onClick={() => checkAction('forward')}
                className="w-full bg-slate-700 hover:bg-slate-600 p-4"
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => checkAction('back')}
                className="w-full bg-slate-700 hover:bg-slate-600 p-4"
              >
                <ArrowDown className="w-6 h-6" />
              </Button>
            </div>
            <Button
              onClick={() => checkAction('right')}
              className="bg-slate-700 hover:bg-slate-600 p-4"
            >
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex justify-center gap-3">
            <Button onClick={() => checkAction('bow')} className="bg-amber-600 hover:bg-amber-700">
              🙇 Saluer
            </Button>
            <Button onClick={() => checkAction('breathe')} className="bg-cyan-600 hover:bg-cyan-700">
              💨 Respirer
            </Button>
            <Button onClick={() => checkAction('hands')} className="bg-pink-600 hover:bg-pink-700">
              🙌 Mains
            </Button>
            <Button onClick={() => checkAction('guard')} className="bg-violet-600 hover:bg-violet-700">
              🥋 Garde
            </Button>
          </div>
        </div>
      )}

      {/* Écran de victoire */}
      <AnimatePresence>
        {gameState === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.span 
              className="text-7xl block mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              🎧
            </motion.span>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Écoute Parfaite !</h2>
            <p className="text-slate-300 mb-4">Tu as suivi toutes les instructions de Maître Tanaka !</p>
            
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 inline-block">
              <p className="text-amber-400 text-3xl font-bold">{score} points</p>
              <p className="text-cyan-400">+{Math.round(score / 10)} Ki</p>
              <p className="text-purple-400 text-sm mt-1">
                Erreurs : {mistakes}/3
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

      {/* Écran d'échec */}
      <AnimatePresence>
        {gameState === 'fail' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <span className="text-6xl block mb-4">🙉</span>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Concentration perdue !</h2>
            <p className="text-slate-300 mb-6">
              L&apos;écoute demande de la patience.<br/>
              <em className="text-amber-400">&quot;Écouter, c&apos;est observer avec les oreilles&quot;</em>
            </p>
            
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame} className="bg-gradient-to-r from-purple-500 to-violet-600">
                <RotateCcw className="w-4 h-4 mr-2" /> Réessayer
              </Button>
              <Button onClick={onExit} variant="outline" className="text-white border-white/30">
                Quitter
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SenseiInvisible;
