/**
 * 🪞 MIROIR D'HARMONIE - Synchronisation
 * 
 * Reproduire les mouvements de Maître Tanaka comme un miroir
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

const MOVEMENTS = [
  { id: 'up', name: 'Haut', key: 'ArrowUp', altKey: 'z', icon: '⬆️', pose: 'arms_up' },
  { id: 'down', name: 'Bas', key: 'ArrowDown', altKey: 's', icon: '⬇️', pose: 'squat' },
  { id: 'left', name: 'Gauche', key: 'ArrowLeft', altKey: 'q', icon: '⬅️', pose: 'left_arm' },
  { id: 'right', name: 'Droite', key: 'ArrowRight', altKey: 'd', icon: '➡️', pose: 'right_arm' },
  { id: 'salute', name: 'Salut', key: ' ', altKey: 'Enter', icon: '🙇', pose: 'bow' },
];

interface Movement {
  id: string;
  name: string;
  key: string;
  altKey: string;
  icon: string;
  pose: string;
}

const SEQUENCE_LENGTH = 6;
const SHOW_TIME = 1200;
const TOTAL_ROUNDS = 3;

interface MiroirHarmonieProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const MiroirHarmonie: React.FC<MiroirHarmonieProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess, playCombo } = useGameSounds();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<'intro' | 'showing' | 'playing' | 'feedback' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [sequence, setSequence] = useState<Movement[]>([]);
  const [playerSequence, setPlayerSequence] = useState<Movement[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const [tanakaPose, setTanakaPose] = useState('neutral');
  const [playerPose, setPlayerPose] = useState('neutral');
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [combo, setCombo] = useState(0);

  const tanakaVoice = useCallback((message: string) => {
    if (soundEnabled) speak(message);
    if (tanakaSpeak) tanakaSpeak(message);
  }, [soundEnabled, speak, tanakaSpeak]);

  const generateSequence = (): Movement[] => {
    const newSeq: Movement[] = [];
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      newSeq.push(MOVEMENTS[Math.floor(Math.random() * MOVEMENTS.length)]);
    }
    return newSeq;
  };

  const startGame = () => {
    setGameState('showing');
    setScore(0);
    setRound(1);
    setCombo(0);
    const newSeq = generateSequence();
    setSequence(newSeq);
    setPlayerSequence([]);
    setCurrentShowIndex(0);
    play('start');
    tanakaVoice("Observe les mouvements, puis reproduis-les.");
  };

  // Show sequence
  useEffect(() => {
    if (gameState !== 'showing') return;

    if (currentShowIndex >= sequence.length) {
      setTimeout(() => {
        setTanakaPose('neutral');
        setGameState('playing');
        tanakaVoice("C'est à toi.");
      }, 500);
      return;
    }

    const movement = sequence[currentShowIndex];
    setTanakaPose(movement.pose);

    const timer = setTimeout(() => {
      setTanakaPose('neutral');
      setTimeout(() => setCurrentShowIndex(i => i + 1), 200);
    }, SHOW_TIME);

    return () => clearTimeout(timer);
  }, [gameState, currentShowIndex, sequence, tanakaVoice]);

  // Handle player input
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const movement = MOVEMENTS.find(m => m.key === e.key || m.altKey === e.key);
      if (!movement) return;

      e.preventDefault();
      
      setPlayerPose(movement.pose);
      setTimeout(() => setPlayerPose('neutral'), 300);

      const expectedMovement = sequence[playerSequence.length];
      const isCorrect = expectedMovement && expectedMovement.id === movement.id;

      if (isCorrect) {
        setLastResult('correct');
        setScore(s => s + (10 * (combo + 1)));
        setCombo(c => c + 1);
        playCombo(combo + 1);
      } else {
        setLastResult('wrong');
        setCombo(0);
        play('fail');
      }

      const newPlayerSeq = [...playerSequence, movement];
      setPlayerSequence(newPlayerSeq);

      if (newPlayerSeq.length >= sequence.length) {
        setTimeout(() => checkRoundComplete(newPlayerSeq), 500);
      }

      setTimeout(() => setLastResult(null), 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, sequence, playerSequence, combo]);

  const checkRoundComplete = (finalSequence: Movement[]) => {
    const correctCount = finalSequence.filter((m, i) => m.id === sequence[i]?.id).length;
    const accuracy = (correctCount / sequence.length) * 100;

    setGameState('feedback');

    setTimeout(() => {
      if (accuracy >= 70) {
        if (round < TOTAL_ROUNDS) {
          setRound(r => r + 1);
          const newSeq = generateSequence();
          setSequence(newSeq);
          setPlayerSequence([]);
          setCurrentShowIndex(0);
          setGameState('showing');
          tanakaVoice("Bien joué ! Round suivant.");
        } else {
          endGame(true);
        }
      } else {
        endGame(false);
      }
    }, 2000);
  };

  const endGame = (success: boolean) => {
    setGameState('finished');
    const finalScore = success ? score + (round * 50) : score;
    const kiEarned = success ? 15 + Math.floor(finalScore / 30) : 5;
    
    if (success) {
      playSuccess('high');
      tanakaVoice(`Bravo ${userName} ! Tu bouges comme un vrai miroir !`);
    } else {
      play('end');
      tanakaVoice("Continue à t'entraîner, tu progresseras !");
    }
    
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  const getPoseEmoji = (pose: string) => {
    const poseMap: Record<string, string> = {
      'neutral': '🧍',
      'arms_up': '🙆',
      'squat': '🧎',
      'left_arm': '🤛',
      'right_arm': '🤜',
      'bow': '🙇'
    };
    return poseMap[pose] || '🧍';
  };

  return (
    <div className="relative min-h-[400px]" data-testid="miroir-harmonie-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🪞</span>
          <div>
            <h3 className="text-white font-bold">Miroir d'Harmonie</h3>
            <p className="text-slate-400 text-sm">Reproduis les mouvements</p>
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
          <span className="text-6xl block mb-4">🪞</span>
          <h2 className="text-2xl font-bold text-white mb-4">Miroir d'Harmonie</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Observe les mouvements de Maître Tanaka, puis reproduis-les dans le même ordre. 
            Utilise les flèches ou ZQSD + Espace pour le salut.
          </p>
          <Button onClick={startGame} className="bg-gradient-to-r from-indigo-500 to-blue-600" data-testid="start-miroir-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game Area */}
      {(gameState === 'showing' || gameState === 'playing' || gameState === 'feedback') && (
        <div>
          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-white font-bold">Round {round}/{TOTAL_ROUNDS}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {combo > 1 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold">🔥 x{combo}</span>
              </motion.div>
            )}
          </div>

          {/* Avatars */}
          <div className="flex justify-center gap-12 mb-6">
            {/* Tanaka */}
            <div className="text-center">
              <p className="text-amber-400 font-bold mb-2">Maître Tanaka</p>
              <motion.div
                animate={{ scale: tanakaPose !== 'neutral' ? 1.1 : 1 }}
                className="w-32 h-32 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center"
              >
                <span className="text-6xl">{getPoseEmoji(tanakaPose)}</span>
              </motion.div>
            </div>

            {/* Player */}
            <div className="text-center">
              <p className="text-cyan-400 font-bold mb-2">{userName || 'Toi'}</p>
              <motion.div
                animate={{ 
                  scale: playerPose !== 'neutral' ? 1.1 : 1,
                  borderColor: lastResult === 'correct' ? '#22c55e' : lastResult === 'wrong' ? '#ef4444' : 'transparent'
                }}
                className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center border-4"
              >
                <span className="text-6xl">{getPoseEmoji(playerPose)}</span>
              </motion.div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center">
            {gameState === 'showing' && (
              <p className="text-amber-300 text-lg animate-pulse">
                👀 Observe... ({currentShowIndex + 1}/{sequence.length})
              </p>
            )}
            {gameState === 'playing' && (
              <div>
                <p className="text-cyan-300 text-lg mb-3">
                  🎮 C'est à toi ! ({playerSequence.length}/{sequence.length})
                </p>
                <div className="flex justify-center gap-2">
                  {MOVEMENTS.map(m => (
                    <span key={m.id} className="bg-slate-700 px-3 py-1 rounded text-white text-sm">
                      {m.icon} {m.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finished */}
      {gameState === 'finished' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">{score > 200 ? '🏆' : '👍'}</span>
          <h2 className="text-2xl font-bold text-white mb-2">
            {score > 200 ? 'Parfait !' : 'Bien joué !'}
          </h2>
          <p className="text-amber-400 text-xl mb-4">Score : {score} points</p>
          <p className="text-slate-400">Tu as complété {round} round{round > 1 ? 's' : ''} !</p>
        </motion.div>
      )}
    </div>
  );
};

export default MiroirHarmonie;
