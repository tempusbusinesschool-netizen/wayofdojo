/**
 * 🌊 LE MESSAGER DU KI - Gestion du stress
 * 
 * Traverse le dojo en gardant ton équilibre
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Heart, Wind } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';

interface MessagerDuKiProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const MessagerDuKi: React.FC<MessagerDuKiProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'fail'>('intro');
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(100);
  const [position, setPosition] = useState({ x: 50, y: 80 });
  const [isBreathing, setIsBreathing] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (voiceEnabled) speak(message);
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Generate obstacles
  useEffect(() => {
    if (gameState === 'playing') {
      const types = ['anger', 'fear', 'rush', 'noise'];
      const newObstacles = [];
      
      for (let i = 0; i < 8; i++) {
        newObstacles.push({
          id: i,
          x: 10 + Math.random() * 80,
          y: 10 + (i * 10),
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
      setObstacles(newObstacles);
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // Balance drain based on speed
      setBalance(prev => {
        const drain = speed > 0.5 ? 1.5 : 0.3;
        const restore = isBreathing ? 2 : 0;
        const newBalance = Math.max(0, Math.min(100, prev - drain + restore));
        
        if (newBalance <= 0) {
          setGameState('fail');
        }
        return newBalance;
      });

      // Score based on position
      setScore(prev => prev + (position.y < 20 ? 5 : 1));
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, speed, isBreathing, position.y]);

  // Check win condition
  useEffect(() => {
    if (position.y <= 5 && gameState === 'playing') {
      setGameState('success');
      const finalScore = score + Math.floor(balance);
      const kiEarned = 15 + Math.floor(finalScore / 30);
      
      speakTanaka(`Bravo ${userName} ! Tu as traversé le dojo avec calme !`);
      setTimeout(() => onComplete(finalScore, kiEarned), 2500);
    }
  }, [position.y, gameState, score, balance, userName, speakTanaka, onComplete]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 5;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - step) }));
          setSpeed(1);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: Math.min(100, prev.y + step) }));
          setSpeed(0.5);
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - step) }));
          setSpeed(0.7);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: Math.min(100, prev.x + step) }));
          setSpeed(0.7);
          break;
        case ' ':
          e.preventDefault();
          setIsBreathing(true);
          setSpeed(0);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsBreathing(false);
      }
      setSpeed(0);
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
    setBalance(100);
    setPosition({ x: 50, y: 80 });
    setSpeed(0);
    speakTanaka("Utilise les flèches pour te déplacer. Appuie sur espace pour respirer.");
  };

  const getObstacleEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      'anger': '😠',
      'fear': '😨',
      'rush': '⚡',
      'noise': '📢'
    };
    return emojis[type] || '❓';
  };

  return (
    <div className="relative min-h-[400px]" data-testid="messager-ki-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🌊</span>
          <div>
            <h3 className="text-white font-bold">Le Messager du Ki</h3>
            <p className="text-slate-400 text-sm">Garde ton équilibre</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Intro */}
      {gameState === 'intro' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🌊</span>
          <h2 className="text-2xl font-bold text-white mb-4">Le Messager du Ki</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Traverse le dojo jusqu'à la sortie. Évite d'aller trop vite sinon tu perdras l'équilibre. 
            Appuie sur ESPACE pour respirer et restaurer ton calme.
          </p>
          <Button onClick={startGame} className="bg-gradient-to-r from-cyan-500 to-blue-600" data-testid="start-messager-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game Area */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${balance < 30 ? 'text-red-500 animate-pulse' : 'text-pink-400'}`} />
              <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: `${balance}%` }}
                  className={`h-full rounded-full ${
                    balance > 60 ? 'bg-emerald-500' : balance > 30 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
            <div className="bg-slate-800 px-4 py-1 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {isBreathing && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-cyan-500/30 px-3 py-1 rounded-full">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300 text-sm">Respire...</span>
              </motion.div>
            )}
          </div>

          {/* Game Board */}
          <div className="relative h-80 bg-gradient-to-b from-slate-800 to-slate-700 rounded-xl overflow-hidden border-2 border-slate-600">
            {/* Exit Gate */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center">
              <span className="text-3xl">🚪</span>
              <p className="text-emerald-400 text-xs font-bold">SORTIE</p>
            </div>

            {/* Obstacles */}
            {obstacles.map(ob => (
              <motion.div
                key={ob.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute"
                style={{ left: `${ob.x}%`, top: `${ob.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <span className="text-2xl opacity-70">{getObstacleEmoji(ob.type)}</span>
              </motion.div>
            ))}

            {/* Player */}
            <motion.div
              animate={{ 
                left: `${position.x}%`, 
                top: `${position.y}%`,
                scale: isBreathing ? 1.2 : 1
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <span className="text-3xl">🥷</span>
                {balance > 70 && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-cyan-400 rounded-full blur-md -z-10"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Controls hint */}
          <div className="text-center mt-3 text-slate-400 text-sm">
            ⬆️⬇️⬅️➡️ Déplacer • ESPACE Respirer
          </div>
        </div>
      )}

      {/* Success */}
      {gameState === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Félicitations !</h2>
          <p className="text-white text-xl mb-4">Score : {score + Math.floor(balance)} points</p>
          <p className="text-slate-400">Tu as traversé le dojo avec calme !</p>
        </motion.div>
      )}

      {/* Fail */}
      {gameState === 'fail' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">💫</span>
          <h2 className="text-2xl font-bold text-amber-400 mb-2">Tu as perdu l'équilibre !</h2>
          <p className="text-white text-xl mb-4">Score : {Math.floor(score / 2)} points</p>
          <p className="text-slate-400">N'oublie pas de respirer pour rester calme.</p>
          <Button onClick={startGame} className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-600">
            Réessayer
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MessagerDuKi;
