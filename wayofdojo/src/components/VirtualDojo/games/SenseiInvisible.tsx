/**
 * 👂 LE SENSEI INVISIBLE - Écoute & attention
 * 
 * Suivre les instructions de Tanaka les yeux fermés
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const INSTRUCTIONS = [
  { id: 'forward', text: 'Avance', action: 'ArrowUp', emoji: '⬆️' },
  { id: 'back', text: 'Recule', action: 'ArrowDown', emoji: '⬇️' },
  { id: 'left', text: 'Tourne à gauche', action: 'ArrowLeft', emoji: '⬅️' },
  { id: 'right', text: 'Tourne à droite', action: 'ArrowRight', emoji: '➡️' },
  { id: 'salute', text: 'Salue', action: ' ', emoji: '🙇' },
];

interface SenseiInvisibleProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const SenseiInvisible: React.FC<SenseiInvisibleProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess, playCombo } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'waiting' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [totalRounds] = useState(8);
  const [currentInstruction, setCurrentInstruction] = useState<typeof INSTRUCTIONS[0] | null>(null);
  const [eyesClosed, setEyesClosed] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (soundEnabled) speak(message);
  }, [soundEnabled, speak, tanakaSpeak]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(0);
    setStreak(0);
    play('start');
    speakTanaka("Ferme les yeux et écoute mes instructions.");
    setTimeout(() => nextInstruction(), 2000);
  };

  const nextInstruction = () => {
    if (round >= totalRounds) {
      endGame();
      return;
    }

    setEyesClosed(true);
    setGameState('waiting');
    
    const instruction = INSTRUCTIONS[Math.floor(Math.random() * INSTRUCTIONS.length)];
    setCurrentInstruction(instruction);
    
    setTimeout(() => {
      speakTanaka(instruction.text);
    }, 1000);
  };

  // Keyboard input
  useEffect(() => {
    if (gameState !== 'waiting' || !currentInstruction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      
      const isCorrect = e.key === currentInstruction.action;
      
      if (isCorrect) {
        setScore(prev => prev + 20 + (streak * 5));
        setStreak(prev => prev + 1);
        setLastResult('correct');
        playCombo(streak + 1);
        
        if (streak > 0 && streak % 3 === 0) {
          speakTanaka("Bien joué !");
        }
      } else {
        setStreak(0);
        setLastResult('wrong');
        play('fail');
      }
      
      setTimeout(() => {
        setLastResult(null);
        setEyesClosed(false);
        setRound(prev => prev + 1);
        
        setTimeout(() => nextInstruction(), 1500);
      }, 1000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentInstruction, streak, speakTanaka]);

  const endGame = () => {
    setGameState('finished');
    setEyesClosed(false);
    const finalScore = score;
    const kiEarned = 25 + Math.floor(finalScore / 30);
    
    if (score >= 150) {
      playSuccess('high');
      speakTanaka(`Bravo ${userName} ! Votre écoute est excellente !`);
    } else {
      play('end');
      speakTanaka("Continuez à pratiquer l'écoute !");
    }
    
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  return (
    <div className="relative min-h-[400px]" data-testid="sensei-invisible-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">👂</span>
          <div>
            <h3 className="text-white font-bold">Le Sensei Invisible</h3>
            <p className="text-slate-400 text-sm">Écoute et suis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">👂</span>
          <h2 className="text-2xl font-bold text-white mb-4">Le Sensei Invisible</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Ferme les yeux et écoute les instructions de Maître Tanaka. 
            Utilisez les flèches pour suivre ses ordres. Le son doit être activé !
          </p>
          <div className="mb-6 p-4 bg-amber-500/20 rounded-xl">
            <p className="text-amber-300 text-sm">
              ⬆️ Avance • ⬇️ Recule • ⬅️ Gauche • ➡️ Droite • ESPACE Salue
            </p>
          </div>
          <Button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-violet-600" data-testid="start-sensei-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {(gameState === 'playing' || gameState === 'waiting') && (
        <div>
          {/* Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              Round {round + 1}/{totalRounds}
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {streak > 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold">🔥 x{streak}</span>
              </motion.div>
            )}
          </div>

          {/* Visual Area */}
          <div className="relative h-64 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
            {eyesClosed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <EyeOff className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-purple-300 text-lg">👂 Écoute Maître Tanaka...</p>
                {currentInstruction && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <span className="text-4xl">{currentInstruction.emoji}</span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="text-center">
                <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Prépare-toi...</p>
              </div>
            )}

            {/* Result overlay */}
            {lastResult && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute inset-0 flex items-center justify-center ${
                  lastResult === 'correct' ? 'bg-emerald-500/30' : 'bg-red-500/30'
                }`}
              >
                <span className="text-6xl">
                  {lastResult === 'correct' ? '✅' : '❌'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-slate-400 text-sm">
            Appuie sur la touche correspondante quand tu entends l'instruction
          </div>
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{score >= 150 ? '🏆' : '👍'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {score >= 150 ? 'Excellente écoute !' : 'Bien joué !'}
          </h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} points</p>
          <p className="text-slate-400">Vous avez complété {totalRounds} instructions !</p>
        </motion.div>
      )}
    </div>
  );
};

export default SenseiInvisible;
