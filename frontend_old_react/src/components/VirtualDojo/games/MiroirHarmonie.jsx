/**
 * 🪞 MIROIR D'HARMONIE - Synchronisation
 * 
 * L'enfant doit reproduire les mouvements de Maître Tanaka
 * comme un miroir parfait
 * Développe: Imitation, Observation, Coordination
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, RotateCcw, Volume2, VolumeX, Eye } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

// Mouvements possibles
const MOVEMENTS = [
  { id: 'up', name: 'Haut', key: 'ArrowUp', altKey: 'z', icon: '⬆️', pose: 'arms_up' },
  { id: 'down', name: 'Bas', key: 'ArrowDown', altKey: 's', icon: '⬇️', pose: 'squat' },
  { id: 'left', name: 'Gauche', key: 'ArrowLeft', altKey: 'q', icon: '⬅️', pose: 'left_arm' },
  { id: 'right', name: 'Droite', key: 'ArrowRight', altKey: 'd', icon: '➡️', pose: 'right_arm' },
  { id: 'salute', name: 'Salut', key: ' ', altKey: 'Enter', icon: '🙇', pose: 'bow' },
];

const SEQUENCE_LENGTH = 8; // Nombre de mouvements par séquence
const SHOW_TIME = 1200; // ms pour montrer chaque mouvement
const TOTAL_ROUNDS = 3;

const MiroirHarmonie = ({ userName, onComplete, onExit, tanakaSpeak }) => {
  const { speak, speaking } = useTanakaVoice();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState('intro'); // intro, showing, playing, feedback, finished
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [tanakaPose, setTanakaPose] = useState('neutral');
  const [playerPose, setPlayerPose] = useState('neutral');
  const [lastResult, setLastResult] = useState(null); // 'correct', 'wrong'
  const [combo, setCombo] = useState(0);

  // Parler avec Tanaka
  const tanakaVoice = useCallback((message) => {
    if (soundEnabled) {
      speak(message);
    }
    if (tanakaSpeak) {
      tanakaSpeak(message);
    }
  }, [soundEnabled, speak, tanakaSpeak]);

  // Générer une nouvelle séquence
  const generateSequence = () => {
    const newSeq = [];
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      newSeq.push(MOVEMENTS[Math.floor(Math.random() * MOVEMENTS.length)]);
    }
    return newSeq;
  };

  // Démarrer le jeu
  const startGame = () => {
    setGameState('showing');
    setScore(0);
    setRound(1);
    setCombo(0);
    const newSeq = generateSequence();
    setSequence(newSeq);
    setPlayerSequence([]);
    setCurrentShowIndex(0);
    tanakaVoice("Observe les mouvements, puis reproduis-les.");
  };

  // Montrer la séquence de Tanaka
  useEffect(() => {
    if (gameState !== 'showing') return;

    if (currentShowIndex >= sequence.length) {
      // Fin de la démonstration
      setTimeout(() => {
        setTanakaPose('neutral');
        setGameState('playing');
        tanakaVoice("C'est à toi.");
      }, 500);
      return;
    }

    // Montrer le mouvement actuel
    const movement = sequence[currentShowIndex];
    setTanakaPose(movement.pose);

    const timer = setTimeout(() => {
      setTanakaPose('neutral');
      setTimeout(() => {
        setCurrentShowIndex(i => i + 1);
      }, 200);
    }, SHOW_TIME);

    return () => clearTimeout(timer);
  }, [gameState, currentShowIndex, sequence]);

  // Gérer les touches du joueur
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      const movement = MOVEMENTS.find(m => m.key === e.key || m.altKey === e.key);
      if (!movement) return;

      e.preventDefault();
      
      // Afficher la pose du joueur
      setPlayerPose(movement.pose);
      setTimeout(() => setPlayerPose('neutral'), 300);

      // Vérifier si c'est correct
      const expectedMovement = sequence[playerSequence.length];
      const isCorrect = expectedMovement && expectedMovement.id === movement.id;

      if (isCorrect) {
        setLastResult('correct');
        setScore(s => s + (10 * (combo + 1)));
        setCombo(c => c + 1);
      } else {
        setLastResult('wrong');
        setCombo(0);
      }

      setPlayerSequence(prev => [...prev, movement]);

      // Vérifier si la séquence est terminée
      if (playerSequence.length + 1 >= sequence.length) {
        setTimeout(() => checkRoundComplete(isCorrect), 500);
      }

      setTimeout(() => setLastResult(null), 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, sequence, playerSequence, combo]);

  // Vérifier la fin du round
  const checkRoundComplete = (lastWasCorrect) => {
    const correctCount = playerSequence.filter((m, i) => m.id === sequence[i]?.id).length + (lastWasCorrect ? 1 : 0);
    const accuracy = (correctCount / sequence.length) * 100;

    setGameState('feedback');

    if (accuracy >= 80) {
      tanakaVoice("Bien joué !");
    } else if (accuracy >= 50) {
      tanakaVoice("Tu fais des efforts, ça se voit.");
    } else {
      tanakaVoice("Continue comme ça !");
    }

    setTimeout(() => {
      if (round < TOTAL_ROUNDS) {
        // Round suivant
        setRound(r => r + 1);
        const newSeq = generateSequence();
        setSequence(newSeq);
        setPlayerSequence([]);
        setCurrentShowIndex(0);
        setGameState('showing');
      } else {
        // Fin du jeu
        endGame();
      }
    }, 2500);
  };

  // Fin du jeu
  const endGame = () => {
    setGameState('finished');
    const finalScore = score;
    const kiEarned = Math.floor(score / 15);

    if (finalScore >= 200) {
      tanakaVoice("Bravo, tu as terminé cette étape !");
    } else {
      tanakaVoice("Tu fais des efforts, ça se voit.");
    }

    setTimeout(() => onComplete(finalScore, kiEarned), 3000);
  };

  // Composant Avatar
  const Avatar = ({ pose, isTanaka = false }) => {
    const poses = {
      neutral: { body: 0, arms: 0, legs: 0 },
      arms_up: { body: 0, arms: -45, legs: 0 },
      squat: { body: 0, arms: 0, legs: 30 },
      left_arm: { body: 0, leftArm: -60, rightArm: 0 },
      right_arm: { body: 0, leftArm: 0, rightArm: -60 },
      bow: { body: 45, arms: 0, legs: 0 },
    };
    const currentPose = poses[pose] || poses.neutral;
    const color = isTanaka ? '#fbbf24' : '#22d3ee';

    return (
      <svg viewBox="0 0 100 150" className="w-32 h-48">
        {/* Corps */}
        <motion.g
          animate={{ rotate: currentPose.body }}
          transition={{ duration: 0.2 }}
          style={{ transformOrigin: '50px 80px' }}
        >
          {/* Tête */}
          <circle cx={50} cy={25} r={20} fill={color} />
          {/* Yeux */}
          <circle cx={43} cy={22} r={3} fill="#1e293b" />
          <circle cx={57} cy={22} r={3} fill="#1e293b" />
          {/* Corps */}
          <rect x={35} y={45} width={30} height={40} rx={5} fill="#1e293b" />
          {/* Bras gauche */}
          <motion.rect
            x={15}
            y={50}
            width={20}
            height={8}
            rx={4}
            fill="#1e293b"
            animate={{ rotate: currentPose.leftArm || currentPose.arms }}
            style={{ transformOrigin: '35px 54px' }}
          />
          {/* Bras droit */}
          <motion.rect
            x={65}
            y={50}
            width={20}
            height={8}
            rx={4}
            fill="#1e293b"
            animate={{ rotate: -(currentPose.rightArm || currentPose.arms) }}
            style={{ transformOrigin: '65px 54px' }}
          />
          {/* Jambes */}
          <motion.rect
            x={38}
            y={85}
            width={10}
            height={30}
            rx={4}
            fill="#1e293b"
            animate={{ rotate: -currentPose.legs }}
            style={{ transformOrigin: '43px 85px' }}
          />
          <motion.rect
            x={52}
            y={85}
            width={10}
            height={30}
            rx={4}
            fill="#1e293b"
            animate={{ rotate: currentPose.legs }}
            style={{ transformOrigin: '57px 85px' }}
          />
        </motion.g>
        {/* Label */}
        <text x={50} y={145} textAnchor="middle" fill="white" fontSize={10}>
          {isTanaka ? 'Tanaka' : userName || 'Toi'}
        </text>
      </svg>
    );
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
            <span className="text-2xl font-bold text-indigo-400">{score}</span>
            <span className="text-slate-400 ml-2">points</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/20 px-3 py-1 rounded-full">
            <span className="text-indigo-400 font-bold">Round {round}/{TOTAL_ROUNDS}</span>
          </div>
          {combo > 1 && (
            <div className="bg-emerald-500/20 px-3 py-1 rounded-full">
              <span className="text-emerald-400 font-bold">🔥 Combo x{combo}</span>
            </div>
          )}
        </div>
        
        <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone de jeu */}
      <div className="relative bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border-2 border-indigo-500/30" style={{ width: 600, height: 400 }}>
        
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 rounded-2xl"
          >
            <span className="text-6xl mb-4">🪞</span>
            <h2 className="text-2xl font-bold text-white mb-2">Miroir d'Harmonie</h2>
            <p className="text-slate-300 text-center mb-6 max-w-md px-4">
              Observe les mouvements de Maître Tanaka, puis reproduis-les dans le même ordre !
            </p>
            <div className="flex gap-2 mb-6">
              {MOVEMENTS.map(m => (
                <div key={m.id} className="bg-slate-700 px-3 py-2 rounded-lg text-center">
                  <span className="text-2xl">{m.icon}</span>
                  <p className="text-xs text-slate-400 mt-1">{m.name}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white font-bold px-8 py-3"
            >
              <Eye className="w-5 h-5 mr-2" />
              Commencer !
            </Button>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 rounded-2xl"
          >
            <span className="text-6xl mb-4">🏆</span>
            <h2 className="text-3xl font-bold text-white mb-2">Terminé !</h2>
            <p className="text-4xl font-bold text-indigo-400 mb-2">{score} points</p>
            <p className="text-cyan-400">+{Math.floor(score / 15)} Ki gagné !</p>
          </motion.div>
        )}

        {/* Avatars côte à côte */}
        <div className="flex justify-around items-center h-full">
          {/* Tanaka */}
          <div className="text-center">
            <div className={`p-4 rounded-xl ${gameState === 'showing' ? 'bg-amber-500/20 border-2 border-amber-500' : 'bg-slate-800/50'}`}>
              <Avatar pose={tanakaPose} isTanaka={true} />
            </div>
            <p className="text-amber-400 font-bold mt-2">
              {gameState === 'showing' ? '👀 Observe !' : 'Maître Tanaka'}
            </p>
          </div>

          {/* Ligne miroir */}
          <div className="h-full w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          {/* Joueur */}
          <div className="text-center">
            <div className={`p-4 rounded-xl ${gameState === 'playing' ? 'bg-cyan-500/20 border-2 border-cyan-500' : 'bg-slate-800/50'} ${lastResult === 'correct' ? 'ring-4 ring-emerald-500' : ''} ${lastResult === 'wrong' ? 'ring-4 ring-red-500' : ''}`}>
              <Avatar pose={playerPose} />
            </div>
            <p className="text-cyan-400 font-bold mt-2">
              {gameState === 'playing' ? '🎮 À toi !' : 'Toi'}
            </p>
          </div>
        </div>

        {/* Séquence à reproduire */}
        {gameState === 'playing' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sequence.map((m, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  i < playerSequence.length
                    ? playerSequence[i]?.id === m.id
                      ? 'bg-emerald-500/50 border-2 border-emerald-400'
                      : 'bg-red-500/50 border-2 border-red-400'
                    : 'bg-slate-700/50 border border-slate-600'
                }`}
              >
                {i < playerSequence.length ? (playerSequence[i]?.id === m.id ? '✓' : '✗') : '?'}
              </div>
            ))}
          </div>
        )}

        {/* Indicateur de mouvement pendant la démo */}
        {gameState === 'showing' && currentShowIndex < sequence.length && (
          <motion.div
            key={currentShowIndex}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 px-6 py-3 rounded-full"
          >
            <span className="text-3xl mr-2">{sequence[currentShowIndex]?.icon}</span>
            <span className="text-white font-bold">{sequence[currentShowIndex]?.name}</span>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      {gameState === 'playing' && (
        <div className="mt-4 text-center">
          <p className="text-slate-400 text-sm">
            Appuie sur les <span className="text-white">flèches</span> ou <span className="text-white">Espace</span> pour reproduire les mouvements
          </p>
        </div>
      )}
    </div>
  );
};

export default MiroirHarmonie;
