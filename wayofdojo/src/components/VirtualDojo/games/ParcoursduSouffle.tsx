/**
 * 💨 PARCOURS DU SOUFFLE - Respiration consciente
 * 
 * L'avatar avance uniquement si le joueur respire au bon rythme
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Butvotre } from '@/components/ui/button';
import { X, Volume2, VolumeX, ArrowUp } from 'lucide-react';
import { useTanakaVoice } from '@/hooks/useTanakaVoice';
import { useGameSounds } from '@/services/gameSoundService';

interface ParcoursduSouffleProps {
  userName?: string;
  onComplete: (score: number, ki: number) => void;
  onExit: () => void;
  tanakaSpeak?: (message: string) => void;
}

const BREATH_CONFIG = {
  inhale: 3000,
  hold: 1500,
  exhale: 4000,
  pause: 1000
};

const ParcoursduSouffle: React.FC<ParcoursduSouffleProps> = ({ userName = '', onComplete, onExit, tanakaSpeak }) => {
  const { speak } = useTanakaVoice();
  const { play, playSuccess, playCombo } = useGameSounds();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success'>('intro');
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [perfectBreaths, setPerfectBreaths] = useState(0);
  const [combo, setCombo] = useState(0);
  
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const targetPhaseRef = useRef<string>('inhale');

  const speakTanaka = useCallback((message: string) => {
    if (tanakaSpeak) tanakaSpeak(message);
    if (voiceEnabled) speak(message);
  }, [voiceEnabled, speak, tanakaSpeak]);

  // Breath cycle
  useEffect(() => {
    if (gameState !== 'playing') return;

    const phases = ['inhale', 'hold', 'exhale', 'pause'] as const;
    let currentIndex = 0;

    const runPhase = () => {
      if (gameState !== 'playing') return;
      
      const phase = phases[currentIndex];
      targetPhaseRef.current = phase;
      
      const duration = BREATH_CONFIG[phase];
      
      breathTimerRef.current = setTimeout(() => {
        currentIndex = (currentIndex + 1) % phases.length;
        runPhase();
      }, duration);
    };

    runPhase();

    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, [gameState]);

  // Check for win
  useEffect(() => {
    if (position >= 100 && gameState === 'playing') {
      setGameState('success');
      const finalScore = score + (perfectBreaths * 10);
      const kiEarned = 20 + Math.floor(finalScore / 20);
      
      playSuccess('high');
      speakTanaka(`Bravo ${userName} ! Vous maîtrisez le souffle !`);
      
      setTimeout(() => onComplete(finalScore, kiEarned), 2500);
    }
  }, [position, gameState, score, perfectBreaths, userName, speakTanaka, onComplete, playSuccess]);

  const handleBreathInput = useCallback((action: 'inhale' | 'exhale') => {
    if (gameState !== 'playing') return;

    const targetPhase = targetPhaseRef.current;
    
    if ((action === 'inhale' && targetPhase === 'inhale') || 
        (action === 'exhale' && targetPhase === 'exhale')) {
      setBreathPhase(action);
      setCombo(prev => prev + 1);
      setPosition(prev => Math.min(100, prev + 2 + combo * 0.3));
      setScore(prev => prev + 5 * (combo + 1));
      play('breathing');
      
      if (combo > 0 && combo % 5 === 0) {
        setPerfectBreaths(prev => prev + 1);
        playCombo(combo);
        speakTanaka("Bien joué !");
      }
    } else {
      setCombo(0);
      setPosition(prev => Math.max(0, prev - 1));
      play('fail');
    }
    
    setTimeout(() => setBreathPhase('idle'), 500);
  }, [gameState, combo, speakTanaka]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        handleBreathInput('inhale');
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        handleBreathInput('exhale');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleBreathInput]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setPosition(0);
    setCombo(0);
    setPerfectBreaths(0);
    setBreathPhase('idle');
    play('start');
    speakTanaka("Inspire avec la flèche du haut, expire avec celle du bas.");
  };

  const getPhaseDisplay = () => {
    const phase = targetPhaseRef.current;
    const displays: Record<string, { text: string; color: string; emoji: string }> = {
      'inhale': { text: 'INSPIRE ⬆️', color: 'text-cyan-400', emoji: '🌬️' },
      'hold': { text: 'RETIENS...', color: 'text-amber-400', emoji: '⏸️' },
      'exhale': { text: 'EXPIRE ⬇️', color: 'text-pink-400', emoji: '💨' },
      'pause': { text: 'PAUSE...', color: 'text-slate-400', emoji: '😌' }
    };
    return displays[phase] || displays['pause'];
  };

  return (
    <div className="relative min-h-[400px]" data-testid="parcours-souffle-game">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl">💨</span>
          <div>
            <h3 className="text-white font-bold">Parcours du Souffle</h3>
            <p className="text-slate-400 text-sm">Respire au bon rythme</p>
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
          <span className="text-6xl block mb-4">💨</span>
          <h2 className="text-2xl font-bold text-white mb-4">Parcours du Souffle</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Guide votre avatar vers la sortie en respirant au bon rythme. 
            Inspire (⬆️) et Expire (⬇️) quand c'est indiqué pour avancer.
          </p>
          <Butvotre onClick={startGame} className="bg-gradient-to-r from-pink-500 to-rose-600" data-testid="start-souffle-btn">
            Commencer
          </Button>
        </motion.div>
      )}

      {/* Game */}
      {gameState === 'playing' && (
        <div>
          {/* Stats */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="bg-slate-800 px-4 py-2 rounded-full">
              <span className="text-amber-400 font-bold">⭐ {score}</span>
            </div>
            {combo > 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full">
                <span className="text-white font-bold">🔥 x{combo}</span>
              </motion.div>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative h-8 bg-slate-800 rounded-full mb-6 overflow-hidden">
            <motion.div
              animate={{ width: `${position}%` }}
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
            />
            <motion.div
              animate={{ left: `${position}%` }}
              className="absolute top-0 transform -translate-x-1/2"
            >
              <span className="text-2xl">🥷</span>
            </motion.div>
            <div className="absolute right-2 top-1">
              <span className="text-xl">🚪</span>
            </div>
          </div>

          {/* Breath indicator */}
          <div className="text-center mb-6">
            <motion.div
              key={targetPhaseRef.current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block"
            >
              <span className="text-4xl block mb-2">{getPhaseDisplay().emoji}</span>
              <p className={`text-2xl font-bold ${getPhaseDisplay().color}`}>
                {getPhaseDisplay().text}
              </p>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleBreathInput('inhale')}
              className={`w-24 h-24 rounded-xl transition-all ${
                breathPhase === 'inhale' 
                  ? 'bg-cyan-500 scale-110' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className="text-center">
                <ArrowUp className="w-8 h-8 mx-auto text-white" />
                <span className="text-white text-sm">Inspire</span>
              </div>
            </Button>
            <Button
              onClick={() => handleBreathInput('exhale')}
              className={`w-24 h-24 rounded-xl transition-all ${
                breathPhase === 'exhale' 
                  ? 'bg-pink-500 scale-110' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className="text-center">
                <ArrowUp className="w-8 h-8 mx-auto text-white rotate-180" />
                <span className="text-white text-sm">Expire</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Success */}
      {gameState === 'success' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Félicitations !</h2>
          <p className="text-white text-xl mb-4">Score : {score + (perfectBreaths * 10)} points</p>
          <p className="text-slate-400">{perfectBreaths} respirations parfaivos !</p>
        </motion.div>
      )}
    </div>
  );
};

export default ParcoursduSouffle;
