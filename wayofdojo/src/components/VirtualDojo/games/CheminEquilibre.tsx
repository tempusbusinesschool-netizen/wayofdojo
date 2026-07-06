/**
 * ⚖️ CHEMIN DE L'ÉQUILIBRE - Posture & centre
 * 
 * Garder son avatar en équilibre sur un chemin étroit
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface CheminEquilibreProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const CheminEquilibre: React.FC<CheminEquilibreProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess } = useGameSounds();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(50); // 0-100, 50 = center
  const [position, setPosition] = useState(0); // 0-100 progress
  const [windForce, setWindForce] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (voiceEnabled) speak(message);
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Wind effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // Random wind
      const newWind = (Math.random() - 0.5) * 4;
      setWindForce(newWind);
    }, 2000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Balance physics
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBalance(prev => {
        let newBalance = prev + windForce * 0.3;
        
        // Natural tendency towards edges
        if (prev < 50) newBalance -= 0.2;
        if (prev > 50) newBalance += 0.2;
        
        // Stabilizing reduces drift
        if (isStabilizing) {
          newBalance = prev + (50 - prev) * 0.1;
        }
        
        // Check bounds
        if (newBalance <= 10 || newBalance >= 90) {
          setGameState('fail');
          return prev;
        }
        
        return Math.max(10, Math.min(90, newBalance));
      });
      
      // Progress if balanced
      if (Math.abs(balance - 50) < 20) {
        setPosition(prev => {
          const newPos = prev + 0.5;
          if (newPos >= 100) {
            setGameState('success');
          }
          return Math.min(100, newPos);
        });
        setScore(prev => prev + 1);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, windForce, balance, isStabilizing]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        setBalance(prev => Math.max(10, prev - 3));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        setBalance(prev => Math.min(90, prev + 3));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsStabilizing(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsStabilizing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setBalance(50);
    setPosition(0);
    setWindForce(0);
    play('start');
    speakTanaka("Trouvez votre centre. Le vent va essayer de vous déséquilibrer !");
  };

  useEffect(() => {
    if (gameState === 'success') {
      const finalScore = score + 50;
      const kiEarned = 20 + Math.floor(finalScore / 30);
      playSuccess('high');
      speakTanaka(`Bravo ${userName} ! Vous avez trouvé votre centre !`);
      setTimeout(() => onComplete(finalScore, kiEarned), 2500);
    } else if (gameState === 'fail') {
      const kiEarned = 5;
      play('fail');
      speakTanaka("Vous avez perdu l'équilibre. Réessayez !");
      setTimeout(() => onComplete(Math.floor(score / 2), kiEarned), 2500);
    }
  }, [gameState, score, userName, speakTanaka, onComplete, playSuccess, play]);

  const getBalanceColor = () => {
    const deviation = Math.abs(balance - 50);
    if (deviation < 10) return 'bg-emerald-500';
    if (deviation < 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative min-h-[400px]" data-testid="chemin-equilibre-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">⚖️</span>
          <div>
            <h3 className="text-white font-bold">Chemin de l'Équilibre</h3>
            <p className="text-slate-400 text-sm">Trouvez votre centre</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <butvotre onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <butvotre onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">⚖️</span>
          <h2 className="text-2xl font-bold text-white mb-4">Chemin de l'Équilibre</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Traverse le chemin en gardant votre équilibre. Le vent essaiera de vous faire tomber. 
            Utilise ⬅️➡️ pour vous pencher et ESPACE pour stabiliser votre centre.
          </p>
          <Butvotre onClick={startGame} className="bg-gradient-to-r from-yellow-500 to-amber-600" data-testid="start-equilibre-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white font-bold">
              Progression: {Math.floor(position)}%
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <motion.div
              animate={{ width: `${position}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
            />
          </div>

          {/* Balance indicator */}
          <div className="relative h-48 bg-gradient-to-b from-slate-800 to-slate-700 rounded-xl overflow-hidden mb-4">
            {/* Wind indicator */}
            {windForce !== 0 && (
              <div className={`absolute top-2 ${windForce > 0 ? 'right-2' : 'left-2'}`}>
                <motion.span
                  animate={{ x: windForce > 0 ? [0, 5, 0] : [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-2xl"
                >
                  💨
                </motion.span>
              </div>
            )}

            {/* Beam */}
            <div className="absolute bottom-12 left-10 right-10 h-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 rounded-full" />

            {/* Player */}
            <motion.div
              animate={{ 
                left: `${balance}%`,
                rotate: (balance - 50) * 1.5
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute bottom-14 transform -translate-x-1/2"
            >
              <div className="relative">
                <span className="text-4xl">🧍</span>
                {isStabilizing && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute -inset-2 bg-cyan-400/30 rounded-full"
                  />
                )}
              </div>
            </motion.div>

            {/* Center marker */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-8 bg-emerald-500/50" />
            </div>

            {/* Balance bar */}
            <div className="absolute bottom-4 left-10 right-10 h-2 bg-slate-600 rounded-full overflow-hidden">
              <motion.div
                animate={{ left: `${balance - 5}%` }}
                className={`absolute w-[10%] h-full ${getBalanceColor()} rounded-full`}
              />
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className={`font-bold ${getBalanceColor().replace('bg-', 'text-')}`}>
              {Math.abs(balance - 50) < 10 ? '✨ Parfait !' : Math.abs(balance - 50) < 20 ? '⚠️ Attention...' : '🌪️ Danger !'}
            </p>
            {isStabilizing && <p className="text-cyan-400 text-sm mt-1">🧘 Stabilisation...</p>}
          </div>

          <div className="text-center mt-3 text-slate-400 text-sm">
            ⬅️ ➡️ Se pencher • ESPACE Stabiliser
          </div>
        </div>
      )}

      {/* Success */}
      {gameState === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Félicitations !</h2>
          <p className="text-white text-xl mb-4">Score : {score + 50} points</p>
          <p className="text-slate-400">Vous avez trouvé votre centre !</p>
        </motion.div>
      )}

      {/* Fail */}
      {gameState === 'fail' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">💫</span>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Perdu l'équilibre !</h2>
          <p className="text-white text-xl mb-4">Score : {Math.floor(score / 2)} points</p>
          <p className="text-slate-400">Vous étiez à {Math.floor(position)}% du chemin.</p>
        </motion.div>
      )}
    </div>
  );
};

export default CheminEquilibre;
