/**
 * 🎯 GARDIEN DE L'ESPACE - Maîtrise du Ma-ai
 * 
 * Maintenir la distance parfaite avec les partenaires
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface GardienEspaceProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const GardienEspace: React.FC<GardienEspaceProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess, playCombo } = useGameSounds();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success'>('intro');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [playerPos, setPlayerPos] = useState(50);
  const [targetPos, setTargetPos] = useState(30);
  const [targetDir, setTargetDir] = useState(1);
  const [perfectZone, setPerfectZone] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  const PERFECT_DISTANCE = 20;
  const TOLERANCE = 5;

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (voiceEnabled) speak(message);
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Target movement
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTargetPos(prev => {
        let newPos = prev + (targetDir * 2);
        if (newPos >= 80 || newPos <= 20) {
          setTargetDir(d => -d);
        }
        return Math.max(10, Math.min(90, newPos));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, targetDir]);

  // Scoring
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const distance = Math.abs(playerPos - targetPos);
      const idealDistance = PERFECT_DISTANCE;
      const distanceError = Math.abs(distance - idealDistance);

      if (distanceError <= TOLERANCE) {
        setScore(prev => prev + 5 * (combo + 1));
        setCombo(prev => prev + 1);
        setPerfectZone(prev => prev + 1);
        
        if (combo > 0 && combo % 10 === 0) {
          playCombo(combo);
          speakTanaka("Bien joué !");
        }
      } else {
        setCombo(0);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [gameState, playerPos, targetPos, combo, speakTanaka]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 3;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        e.preventDefault();
        setPlayerPos(prev => Math.max(5, prev - step));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        e.preventDefault();
        setPlayerPos(prev => Math.min(95, prev + step));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setPerfectZone(0);
    setTimeLeft(60);
    setPlayerPos(50);
    setTargetPos(30);
    play('start');
    speakTanaka("Maintiens la bonne distance avec votre partenaire. Ni trop près, ni trop loin !");
  };

  const endGame = () => {
    setGameState('success');
    const finalScore = score + (perfectZone * 2);
    const kiEarned = 20 + Math.floor(finalScore / 50);
    
    playSuccess('high');
    speakTanaka(`Bravo ${userName} ! Vous maîtrisez le Ma-ai !`);
    setTimeout(() => onComplete(finalScore, kiEarned), 2500);
  };

  const getDistanceStatus = () => {
    const distance = Math.abs(playerPos - targetPos);
    const idealDistance = PERFECT_DISTANCE;
    const distanceError = Math.abs(distance - idealDistance);

    if (distanceError <= TOLERANCE) {
      return { text: '✨ Parfait !', color: 'text-emerald-400' };
    } else if (distance < idealDistance - TOLERANCE) {
      return { text: '⚠️ Trop près !', color: 'text-red-400' };
    } else {
      return { text: '⚠️ Trop loin !', color: 'text-amber-400' };
    }
  };

  return (
    <div className="relative min-h-[400px]" data-testid="gardien-espace-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="text-white font-bold">Gardien de l'Espace</h3>
            <p className="text-slate-400 text-sm">Maîtrise du Ma-ai</p>
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
          <span className="text-6xl block mb-4">🎯</span>
          <h2 className="text-2xl font-bold text-white mb-4">Gardien de l'Espace</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Le Ma-ai est la distance parfaite entre vous et votre partenaire. 
            Ni trop près (danger), ni trop loin (tu ne peux pas agir). 
            Utilise ⬅️➡️ pour ajuster votre position.
          </p>
          <Butvotre onClick={startGame} className="bg-gradient-to-r from-emerald-500 to-teal-600" data-testid="start-gardien-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-white font-bold">⏱️ {timeLeft}s</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {combo > 3 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold">🔥 x{combo}</span>
              </motion.div>
            )}
          </div>

          {/* Game Area */}
          <div className="relative h-48 bg-gradient-to-b from-slate-800 to-slate-700 rounded-xl overflow-hidden border-2 border-slate-600 mb-4">
            {/* Distance indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <p className={`font-bold ${getDistanceStatus().color}`}>
                {getDistanceStatus().text}
              </p>
            </div>

            {/* Target (partner) */}
            <motion.div
              animate={{ left: `${targetPos}%` }}
              className="absolute bottom-4 transform -translate-x-1/2"
            >
              <span className="text-4xl">🥋</span>
              <p className="text-xs text-center text-slate-400">Partenaire</p>
            </motion.div>

            {/* Player */}
            <motion.div
              animate={{ left: `${playerPos}%` }}
              className="absolute bottom-4 transform -translate-x-1/2"
            >
              <span className="text-4xl">🧑‍🎓</span>
              <p className="text-xs text-center text-cyan-400">Vous</p>
            </motion.div>

            {/* Distance line */}
            <svg className="absolute bottom-16 w-full h-8" style={{ overflow: 'visible' }}>
              <line
                x1={`${Math.min(playerPos, targetPos)}%`}
                y1="50%"
                x2={`${Math.max(playerPos, targetPos)}%`}
                y2="50%"
                stroke={getDistanceStatus().color.includes('emerald') ? '#22c55e' : getDistanceStatus().color.includes('red') ? '#ef4444' : '#f59e0b'}
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          {/* Controls hint */}
          <div className="text-center text-slate-400 text-sm">
            ⬅️ ➡️ ou A/D pour vous déplacer
          </div>
        </div>
      )}

      {/* Success */}
      {gameState === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎯</span>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Félicitations !</h2>
          <p className="text-white text-xl mb-4">Score : {score + (perfectZone * 2)} points</p>
          <p className="text-slate-400">{perfectZone} moments en distance parfaite !</p>
        </motion.div>
      )}
    </div>
  );
};

export default GardienEspace;
